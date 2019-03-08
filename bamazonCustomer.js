console.clear();

require('dotenv').config(); 
var mysql = require('mysql');
var inquire = require ('inquirer');
var server = require('./myConnection');
var productTable = require('./util/printTable');

var connection = mysql.createConnection(server);
var myTable = new productTable();


var main = function() {
    console.clear();

    showTable(myTable.initialPrint());
}

var showTable = function(callback) {
    connection.query("SELECT * FROM products", function (error, data) {
        if (error) {
            return console.error(error);
        }
        myTable.setData(data);
        connection.end();
        return function() {
            callback;

        }
        
        
        /* data.forEach( function (line) {
            console.log(`ID: ${line.item_id} | ${line.product_name} | ${line.price}`);
        }); */

        //connection.end();
        
    })
};

main();