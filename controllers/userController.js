const connectDB = require('./connectDB')

exports.createNewUser = async(req, res) => {

    const {nickname, email, password, sub_level } = req.body

    const connection = connectDB();
    const query = `INSERT INTO users (nickname, email, password, sub_level) VALUES (?, ?, ?, ?)`;

    //Inserting new user data into DB
    //TO ADD: Need to encrypt password, will do later
    connection.query(query, [nickname, email, password, sub_level], (queryError, _results) => {
        if (queryError){
            console.error('Error ' + queryError);   
            return res.status(500).json({'message' : 'Error creating user during database operation'})
        }

        //Send new user data back to client to use
        const newUserDetails = 'SELECT * FROM users WHERE id = LAST_INSERT_ID()'
        connection.query(newUserDetails, (selectError, userResults) => {
            connection.end()
            if (selectError) {
                console.error('Error ' + selectError)
                return res.status(500).json({'message' : 'Error returning new user data to client'})
            }
            res.status(200).json(userResults[0] || {})
        })
    })
}

exports.logIn = async (req, res) => {
    const {email, password} = req.body
    const connection = connectDB();
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?'
    connection.query(query, [email, password], (queryError, results) => {
        connection.end()
        if (queryError){
            console.error('Error ' + queryError);   
            return res.status(500).json({'message' : 'Error querying for user credentials during database operation'})
        }
        if (results.length === 0) {
            console.error('Error ' + queryError);   
            return res.status(500).json({'message' : 'Error finding matching user credentials during database operation'})
        }
        res.send(results)
    })
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

