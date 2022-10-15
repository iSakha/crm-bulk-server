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

    static destructObj(reqbody, unixTime, userId) {

        let movRow = [];


        movRow.push(reqbody.id);
        movRow.push(reqbody.warehouseOut.id);
        movRow.push(reqbody.warehouseIn.id);
        movRow.push(reqbody.dateOut.slice(0, 16));
        movRow.push(reqbody.dateIn.slice(0, 16));
        movRow.push(reqbody.status.id);
        movRow.push(reqbody.notes);
        movRow.push(userId);
        movRow.push(unixTime);


        return movRow;
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
            return db.query('SELECT * FROM `v_movings` WHERE `id`=?', [id]);
        } catch (error) {
            return error;
        }
    }

    static copyRow(idMoving) {
        try {
            return db.query('SELECT * FROM `t_movings` WHERE id=? AND is_deleted=0', [idMoving]);
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

static checkMovEquipQtt(whOut,arrIdModel) {
let query = "";
// switch (whOut) {
//     case 2:
//         query = "SELECT `qtt2` FROM `t_model1` WHERE `id` IN (?)";  
//         break;
//     case 3:
//     case 4:
//     case 5:
// }
}
}