const dtb = require('../config/database');
const db = dtb.promise();

module.exports = class Repair {
    constructor(row) {

        this.id = row.id;
        this.date = row.date;
        this.idEvent = row.idEvent;

        this.device = {};
        this.device.idDevice = row.idDevice;
        this.device.problem = row.problem;
        this.device.notes = row.notes;

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



    static destructObj(id, date, idUser, modelId, deviceArr, unixTime) {

        let dataArr = [];


        for (let i = 0; i < deviceArr.length; i++) {

            let dataRow = [];

            dataRow.push(id);
            dataRow.push(date);
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
            dataRow.push(unixTime);   //  unixTime

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

    static getOne(id) {
        try {
            return db.query('SELECT * FROM `v_repair` WHERE id=?', [id]);
        } catch (error) {
            return error;
        }
    }

    static getModel(idModel, idWh) {
        let query = "";
        switch (idWh) {
            case 2:
                query = "SELECT * FROM `v_repair` WHERE `idWh`=2 AND `idModel`=?";
                break;
            case 3:
                query = "SELECT * FROM `v_repair` WHERE `idWh`=3 AND `idModel`=?";
                break;
            case 4:
                query = "SELECT * FROM `v_repair` WHERE `idWh`=4 AND `idModel`=?";
                break;
            case 5:
                query = "SELECT * FROM `v_repair` WHERE `idWh`=5 AND `idModel`=?";
                break;
            default:
                query = "SELECT * FROM `v_repair` WHERE `idModel`=?";
                break;
        }
        try {
            return db.query(query, [idModel]);
        } catch (error) {
            return error;
        }
    }

    static createRepair(deviceArr) {
        try {
            return db.query('INSERT INTO `t_repair` (id, date, idModel, idDevice, problem, notes, idEvent, idWh, idRepairStatus, qtt, idCalcMethod, idUser, unixTime) VALUES ?', [deviceArr]);
        } catch (error) {
            return error;
        }
    }


}