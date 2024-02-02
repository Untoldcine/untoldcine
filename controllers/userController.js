const connectDB = require('./connectDB')
const {PrismaClient} = require('@prisma/client')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

exports.createNewUser = async(req, res) => {
    const {nickname, email, password } = req.body
    if (!nickname || !email || !password) {
        return res.status(400).json({"message" : "Missing email, username, or password"})
    }
    try {
        const exists = await prisma.user.findUnique({
            where: {
                user_email: email
            }
        })
        if (exists) {
            return res.status(401).json({"message" : `User already exists at email: ${email}`})
        }
        const hash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                user_nickname: nickname,
                user_email: email,
                user_password: hash,
                user_level: 0
            }
        })
    }
    catch(err) {
        console.error('Problem querying DB to create new user');
        return res.status(500).json({"message" : "Internal server error"});
     }
    
}

exports.logIn = async (req, res) => {
    const {email, password} = req.body
    if (!email || !password) {
        return res.status(400).json({"message" : "Missing email or password"})
    }
    try {
        const user = await prisma.user.findUnique({
            where: {
                user_email: email
                }
    })
        if (!user) {
            return res.status(401).json({"message" : "No user found at those credentials"})
    }   
    //if email exists, then compare hashed value to input password
        const isValid = await bcrypt.compare(password, user.user_password);
        if (!isValid) {
            return res.status(401).json({"message" : "Password does not match!"})
        }
        
        let token = jwt.sign(user, "secretKey");

        //cookie properties for more secure transmission
        res.cookie('token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict', 
            maxAge: 24 * 60 * 60 * 1000 // expires in a day
        });
        return res.status(200).json({ message: "Login successful" });

     }
     catch(err) {
        console.error('Problem querying DB to log in');
        return res.status(500).json({"message" : "Internal server error"});
     }
    
}

exports.submitRating = async (req, res) => {
    const connection = connectDB();
    //written in async/await format for readability. Check if user has already submitted a rating. If not, then update the rating and then insert into feedback table
    //If they have, change the existing entry to prevent duplicates
    try {
        const {userID, content_ID, table} = req.body;
        console.log(table);
        const {choice} = req.params;
        const feedbackExists = await checkFeedbackExists(connection, userID, table, content_ID)
    
        if (!feedbackExists) {
            await updateRating(connection, choice, table, content_ID);
            await insertNewFeedback(connection, userID, table, content_ID, choice);
            res.sendStatus(200);
        }
        else {
            await changeExistingFeedback(connection, userID, table, content_ID, choice);
            res.sendStatus(200);
        }
    }

    catch(err) {
        console.error(err + ':Error attempting to update rating during database operation');
    }
    finally {
        if (connection) connection.end()
    }
}
    
//next 4 functions are all for submitRating API
    async function updateRating(connection, choice, table, content_ID) {
        let query;
        if (choice === 'like') {
            query = 'UPDATE ?? SET rating = JSON_SET(rating, \'$.Upvotes\', JSON_VALUE(rating, \'$.Upvotes\') + 1) WHERE id = ?';
        } else if (choice === 'dislike') {
            query = 'UPDATE ?? SET rating = JSON_SET(rating, \'$.Downvotes\', JSON_VALUE(rating, \'$.Downvotes\') + 1) WHERE id = ?';
        }
        return connection.query(query, [table, content_ID])
    }
    async function checkFeedbackExists(connection, userID, table, content_ID) {
        const query = 'SELECT * FROM feedback WHERE user_ID = ? AND table_name = ? AND item_ID = ?';
        const results = await new Promise((resolve, reject) => {
            connection.query(query, [userID, table, content_ID], (queryError, results) => {
                if (queryError) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        return results.length > 0;
    }
    async function insertNewFeedback(connection, userID, table, content_ID, choice) {
        const addToFeedback = `INSERT INTO feedback (user_ID, table_name, item_ID, rating) VALUES (?, ?, ?, ?)`
        return connection.query(addToFeedback, [userID, table, content_ID, choice])
    }
    async function changeExistingFeedback(connection, userID, table, content_ID, choice) {
        const query = 'UPDATE feedback SET rating = ? WHERE user_ID = ? AND table_name = ? AND item_ID = ?'
        return connection.query(query, [choice, userID, table, content_ID])
    }


exports.removeUser = async (req, res) => {
    const { userID } = req.params;
    const connection = connectDB();
    
    //Flag the user for deletion, adjust client appearance and permissions based on this
    const updateUserQuery = 'UPDATE users SET deleted = TRUE, deleted_at = CURRENT_TIMESTAMP WHERE id = ?';

    connection.query(updateUserQuery, userID, (updateError, _updateResults) => {
        if (updateError) {
            console.error('Error: ' + updateError);
            connection.end();
            return res.status(500).json({'message': 'Error deleting user during database operation'});
        }

        //Add the user to deletion table for soft delete, then purge the table routinely (done in another function)
        //BUG: Currently can have duplications of deleted entries on the table, but can fix later
        const newDeleteItemQuery = "INSERT INTO deleted_content (Content_Type, Content_ID) VALUES ('user', ?)";
        
        connection.query(newDeleteItemQuery, userID, (deleteError, _deleteResults) => {
            connection.end(); 

            if (deleteError) {
                console.error('Error: ' + deleteError);
                return res.status(500).json({'message': 'Error adding user to delete table during database operation'});
            }

            res.status(200).json({"message": "Successfully flagged user for deletion and added to delete table"});
        });
    });
};

