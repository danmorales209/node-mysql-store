console.clear();

require('dotenv').config(); 
var mysql = require('mysql');
var inquire = require ('inquirer');
var server = require('./myConnection');

var connection = mysql.createConnection(server);

connection.query("SELECT * FROM products", function (error, data) {
    if (error) {
        return console.error(error);
    }

    console.table(data);

    connection.end();
});