const dtb = require('../config/database');
const db = dtb.promise();



function validateUser(usernameEnteredByUser) {
    return db.query('SELECT * FROM `v_users` WHERE login = ?',[usernameEnteredByUser]);
}


module.exports = {

    validateUser: validateUser

};