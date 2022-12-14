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

exports.getOne = async (req, res) => {
    console.log("getOne");
    let status = await auth.authenticateJWT(req, res);
    console.log("statusCode:", status);

    let allRepairsArr = [];

    if (status.status === 200) {
        try {
            const [repairs] = await Repair.getOne(req.params.id);
            console.log("getOne from db:", repairs);

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
    } else {
        return res.status(status.status).json({ msg: "We have problems with JWT authentication" });
    }
}

exports.create = async (req, res) => {

    console.log("createRepair req.body:", req.body);

    const rb = Object.assign({}, req.body);

    let status = await auth.authenticateJWT(req, res);
    console.log("statusCode:", status);

    if (status.status === 200) {

        const idModel = req.body.idModel;
        const idUser = status.id;
        req.body.id = createRepairId();
        rb.id = req.body.id;
        let unixTime = Date.now();

        console.log("req.body:", req.body);

        let deviceRow = Repair.destructObj(req.body.id, req.body.date, req.body.idEvent, idUser, idModel, req.body.device, req.body.warehouse.id, req.body.status.id, req.body.idCalcMethod, req.body.qtt, unixTime);

        console.log("deviceRow:", deviceRow);

        try {

            let [whQtt] = await Repair.checkRepEquipQtt(req.body.warehouse.id, req.body.idModel);
            console.log("whQttArr:", whQtt);


            if (req.body.qtt > Object.values(whQtt[0])[0]) {
                return res.status(400).json({ msg: "???????????? ?? ???????????? ???????????? ?????? ???????????????????? ????????????????" });
            }

            const [result] = await Repair.createRepair(deviceRow
            );
            return res.status(200).json([{ msg: "ok" }, rb]);
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

exports.getRepairStatus = async (req, res) => {
    try {
        const [result] = await Repair.getRepairStatus();
        result.shift();
        return res.status(200).json(result)
    } catch (error) {
        console.log("error:", error);
        res.status(500).json({ msg: "We have problems with getting repair status from database" });
        return {
            error: true,
            message: 'Error from database'
        }
    }
}

exports.getCalcMethod = async (req, res) => {
    try {
        const [result] = await Repair.getCalcMethod();
        result.shift();
        return res.status(200).json(result)
    } catch (error) {
        console.log("error:", error);
        res.status(500).json({ msg: "We have problems with getting repair calc method from database" });
        return {
            error: true,
            message: 'Error from database'
        }
    }
}

exports.update = async (req, res) => {
    console.log("update req.body:", req.body);
    const rb = Object.assign({}, req.body);

    let status = await auth.authenticateJWT(req, res);
    console.log("statusCode:", status);

    if (status.status === 200) {

        const idModel = req.body.idModel;
        const idUser = status.id;
        req.body.id = req.params.id;
        rb.id = req.body.id;
        let unixTime = Date.now();

        let deviceRow = Repair.destructObj(req.body.id, req.body.date, req.body.idEvent, idUser, idModel, req.body.device, req.body.warehouse.id, req.body.status.id, req.body.idCalcMethod, req.body.qtt, unixTime);

        console.log("deviceRow:", deviceRow);

        switch (req.body.status.id) {
            case 3:
            case 4:
            case 5:

                try {
                    const [result] = await Repair.updateNoCalc(deviceRow);
                    return res.status(200).json([{ msg: "???????????? ?????????????? ??????????????????" }, rb]);
                } catch (error) {
                    console.log("error:", error);
                    res.status(500).json({ msg: "We've got problems with updateNoCalc" });
                    return {
                        error: true,
                        message: 'Error from database'
                    }
                }

            case 6:
                switch (req.body.idCalcMethod) {
                    case 2:
                        deviceRow[9] = -deviceRow[9];
                        try {
                            const [result] = await Repair.updateBulk(deviceRow);
                            return res.status(200).json([{ msg: "???????????? ?????????????? ??????????????????" }, rb]);
                        } catch (error) {
                            console.log("error:", error);
                            res.status(500).json({ msg: "We've got problems with updateNoCalc" });
                            return {
                                error: true,
                                message: 'Error from database'
                            }
                        }
                    case 3:
                        deviceRow[9] = -deviceRow[9];
                        try {
                            const [result] = await Repair.updateSN(deviceRow);
                            return res.status(200).json([{ msg: "???????????? ?????????????? ??????????????????" }, rb]);
                        } catch (error) {
                            console.log("error:", error);
                            res.status(500).json({ msg: "We've got problems with updateNoCalc" });
                            return {
                                error: true,
                                message: 'Error from database'
                            }
                        }
                    default:
                        return res.status(500).json({ msg: "?????????????? ???????????? ?????????? ????????????????" });
                }

            default:
                return res.status(500).json({ msg: "?????????????? ???????????? ???????????? ?????????????? ??????????????" });
        }
    } else {
        return res.status(status.status).json({ msg: "We have problems with JWT authentication" });
    }
}
function createRepairId() {
    let d = new Date();
    let utc = d.getTime().toString();
    let id = "rep" + utc.slice(0, 11);
    return id;
}