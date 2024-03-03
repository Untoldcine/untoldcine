const { PrismaClient,} = require('@prisma/client')
const bcrypt = require("bcrypt");
require('dotenv').config();

const prisma = new PrismaClient();

module.exports = async(req, res) => {
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
        res.status(200).json({"message":"OK!"})
    }
    catch(err) {
        console.error('Problem querying DB to create new user');
        return res.status(500).json({"message" : "Internal server error"});
     }
    
}