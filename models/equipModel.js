const dtb = require('../config/database');
const db = dtb.promise();

module.exports = class EquipModel {

    constructor(row) {

        this.id = row.id;
        this.name = row.name;
        this.manufactor = {};
        this.manufactor.id = row.idManufactor;
        this.manufactor.name = row.manufactor;
        this.img = row.img;
        this.category = {};
        this.category.idDep = row.idDep;
        this.category.idCat = row.idCat;
        this.deviceData = {};
        this.deviceData.weight = row.weight;
        this.deviceData.power = row.power;
        this.deviceData.transportWeight = row.transportWeight;
        this.deviceData.volume = row.volume;
        this.case = {};
        this.case.inCase = row.inCase;
        this.case.length = row.caseLength;
        this.case.width = row.caseWidth;
        this.case.height = row.caseHeight;
        this.quantity = {};
        this.quantity.all = {};
        this.quantity.all.qtt = row.qtyAll;
        this.quantity.all.qttWork = (parseInt(row.qttMinskWork) + parseInt(row.qttMoscowWork) + parseInt(row.qttKazanWork) + parseInt(row.qttPiterWork));
        this.quantity.all.qtyBroken = (parseInt(row.qttMinskBrokenSN) + parseInt(row.qttMinskBrokenBulk) + parseInt(row.qttMoscowBrokenSN) + parseInt(row.qttMoscowBrokenBulk) + parseInt(row.qttKazanBrokenSN) + parseInt(row.qttKazanBrokenBulk) + parseInt(row.qttPiterBrokenSN) + parseInt(row.qttPiterBrokenBulk));
        this.quantity.onWarehouse = [];
        this.quantity.onWarehouse[0] = {};
        this.quantity.onWarehouse[0].id = 2;
        this.quantity.onWarehouse[0].name = "Минск";
        this.quantity.onWarehouse[0].qtt = row.qtyMinsk;
        this.quantity.onWarehouse[0].qttWork = row.qttMinskWork;
        this.quantity.onWarehouse[0].qtyBroken = parseInt(row.qttMinskBrokenSN) + parseInt(row.qttMinskBrokenBulk);

        this.quantity.onWarehouse[1] = {};
        this.quantity.onWarehouse[1].id = 3;
        this.quantity.onWarehouse[1].name = "Москва";
        this.quantity.onWarehouse[1].qtt = row.qtyMoscow;
        this.quantity.onWarehouse[1].qttWork = row.qttMoscowWork;
        this.quantity.onWarehouse[1].qtyBroken = parseInt(row.qttMoscowBrokenSN) + parseInt(row.qttMoscowBrokenBulk);

        this.quantity.onWarehouse[2] = {};
        this.quantity.onWarehouse[2].id = 4;
        this.quantity.onWarehouse[2].name = "Казань";
        this.quantity.onWarehouse[2].qtt = row.qtyKazan;
        this.quantity.onWarehouse[2].qttWork = row.qttKazanWork;
        this.quantity.onWarehouse[2].qtyBroken = parseInt(row.qttKazanBrokenSN) + parseInt(row.qttKazanBrokenBulk);

        this.quantity.onWarehouse[3] = {};
        this.quantity.onWarehouse[3].id = 5;
        this.quantity.onWarehouse[3].name = "Питер";
        this.quantity.onWarehouse[3].qtt = row.qtyPiter;
        this.quantity.onWarehouse[3].qttWork = row.qttPiterWork;
        this.quantity.onWarehouse[3].qtyBroken = parseInt(row.qttPiterBrokenSN) + parseInt(row.qttPiterBrokenBulk);

    }

    static getDepartments() {
        try {
            return db.query('SELECT * FROM `t_department`');
        } catch (error) {
            return error;
        }
    }

    
    static getCategoriesByDep(idDep) {
        console.log("idDep:", idDep)
        try {
            return db.query('SELECT * FROM `t_category` WHERE idDep=?', [idDep]);
        } catch (error) {
            return error;
        }
    }

    
    static getModelsByCat(idCat) {
        console.log("idCat:", idCat);
        try {
            return db.query('SELECT * FROM `v_model` WHERE idCat=? ORDER BY `id`', [idCat]);
        } catch (error) {
            return error;
        }
    }

    static getCategories() {
        try {
            return db.query('SELECT * FROM `t_category`');
        } catch (error) {
            return error;
        }
    }

    static getModels(q) {
        console.log("getModelById idArr:", q);
        try {
            return db.query(`SELECT * FROM v_model WHERE id IN ${q} ORDER BY id`);
        } catch (error) {
            return error;
        }
    }

    static searchModel(searchString) {
        console.log("searchModel searchString:", searchString);
        try {
            return db.query(`SELECT * FROM v_model WHERE name LIKE '%${searchString}%'`);
        } catch (error) {
            return error;
        }
    }
    
}