const express = require('express');
const mongoose =  require('mongoose');
const fileUpload = require('express-fileupload')
require('dotenv').config();
const http =require('http');
const app = express();
const cors = require('cors');

const server = http.createServer(app);
const socketIo = require('socket.io');

const io = socketIo(server, {
    transports:['polling'],
    cors:{
        cors: {
          origin: "http://localhost:3000/admin/users/"
        }
      }
});

app.use(fileUpload());
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors());
const PORT = process.env.PORT || 5000;

app.use('/uploads',express.static('uploads'));

app.use('/',require('./routes'));
app.use('/posts',require('./routes/posts'))

const CONNECTION_URI = process.env.MONGO_KEY;

io.on("connection", (socket) => {

    socket.on("disconnect", () => {
        console.log(`${socket.id} has left`);

    })


})
app.set('io',io);


mongoose.connect(CONNECTION_URI)
.then(() => console.log("database connected"))
.catch(err => console.log(err + "helo"));

server.listen(PORT || 5001, () => {
    console.log(`server running on port: ${PORT}`);
})