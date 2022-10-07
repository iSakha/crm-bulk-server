const db = require('../config/database');

const mysql = require('mysql2');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: "eu-cdbr-west-03.cleardb.net",
    user: "bb962375bd6b35",
    password: "2d88fb96",
    database: "heroku_14052c548fadd47"
});