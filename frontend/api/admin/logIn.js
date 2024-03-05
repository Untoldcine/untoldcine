require('dotenv').config();

// /api/admin/login - body is email/password

module.exports = async(req, res) => {
    const {email, password} = req.body
    if (!email || !password) {
        return res.status(400).json({"message" : "Missing email or password"})
    }
    if (email !== process.env.ADMIN_USER || password !== process.env.ADMIN_PASSWORD) {
        return res.status(400).json({"message" : "Incorrect credentials"})
    }
    return res.status(200).json({"message" : "Welcome Malcolm"})
}