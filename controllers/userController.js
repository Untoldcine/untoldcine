const mysql = require('mysql')
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
            res.status(500).json({'message' : 'Error creating user during database operation'})
        }

        //Send new user data back to client to use
        const newUserDetails = 'SELECT * FROM users WHERE id = LAST_INSERT_ID()'
        connection.query(newUserDetails, (selectError, userResults) => {
            if (selectError) {
                console.error('Error ' + selectError)
                res.status(500).json({'message' : 'Error returning new user data to client'})
            }
            res.status(200).json(userResults[0] || {})
        })
        connection.end()
    })
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

