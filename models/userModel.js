const dtb = require('../config/database');
const db = dtb.promise();

module.exports = class User {

    constructor(row) {

        this.id = row.id;
        this.login = row.login;
        let name = {};
        name.firstName = row.firstName;
        name.lastName = row.lastName;
        name.patronymic = row.patrName;
        name.fullName = row.fullName;
        name.avatar = row.avatar;
        this.name = name;
        let role = {};
        role.id = row.idRole;
        role.name = row.role;
        this.role = role;
        let contacts = {};
        contacts.phone1 = row.phone1;
        contacts.phone2 = row.phone2;
        contacts.email = row.email;
        this.contacts = contacts;
        let warehouse = {};
        warehouse.id = row.idWarehouse;
        warehouse.name = row.warehouse;
        this.warehouse = warehouse;
        let department = {};
        department.id = row.idDepartment;
        department.name = row.department;
        this.department = department;

    }

    static getUsers() {
        try {
            return db.query('SELECT * FROM `v_users`');
        } catch (error) {
            return error;
        }
    }

    static getUser(userID) {

        try {
            return db.query('SELECT * FROM `v_users` WHERE `id`=?', [userID]);
        } catch (error) {
            return error;
        }

    }

}