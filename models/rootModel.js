const dtb = require('../config/database');
const db = dtb.promise();

module.exports = class Root {

    // CLIENTS
    // =====================================================================

    static getClients() {
        try {
            return db.query('SELECT * FROM `t_clients`');
        } catch (error) {
            return error;
        }
    }

    static getOneClient(id) {
        try {
            return db.query('SELECT * FROM `t_clients` WHERE `id`=?', [id]);
        } catch (error) {
            return error;
        }
    }

    static addClient(clientRow) {
        try {
            return db.query('INSERT INTO `t_clients` (client, clientDescription, comments) VALUES(?, ?, ?)', clientRow);
        } catch (error) {
            return error;
        }
    }

    static updateClient(clientRow) {
        try {
            return db.query('UPDATE `t_clients` SET client=?, clientDescription=?, comments=? WHERE id=?', clientRow);
        } catch (error) {
            return error;
        }
    }

    static deleteClient(id) {
        try {
            return db.query('DELETE FROM `t_clients` WHERE `id`=?', [id]);
        } catch (error) {
            return error;
        }
    }




    // LOCATIONS
    // =====================================================================

    static getLocations() {
        try {
            console.log("getLocations:");
            return db.query('SELECT * FROM `v_location`');
            // return db.execute('SELECT * FROM `v_location`');
        } catch (error) {
            return error;
        }
    }

    static getCities() {
        try {
            return db.query('SELECT * FROM `t_event_city`');
        } catch (error) {
            return error;
        }       
    }


    static addCity(city) {
        try {
            return db.query('INSERT INTO `t_event_city` (`city`) VALUES (?)', [city]);
        } catch (error) {
            return error;
        }  
        
    }


    static getStatus() {
        try {
            return db.query('SELECT * FROM `t_status`');
        } catch (error) {
            return error;
        }        
    }

    static addStatus() {
        try {
            return db.query('INSERT INTO `t_status`(status) VALUES("new status")');
        } catch (error) {
            return error;
        }         
    }

    static getPhases() {
        try {
            return db.query('SELECT * FROM `t_phase`');
        } catch (error) {
            return error;
        } 
        
    }

    static getWarehouses() {
        try {
            return db.query('SELECT * FROM `t_warehouses`');
        } catch (error) {
            return error;
        }     
    }



    // CREATE
    // =====================================================================
    static newCity() {
        try {
            return db.query('INSERT * INTO `t_event_city` (city) VALUES(?)', [city]);
        } catch (error) {
            return error;
        } 
        
    }

    // UPDATE
    // =====================================================================

    // DELETE
    // =====================================================================


}