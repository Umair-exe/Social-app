const express = require('express')
const router = express.Router();
const brcypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { createError } = require('../error');
const { verifyToken } = require('../middlewares/verifyToken');
const { default: mongoose } = require('mongoose');

// router.get('/', async (req, res, next) => {
//     const users = await User.aggregate([{
//         $project: {
//             password: 0,
//         }
//     }])
//     res.status(200).json(users);
// })



//get followers of current user
router.get('/followers', verifyToken, async (req, res, next) => {
    const user = req.user;
    try {
        const currentuser = await User.findById(user.id);
        if (currentuser) {
            const followers = await Promise.all(
                currentuser?.followers.map(async (id) => {
                    return await User.aggregate([{
                        $match: {
                            _id: mongoose.Types.ObjectId(id),
                        }
                    },{
                        $project: {
                            password: 0,
                            email: 0,
                            fromGoogle:0,
                            followers: 0,
                            following: 0,
                        }
                    }])
                })
            )
            if (followers) res.status(200).json(followers.flat())
        }
    } catch (error) {
        next(error);
    }

})

//upload profile pic 
router.put('/uploadProfile', verifyToken, async (req, res, next) => {
    try {
        const currentUser = req.user;
        const user = await User.findByIdAndUpdate(currentUser.id, {
            profileimg: req.body.imgUrl,
        }, { new: true });
        const { password, ...others } = user._doc;
        if (user) return res.status(200).json(others);
    } catch (error) {
        next(error)
    }

})

router.get('/search/:name', verifyToken, async (req, res, next) => {
    try {
        // const users = await User.aggregate().match({ $regex: { name: req.params.name } }).project({ password: 0 }).sort({ createdAt: -1 });
        const users = await User.aggregate([
            {
                $match: {
                    name: {
                        $regex: req.params.name,
                        $options: "i",
                    }
                }
            }, {
                $project: {
                    password: 0,
                }
            }
        ])

        if (users) res.status(200).json(users);

    } catch (error) {
        next(error)
    }


})

router.put('/follow/:userId', verifyToken, async (req, res, next) => {
    const currentuser = req.user.id;
    const usertofollow = req.params.userId;
    try {
        await User.findByIdAndUpdate(usertofollow, {
            $addToSet: {
                followers: currentuser,
            }
        }, { new: true })
        await User.findByIdAndUpdate(currentuser, {
            $addToSet: {
                following: usertofollow,
            }
        }, { new: true });
        res.status(200).json("followed!!")
    } catch (error) {
        next(error)
    }
})



router.put('/unfollow/:userId', verifyToken, async (req, res, next) => {
    const currentuser = req.user.id;
    const usertofollow = req.params.userId;
    try {
        await User.findByIdAndUpdate(usertofollow, {
            $pull: {
                followers: currentuser,
            }
        })
        await User.findByIdAndUpdate(currentuser, {
            $pull: {
                following: usertofollow,
            }
        });
        res.status(200).json("unfollowed!!")
    } catch (error) {
        next(error)
    }
})




module.exports = router; 