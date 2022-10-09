const dtb = require('../config/database');
const db = dtb.promise();

module.exports = class Notification {

    constructor(notification) {

        this.id = notification.id;
        this.creator = {};
        this.creator.id = notification.idUser;
        this.creator.name = notification.user;
        this.creator.avatar = notification.avatar;
        this.action = notification.action;
        this.object = {};
        this.object.type = notification.objType;
        this.object.id = notification.idObj;
        this.object.name = notification.objName;
        this.warehouse = {};
        this.warehouse.id = notification.idWh;
        this.warehouse.name = notification.nameWh;
        this.date = notification.date;

    }

    static destructObj(userId, obj) {

        console.log("destructObj:", obj);
        let notificationRow = [];
        let unixTime = Date.now();

        notificationRow.push(userId);
        notificationRow.push(obj.action);
        notificationRow.push(obj.object.type);
        notificationRow.push(obj.object.id);
        notificationRow.push(obj.warehouse.id);
        notificationRow.push(unixTime);

        return notificationRow;
    }

    static getAll() {
        try {
            return db.query('SELECT * FROM `v_notifications`');
        } catch (error) {
            return error;
        }
    }

    static createNew(notifictionRow) {
        try {
            return db.query('INSERT INTO `t_notifications` (`idUser`, `action`, `objType`, `idObj`,`idWh`, `unixTime`) VALUES (?,?,?,?,?,?)', notifictionRow);
        } catch (error) {
            return error;
        }
    }

    static getByWarehouse(idWh, limit) {
        try {
            switch (idWh) {
                case "all":
                    return db.query('SELECT * FROM `v_notifications` ORDER BY `id` DESC LIMIT ?', [parseInt(limit)]);
            }
            return db.query('SELECT * FROM `v_notifications` WHERE idWh=? ORDER BY `id` DESC LIMIT ?', [idWh, parseInt(limit)]);
        } catch (error) {
            return error;
        }
    }


}