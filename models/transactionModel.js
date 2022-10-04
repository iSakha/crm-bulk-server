const db = require('../config/database');

const mysql = require('mysql2');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: "eu-cdbr-west-03.cleardb.net",
    user: "bb962375bd6b35",
    password: "2d88fb96",
    database: "heroku_14052c548fadd47"
});

// const pool = mysql.createPool({
//     connectionLimit: 10,
//     host: "us-cdbr-east-06.cleardb.net",
//     user: "b09978c9b32cd7",
//     password: "c83f439e",
//     database: "heroku_2a5cfbff796101a"
// });

// const pool = mysql.createPool({
//     connectionLimit: 10,
//     host: "localhost",
//     user: "dev_user",
//     password: "2836",
//     database: "backup_crm_bulk"
// });

const createNew = (row1, row2) => {
    // console.log("row from controller:",row);

    db.getConnection((err, connection) => {
        if (err) {
            connection.release();
            throw err;
        }

        connection.beginTransaction((err) => {
            if (err) {
                connection.release();
                throw err;
            }

            connection.execute('SET autocommit=0;');

            connection.execute('INSERT INTO `t_locations` (name,city,address) VALUES (?,?,?);',
                row1, (err, result) => {

                    if (err) {

                        return connection.rollback(() => {
                            console.log("err:", err);
                            connection.release();
                            return err;
                        })


                    }

                    console.log("result_mod_1:", result);

                });



            connection.execute('INSERT INTO `t_locations` (name,city,address) VALUES (?,?,?);',
                row2, (err, result) => {

                    if (err) {
                        return connection.rollback(() => {
                            console.log("err:", err);
                            connection.release();
                            return err;
                        })

                    }

                    console.log("result_mod_2:", result);

                });

            connection.commit();

        })




        connection.release();

    })

    // return db_response;
    return { msg: "Success!" };
}


const addLocation = (row1, row2) => {
    let msg = "";
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                return reject("Error occurred while getting the connection");
            }
            return connection.beginTransaction((err) => {
                if (err) {
                    connection.release();
                    return reject("Error occurred while creating the transaction");
                }
                return connection.execute('INSERT INTO `t_locations` (name,city,address) VALUES (?,?,?);', row1, (err) => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            console.log("err:", err);
                            msg = "Inserting row1 to `t_locations` table failed" + "," + err;
                            resolve({ msg: msg });
                            return reject(msg, err);
                        });
                    }
                    return connection.execute('INSERT INTO `t_locations` (name,city,address) VALUES (?,?,?);', row2, (err) => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                console.log("err:", err);
                                msg = "Inserting row2 to `t_locations` table failed" + "," + err;
                                resolve({ msg: msg });
                                return reject(msg, err);
                            });
                        }
                        return connection.commit((err) => {
                            if (err) {
                                return connection.rollback(() => {
                                    connection.release();
                                    return reject("Commit failed");
                                });
                            }
                            msg = "Success!"
                            connection.release();
                            resolve({ msg: msg });
                        })
                    })
                })
            })
        })

    })
}

const createEventFull = (eventRow, phaseArr, bookEquipArr, bookCalendarArr) => {
    console.log("createEvent transaction")
    
    let msg = "";
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                msg = "Error occurred while getting the connection";
                console.log("err:", err)
                resolve([{ status: 400 }, { msg: msg }]);
                return reject(msg);
            }
            return connection.beginTransaction(err => {
                if (err) {
                    msg = "Error occurred while creating the transaction";
                    console.log("err:", err)
                    resolve([{ status: 400 }, { msg: msg }]);
                    return reject(msg);
                }
                return connection.execute('INSERT INTO `t_events` (idEvent, idWarehouse, title, start, end, idManager_1, idEventCity, idEventPlace, idClient, idCreatedBy, notes, idStatus, idUpdatedBy, unixTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', eventRow, err => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            console.log("err:", err);
                            msg = "Inserting eventRow to `t_events` table failed";
                            resolve([{ status: 400 }, { msg: msg }]);
                            return reject(msg);
                        });
                    }

                    console.log("phaseArr:", phaseArr);
                    return connection.query('INSERT INTO `t_event_phases` (idEvent, idPhase, startPhase, endPhase, idUser, unixTime) VALUES ?', [phaseArr], err => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                console.log("err:", err);
                                msg = "Inserting phaseArr to `t_event_phases` table failed";
                                resolve([{ status: 400 }, { msg: msg }]);
                                return reject(msg);
                            });
                        }
                        return connection.query('INSERT INTO `t_event_equipment` (idEvent, idModel, qtt, idWarehouse, idUser, unixTime) VALUES ?', [bookEquipArr], err => {
                            if (err) {
                                return connection.rollback(() => {
                                    connection.release();
                                    console.log("err:", err);
                                    msg = "Inserting bookEquipArr to `t_event_equipment` table failed";
                                    resolve([{ status: 400 }, { msg: msg }]);
                                    return reject(msg);
                                });
                            }
                            console.log("bookCalendarArr trans mod:", bookCalendarArr);
                            return connection.query('INSERT INTO `t_booking_calendar` (date, idEvent, idModel, qtt, idWh, idUser, phaseTransportTo, phaseInWork, phaseTransportFrom, idEventStatus, unixTime) VALUES ?', [bookCalendarArr], err => {
                                if (err) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        console.log("err:", err);
                                        msg = "Inserting bookCalendarArr to `t_booking_calendar` table failed";
                                        resolve([{ status: 400 }, { msg: msg }]);
                                        return reject(msg);
                                    });
                                }
                                return connection.commit(err => {
                                    if (err) {
                                        return connection.rollback(() => {
                                            connection.release();
                                            console.log("err:", err);
                                            msg = "Commit failed";
                                            resolve([{ status: 400 }, { msg: msg }]);
                                            return reject(msg);
                                        });
                                    }

                                    msg = "Success!"
                                    connection.release();
                                    resolve([{ status: 200 },{ msg: msg }]);

                                })

                            })
                        })

                    })
                })
            })
        })
    })
}

const createEventPhase = (ventRow, phaseArr) => {
    
}

const createEventEquip = (eventRow,bookEquipArr) => {

}

const createEventShort = (eventRow) => {
    console.log("createEventShort transaction:", eventRow);
    let msg = "";

    try {
        return db.query('INSERT INTO `t_events` (idEvent, idWarehouse, title, start, end, idManager_1, idEventCity, idEventPlace, idClient, idCreatedBy, notes, idStatus, idUpdatedBy, unixTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', eventRow);
    } catch (error) {
        return error;
    }
}





module.exports = {
    createNew: createNew,
    addLocation: addLocation,
    createEventFull: createEventFull,
    createEventPhase:createEventPhase,
    createEventEquip:createEventEquip,
    createEventShort:createEventShort
}