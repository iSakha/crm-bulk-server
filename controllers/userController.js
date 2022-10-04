const jwt = require('jsonwebtoken');
const auth = require('../controllers/authController');
const User = require('../models/userModel');

exports.getUsers = async (req, res) => {

    try {
        console.log("getUsers");
        let status = await auth.authenticateJWT(req, res);
        console.log("statusCode:", status.status);

        let usersArr = [];

        if (status.status === 200) {
            const [users] = await User.getUsers();
            console.log(users);
            users.shift();

            users.map(item => {
                let user = new User(item);
                usersArr.push(user);
            })

            return res.status(200).json(usersArr);

        } else {
            res.sendStatus(status.status);
        }

    } catch (error) {
        if (!error.statusCode) {
            console.log("error:", error);
            return res.status(500).json({ msg: "We have problems with getting users from database" });
        }
    }

}

exports.getUser = async (req, res) => {


    console.log("getUser");
    let status = await auth.authenticateJWT(req, res);

    if (status.status === 200) {

        try {
            console.log("iduser:", status.id);

            const [users] = await User.getUser(status.id);
            console.log(users);

            let user = new User(users[0]);

            return res.status(200).json(user);
        } catch (error) {
            if (!error.statusCode) {
                console.log("error:", error);
                return res.status(500).json({ msg: "We have problems with getting user from database" });
            }
        }

    } else {
        return res.status(status.status).json({ msg: "We have problems with JWT authentication" });
    }



}