const dtb = require('../config/database');
const db = dtb.promise();



async function validateUser(usernameEnteredByUser) {
    return db.query('SELECT * FROM `v_users` WHERE login = ?',[usernameEnteredByUser]);
}

async function addToken(idUser,rToken) {
    return db.query('INSERT INTO `t_token` (refreshToken, idUser) VALUES(?,?)',[rToken, idUser]);
}

async function validateRefreshToken(idUser,rToken) {
    return db.query('SELECT * FROM `t_token` WHERE refreshToken=? AND idUser=?',[rToken, idUser]);
}


module.exports = {

    validateUser: validateUser,
    addToken:addToken,
    validateRefreshToken:validateRefreshToken

};