var express = require('express');
const Post = require('../models/Post');
var fileUpload = require('express-fileupload');
const { authToken } = require('../middlewares/auth');
const { route } = require('.');
var router = express.Router();

// router.get('/bongi',async (req,res) => {
//     let posts = await Post.aggregate([{
//         $project: {
//             title:1,
//             body:1
//         }
//     }])

//     return res.status(200).json(posts);
// })

router.get('/',authToken, async (req, res) => {
  
    let posts = await Post.find({
        user: req.user.id,
    }).sort({
        'createdAt': -1
    })
    if(posts) return res.json(posts);

    return res.status(400).send({
        message: "You don't have any posts",
    })
    
})
router.get('/:id',authToken, async (req, res) => {
    
    let posts = await Post.findOne({
        _id: req.params.id
    })
    if(posts) return res.json(posts);

    return res.status(400).send({
        message: "You don't have this post",
    })
    
})
router.post('/create',authToken, async (req, res) => {
    
    let post = new Post({
        title: req.body.title,
        body: req.body.body,
        user: req.user.id,

    });
    let confirm = await post.save();

    
    if(!confirm) {
        return res.status(400).send({
            status: 400,
            message: "post not saved",
        })
    }

    return res.send({
        status: 200,
        message: "post saved",
    })

})

router.put('/:id',authToken, async (req, res) => {
    let id =req.params.id;
    let posts = await Post.findByIdAndUpdate(id, {
        title: req.body.title,
        body: req.body.body,
    })
    if(posts) return res.json({
        message: "story changed",
        posts:posts,

    });

    return res.status(400).send({
        message: "story not changed",
    })
    
})

router.delete("/delete/:id",authToken,async (req,res) => {
    let id = req.params.id;
    let post = await Post.findByIdAndDelete(id);

    if(post) {
        return res.json({
            status:200,
            message: "post deleted!",
        })
    }
   

})

module.exports = router;