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

        let deviceRow = Repair.destructObj(req.body.id,req.body.date,idUser, idModel, req.body.device, req.body.idCalcMethod, req.body.qtt, unixTime);

        console.log("deviceRow:", deviceRow);

        try {

            let [whQtt] = await Repair.checkRepEquipQtt(req.body.device.warehouse.id ,req.body.idModel);
            console.log("whQttArr:", whQtt);   

            
            if(req.body.qtt > Object.values(whQtt[0])[0]) {
                return res.status(403).json({msg:"Ошибка в выборе склада или количества приборов"});
            }

            const [result] = await Repair.createRepair(deviceRow
                );
            return res.status(200).json([{ msg: "ok" },rb]);
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

exports.getRepairStatus = async(req,res) => {
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

exports.getCalcMethod = async(req,res) => {
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
function createRepairId() {
    let d = new Date();
    let utc = d.getTime().toString();
    let id = "rep" + utc.slice(0, 11);
    return id;
}