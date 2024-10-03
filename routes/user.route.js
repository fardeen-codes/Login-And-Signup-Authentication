const express = require('express');
const router = express.Router();
const User = require('../Models/User.model');

const {login, signup} = require('../controllers/Auth.controller');
const {auth, isAdmin, isStudent} = require('../middleware/auth.middleware');

router.post('/signup', signup);
router.post('/login', login);

//Testing route for middleware
router.get('/test', auth, (req, res) => {
    res.json({
        success: true,
        message: 'Test successful',
    })
})

//Protected route for student
router.get('/student', auth, isStudent, (req, res) => {
    res.json({
        success: true,
        message: "This is protected route for student",
    })
})

//Protected route for Admin
router.get('/admin', auth, isAdmin, (req, res) => {
    res.json({
        success: true,
        message: "This is protected route for admin",
    })
})

// Email route
router.get('/getEmail', auth, async(req, res) => {
    try {
        const id = req.user.id;
        console.log(id);
        const user = await User.findOne({_id: id});

        res.status(200).json({
            success: true,
            user: user,
            message: "Welcome to email route"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
})

module.exports = router;