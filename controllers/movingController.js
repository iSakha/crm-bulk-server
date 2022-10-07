const jwt = require('jsonwebtoken');
const Moving = require('../models/movingModel');
const MovingEquip = require('../models/movEquipModel');
const Notification = require('../models/notificateModel');
const utils = require('../utils/utils');
const auth = require('../controllers/authController');

exports.getAll = async (req, res) => {

    console.log("getAllEvents");
    let status = await auth.authenticateJWT(req, res);
    console.log("statusCode:", status);

    let allMovingsArr = [];

    if (status.status === 200) {

        try {
            const [allMovings] = await Moving.getAll();
            console.log("allMovings from db:", allMovings);

            const [allMovingEquip] = await MovingEquip.getAll();
            console.log("allMovingEquip from db:", allMovingEquip);


            for (let i = 0; i < allMovings.length; i++) {

                let movObj = new Moving(allMovings[i]);

                let foundEquip = allMovingEquip.filter(e => e.idMoving === allMovings[i].id);
                console.log("foundEquip:", i, foundEquip);

                foundEquip = foundEquip.map(item => {
                    return item = new MovingEquip(item);
                });

                if (foundEquip.length > 0) {
                    movObj.model = foundEquip;
                } else movObj.model = [];

                allMovingsArr.push(movObj);
            }
            return res.status(200).json(allMovingsArr);
        } catch (error) {
            console.log("error:", error);
            res.status(500).json({ msg: "We have problems with getting event data from database" });
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

    console.log("getOneEvent");
    let status = await auth.authenticateJWT(req, res);
    console.log("statusCode:", status);

    if (status.status === 200) {

        try {
            const [moving] = await Moving.getOne(req.params.id);
            console.log("moving from db:", moving);

            if (moving.length < 1) {
                res.status(200).json({ msg: `Перемешения с id = ${req.params.id} не существует` });
                return;
            }

            let movObj = new Moving(moving[0]);

            let movEquipArr = []
            const [movingEquip] = await MovingEquip.getOne(req.params.id);
            console.log("movingEquip from db:", movingEquip);

            if (movingEquip.length > 0) {

                for (let i = 0; i < movingEquip.length; i++) {
                    let movEquipObj = new MovingEquip(movingEquip[i]);
                    movEquipArr.push(movEquipObj);
                }

                movObj.model = movEquipArr;
            } else {
                movObj.model = [];
            }
            console.log("movObj to send:", movObj);

            return res.status(200).json(movObj);

        } catch (error) {
            console.log("error:", error);
            res.status(500).json({ msg: "We have problems with getting event data from database" });
            return {
                error: true,
                message: 'Error from database'
            }
        }

    } else {
        return res.status(status.status).json({ msg: "We have problems with JWT authentication" });
    }

}

exports.createNew = async (req, res) => {

    console.log("createNew req.body:", req.body);

    let status = await auth.authenticateJWT(req, res);
    let userId = status.id;
    req.body.id = "mov" + utils.createEventId();

    if (status.status === 200) {

        let destructArr = Moving.destructObj(userId, req.body);
        let movRow = destructArr[0];
        let modelRow = destructArr[1];
        try {
            const [newMoving] = await Moving.create(movRow);
            console.log("result newMoving:", newMoving);
        } catch (error) {
            console.log("error:", error);
            res.status(500).json({ msg: "We have problems with writing moving data to database" });
            return {
                error: true,
                message: 'Error from database'
            }
        }

        if (modelRow.length > 0) {
            try {
                const [newModel] = await MovingEquip.create(modelRow);
                console.log("result modelRow:", newModel);
            } catch (error) {
                console.log("error:", error);
                res.status(500).json({ msg: "We have problems with writing model data to database" });
                return {
                    error: true,
                    message: 'Error from database'
                }
            }
        }

        let unixTime = movRow[movRow.length - 1];
        let notifyRow = [];

        notifyRow.push(userId);
        notifyRow.push("create");
        notifyRow.push("moving");
        notifyRow.push(req.body.id);
        notifyRow.push(req.body.warehouseOut.id);
        notifyRow.push(unixTime);

        try {

            // write to `t_notifications` table
            const [notification] = await Notification.createNew(notifyRow);
            console.log("result notification:", notification);

        } catch (error) {
            console.log("error:", error);
            res.status(500).json({ msg: "We have problems with writing notification to database" });
            return {
                error: true,
                message: 'Error from database'
            }
        }

        return res.status(200).json([{ msg: `Перемещение успешно создано. idMoving = ${req.body.id}` }, req.body]);

    } else {
        res.status(status.status).json({ msg: "We have problems with JWT authentication" });
    }

}

exports.update = async (req, res) => {

    console.log("update req.body:", req.body);

    let status = await auth.authenticateJWT(req, res);
    let userId = status.id;
    req.body.id = req.params.id;

    if (status.status === 200) {

        let destructArr = Moving.destructObj(userId, req.body);

        let movRow = destructArr[0];
        let modelRow = destructArr[1];
        console.log("movRow destructObj:", movRow);
        console.log("modelRow destructObj:", modelRow);

        try {

            const [result] = await Moving.markMovingDel(req.params.id);
            console.log("result markMovingDel:", result);
            const [newMoving] = await Moving.create(movRow);
            console.log("result newMoving:", newMoving);

            const [resultEquip] = await MovingEquip.markMovingDel(req.params.id);
            console.log("resultEquip markMovingDel:", resultEquip);

        } catch (error) {
            console.log("error:", error);
            res.status(500).json({ msg: "We have problems with updating moving data in database" });
            return {
                error: true,
                message: 'Error from database'
            }
        }

        if (modelRow.length > 0) {
            try {
                const [newModel] = await MovingEquip.create(modelRow);
                console.log("result modelRow:", newModel);
            } catch (error) {
                console.log("error:", error);
                res.status(500).json({ msg: "We have problems with writing model data to database" });
                return {
                    error: true,
                    message: 'Error from database'
                }
            }
        }

        let unixTime = movRow[movRow.length - 1];
        let notifyRow = [];

        notifyRow.push(userId);
        notifyRow.push("update");
        notifyRow.push("moving");
        notifyRow.push(req.body.id);
        notifyRow.push(req.body.warehouseOut.id);
        notifyRow.push(unixTime);

        try {

            // write to `t_notifications` table
            const [notification] = await Notification.createNew(notifyRow);
            console.log("result notification:", notification);

        } catch (error) {
            console.log("error:", error);
            res.status(500).json({ msg: "We have problems with writing notification to database" });
            return {
                error: true,
                message: 'Error from database'
            }
        }

        return res.status(200).json([{ msg: `Перемещение успешно  обновлено. idMoving = ${req.body.id}` }, req.body]);

    } else {
        res.status(status.status).json({ msg: "We have problems with JWT authentication" });
    }

}

exports.delete = async (req, res) => {

    console.log("delete id:", req.params.id);
    let status = await auth.authenticateJWT(req, res);

    let userId = status.id;
    // req.body.id = req.params.id;
    let unixTime = Date.now();

    if (status.status === 200) {

        try {

            const [result] = await Moving.markMovDel(req.params.id,userId,unixTime);
            console.log("result markMovDel:", result);

        } catch (error) {
            console.log("error:", error);
            res.status(500).json({ msg: "We have problems with deleting moving data in database" });
            return {
                error: true,
                message: 'Error from database'
            }
        }

        let notifyRow = [];

        notifyRow.push(userId);
        notifyRow.push("delete");
        notifyRow.push("moving");
        notifyRow.push(req.params.id);
        notifyRow.push(1);
        notifyRow.push(unixTime);

        try {

            // write to `t_notifications` table
            const [notification] = await Notification.createNew(notifyRow);
            console.log("result notification:", notification);

        } catch (error) {
            console.log("error:", error);
            res.status(500).json({ msg: "We have problems with writing notification to database" });
            return {
                error: true,
                message: 'Error from database'
            }
        }

        return res.status(200).json([{ msg: `Перемещение успешно  удалено. idMoving = ${req.params.id}` }]);

    } else {
        res.status(status.status).json({ msg: "We have problems with JWT authentication" });
    }

}

exports.getStatus = async (req, res) => {

    console.log("getStatus");
    let status = await auth.authenticateJWT(req, res);

    if (status.status === 200) {

        try {
            const [movStatus] = await Moving.getMovStatus();
            movStatus.shift();
            console.log("result movStatus:", movStatus);
            return res.status(200).json(movStatus);
        } catch (error) {

            console.log("error:", error);
            res.status(500).json({ msg: "We have problems with writing model data to database" });
            return {
                error: true,
                message: 'Error from database'
            }            
        }        

    } else {
        res.status(status.status).json({ msg: "We have problems with JWT authentication" });
    }
}
