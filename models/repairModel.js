const dtb = require('../config/database');
const db = dtb.promise();

module.exports = class Repair {
    constructor(row) {

        this.id = row.idModel;
        this.idDevice = row.idDevice;
        this.idEvent = row.idEvent;
        this.problem = row.problem;
        this.notes = row.notes;

        this.warehouse = {};
        this.warehouse.id = row.idWh;
        this.warehouse.name = row.warehouse;

        this.status = {};
        this.status.id = row.idRepairStatus;
        this.status.name = row.deviceState;  
        
        this.creator = {};
        this.creator.id = row.idCreatedBy;
        this.creator.name = row.creator; 

        this.updatedBy = {};
        this.updatedBy.id = row.idUpdatedBy;
        this.updatedBy.name = row.updatedBy; 

    }

 
    
    static destructObj(obj) {

    }

    static getAll() {
        try {
            return db.query('SELECT * FROM `v_repair`');
        } catch (error) {
            return error;
        }
    }


}