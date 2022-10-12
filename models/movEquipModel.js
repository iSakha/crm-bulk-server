const dtb = require('../config/database');
const db = dtb.promise();


module.exports = class MovingEquip {

    constructor(row) {
        this.id = row.idModel;
        this.name = row.modelName;
        this.qtt = row.qtt;
    }

    static destructModel(reqbody, unixTime) {

        let modelArr = [];
        reqbody.model.map(item => {

            let row = [];
            row.push(reqbody.id);
            row.push(item.id);
            row.push(item.qtt);
            row.push(reqbody.status.id);
            row.push(unixTime);

            modelArr.push(row);
        })

        console.log("modelArr_mod:", modelArr);
        return modelArr;

    }

    static destructModelCalendar(reqbody, unixTime, userId) {

        let modelArr = [];
        reqbody.model.map(item => {

            let row = [];
            row.push(reqbody.dateOut);
            row.push(reqbody.id);
            row.push(item.id);
            row.push(item.qtt);
            row.push(reqbody.warehouseOut.id);
            row.push(reqbody.warehouseIn.id);
            row.push(userId);
            row.push(unixTime);

            modelArr.push(row);
        })

        console.log("modelArr_mod:", modelArr);
        return modelArr;

    }

    static getAll() {
        try {
            return db.query('SELECT * FROM `v_mov_equipment`');
        } catch (error) {
            return error;
        }
    }


    static getOne(id) {
        try {
            return db.query('SELECT idModel, modelName, qtt FROM `v_mov_equipment` WHERE `idMoving`=?', [id]);
        } catch (error) {
            return error;
        }
    }

    // static create(modelRow) {
    //     console.log("create_mod modelRow", modelRow);
    //     try {
    //         return db.query('INSERT INTO `t_mov_equipment` (idMoving, idModel, qtt) VALUES ?', [modelRow]);
    //     } catch (error) {
    //         return error;
    //     }
    // }

    // static markMovingDel(id) {
    //     try {
    //         return db.query('UPDATE t_mov_equipment SET is_deleted=1 WHERE idMoving=?', [id]);

    //     } catch (error) {
    //         return error;
    //     }
    // }

}