const mysql = require('mysql');
const env = require('./config');

const con = mysql.createConnection({
	host: env.HOST,
	user: env.USER,
	password: env.PASS,
	database: env.DB,
});

con.connect(function(err){
	if(err) throw err;
});

module.exports = con;