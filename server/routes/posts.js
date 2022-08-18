const express = require('express');
const { createError } = require('../error');
const { verifyToken } = require('../middlewares/verifyToken');
const Post = require('../models/Post');
const User = require('../models/User');
const { removeFile } = require('../utils/removeFile');
const router = express.Router();


//specific profile details
router.get('/profile/:id', verifyToken, async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            const { password, ...others } = user._doc;
            const posts = await Post.find({ userId: req.params.id });
            if (posts) return res.status(200).json({
                user: others,
                posts,
            });
        }
    } catch (error) {
        next(error)
    }
})

router.post('/newPost', verifyToken, async (req, res, next) => {
    const user = req.user;
    const newPost = new Post({ ...req.body, userId: user.id });
    try {
        await newPost.save();
        res.status(200).json(newPost);
    } catch (error) {
        next(error)
    }
})


router.put('/update/:postId', verifyToken, async (req, res, next) => {
    try {
        const user = req.user;
        if (req.params.postId) {
            const postcheck = await Post.findById(req.params.postId);
            if (postcheck) {
                if (user.id === postcheck.userId) {
                    const post = await Post.findByIdAndUpdate(req.params.postId, {
                        $set: req.body,
                    }, { new: true });
                    if (!post) return next(createError(403, "post not updated"))
                    return res.status(200).json(post);
                }
                return next(createError(403, "you cannot update someone else's post"))
            }
            return next(createError(403, "Post don't exist"))
        }
    } catch (error) {
        next(createError(error))
    }

})


router.delete('/delete/:postId', verifyToken, async (req, res, next) => {
    try {
        const user = req.user;
        if (req.params.postId) {
            const findPost = await Post.findById(req.params.postId);
            if (!findPost) return next(createError(403, 'post does not exist'))
            if (user.id === findPost.userId) {
                if (findPost.imgUrl) {
                    const filename = findPost.imgUrl?.split('/')[1];
                    removeFile(filename);
                }
                const deletePost = await Post.findByIdAndDelete(findPost._id)
                if (deletePost) res.status(200).json('post is deleted');
            }
            else {
                next(createError(403, 'you can only delete your post'))
            }
        }
    } catch (error) {
        next(error)
    }
})

router.put('/like/:postId', verifyToken, async (req, res, next) => {
    try {
        const user = req.user;
        const post = await Post.findByIdAndUpdate(req.params.postId, {
            $addToSet: {
                likes: user.id,
            }
        })
        if (post) res.status(200).send("post liked!!")
    } catch (error) {
        next(error)
    }
})

router.put('/dislike/:postId', verifyToken, async (req, res, next) => {
    try {
        const user = req.user;
        const post = await Post.findByIdAndUpdate(req.params.postId, {
            $pull: {
                likes: user.id
            }
        })
        if (post) res.status(200).send("post disliked!!")
    } catch (error) {
        next(error)
    }
})


router.get("/", verifyToken, async (req, res, next) => {
    try {
        const user = req.user;
        const findUser = await User.findById(user.id);
        if (findUser) {
            const posts = await Promise.all(
                findUser?.following?.map(async (id) => {
                    return await Post.find({ userId: id });
                })
            )
            const myposts = await Post.find({ userId: user.id });
            if (posts) {
                if (myposts) {
                    posts.push(myposts);
                    return res.status(200).json(posts.flat().sort((a, b) => b.createdAt - a.createdAt));

                }
            }
        }

    } catch (error) {
        next(error)
    }
})


module.exports = router;