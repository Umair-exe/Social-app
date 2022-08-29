const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require("jsonwebtoken");
const config = require('config');
const jwt_decode = require('jwt-decode');
const Post = require('../models/Post');
//const auth = require('../middlewares/auth');
const { admin, authToken } = require('../middlewares/auth');
const sendMail = require('../utils/email');

//route for creating admin temporary
/*router.post("/register/admin",async(req,res) => {

    let user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.role='admin';
    let salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    await user.save();
})*/



router.post('/registerUser', async (req, res) => {
    let io = req.app.get('io');
    try {
        let checkUser = await User.findOne({ email: req.body.email });
        if (checkUser) {
            console.log("exist");
            return res.json({
                msg: "user already exist",
            });
        }
        let user = new User();
        user.name = req.body.name;
        user.email = req.body.email;
        let salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        await user.save();

        /*        let mailOk = await sendMail(user);
                if(!mailOk) {
                    console.log("mail not sent");
                }
                */
        io.emit("addUser", "new user added");

        return res.json({
            msg: "User created",
            data: user.name
        })

    } catch (error) {

        if (error) {
            return res.status(400).send({
                message: "user not created",
            })
        }

    }

})


router.post('/auth', async (req, res) => {

    let checkUser = await User.findOne({ email: req.body.email });
    if (!checkUser) {
        return res.status(400).json({
            msg: "user don't exist",
        })
    }

    let checkPass = await bcrypt.compare(req.body.password, checkUser.password);
    if (!checkPass) {
        return res.status(500).json({
            msg: "incorrect password"
        });
    }
    console.log(checkUser.role);
    let token = jwt.sign({ _id: checkUser._id, name: checkUser.name, role: checkUser.role }, config.get("jwt-key"));

    return res.status(200).send({
        loggedIn: true,
        token,
    });




})

router.post('/google/auth', async (req,res) => {
    
    let decodedToken = await jwt_decode(req.body.credential);
    
    const user = await User.findOne({
        email: decodedToken.email,
    })
   
    if(!user) {
        let newUser = new User();
        newUser.name = decodedToken.name;
        newUser.email= decodedToken.email;
        newUser.googleId = decodedToken.aud;
        newUser.profilePic = decodedToken.picture;
        newUser.fromGoogle = true;
        await newUser.save();


        let token = jwt.sign({_id:newUser._id, name:newUser.name,role:newUser.role},config.get("jwt-key"));
        return res.status(200).send(token);
    }
    else {
        let token = jwt.sign({_id:user._id, name:user.name,role:user.role},config.get("jwt-key"));
        return res.status(200).send(token);
    }


})


router.get('/admin/users/', authToken, admin, async (req, res) => {
    try {
        let Users = await User.aggregate([{
            $project: {
                password:0
            }
        }])
        return res.json({
            users: Users
        });

    } catch (error) {
        console.log(error);
    }


})

router.delete("/admin/users/:id", authToken, admin, async (req, res) => {
    //  console.log(req.params.id);
    try {
        let users = await User.findByIdAndDelete(req.params.id);
        if (users) {
            let posts = await Post.find({
                user: req.params.id,
            }).deleteMany();
            if (posts) {
                return res.status(200).json("user deleted");
            }
            return res.status(200).send("user deleted and had no stories...")
        }
        return res.status(400).send("not deleted");
    } catch (error) {
        console.log(error);
    }
})

router.get("/admin/totalUsers/",authToken,admin, async(req,res) => {
    let count = 0;
    try {
        count = await User.countDocuments();
        return res.status(200).json(count);    
    } catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }
    
})



module.exports = router;