const express = require('express')
const router = express.Router();
const brcypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { createError } = require('../error');



router.post('/', async (req, res, next) => {

    try {
        const userExist = await User.findOne({email: req.body.email});
        if (!userExist) return next(createError(401, "User don't exist"));

        const checkPassword = await brcypt.compare(req.body.password, userExist.password);
        if (checkPassword) {
            const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET);
            const { password, ...others } = userExist._doc;
            return res.status(200).json({
                user: others,
                token: token,
            })
        }
        next(createError(401, "Wrong Password"));

    } catch (error) {
        next(error)
    }
})

router.post('/register', async (req, res, next) => {
    try {
        const userExist = await User.findOne({email:req.body.email});
        if (!userExist) {
            const genSalt = brcypt.genSaltSync(10);
            const hashpass = brcypt.hashSync(req.body.password, genSalt);
            const user = new User({ ...req.body, password: hashpass })

            const newUser =  await user.save();
            if(newUser) return res.status(200).json("new User created")
        }
        next(createError(401, "User already exist"));
    } catch (error) {
        next(error)
    }
})


module.exports = router;