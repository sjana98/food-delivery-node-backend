const authController = require("express").Router();
const userModel = require("../models/userSchema");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

// API for register
authController.post("/register", async (req, resp) => {
    try {
        const { username, email, password } = req.body;
        
        const isExisting = await userModel.findOne({ email: email });
        if (isExisting) {
            throw new Error("Already have this user with the same email address!");
        } else {
            const hashedPassword = await bcrypt.hash(password, 10); 
            
            let newUserDetails = await userModel.create({ username, email, password:hashedPassword });
            newUserDetails = newUserDetails.toObject();
            delete newUserDetails.password;

            const Token = JWT.sign({ id: newUserDetails._id, isAdmin: newUserDetails.isAdmin }, process.env.JWT_SECRET, { expiresIn: "12h" });
            
            return resp.status(201).json({ newUserDetails, Token });
        };
            
    } catch (error) {
        return resp.status(500).json(error.message);
    };
});

// API for login
authController.post("/login", async (req, resp) => {
    try {
        const { email, password } = req.body;

        let userExist = await userModel.findOne({ email: email });
        if (userExist && (await bcrypt.compare(password, userExist.password))) {

            userExist = userExist.toObject();
            delete userExist.password;

            const Token = JWT.sign({ id: userExist._id, isAdmin: userExist.isAdmin }, process.env.JWT_SECRET, { expiresIn: "12h" });

            return resp.status(202).json({ userExist, Token });
        } else {
            throw new Error("Email or Password is wrong!");
        };
        
    } catch (error) {
        return resp.status(500).json(error.message);
    };
});

module.exports = authController;