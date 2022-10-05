const dtb = require('../config/database');
const db = dtb.promise();

module.exports = class User {

    constructor(row) {

        this.id = row.id;
        if (row.login === '') {
            this.login = null;
        } else this.login = row.login;

        let name = {};

        if (row.firstName === '') {
            name.firstName = null;
        } else name.firstName = row.firstName;

        if (row.lastName === '') {
            name.lastName = null;
        } else name.lastName = row.lastName;

        if (row.patrName === '') {
            name.patronymic = null;
        } else name.patronymic = row.patrName;

        if (row.fullName === '') {
            name.fullName = null;
        } else name.fullName = row.fullName;

        if (row.fullName === '') {
            name.avatar = null;
        } else name.avatar = row.avatar;

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