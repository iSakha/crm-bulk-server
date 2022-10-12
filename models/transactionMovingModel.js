const db = require('../config/database');

const mysql = require('mysql2');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: "eu-cdbr-west-03.cleardb.net",
    user: "bb962375bd6b35",
    password: "2d88fb96",
    database: "heroku_14052c548fadd47"
});

const createMoving = (movingRow, modelArr) => {
    console.log("createMoving");
    console.log("movingRow:", movingRow);
    console.log("modelArr:", modelArr);

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
                return connection.execute('INSERT INTO `t_movings` (id, idWhOut, idWhIn, dateOut, dateIn, idStatus, notes, idUser, unixTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)', movingRow, err => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            console.log("err:", err);
                            msg = "Inserting movingRow to `t_movings` table failed";
                            resolve([{ status: 400 }, { msg: msg }]);
                            return reject(msg);
                        });
                    }
                    return connection.query('INSERT INTO `t_mov_equipment` (idMoving, idModel, qtt, model_mov_status, unixTime) VALUES ?', [modelArr], err => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                console.log("err:", err);
                                msg = "Inserting modelArr to `t_mov_equipment` table failed";
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

}

const updateMovingRequest = (idMoving, movingRow, modelArr) => {
    console.log("updateMoving transaction");
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
                return connection.execute('UPDATE `t_movings` SET `t_movings`.`is_deleted` = 1 WHERE `t_movings`.`id`=?', [idMoving], err => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            console.log("err:", err);
                            msg = "Mark eventRow as deleted in `t_movings` table failed";
                            resolve([{ status: 400 }, { msg: msg }]);
                            return reject(msg);
                        });
                    }

                    return connection.execute('UPDATE `t_mov_equipment` SET `t_mov_equipment`.`is_deleted` = 1 WHERE `t_mov_equipment`.`idMoving`=?', [idMoving], err => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                console.log("err:", err);
                                msg = "Mark eventRow as deleted in `t_mov_equipment` table failed";
                                resolve([{ status: 400 }, { msg: msg }]);
                                return reject(msg);
                            });
                        };

                        return connection.execute('INSERT INTO `t_movings` (`id`, `idWhOut`, `idWhIn`, `dateOut`, `dateIn`, `idStatus`, `notes`, `idUser`, `unixTime`) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)', movingRow, err => {
                            if (err) {
                                return connection.rollback(() => {
                                    connection.release();
                                    console.log("err:", err);
                                    msg = "Inserting movingRow to `t_movings` table failed";
                                    resolve([{ status: 400 }, { msg: msg }]);
                                    return reject(msg);
                                });
                            }
                            return connection.query('INSERT INTO `t_mov_equipment` (idMoving, idModel, qtt, model_mov_status, unixTime) VALUES ?', [modelArr], err => {
                                if (err) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        console.log("err:", err);
                                        msg = "Inserting modelArr to `t_mov_equipment` table failed";
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
                                    msg = "Success!Updated Moving"
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

const updateMovingShipped = (idMoving, movingRow, modelArr, modelArrCal) => {
    console.log("updateMoving transaction");
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
                return connection.execute('UPDATE `t_movings` SET `t_movings`.`is_deleted` = 1 WHERE `t_movings`.`id`=?', [idMoving], err => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            console.log("err:", err);
                            msg = "Mark eventRow as deleted in `t_movings` table failed";
                            resolve([{ status: 400 }, { msg: msg }]);
                            return reject(msg);
                        });
                    }

                    return connection.execute('UPDATE `t_mov_equipment` SET `t_mov_equipment`.`is_deleted` = 1 WHERE `t_mov_equipment`.`idMoving`=?', [idMoving], err => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                console.log("err:", err);
                                msg = "Mark eventRow as deleted in `t_mov_equipment` table failed";
                                resolve([{ status: 400 }, { msg: msg }]);
                                return reject(msg);
                            });
                        };

                        return connection.execute('UPDATE `t_mov_model_cal_trans` SET `t_mov_model_cal_trans`.`is_deleted` = 1 WHERE `t_mov_model_cal_trans`.`idMoving`=?', [idMoving], err => {
                            if (err) {
                                return connection.rollback(() => {
                                    connection.release();
                                    console.log("err:", err);
                                    msg = "Mark eventRow as deleted in `t_mov_model_cal_trans` table failed";
                                    resolve([{ status: 400 }, { msg: msg }]);
                                    return reject(msg);
                                });
                            };


                            return connection.execute('INSERT INTO `t_movings` (`id`, `idWhOut`, `idWhIn`, `dateOut`, `dateIn`, `idStatus`, `notes`, `idUser`, `unixTime`) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)', movingRow, err => {
                                if (err) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        console.log("err:", err);
                                        msg = "Inserting movingRow to `t_movings` table failed";
                                        resolve([{ status: 400 }, { msg: msg }]);
                                        return reject(msg);
                                    });
                                }

                                return connection.query('INSERT INTO `t_mov_equipment` (idMoving, idModel, qtt, model_mov_status, unixTime) VALUES ?', [modelArr], err => {
                                    if (err) {
                                        return connection.rollback(() => {
                                            connection.release();
                                            console.log("err:", err);
                                            msg = "Inserting modelArr to `t_mov_equipment` table failed";
                                            resolve([{ status: 400 }, { msg: msg }]);
                                            return reject(msg);
                                        });
                                    }

                                    return connection.query('INSERT INTO `t_mov_model_cal_trans` (date, idMoving, idModel, qtt, idWhOut, idWhIn, idUser, unixTime) VALUES ?', [modelArrCal], err => {
                                        if (err) {
                                            return connection.rollback(() => {
                                                connection.release();
                                                console.log("err:", err);
                                                msg = "Inserting modelArr to `t_mov_equipment` table failed";
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
                                            msg = "Success!Updated Moving"
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

const updateMovingReceived = (idMoving, movingRow, modelArr, query) => {
    console.log("updateMoving transaction");
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
                return connection.execute('UPDATE `t_movings` SET `t_movings`.`is_deleted` = 1 WHERE `t_movings`.`id`=?', [idMoving], err => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            console.log("err:", err);
                            msg = "Mark eventRow as deleted in `t_movings` table failed";
                            resolve([{ status: 400 }, { msg: msg }]);
                            return reject(msg);
                        });
                    }

                    return connection.execute('UPDATE `t_mov_equipment` SET `t_mov_equipment`.`is_deleted` = 1 WHERE `t_mov_equipment`.`idMoving`=?', [idMoving], err => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                console.log("err:", err);
                                msg = "Mark eventRow as deleted in `t_mov_equipment` table failed";
                                resolve([{ status: 400 }, { msg: msg }]);
                                return reject(msg);
                            });
                        };

                        return connection.execute('UPDATE `t_mov_model_cal_trans` SET `t_mov_model_cal_trans`.`is_deleted` = 1 WHERE `t_mov_model_cal_trans`.`idMoving`=?', [idMoving], err => {
                            if (err) {
                                return connection.rollback(() => {
                                    connection.release();
                                    console.log("err:", err);
                                    msg = "Mark eventRow as deleted in `t_mov_model_cal_trans` table failed";
                                    resolve([{ status: 400 }, { msg: msg }]);
                                    return reject(msg);
                                });
                            };


                            return connection.execute('INSERT INTO `t_movings` (`id`, `idWhOut`, `idWhIn`, `dateOut`, `dateIn`, `idStatus`, `notes`, `idUser`, `unixTime`) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)', movingRow, err => {
                                if (err) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        console.log("err:", err);
                                        msg = "Inserting movingRow to `t_movings` table failed";
                                        resolve([{ status: 400 }, { msg: msg }]);
                                        return reject(msg);
                                    });
                                }

                                return connection.query('INSERT INTO `t_mov_equipment` (idMoving, idModel, qtt, model_mov_status, unixTime) VALUES ?', [modelArr], err => {
                                    if (err) {
                                        return connection.rollback(() => {
                                            connection.release();
                                            console.log("err:", err);
                                            msg = "Inserting modelArr to `t_mov_equipment` table failed";
                                            resolve([{ status: 400 }, { msg: msg }]);
                                            return reject(msg);
                                        });
                                    }

                                    return connection.query(query, err => {
                                        if (err) {
                                            return connection.rollback(() => {
                                                connection.release();
                                                console.log("err:", err);
                                                msg = "Inserting transferArr to `t_model` table failed";
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
                                            msg = "Success!Updated Moving"
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

const deleteMoving = (idMoving, movingRow) => {
    console.log("deleteЬMoving transaction");
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
                console.log("idMoving:", idMoving);
                return connection.execute('UPDATE `t_movings` SET `is_deleted`=1 WHERE `id`=?', [idMoving], err => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            console.log("err:", err);
                            msg = `Mark is_deleted moving with id = ${idMoving} failed`;
                            resolve([{ status: 400 }, { msg: msg }]);
                            return reject(msg);
                        });
                    };
                    console.log("movingRow:", movingRow);
                    return connection.execute('INSERT INTO `t_movings` (id, idWhOut, idWhIn, dateOut, dateIn, idStatus, notes, idUser, is_deleted, unixTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', movingRow, err => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                console.log("err:", err);
                                msg = "Copy movingRow to `t_movings` table failed";
                                resolve([{ status: 400 }, { msg: msg }]);
                                return reject(msg);
                            });
                        }
                        return connection.execute('UPDATE `t_mov_equipment` SET `t_mov_equipment`.`is_deleted` = 1 WHERE `t_mov_equipment`.`idMoving`=?', [idMoving], err => {
                            if (err) {
                                return connection.rollback(() => {
                                    connection.release();
                                    console.log("err:", err);
                                    msg = `Mark is_deleted t_mov_equipment table with idMoving = ${idMoving} failed`;
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
                                msg = `Moving with id = ${idMoving} deleted!`
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

module.exports = {
    
    createMoving: createMoving,
    updateMovingRequest: updateMovingRequest,
    updateMovingShipped: updateMovingShipped,
    updateMovingReceived:updateMovingReceived,
    deleteMoving: deleteMoving
    
}