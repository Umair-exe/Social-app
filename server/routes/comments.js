const express = require('express');
const { verifyToken } = require('../middlewares/verifyToken');
const Comment = require('../models/Comment');
const router = express.Router();


router.post('/add/:PostId', verifyToken, async (req, res, next) => {
    const user = req.user;
    const comment = new Comment({ ...req.body, userId: user.id, postId: req.params.PostId });
    try {
        const newcomment = await comment.save();
        if (newcomment) res.status(200).json(newcomment);
    } catch (error) {
        next(error)
    }


})

router.get('/get/:PostId', verifyToken, async (req, res, next) => {
    try {
        const comments = await Comment.find({ postId: req.params.PostId });
        res.status(200).json(comments);

    } catch (error) {
        next(error);
    }

})

module.exports = router;