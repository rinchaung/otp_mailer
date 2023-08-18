const User = require("../models/user.model");
const createError = require("http-errors");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { hashData, verifyHashedData } = require("../config/hash_pass");

/** __Login with your email__ */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!(email || password )) {
            res.json({ status: "FAILED", message: "All fields are required" })
        }
         // check user exits
        const exitUser = await User.findOne({ email: email });
        if(!exitUser){
           return res.json({error: "Email is not registered"});
        }

        // check password
        const hashedPassword = exitUser.password;
        const passwordMatch = await verifyHashedData(password, hashedPassword);
        if(!passwordMatch){
          return res.json({error: "Password is incorrect"});
        }

        // check password
        await bcrypt.compare(password, exitUser.password)
        .then(match =>{
            if(!match) {
              return res.json({error: "Password does not match"});
            }
            const token = jwt.sign({email: exitUser.email, id: exitUser._id}, process.env.JWT_KEY, {expiresIn: process.env.TOKEN_EXPIRY});
            return res.json({ success:"Login Successfully", token: token, email: exitUser.email, id: exitUser._id });
        })
    } catch (error) {
       res.status(400).json({ error: error.message });
    }
};

/** __Register with Email__ */
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if(!(name || email || password )){
            throw createError.BadRequest({ message: "All fields are required" });
        }        
        else {
            // Exiting User
            const exitingUser = await User.findOne({ email: email });
            if (exitingUser) {
                throw createError.Conflict({ message: "Email is already registered" });
            }
            if (password.length < 6) {
               return res.json({ status: "FAILED", message: "Password should be at least 6 characters long" });
            }
                // Hashing Password.... $##@$$$...
                const hashedPass = await hashData(password);
                // Creating a New user...💁...
                const newUser = new User({
                    name: name,
                    email: email,
                    password: hashedPass,
                }); 
                await newUser.save();
                return res.status(200).json({ status: "SUCCESS", message: "User register created successfully!" });                
            
        }  
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

module.exports = {
    login,
    register,
}