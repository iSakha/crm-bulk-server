const dtb = require('../config/database');
const db = dtb.promise();


module.exports = class Moving {

    constructor(row) {

        this.id = row.id;
        this.warehouseOut = {};
        this.warehouseOut.id = row.idWhOut;
        this.warehouseOut.name = row.whOutName;
        this.warehouseIn = {};
        this.warehouseIn.id = row.idWhIn;
        this.warehouseIn.name = row.whInName;
        this.dateOut = row.dateOut;
        this.dateIn = row.dateIn;
        this.status = {};
        this.status.id = row.idStatus;
        this.status.name = row.status;
        this.notes = row.notes;
        this.creator = {};
        this.creator.id = row.creatorId;
        this.creator.name = row.creatorName;

    }
    static destructObj(userId, obj, unixTime) {

        let movRow = [];
        let modelArr = [];

        movRow.push(obj.id);
        movRow.push(obj.warehouseOut.id);
        movRow.push(obj.warehouseIn.id);
        movRow.push(obj.dateOut.slice(0, 16));
        movRow.push(obj.dateIn.slice(0, 16));
        movRow.push(obj.status.id);
        movRow.push(obj.notes);
        movRow.push(userId);
        movRow.push(unixTime);

        if (obj.hasOwnProperty('model')) {
            if (obj.model.length > 0) {
                console.log("obj.model:", obj.model);
                obj.model.map(item => {
                    // let { id, name, qtt } = item;
                    let modelRow = [];
                    modelRow.push(obj.id);
                    modelRow.push(item.id);
                    modelRow.push(item.qtt);
                    modelRow.push(1);
                    modelRow.push(unixTime);

                    modelArr.push(modelRow);
                })
            }

            return [movRow,modelArr];
        }
    }

    static getAll() {
        try {
            return db.query('SELECT * FROM `v_movings`');
        } catch (error) {
            return error;
        }
    }

    static getOne(id) {
        try {
            return db.query('SELECT * FROM `v_moving` WHERE `id`=?', [id]);
        } catch (error) {
            return error;
        }
    }

    static create(movRow) {
        console.log("create_mod movRow", movRow);
        try {
            return db.query('INSERT INTO `t_moving` (id, idWhOut, idWhIn, dateOut, dateIn, idStatus, notes, idUser, unixTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)', movRow);
        } catch (error) {
            return error;
        }
    }

    // for update
    static markMovingDel(id) {
        try {
            return db.query('UPDATE t_moving SET is_deleted=1 WHERE id=?', [id]);

        } catch (error) {
            return error;
        }
    }

    // for delete
    static markMovDel(id,userId,unixTime) {
        try {
            return db.query('UPDATE t_moving SET is_deleted=1, idUser=?, unixTime=? WHERE id=?', [userId,unixTime,id]);

        } catch (error) {
            return error;
        }
    }

    static getMovStatus() {
        try {
            return db.query('SELECT * FROM t_mov_status');
        } catch (error) {
            return error;
        }
    }


}