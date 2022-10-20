const dtb = require('../config/database');
const db = dtb.promise();

module.exports = class DayDetails {

    constructor(item) {
   
        this.type = item.type;
        this.id = item.idEvent;
        switch (item.type) {
            case "moving":
                this.title = "moving";
                break;
            default:
                this.title = item.title;
                break;
        }

        this.warehouse = {};
        this.warehouse.id = item.idWh;
        this.warehouse.name = item.warehouse;

        this.status = {};
        this.status.id = item.idStatus;
        this.status.name = item.status;

        this.manager = {};
        this.manager.id = item.idManager;
        this.manager.name = item.manager;

        this.inWork = item.inWork;

    }



    static getDayDetails(idModel, idWh, date) {
        console.log('getDayDetails: idModel, idWh, date', idModel, idWh, date);
        let query = '';
        switch (idWh) {
            case "all":
                query = 'SELECT * FROM `v_day_details` WHERE `idModel`=? AND `date`=?';
                try {
                    return db.query(query, [idModel, date]);
                } catch (error) {
                    return error;
                }
            default:
                query = 'SELECT * FROM `v_day_details` WHERE `idModel`=? AND `idWh`=? AND `date`=?';
                try {
                    return db.query(query, [idModel, idWh, date]);
                } catch (error) {
                    return error;
                }
        }


    }

}