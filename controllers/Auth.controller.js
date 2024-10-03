const bcrypt = require('bcrypt');
const User = require('../Models/User.model');
const jwt = require('jsonwebtoken');
const { response } = require('express');

require('dotenv').config();

//signup route handler
exports.signup = async (req, res) => {
    try{
        //get data
        const {name, email, password, role} = req.body;

        //check if user already exists
        const existingUser = await User.findOne({email});

        if(existingUser) {
            return res.json({
                success: false,
                message: 'User already exists.',
            })
        }
        //secured password
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch(error) {
            res.status(500).json({
                success: false,
                message: "Error in hashing password"
            })
        }

        //create entry for user
        let user = await User.create({
            name, email, password:hashedPassword, role
        });

        return res.status(200).json({
            success: true,
            message: 'User created successfully',
            data: user
        })
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'User can not be registered, please try again'
        })
    }
}

//login
exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'please fill all the deatils'
            })
        }

        // check for registered user
        let user = await User.findOne({email});
        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        //verify password and generate a JWT token
        const payload = {
            email: user.email,
            id: user._id,
            role: user.role,
        };

        if(await bcrypt.compare(password, user.password)) {
            //password match
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '2h'
            });

            user = user.toObject();
            user.token = token;
            user.password = password;

            const options = {
                expiresIn: new Date(Date.now() * 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }

            // res.cookie('token', token, options).status(200).json({
            //     success: true,
            //     token, 
            //     user, 
            //     message: 'User logged in successfully'
            // })

            res.status(200).json({
                success: true,
                token, 
                user, 
                message: 'User logged in successfully'
            })
        } else {
            //password do not match
            return res.status(403).json({
                success: false,
                message: "Invalid password"
            })
        }
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'User can not be logged in, please try again'
        })
    }
}