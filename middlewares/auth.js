const config = require('config');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
let jwt_decode = require('jwt-decode');

module.exports = {
    authToken: async (req, res, next) => {
        let token = req.header("x-auth-token");
        if (!token) return res.status(400).json("token is not provided");
        try {
            let verify = await jwt.verify(token, config.get("jwt-key"))
            if (verify) {
                req.user = await User.findById(verify._id)
            }
        } catch (err) {
            return res.status(400).send(err)
            console.log(err);
        }
        next();
    },

    admin: async (req, res, next) => {
        let { role } = jwt_decode(req.header("x-auth-token"));
        if (role !== 'admin') {
            return res.status(400).send({
                msg: "you are not admin",
            })
        }
        next();

    }

}