const dtb = require('../config/database');
const db = dtb.promise();

module.exports = class BookEquipment {

    constructor(row) {
        this.idModel = row.idModel;
        this.name = row.name;
        this.qtt = row.qtt;
    }


    static destructObj(obj, eventId, idWh, userId, unixTime) {

        console.log("destructPhaseObj_mod:", obj);
        let equipArr = [];

        obj.map(item => {
            let equipRow = [];
            let { id, qtt } = item;

            // console.log("obj.phase:", obj.phase);

            equipRow.push(eventId);     // eventId
            equipRow.push(id);
            equipRow.push(qtt);
            equipRow.push(idWh);
            equipRow.push(userId);
            equipRow.push(unixTime);

            equipArr.push(equipRow);
        })

        // console.log("phaseArr:", phaseArr);

        return equipArr;
    }

    static addEventEquip(equipArr) {
        console.log('addEventEquip');
        console.log('equipArr:', equipArr);
        try {
            return db.query('INSERT INTO `t_event_equipment` (idEvent, idModel, qtt, idWarehouse, idUser, unixTime) VALUES ?', [equipArr]);
        } catch (error) {
            return error;
        }
    }

    static getAllEquip() {
        console.log("getAllEquip");
        return db.query('SELECT * FROM `v_event_equipment`');
     }
     
    static getOne(idEvent) {
        try {
            return db.query('SELECT * FROM `v_event_equipment` WHERE `idEvent`=?', [idEvent]);
        } catch (error) {
            return error;
        }
    }

}