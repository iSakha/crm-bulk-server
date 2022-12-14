const dtb = require('../config/database');
const db = dtb.promise();

module.exports = class Repair {
    constructor(row) {

        this.id = row.id;
        this.date = row.date;
        this.idEvent = row.idEvent;
        this.idCalcMethod = row.idCalcMethod;
        this.idModel = row.idModel
        this.qtt = row.qtt;

        this.device = {};
        
        this.device.idDevice = row.idDevice;
        this.device.problem = row.problem;
        this.device.notes = row.notes;

        this.warehouse = {};
        this.warehouse.id = row.idWh;
        this.warehouse.name = row.warehouse;

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



    static destructObj(idRepair, date, idEvent, idUser, idModel, device, idWh, idStatus, idCalcMethod, qtt, unixTime) {

        console.log("idRepair:",idRepair);
        console.log("date:",date.slice(0, -1));
        console.log("idUser:",idUser);
        console.log("idModel:",idModel);
        console.log("device:",device);
        console.log("idCalcMethod:",idCalcMethod);
        console.log("qtt:",qtt);
        console.log("unixTime:",unixTime);

        let dataRow = [];

        dataRow.push(idRepair);
        dataRow.push(date.slice(0, -1));
        dataRow.push(idModel);
        dataRow.push(device.idDevice);
        dataRow.push(device.problem);
        dataRow.push(device.notes);
        dataRow.push(idEvent);
        dataRow.push(idWh);
        dataRow.push(idStatus);

        if (idCalcMethod === 3) {
            dataRow.push(1);        //  qtt
        };

        if (idCalcMethod === 2) {
            dataRow.push(qtt);        //  qtt
        }

        dataRow.push(idCalcMethod);        //  idCalcMethod (по серийникам или россыпью)
        dataRow.push(idUser);   //  idUser
        dataRow.push(unixTime);   //  unixTime

        return dataRow;


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
            case "2":
                console.log("case 2");
                query = "SELECT * FROM `v_repair_last_state` WHERE `idWh`=2 AND `idModel`=?";
                break;
            case "3":
                console.log("case 3");
                query = "SELECT * FROM `v_repair_last_state` WHERE `idWh`=3 AND `idModel`=?";
                break;
            case "4":
                console.log("case 4");
                query = "SELECT * FROM `v_repair_last_state` WHERE `idWh`=4 AND `idModel`=?";
                break;
            case "5":
                console.log("case 5");
                query = "SELECT * FROM `v_repair_last_state` WHERE `idWh`=5 AND `idModel`=?";
                break;
            default:
                console.log("case default");
                query = "SELECT * FROM `v_repair_last_state` WHERE `idModel`=?";
                break;
        }
        try {
            return db.query(query, [idModel]);
        } catch (error) {
            return error;
        }
    }

    static createRepair(deviceRow) {
        try {
            return db.query('INSERT INTO `t_repair` (id, date, idModel, idDevice, problem, notes, idEvent, idWh, idRepairStatus, qtt, idCalcMethod, idUser, unixTime) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', deviceRow);
        } catch (error) {
            return error;
        }
    }

    static checkRepEquipQtt(whOut, idModel) {
        console.log('checkRepEquipQtt_mod whOut, idModel:', whOut, idModel);
        let query = "";
        switch (whOut) {
            case 2:
                query = "SELECT `qtt2` FROM `t_model` WHERE `id`=?";
                break;
            case 3:
                query = "SELECT `qtt3` FROM `t_model` WHERE `id`=?";
                break;
            case 4:
                query = "SELECT `qtt4` FROM `t_model` WHERE `id`=?";
                break;
            case 5:
                query = "SELECT `qtt5` FROM `t_model` WHERE `id`=?";
                break;
        }

        try {
            return db.query(query, [idModel]);
        } catch (error) {
            return error;
        }
    }

    static getRepairStatus() {
        try {
            return db.query('SELECT * FROM `t_repair_status`');
        } catch (error) {
            return error;
        }
    }

    static getCalcMethod() {
        try {
            return db.query('SELECT * FROM `t_calc_method`');
        } catch (error) {
            return error;
        }
    }

    static updateNoCalc(deviceRow) {
        console.log("updateNoCalc:");
        try {
            return db.query('INSERT INTO `t_repair` (id, date, idModel, idDevice, problem, notes, idEvent, idWh, idRepairStatus, qtt, idCalcMethod, idUser, unixTime) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', deviceRow);
        } catch (error) {
            return error;
        }
    }

    static updateBulk(deviceRow) {
        try {
            return db.query('INSERT INTO `t_repair` (id, date, idModel, idDevice, problem, notes, idEvent, idWh, idRepairStatus, qtt, idCalcMethod, idUser, unixTime) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', deviceRow);
        } catch (error) {
            return error;
        }
    }

    static updateSN(deviceRow) {
        try {
            return db.query('INSERT INTO `t_repair` (id, date, idModel, idDevice, problem, notes, idEvent, idWh, idRepairStatus, qtt, idCalcMethod, idUser, unixTime) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', deviceRow);
        } catch (error) {
            return error;
        }
    }
}