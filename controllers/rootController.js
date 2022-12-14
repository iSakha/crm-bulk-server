const Root = require('../models/rootModel');
const pool = require('../config/database');
const auth = require('../controllers/authController');

exports.greetMessage = (req, res) => {
    try {
        let msg = { msg: "Server is running" };
        res.status(200).json(msg);
    } catch (error) {
        console.log("error:", error);
    }
}

exports.checkDbConnection = (req, res) => {
    pool.getConnection((err, connection) => {
        if (!err) {
            // console.log('connect!')
            connection.release();
            res.json({ message: 'Successfully connected to MySQL database!' });
        } else {
            console.log('err:', err);
            res.send({ message: 'We\'ve got a problem!' });
        }
    })
}

exports.getWarehouses = async (req, res) => {

    console.log("getWarehouses");
    let status = await auth.authenticateJWT(req, res);

    if (status.status === 200) {

        try {
            const [whouses] = await Root.getWarehouses();
            whouses.shift();
            return res.status(200).json(whouses);

        } catch (error) {
            if (!error.statusCode) {
                console.log("error:", error);
                return res.status(500).json({ msg: "We have problems with getting warehouses from database" });
            }
        }
    } else {
        return res.status(status.status).json({ msg: "We have problems with JWT authentication" });
    }
}


exports.getPhases = async (req, res) => {

    try {
        console.log("getPhases");
        let status = await auth.authenticateJWT(req, res);
        console.log("statusCode:", status.status);
        if (status.status === 200) {
            const [phase] = await Root.getPhases();
            console.log(status);
            phase.shift();
            res.status(200).json(phase);
        } else {
            res.sendStatus(status.status);
        }

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
    }
}

exports.getStatus = async (req, res) => {

    try {
        console.log("getStatus");
        let status = await auth.authenticateJWT(req, res);
        console.log("statusCode:", status.status);
        if (status.status === 200) {
            const [stats] = await Root.getStatus();
            console.log(stats);
            stats.shift();
            res.status(200).json(stats);
        } else {
            res.sendStatus(status.status);
        }

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
    }

}

