const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts')
const commentRoutes = require('./routes/comments')
const userRoutes = require('./routes/users');
const path = require('path')
const multer = require('multer')
const cors = require('cors');

app.use(cors({
    origin: ["http://localhost:3000","https://umair-social.netlify.app/"],
    optionsSuccessStatus: 200

}));

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


//db connection 
const connect = () => {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log("mongo db is connected!!"))
        .catch(err => {
            console.log(err)
        })
}

app.use(express.urlencoded({ extended: false }))


app.use('/api/auth', authRoutes)
app.use('/api/post', postRoutes)
app.use('/api/comment', commentRoutes);
app.use('/api/users', userRoutes)


//file Uploading
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, req.body.name)
    }
})
const upload = multer({ storage: storage })
app.post("/api/upload", upload.single('file'), (req, res) => {
    res.status(200).json("File has been uploaded");
});



//error middleware
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'something went wrong'
    return res.status(status).json({
        success: false,
        status,
        message,
        field: err.field,
    })
})




app.listen(PORT, () => {
    connect();
    console.log(`server is running on PORT ${PORT} `)
})