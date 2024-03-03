const { PrismaClient} = require('@prisma/client')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require('dotenv').config();

const prisma = new PrismaClient();

module.exports = async (req, res) => {
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
        
        const token = jwt.sign(user, process.env.JWT_SECRET);

        //cookie properties for more secure transmission
        res.cookie('token', token, {
            httpOnly: true, 
            // secure: process.env.NODE_ENV === 'production',
            secure: false,
            sameSite: 'lax', 
            maxAge: 24 * 60 * 60 * 1000 // expires in a day
        });
   
        return res.status(200).json({
            status: 200,
            message: 'Login Success'
        })

     }
     catch(err) {
        console.error('Problem querying DB to log in');
        return res.status(500).json({"message" : "Internal server error"});
     } 
}