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

exports.getModel = async (req, res) => {
    console.log("getModel");
    let status = await auth.authenticateJWT(req, res);
    console.log("statusCode:", status);

    let modelArr = [];
    if (status.status === 200) {

        try {
            const [models] = await Repair.getModel(req.query.idModel, req.query.idWh);
            console.log("models from db:", models);
            models.map(item => {
                let model = new Repair(item);
                modelArr.push(model);
            })
            return res.status(200).json(modelArr);
        } catch (error) {
            console.log("error:", error);
            res.status(500).json({ msg: "We have problems with getting repair models from database" });
            return {
                error: true,
                message: 'Error from database'
            }
        }
    }
}

exports.create = async (req, res) => {
    console.log("createRepair");
    let status = await auth.authenticateJWT(req, res);
    console.log("statusCode:", status);

    if (status.status === 200) {

        const idModel = req.body.id;
        const idUser = status.id;

        let deviceArr = Repair.destructObj(idUser, idModel, req.body.device);

        console.log("deviceArr:", deviceArr);

        try {
            const [result] = await Repair.createRepair(deviceArr);
            return res.status(200).json({ msg: "ok" });
        } catch (error) {
            console.log("error:", error);
            res.status(500).json({ msg: "We've got problems with creating repair" });
            return {
                error: true,
                message: 'Error from database'
            }
        }
    } else {
        return res.status(status.status).json({ msg: "We've got problems with JWT authentication" });
    }
}