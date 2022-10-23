const dtb = require('../config/database');
const db = dtb.promise();

module.exports = class Repair {
    constructor(row) {

        // this.id = row.idModel;
        this.idDevice = row.idDevice;
        this.idEvent = row.idEvent;
        this.problem = row.problem;
        this.notes = row.notes;

        this.warehouse = {};
        this.warehouse.id = row.idWh;
        // this.warehouse.name = row.warehouse;

        this.status = {};
        this.status.id = row.idRepairStatus;
        this.status.name = row.deviceState;

        this.creator = {};
        this.creator.id = row.idCreatedBy;
        this.creator.name = row.creator;

        // this.updatedBy = {};
        // this.updatedBy.id = row.idUpdatedBy;
        // this.updatedBy.name = row.updatedBy; 

    }



    static destructObj(idUser, modelId, deviceArr) {

        let dataArr = [];


        for (let i = 0; i < deviceArr.length; i++) {

            let dataRow = [];

            dataRow.push(modelId);
            dataRow.push(deviceArr[i].id);
            dataRow.push(deviceArr[i].problem);
            dataRow.push(deviceArr[i].notes);
            dataRow.push(deviceArr[i].idEvent);
            dataRow.push(deviceArr[i].warehouse.id);
            dataRow.push(deviceArr[i].status.id);
            dataRow.push(1);        //  qtt
            dataRow.push(3);        //  idCalcMethod (по серийникам)
            dataRow.push(idUser);   //  idUser

            dataArr.push(dataRow)
        }

        return dataArr;


    }

    static getAll() {
        try {
            return db.query('SELECT * FROM `v_repair`');
        } catch (error) {
            return error;
        }
    }

    static getModel() {
        try {
            return db.query('SELECT * FROM `v_repair`');
        } catch (error) {
            return error;
        }
    }

    static createRepair(deviceArr) {
        try {
            return db.query('INSERT INTO `t_repair` (idModel, idDevice, problem, notes, idEvent, idWh, idRepairStatus, qtt, idCalcMethod, idUser) VALUES ?', [deviceArr]);
        } catch (error) {
            return error;
        }
    }


}