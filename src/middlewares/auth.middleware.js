require('dotenv').config();
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    // check your provided token
    if(!token) {
        return res.status(403).send({ message: 'No token provided' });
    }

    // verify your token
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        req.currentUser = decodedToken;
    } catch (error) {
        return res.status(401).send({ message: 'Failed to authenticate token.' });
    }

    // process with request
    return next();
};

module.exports = verifyToken;