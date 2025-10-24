const express = require('express');
const router = express.Router();
const User = require('../models/User.js'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists with this email' });
        }
        user = new User({
            username,
            email,
            password 
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        res.status(201).json({ msg: 'Registration successful. Please log in.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error during registration');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials (User not found)' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials (Password mismatch)' });
        }
        const payload = {
            user: {
                id: user.id,
                username: user.username
            }
        };
        jwt.sign(
            payload,
            process.env.JWT_SECRET, 
            { expiresIn: '5h' }, 
            (err, token) => {
                if (err) throw err;
                res.json({ token }); 
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error during login');
    }
});

module.exports = router;