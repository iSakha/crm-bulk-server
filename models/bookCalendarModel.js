const dtb = require('../config/database');
const db = dtb.promise();

module.exports = class BookCalendarEquip {

    constructor(item) {

        this.id = item.idModel;
        this.name = item.name;
        this.manufactor = item.manufactor;
        this.category = {};
        // console.log("row.idModel:",row.idModel);
        this.category.id = item.idModel.slice(0, 7);
        this.quantity = {};
        this.quantity.all = item.all;
        this.quantity.currentWarehouse = item.currentWh;
        this.quantity.otherWarehouse = parseInt(item.all) - parseInt(item.currentWh);
        this.quantity.currentRepair = 42;

    }

    static writeToCalendar(dataArr) {
        console.log('writeToCalendar');
        console.log('dataArr:', dataArr);
        try {
            return db.query('INSERT INTO `t_booking_calendar` (date, idEvent, idModel, qtt, idWh, idUser, phaseTransportTo, phaseInWork, phaseTransportFrom, idEventStatus, unixTime) VALUES ?', [dataArr]);
        } catch (error) {
            return error;
        }
    }

    static getModels() {
        console.log('getModels');
        try {
            return db.query('SELECT * FROM v_inwork_all');
        } catch (error) {
            return error;
        }
    }

    static getModelsByCatWhPeriod(idCat, idWh, start, end) {
        console.log('getModelsByCatWhPeriod_mod');
        let query;

        switch (idWh) {
            case '2':
                console.log('case 2');
                query = 'SELECT * FROM v_inwork_minsk WHERE idModel LIKE ' + "'" + idCat + "%'";
                break;
            case '3':
                console.log('case 3');
                query = 'SELECT * FROM v_inwork_moscow WHERE idModel LIKE ' + "'" + idCat + "%'";
                break;
            case '4':
                console.log('case 4');
                query = 'SELECT * FROM v_inwork_kazan WHERE idModel LIKE ' + "'" + idCat + "%'";
                break;
            case '5':
                console.log('case 5');
                query = 'SELECT * FROM v_inwork_piter WHERE idModel LIKE ' + "'" + idCat + "%'";
                break;
            case 'all':
                console.log('case all');
                query = 'SELECT * FROM v_inwork_all WHERE idModel LIKE ' + "'" + idCat + "%'";
                break;

        }

        try {
            return db.query(query + 'AND `day` >= ? AND `day` <= ?',[start, end]);
        } catch (error) {
            return error;
        }

    }

    static getAllIdModels() {
        try {
            return db.query('SELECT `id` FROM `t_model`' );
        } catch (error) {
            return error;
        }
    }

}