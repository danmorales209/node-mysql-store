console.clear();

require('dotenv').config(); 
var mysql = require('mysql');
var inquire = require ('inquirer');
var server = require('./myConnection');
var productTable = require('./util/printTable');

var connection = mysql.createConnection(server);



var main = function() {
    console.clear();
    var myTable = new productTable();
    showTable(myTable, myTable.initialPrint);

}

var showTable = function(obj) {
    connection.query("SELECT * FROM products", function (error, data) {
        if (error) {
            return console.error(error);
        }
        
        obj.setData(data);
        obj.initialPrint()
        
        connection.end();
    });

};

main();