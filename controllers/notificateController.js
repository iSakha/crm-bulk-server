const jwt = require('jsonwebtoken');
const Notification = require('../models/notificateModel');
const auth = require('../controllers/authController');





exports.getAll = async (req, res) => {
    console.log("getAll_notifications");

    let status = await auth.authenticateJWT(req, res);
    if (status.status === 200) {

        let notificationArr = [];
        let allNotifications;

        [allNotifications] = await Notification.getAll();
        console.log("allNotifications from db:", allNotifications);

        for (let i = 0; i < allNotifications.length; i++) {
            let notifObj = new Notification(allNotifications[i]);
            notificationArr.push(notifObj);
        }

        return res.status(200).json(notificationArr);

    } else {
        return res.status(status.status).json({ msg: "We have problems with JWT authentication" });
    }

}

exports.createNew = async (req, res) => {

    return res.status(200).json({ msg: "test createNew" });

    // let userId = 4;
    // let row = Notification.destructObj(userId, req.body);
    // console.log("notify_row:", row);

    // try {
    //     const [newNotification] = await Notification.createNew(row);
    //     return res.status(200).json({ msg: "test createNew" });
    // } catch (error) {
    //     console.log("error:", error);
    //     res.status(500).json({ msg: "We have problems with writing notification to database" });
    // }

}
exports.getByWarehouse = async (req, res) => {
    console.log("getByWarehouse_notifications");

    let status = await auth.authenticateJWT(req, res);

    if (status.status === 200) {

        let idWh = req.query.id;
        let limit = req.query.last;
        let notificationArr = [];
        let notificationsByWh;

        try {

            [notificationsByWh] = await Notification.getByWarehouse(idWh, limit);
            console.log("notificationsByWh from db:", notificationsByWh);

            for (let i = 0; i < notificationsByWh.length; i++) {
                let notifObj = new Notification(notificationsByWh[i]);
                notificationArr.push(notifObj);
            }


            return res.status(200).json(notificationArr);

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
