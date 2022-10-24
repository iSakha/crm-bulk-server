const bcrypt = require('bcrypt');
const auth = require('../models/authModel');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const accessTokenSecret = 'greatSecretForTokenAccessWith#-~';
const refreshTokenSecret = 'someRandomNewStringForRefreshTokenWithout~#-';


exports.authenticateJWT = (req, res) => {
    const authHeader = req.headers.authorization;
    let status;
    let id;
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                status = 403;
            } else {
                status = 200;
                req.user = user;
                id = user.id;
            }
        });
    } else {
        status = 401;
    }
    return { status: status, id: id };
};

exports.validateUser = async (req, res) => {

    try {

        const [row] = await auth.validateUser(req.body.login);

        // const dbUser = row[0]; 

        if (row.length > 0) {
            let passwordEnteredByUser = req.body.pass;
            let salt = row[0].salt;


            if (bcrypt.hashSync(passwordEnteredByUser, salt) === row[0].crypto) {
                
                let user = new User(row[0]);

                const accessToken = jwt.sign({ username: user.username, role: user.role, id: user.id }, accessTokenSecret, { expiresIn: '15s' });
                const refreshToken = jwt.sign({ username: user.username, role: user.role, id: user.id }, refreshTokenSecret);


                return res.status(200).json({
                    user,
                    accessToken,
                    refreshToken
                });
            } else {
                return res.status(401).json({ "result": "Wrong password or login" });
            }
        } else return res.status(401).json({ "result": "Wrong password or login" });

    } catch (error) {
        if (!error.statusCode) {
            console.log("error:", error);
            error.statusCode = 500;
            return res.status(500).json({"error": error});
        }
    }
}

exports.updateToken = async (req, res) => {

    const { token } = req.body;

    if (!token) {
        console.log("token 401:", token);
        return res.sendStatus(401);
    }
    jwt.verify(token, refreshTokenSecret, (err, user) => {
        if (err) {
            console.log("token 403:", token);
            return res.sendStatus(403);
        }

        const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '120m' });
        const refreshToken = jwt.sign({ username: user.username, role: user.role }, refreshTokenSecret);

        return res.status(200).json({
            accessToken,
            refreshToken
        });
    });
}