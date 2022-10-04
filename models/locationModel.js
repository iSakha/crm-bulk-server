const dtb = require('../config/database');
const db = dtb.promise();

module.exports = class Location {

    constructor(row) {
        this.id = row.id;
        this.name = row.name;
        this.city = row.city;
        this.address = row.address;
    }

    static destructObj(obj) {

        let locationRow = [];

        locationRow.push(obj.name);
        locationRow.push(obj.city);
        locationRow.push(obj.address);

        return locationRow;

    }

    static getAll() {
        try {
            return db.query('SELECT * FROM `t_locations`');
        } catch (error) {
            return error;
        }   
    }

    static createNew(row) {
        try {
            console.log("createNew row:",row);
            return db.query("INSERT INTO `t_locations` (name,city,address) VALUES (?,?,?)", row);
        } catch (error) {
            return error;
        }   
    }

    static update(row) {
        try {
            return db.query('UPDATE `t_locations` SET (name=?,city=?,address=?) WHERE id=?', row);
        } catch (error) {
            return error;
        }   
    }

    static updateRow(row) {
        try {
            return db.query('UPDATE `t_locations` SET name=?,city=?,address=? WHERE id=?', row);
        } catch (error) {
            return error;
        }   
    }

}