const dtb = require('../config/database');
const db = dtb.promise();

module.exports = class Phase {
    constructor(row) {
        this.id = row.id;
        this.phase = row.phase;
        this.start = row.start;
        this.end = row.end;
    }

    static destructObj(obj, eventId, userId, unixTime) {

        // console.log("destructPhaseObj_mod:", obj);
        let phaseArr = [];

        obj.map(item => {
            let phaseRow = [];
            let { id, start, end } = item;

            // console.log("obj.phase:", obj.phase);

            phaseRow.push(eventId);     // eventId
            phaseRow.push(id);
            phaseRow.push(start.slice(0, -1));
            phaseRow.push(end.slice(0, -1));
            phaseRow.push(userId);
            phaseRow.push(unixTime);

            phaseArr.push(phaseRow);
        })

        // console.log("phaseArr:", phaseArr);

        return phaseArr;
    }

    static writeEventPhase(eventPhase) {
        console.log("writeEventPhase:", eventPhase);
        try {
            return db.query('INSERT INTO `t_event_phases` (idEvent, idPhase, startPhase, endPhase, idUser, unixTime) VALUES ?', [eventPhase]);
        } catch (error) {
            return error;
        }
    }

    // static updateEventPhase(eventPhase) {
    //     console.log("updateEventPhase:", eventPhase);
    //     try {
    //         return db.query('INSERT INTO `t_event_phases` (idPhase, startPhase, endPhase, unixTime, idEvent) VALUES ?', [eventPhase]);

    //     } catch (error) {
    //         return error;
    //     }
    // }

    static getAllPhase() {
        try {
            return db.query('SELECT * FROM `v_event_phases`');
        } catch (error) {
            return error;
        }
    }

    static getOne(idEvent) {
        try {
            return db.query('SELECT id, phase, start, end FROM `v_event_phases` WHERE `idEvent`=?', [idEvent]);
        } catch (error) {
            return error;
        }
    }

    // static createPhase(oPhase) {
    //     console.log("eventObj:", oPhase);
    //     try {
    //         return db.query('INSERT INTO `t_event_phases`(idEvent, idPhase, startPhase, endPhase) VALUES(?, ?, ?, ?)', [oPhase.idEvent, oPhase.idPhase, oPhase.startPhase, oPhase.endPhase]);
    //     } catch (error) {
    //         return error;
    //     }
    // }

}