const dtb = require('../config/database');
const db = dtb.promise();


module.exports = class MovingEquip {

    constructor(row) {
        this.id = row.idModel;
        this.name = row.modelName;
        this.qtt = row.qtt;
    }
    
    static destructObj(obj, unixTime) {

        let modelArr = [];
        
        if (obj.hasOwnProperty('model')) {
            if (obj.model.length > 0) {
                console.log("obj.model:", obj.model);
                obj.model.map(item => {
                    let modelRow = [];
                    modelRow.push(obj.id);
                    modelRow.push(item.id);
                    modelRow.push(item.qtt);
                    modelRow.push(1);
                    modelRow.push(unixTime);

                    modelArr.push(modelRow);
                })
            }
        }
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