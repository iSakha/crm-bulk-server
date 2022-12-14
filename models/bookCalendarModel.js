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
        this.quantity.all = item.qtyAll;
        this.quantity.currentWarehouse = item.currentWh;
        this.quantity.otherWarehouse = parseInt(item.qtyAll) - parseInt(item.currentWh);
        this.quantity.currentRepair = item.currentRepair;

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
            return db.query(query + 'AND `day` >= ? AND `day` <= ?', [start, end]);
        } catch (error) {
            return error;
        }

    }

    static getAllModelsByCat(idCat, idWh) {
        // console.log('getAllModelsByCat_mod');
        let query = "";
        switch (idWh) {
            case '2':
                console.log('case 2');
                query = "SELECT `id` as idModel, `name`, `manufactor`, `qtyAll`, `qtyMinsk` as currentWh, `qttMinskBrokenSN` + `qttMinskBrokenBulk` as currentRepair FROM `v_model` WHERE `idCat`=?"
                break;
            case '3':
                console.log('case 3');
                query = "SELECT `id` as idModel, `name`, `manufactor`, `qtyAll`, `qtyMoscow` as currentWh, `qttMoscowBrokenSN` + `qttMoscowBrokenBulk` as currentRepair FROM `v_model` WHERE `idCat`=?"
                break;
            case '4':
                console.log('case 4');
                query = "SELECT `id` as idModel, `name`, `manufactor`, `qtyAll`, `qtyKazan` as currentWh, `qttKazanBrokenSN` + `qttKazanBrokenBulk` as currentRepair FROM `v_model` WHERE `idCat`=?"
                break;
            case '5':
                console.log('case 5');
                query = "SELECT `id` as idModel, `name`, `manufactor`, `qtyAll`, `qtyPiter` as currentWh, `qttPiterBrokenSN` + `qttPiterBrokenBulk` as currentRepair FROM `v_model` WHERE `idCat`=?"
                break;
            default:
                console.log('default');
                query = "SELECT `id` as idModel, `name`, `manufactor`, `qtyAll`, `qtyAll` as currentWh, `qttMinskBrokenSN` + `qttMinskBrokenBulk` + `qttMoscowBrokenSN` + `qttMoscowBrokenBulk` + `qttKazanBrokenSN` + `qttKazanBrokenBulk` + `qttPiterBrokenSN` + `qttPiterBrokenBulk` as currentRepair FROM `v_model` WHERE `idCat`=?"
                break;
        }

        try {
            console.log("query:",query);
            return db.query(query, [idCat]);
        } catch (error) {
            return error;
        }
    }

    static searchModelByWhPeriod(searchStr,idWh, start, end) {
        console.log('searchModelByWhPeriod: searchStr, idWh, start, end"');
        console.log(searchStr, idWh, start, end);

        let query;

        switch (idWh) {
            case '2':
                console.log('case 2');
                query = 'SELECT * FROM v_inwork_minsk WHERE name LIKE ' + "'%" + searchStr + "%'";
                break;
            case '3':
                console.log('case 3');
                query = 'SELECT * FROM v_inwork_moscow WHERE name LIKE ' + "'%" + searchStr + "%'";
                break;
            case '4':
                console.log('case 4');
                query = 'SELECT * FROM v_inwork_kazan WHERE name LIKE ' + "'%" + searchStr + "%'";
                break;
            case '5':
                console.log('case 5');
                query = 'SELECT * FROM v_inwork_piter WHERE name LIKE ' + "'%" + searchStr + "%'";
                break;
            case 'all':
                console.log('case all');
                query = 'SELECT * FROM v_inwork_all WHERE name LIKE ' + "'%" + searchStr + "%'";
                break;

        }

        try {
            return db.query(query + 'AND `day` >= ? AND `day` <= ?', [start, end]);
        } catch (error) {
            return error;
        }
    }

}