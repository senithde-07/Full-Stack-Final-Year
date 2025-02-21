require('dotenv').config()
let express = require('express');
const jwt = require("jsonwebtoken");

const router = express.Router()

const bcrypt = require('bcrypt');

const User = require('../models/user')


router.get('/status', (req, res) => {
    if (req.session.isAuth) {
        res.status(200).send({ LoginStatus: true });
    } else {
        res.status(200).send({ LoginStatus: false });
    }
})

router.post('/login', async (req, res) => {
    try {
        if (req.body.email && req.body.password) {

            // if (req.session.isAuth) {
            //     res.send('Already logged in');
            // } else {
            const { email, password } = req.body;

            const user = await User.findOne({ email: email })

            if (!user) {
                return res.status(400).json({ msg: 'User not found' })
            }

            const hashedLoginPass = await bcrypt.compare(password, user.password)
            if (hashedLoginPass) {

                const accessToken = jwt.sign({ uid: user._id, name: user.name, role: user.role },"Ksja82njakajkHSH80us8SHA0U291SY892AJSKJAS", { expiresIn: '24h' });
console.log("Hi");
                return res
                    .status(200)
                    .json({ status: 'You have logged in successfully', token: accessToken });

            } else {
                console.log("Invalid");
                return res.status(400).json({ msg: 'Invalid credentials' })
            }
        }

        else {
            res.status(401).send({ message: "empty credentials" });
        }
    } catch (err) {
        console.log(err);
        res.send({ mesage: 'Failed to execute the operation' });
    }

});

router.post('/register', async (req, res) => {
    try {
        if (req.body.email && req.body.password && req.body.name) {

            const { email, password, name, gender, phoneNumber } = req.body;

            let user = await User.findOne({
                email: email
            });

            if (user) {
                res.send('user exists');
            }
            else {
                const hashedPass = await bcrypt.hash(password, 10);

                const newUser = {
                    email: email,
                    password: hashedPass,
                    name: name,
                    gender: gender,
                    phoneNumber: phoneNumber,
                    role: 'basic'
                }

                user = await User.create(newUser);
        
                if(!user){
             
                    return res.status(500).json({ message: "Failed to create user"});
                }

                const accessToken = jwt.sign({ uid: user._id, name: user.name, role: user.role }, process.env.SECRET, { expiresIn: '24h' });

                res.status(200).send({ message: "User created successfully", token: accessToken });
            }
        } else {
            res.status(401).send({ message: "empty credentials" });
        }

    } catch (err) {
        res.send({ mesage: 'Failed to execute the operation' })
    }
});


module.exports = router;