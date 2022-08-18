const { createError } = require("../error");
const jwt = require('jsonwebtoken');


const verifyToken = async (req, res, next) => {
    const token = req.headers.access_token;
    if (!token) return next(createError(401, "Token not provided which means not authenticated"))
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(createError(401, "Token is not invalid it must be tempered!"))
        req.user = user;
        next();
    })
}

module.exports = { verifyToken };