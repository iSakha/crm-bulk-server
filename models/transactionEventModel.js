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

const createEventFull = (eventRow, phaseArr, bookEquipArr, bookCalendarArr) => {
    console.log("createEvent transaction");
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
                return connection.execute('INSERT INTO `t_events` (idEvent, idWarehouse, title, start, end, idManager_1, idLocation, idClient, idCreatedBy, notes, idStatus, idUpdatedBy, unixTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', eventRow, err => {
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

                                    msg = "Success!Created EventFull!"
                                    connection.release();
                                    resolve([{ status: 200 }, { msg: msg }]);

                                })

                            })
                        })

                    })
                })
            })
        })
    })
}

const createEventPhase = (eventRow, phaseArr) => {
    console.log("createEventPhase transaction");
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

                return connection.execute('INSERT INTO `t_events` (idEvent, idWarehouse, title, start, end, idManager_1, idLocation, idClient, idCreatedBy, notes, idStatus, idUpdatedBy, unixTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', eventRow, err => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            console.log("err:", err);
                            msg = "Inserting eventRow to `t_events` table failed";
                            resolve([{ status: 400 }, { msg: msg }]);
                            return reject(msg);
                        });
                    }

                    return connection.query('INSERT INTO `t_event_phases` (idEvent, idPhase, startPhase, endPhase, idUser, unixTime) VALUES ?;', [phaseArr], err => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                console.log("err:", err);
                                msg = "Inserting phaseArr to `t_event_phases` table failed";
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

                            msg = "Success!Created Event with phase only!"
                            connection.release();
                            resolve([{ status: 200 }, { msg: msg }]);
                        })
                    })
                })
            })
        })
    })

}

const createEventEquip = (eventRow, bookEquipArr) => {
    console.log("createEventEquip transaction");
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

                return connection.execute('INSERT INTO `t_events` (idEvent, idWarehouse, title, start, end, idManager_1, idLocation, idClient, idCreatedBy, notes, idStatus, idUpdatedBy, unixTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', eventRow, err => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            console.log("err:", err);
                            msg = "Inserting eventRow to `t_events` table failed";
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

                            msg = "Success!Created Event with Equipment only!"
                            connection.release();
                            resolve([{ status: 200 }, { msg: msg }]);

                        })
                    })
                })

            })
        })
    })
}

const createEventShort = (eventRow) => {
    let msg = "";
    console.log("createEventShort transaction:", eventRow);
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                msg = "Error occurred while getting the connection";
                console.log("err:", err)
                resolve([{ status: 400 }, { msg: msg }]);
                return reject(msg);
            }
            return connection.execute('INSERT INTO `t_events` (idEvent, idWarehouse, title, start, end, idManager_1, idLocation, idClient, idCreatedBy, notes, idStatus, idUpdatedBy, unixTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', eventRow, err => {
                if (err) {
                    return connection.rollback(() => {
                        connection.release();
                        console.log("err:", err);
                        msg = "Inserting eventRow to `t_events` table failed";
                        resolve([{ status: 400 }, { msg: msg }]);
                        return reject(msg);
                    });
                }


                msg = "Success!Created shortEvent!"
                connection.release();
                resolve([{ status: 200 }, { msg: msg }]);
            })
        })
    })

}

const updateEventFull = (idEvent, eventRow, phaseArr, bookEquipArr, bookCalendarArr) => {
    console.log("createEvent transaction");
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

                return connection.execute('UPDATE t_events SET is_deleted=1 WHERE idEvent=?', [idEvent], err => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            console.log("err:", err);
                            msg = "Mark eventRow as deleted in `t_events` table failed";
                            resolve([{ status: 400 }, { msg: msg }]);
                            return reject(msg);
                        });
                    }

                    return connection.execute('UPDATE t_event_phases SET t_event_phases.is_deleted = 1 WHERE t_event_phases.idEvent=?', [idEvent], err => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                console.log("err:", err);
                                msg = "Mark eventRow as deleted in `t_event_phases` table failed";
                                resolve([{ status: 400 }, { msg: msg }]);
                                return reject(msg);
                            });

                        };

                        return connection.execute('UPDATE t_event_equipment SET t_event_equipment.is_deleted = 1 WHERE t_event_equipment.idEvent=?', [idEvent], err => {
                            if (err) {
                                return connection.rollback(() => {
                                    connection.release();
                                    console.log("err:", err);
                                    msg = "Mark eventRow as deleted in `t_event_equipment` table failed";
                                    resolve([{ status: 400 }, { msg: msg }]);
                                    return reject(msg);
                                });

                            };


                            return connection.execute('UPDATE t_booking_calendar SET t_booking_calendar.is_deleted = 1 WHERE t_booking_calendar.idEvent=?', [idEvent], err => {
                                if (err) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        console.log("err:", err);
                                        msg = "Mark eventRow as deleted in `t_booking_calendar` table failed";
                                        resolve([{ status: 400 }, { msg: msg }]);
                                        return reject(msg);
                                    });
                                };


                                return connection.execute('INSERT INTO `t_events` (idEvent, idWarehouse, title, start, end, idManager_1, idLocation, idClient, idCreatedBy, notes, idStatus, idUpdatedBy, unixTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', eventRow, err => {
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

                                                    msg = "Success!Updated EventFull!"
                                                    connection.release();
                                                    resolve([{ status: 200 }, { msg: msg }]);

                                                })

                                            })
                                        })

                                    })
                                })
                            })
                        })

                    })
                })

            })
        })
    })
}

const updateEventPhase = (idEvent, eventRow, phaseArr) => {
    console.log("createEventPhase transaction");
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

                return connection.execute('UPDATE t_events SET is_deleted=1 WHERE idEvent=?', [idEvent], err => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            console.log("err:", err);
                            msg = "Mark eventRow as deleted in `t_events` table failed";
                            resolve([{ status: 400 }, { msg: msg }]);
                            return reject(msg);
                        });
                    }

                    return connection.execute('UPDATE t_event_phases SET t_event_phases.is_deleted = 1 WHERE t_event_phases.idEvent=?', [idEvent], err => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                console.log("err:", err);
                                msg = "Mark eventRow as deleted in `t_event_phases` table failed";
                                resolve([{ status: 400 }, { msg: msg }]);
                                return reject(msg);
                            });

                        };

                        return connection.execute('UPDATE t_event_equipment SET t_event_equipment.is_deleted = 1 WHERE t_event_equipment.idEvent=?', [idEvent], err => {
                            if (err) {
                                return connection.rollback(() => {
                                    connection.release();
                                    console.log("err:", err);
                                    msg = "Mark eventRow as deleted in `t_event_equipment` table failed";
                                    resolve([{ status: 400 }, { msg: msg }]);
                                    return reject(msg);
                                });

                            };

                            return connection.execute('UPDATE t_booking_calendar SET t_booking_calendar.is_deleted = 1 WHERE t_booking_calendar.idEvent=?', [idEvent], err => {
                                if (err) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        console.log("err:", err);
                                        msg = "Mark eventRow as deleted in `t_booking_calendar` table failed";
                                        resolve([{ status: 400 }, { msg: msg }]);
                                        return reject(msg);
                                    });
                                };

                                return connection.execute('INSERT INTO `t_events` (idEvent, idWarehouse, title, start, end, idManager_1, idLocation, idClient, idCreatedBy, notes, idStatus, idUpdatedBy, unixTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', eventRow, err => {
                                    if (err) {
                                        return connection.rollback(() => {
                                            connection.release();
                                            console.log("err:", err);
                                            msg = "Inserting eventRow to `t_events` table failed";
                                            resolve([{ status: 400 }, { msg: msg }]);
                                            return reject(msg);
                                        });
                                    }

                                    return connection.query('INSERT INTO `t_event_phases` (idEvent, idPhase, startPhase, endPhase, idUser, unixTime) VALUES ?;', [phaseArr], err => {
                                        if (err) {
                                            return connection.rollback(() => {
                                                connection.release();
                                                console.log("err:", err);
                                                msg = "Inserting phaseArr to `t_event_phases` table failed";
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

                                            msg = "Success!Created Event with phase only!"
                                            connection.release();
                                            resolve([{ status: 200 }, { msg: msg }]);
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })

}

const updateEventEquip = (idEvent, eventRow, bookEquipArr) => {
    console.log("createEventEquip transaction");
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

                return connection.execute('UPDATE t_events SET is_deleted=1 WHERE idEvent=?', [idEvent], err => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            console.log("err:", err);
                            msg = "Mark eventRow as deleted in `t_events` table failed";
                            resolve([{ status: 400 }, { msg: msg }]);
                            return reject(msg);
                        });
                    }

                    return connection.execute('UPDATE t_event_phases SET t_event_phases.is_deleted = 1 WHERE t_event_phases.idEvent=?', [idEvent], err => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                console.log("err:", err);
                                msg = "Mark eventRow as deleted in `t_event_phases` table failed";
                                resolve([{ status: 400 }, { msg: msg }]);
                                return reject(msg);
                            });

                        };

                        return connection.execute('UPDATE t_event_equipment SET t_event_equipment.is_deleted = 1 WHERE t_event_equipment.idEvent=?', [idEvent], err => {
                            if (err) {
                                return connection.rollback(() => {
                                    connection.release();
                                    console.log("err:", err);
                                    msg = "Mark eventRow as deleted in `t_event_equipment` table failed";
                                    resolve([{ status: 400 }, { msg: msg }]);
                                    return reject(msg);
                                });

                            };

                            return connection.execute('UPDATE t_booking_calendar SET t_booking_calendar.is_deleted = 1 WHERE t_booking_calendar.idEvent=?', [idEvent], err => {
                                if (err) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        console.log("err:", err);
                                        msg = "Mark eventRow as deleted in `t_booking_calendar` table failed";
                                        resolve([{ status: 400 }, { msg: msg }]);
                                        return reject(msg);
                                    });
                                };


                                return connection.execute('INSERT INTO `t_events` (idEvent, idWarehouse, title, start, end, idManager_1, idLocation, idClient, idCreatedBy, notes, idStatus, idUpdatedBy, unixTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', eventRow, err => {
                                    if (err) {
                                        return connection.rollback(() => {
                                            connection.release();
                                            console.log("err:", err);
                                            msg = "Inserting eventRow to `t_events` table failed";
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

                                            msg = "Success!Created Event with Equipment only!"
                                            connection.release();
                                            resolve([{ status: 200 }, { msg: msg }]);

                                        })
                                    })
                                })
                            })
                        })
                    })
                })

            })
        })
    })
}

const updateEventShort = (idEvent, eventRow) => {
    let msg = "";
    console.log("createEventShort transaction:", eventRow);
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                msg = "Error occurred while getting the connection";
                console.log("err:", err)
                resolve([{ status: 400 }, { msg: msg }]);
                return reject(msg);
            }

            return connection.execute('UPDATE t_events SET is_deleted=1 WHERE idEvent=?', [idEvent], err => {
                if (err) {
                    return connection.rollback(() => {
                        connection.release();
                        console.log("err:", err);
                        msg = "Mark eventRow as deleted in `t_events` table failed";
                        resolve([{ status: 400 }, { msg: msg }]);
                        return reject(msg);
                    });
                }

                return connection.execute('UPDATE t_event_phases SET t_event_phases.is_deleted = 1 WHERE t_event_phases.idEvent=?', [idEvent], err => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            console.log("err:", err);
                            msg = "Mark eventRow as deleted in `t_event_phases` table failed";
                            resolve([{ status: 400 }, { msg: msg }]);
                            return reject(msg);
                        });

                    };


                    return connection.execute('UPDATE t_event_equipment SET t_event_equipment.is_deleted = 1 WHERE t_event_equipment.idEvent=?', [idEvent], err => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                console.log("err:", err);
                                msg = "Mark eventRow as deleted in `t_event_equipment` table failed";
                                resolve([{ status: 400 }, { msg: msg }]);
                                return reject(msg);
                            });

                        };


                        return connection.execute('UPDATE t_booking_calendar SET t_booking_calendar.is_deleted = 1 WHERE t_booking_calendar.idEvent=?', [idEvent], err => {
                            if (err) {
                                return connection.rollback(() => {
                                    connection.release();
                                    console.log("err:", err);
                                    msg = "Mark eventRow as deleted in `t_booking_calendar` table failed";
                                    resolve([{ status: 400 }, { msg: msg }]);
                                    return reject(msg);
                                });
                            };

                            return connection.execute('INSERT INTO `t_events` (idEvent, idWarehouse, title, start, end, idManager_1, idLocation, idClient, idCreatedBy, notes, idStatus, idUpdatedBy, unixTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', eventRow, err => {
                                if (err) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        console.log("err:", err);
                                        msg = "Inserting eventRow to `t_events` table failed";
                                        resolve([{ status: 400 }, { msg: msg }]);
                                        return reject(msg);
                                    });
                                }


                                msg = "Success!Created shortEvent!"
                                connection.release();
                                resolve([{ status: 200 }, { msg: msg }]);
                            })
                        })
                    })
                })
            })
        })
    })

}


const deleteEvent = (idEvent, eventRow) => {
    console.log("deleteEvent transaction");
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
                return connection.execute('UPDATE t_events SET is_deleted=1 WHERE idEvent=?', [idEvent], err => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            console.log("err:", err);
                            msg = `Mark is_deleted event with id = ${idEvent} failed`;
                            resolve([{ status: 400 }, { msg: msg }]);
                            return reject(msg);
                        });

                    };

                    return connection.execute('INSERT INTO `t_events`(idEvent, idWarehouse, title, start, end, idManager_1, idLocation, idClient, idCreatedBy, createdAt, notes, idStatus,  idUpdatedBy, updatedAt, filledUp, is_deleted, unixTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', eventRow, err => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                console.log("err:", err);
                                msg = "Copy eventRow to `t_events` table failed";
                                resolve([{ status: 400 }, { msg: msg }]);
                                return reject(msg);
                            });
                        }
                        return connection.execute('UPDATE t_event_phases SET t_event_phases.is_deleted = 1 WHERE t_event_phases.idEvent=?', [idEvent], err => {
                            if (err) {
                                return connection.rollback(() => {
                                    connection.release();
                                    console.log("err:", err);
                                    msg = `Mark is_deleted phase with id = ${idEvent} failed`;
                                    resolve([{ status: 400 }, { msg: msg }]);
                                    return reject(msg);
                                });
                            }
                            return connection.execute('UPDATE t_event_equipment SET t_event_equipment.is_deleted = 1 WHERE t_event_equipment.idEvent=?', [idEvent], err => {
                                if (err) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        console.log("err:", err);
                                        msg = `Mark is_deleted event_equipment with id = ${idEvent} failed`;
                                        resolve([{ status: 400 }, { msg: msg }]);
                                        return reject(msg);
                                    });
                                }
                                return connection.execute('UPDATE t_booking_calendar SET t_booking_calendar.is_deleted = 1 WHERE t_booking_calendar.idEvent=?', [idEvent], err => {
                                    if (err) {
                                        return connection.rollback(() => {
                                            connection.release();
                                            console.log("err:", err);
                                            msg = `Mark is_deleted book calendar with id = ${idEvent} failed`;
                                            resolve([{ status: 400 }, { msg: msg }]);
                                            return reject(msg);
                                        });
                                    }
                                    return connection.commit(err => {
                                        if (err) {
                                            return connection.rollback(() => {
                                                connection.release();
                                                console.log("err:", err);
                                                msg = "Commit when delete event failed";
                                                resolve([{ status: 400 }, { msg: msg }]);
                                                return reject(msg);
                                            });
                                        }
                                        msg = `Event with id = ${idEvent} deleted!`
                                        connection.release();
                                        resolve([{ status: 200 }, { msg: msg }]);
                                    })
                                })
                            })
                        })
                    })
                })



            })
        })
    })
}




module.exports = {
    createEventFull: createEventFull,
    createEventPhase: createEventPhase,
    createEventEquip: createEventEquip,
    createEventShort: createEventShort,
    deleteEvent: deleteEvent,
    updateEventFull: updateEventFull,
    updateEventPhase: updateEventPhase,
    updateEventEquip: updateEventEquip,
    updateEventShort: updateEventShort
}