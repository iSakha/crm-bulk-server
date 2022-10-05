const dtb = require('../config/database');
const db = dtb.promise();

module.exports = class Event {

    constructor(row) {
        this.id = row.idEvent;
        this.warehouse = { id: row.idWarehouse, name: row.warehouse };
        this.time = { start: row.start, end: row.end };
        this.title = row.title;
        this.title = row.title;
        this.creator = { id: row.idCreatedBy, name: row.createdBy };
        this.client = { id: row.idClient, name: row.client };
        this.status = { id: row.idStatus, name: row.status };
        this.location = { id: row.idLocation, city: row.city, name: row.place };
        this.manager = { id: row.idManager_1, name: row.manager_1 };
        this.notes = row.notes;
    }

    static destructObj(obj) {

        // console.log("destructEventObj_mod:", obj);
        let eventRow = [];

        eventRow.push(obj.id);
        eventRow.push(obj.warehouse.id);
        eventRow.push(obj.title);
        eventRow.push(obj.time.start.slice(0, 16));
        eventRow.push(obj.time.end.slice(0, 16));

        if (obj.hasOwnProperty('manager')) {
            if (obj.manager !== null) {
                eventRow.push(obj.manager.id);
            } else eventRow.push(1);
        } else eventRow.push(1);

        if (obj.hasOwnProperty('location')) {
            if (obj.location !== null) {
                eventRow.push(obj.location.id);;
            } else eventRow.push(1);
        } else {
            eventRow.push(1);
        }

        if (obj.hasOwnProperty('client')) {
            if (obj.client !== null) {
                eventRow.push(obj.client.id);
            } else eventRow.push(1);
        } else eventRow.push(1);


        if (obj.hasOwnProperty('creator')) {
            if (obj.creator !== null) {
                eventRow.push(obj.creator.id);
            } else eventRow.push(1);
        } else eventRow.push(1);


        if (obj.hasOwnProperty('notes')) {
            if (obj.notes !== null) {
                eventRow.push(obj.notes);
            } else eventRow.push("");
        } else eventRow.push("");



        if (obj.hasOwnProperty('status')) {
            if (obj.status !== null) {
                eventRow.push(obj.status.id);
            } else eventRow.push(1);
        } else eventRow.push(1);


        eventRow.push(obj.creator.id);
        eventRow.push(obj.unixTime);

        return eventRow;
    }

    static getAll() {
        try {
            return db.query('SELECT * FROM `v_events`');
        } catch (error) {
            return error;
        }
    }

    static getOne(idEvent) {
        try {
            return db.query('SELECT * FROM `v_events` WHERE `idEvent`=?', [idEvent]);
        } catch (error) {
            return error;
        }
    }

    // static create(eventRow) {
    //     console.log("createEvent_mod eventRow:", eventRow);
    //     try {
    //         return db.query('INSERT INTO `t_events` (idEvent, idWarehouse, title, start, end, idManager_1, idEventCity, idEventPlace, idClient, idCreatedBy, notes, idStatus, idUpdatedBy, unixTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', eventRow);
    //     } catch (error) {
    //         return error;
    //     }
    // }

    // static copyRow(idEvent) {
    //     try {
    //         return db.query('SELECT * FROM t_events WHERE idEvent=? AND is_deleted=0', [idEvent]);
    //     } catch (error) {
    //         return error;
    //     }
    // }

}

