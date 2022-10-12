const jwt = require('jsonwebtoken');
const Moving = require('../models/movingModel');
const MovingEquip = require('../models/movEquipModel');
const trans = require('../models/transactionMovingModel');
const Notification = require('../models/notificateModel');
// const utils = require('../utils/utils');
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

exports.create = async (req, res) => {

    console.log("createNew req.body:", req.body);

    const rb = Object.assign({}, req.body);

    let status = await auth.authenticateJWT(req, res);
    let userId = status.id;
    let responseDB;
    let msg;

    if (status.status === 200) {
        req.body.id = createMovId();
        let unixTime = Date.now();

        let modelArr = MovingEquip.destructObj(req.body, unixTime);

        let movRow = Moving.destructObj(userId, req.body, unixTime);

        let notifyRow = [];

        notifyRow.push(userId);
        notifyRow.push("create");
        notifyRow.push("moving");
        notifyRow.push(req.body.id);
        notifyRow.push(req.body.warehouseOut.id);
        notifyRow.push(unixTime);

        try {
            responseDB = await trans.createMoving(movRow, modelArr);

            msg = `Перемещение успешно создано. idEvent = ${req.body.id}`

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

            return res.status(responseDB[0].status).json([{ msg: msg }, rb, { id: req.body.id }]);
        } catch (error) {
            console.log("error:", error);
            return res.status(responseDB[0].status).json({ msg: responseDB[1].msg });
        }




    }

    // return res.status(200).json([{ msg: `Перемещение успешно создано. idMoving = ${req.body.id}` }, req.body]);
    // return res.status(200).json([{ msg: `Перемещение успешно создано. idMoving = ${req.body.id}` }, req.body]);

    // } else {
    //     res.status(status.status).json({ msg: "We have problems with JWT authentication" });
    // }

}

exports.update = async (req, res) => {

    console.log("update req.body:", req.body);

    let status = await auth.authenticateJWT(req, res);
    let userId = status.id;
    let responseDB;
    let msg;


    if (status.status === 200) {
        req.body.id = req.params.id;
        let unixTime = Date.now();


        let modelArr = MovingEquip.destructModel(req.body, unixTime);
        let modelArrCal = MovingEquip.destructModelCalendar(req.body, unixTime, userId);
        let movRow = Moving.destructObj(req.body, unixTime, userId);

        let transferArr = MovingEquip.destructModelTransfer(req.body);


        console.log("transferArr:", transferArr);

        let notifyRow = [];

        notifyRow.push(userId);
        notifyRow.push("update");
        notifyRow.push("moving");
        notifyRow.push(req.body.id);
        notifyRow.push(req.body.warehouseOut.id);
        notifyRow.push(unixTime);

        try {
            switch (req.body.status.id) {
                case 2:
                    responseDB = await trans.updateMovingRequest(req.params.id, movRow, modelArr, modelArrCal);
                    break;
                case 3:
                    responseDB = await trans.updateMovingShipped(req.params.id, movRow, modelArr, modelArrCal);
                    break;
                case 4:
                    let query = createQuery(req.body.warehouseOut.id, req.body.warehouseIn.id, transferArr);
                    responseDB = await trans.updateMovingReceived(req.params.id, movRow, modelArr, query);
                    break;
            }


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

            return res.status(responseDB[0].status).json({ msg: responseDB[1].msg });

        } catch (error) {
            console.log("error:", error);
            return res.status(responseDB[0].status).json({ msg: responseDB[1].msg });
        }


    }
}

exports.delete = async (req, res) => {

    console.log("deleteTrans id:", req.params.id);
    let status = await auth.authenticateJWT(req, res);
    let userId = status.id;
    let unixTime = Date.now();
    let responseDB;

    if (status.status === 200) {

        try {

            console.log("authentication successfull!");

            const [delMoving] = await Moving.copyRow(req.params.id);
            console.log("delMoving:", delMoving);

            if (delMoving.length > 0) {
                delMoving[0].idUser = userId;
                delMoving[0].unixTime = unixTime;
                delMoving[0].is_deleted = 1;

                let delMovingRow = Object.values(delMoving[0]);
                console.log("delMovingRow:", delMovingRow);

                let notifyRow = [];

                notifyRow.push(userId);
                notifyRow.push("delete");
                notifyRow.push("moving");
                notifyRow.push(req.params.id);
                notifyRow.push(delMoving[0].idWhOut);
                notifyRow.push(unixTime);

                responseDB = await trans.deleteMoving(req.params.id, delMovingRow);

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

                return res.status(responseDB[0].status).json({ msg: responseDB[1].msg });

            } else {
                return res.status(200).json({ msg: `Перемещения с id=${req.params.id} не существует` });
            }

        } catch (error) {
            console.log("error:", error);
            res.status(500).json({ msg: "We have problems with deleting moving data in database" });
            return {
                error: true,
                message: 'Error from database'
            }
        }

        // let notifyRow = [];

        // notifyRow.push(userId);
        // notifyRow.push("delete");
        // notifyRow.push("moving");
        // notifyRow.push(req.params.id);
        // notifyRow.push(1);
        // notifyRow.push(unixTime);

        // try {

        //     // write to `t_notifications` table
        //     const [notification] = await Notification.createNew(notifyRow);
        //     console.log("result notification:", notification);

        // } catch (error) {
        //     console.log("error:", error);
        //     res.status(500).json({ msg: "We have problems with writing notification to database" });
        //     return {
        //         error: true,
        //         message: 'Error from database'
        //     }
        // }

        // return res.status(200).json([{ msg: `Перемещение успешно  удалено. idMoving = ${req.params.id}` }]);

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

exports.testQuery = async (req, res) => {

    console.log("testQuery");


    try {
        const [result] = await MovingEquip.testTransfer(2, 3, '001.001.001');

        console.log("result test:", result);
        return res.status(200).json({ msg: "ok" });
    } catch (error) {

        console.log("error:", error);
        res.status(500).json({ msg: "We have problems with testQuery" });
        return {
            error: true,
            message: 'Error from database'
        }
    }


}

function createMovId() {
    let d = new Date();
    let utc = d.getTime().toString();
    let id = "mov" + utc.slice(0, 11);
    return id;
}

function createQuery(whOut, whIn, arr) {

    let query = "";
    let idArr = "WHERE id IN ("
    let q1 = `UPDATE t_model SET qtt${whOut} = CASE `;

    for (let i = 0; i < arr.length; i++) {
        q1 += `WHEN id = '${arr[i][0]}' THEN qtt${whOut} - ${arr[i][1]} `;
        idArr +=`'${arr[i][0]}'`;
        if (i < arr.length -1) {
            idArr +=","
        }
    }

    let q2 = `qtt${whIn} = CASE `

    for(i = 0;i < arr.length;i++) {
        q2 += `WHEN id = '${arr[i][0]}' THEN qtt${whIn} + ${arr[i][1]} `;
    }

    query = q1 + "END , " + q2 + "END " + idArr + ")";

    // console.log(query);
    return query;

}

