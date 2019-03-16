console.clear();
// Define project dependencies

// Use dotenv to store database logins securely
require('dotenv').config();
var mysql = require('mysql');
var inquire = require('inquirer');
var server = require('./myConnection');
var dataTable = require('./util/printTable');

// create the SQL connection as a global variable
var connection = mysql.createConnection(server);

var main = function () {
    let myTable = new dataTable();

    connection.connect(function (err) {
        if (err) throw err;

        managerPrompt(myTable);
    });
};

var managerPrompt = function (obj) {

    connection.query("SELECT * FROM products", function (error, data) {
        if (error) throw error;

        inquire.prompt([
            {
                type: "rawlist",
                name: "choice",
                message: "What would you like to do?",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory","Add New Product"]

            }
        ]).then(function(answer){
            console.log(answer.choice)
            connection.end();
        });
    });

};

main();