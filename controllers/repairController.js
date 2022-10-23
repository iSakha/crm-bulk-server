const jwt = require('jsonwebtoken');
const Repair = require('../models/repairModel');
const auth = require('../controllers/authController');

exports.getAll = async (req, res) => {
    console.log("getAllRepairs");
    let status = await auth.authenticateJWT(req, res);
    console.log("statusCode:", status);

    let allRepairsArr = [];

    if (status.status === 200) {
        try {
            const [repairs] = await Repair.getAll();
            console.log("allRepairs from db:", repairs);

            repairs.map(item => {
                let repair = new Repair(item);
                allRepairsArr.push(repair);
            })

            return res.status(200).json(allRepairsArr);
        } catch (error) {
            console.log("error:", error);
            res.status(500).json({ msg: "We have problems with getting repair data from database" });
            return {
                error: true,
                message: 'Error from database'
            }           
        }
    } else {
        return res.status(status.status).json({ msg: "We have problems with JWT authentication" });
    }
}