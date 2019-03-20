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
    connection.resume();

    connection.query("SELECT * FROM products", function (error, data) {
        if (error) throw error;

        inquire.prompt([
            {
                type: "list",
                name: "choice",
                message: "What would you like to do?",
                choices: [
                    "View Products for Sale",
                    "View Low Inventory",
                    "Add to Inventory",
                    "Add New Product",
                    "Quit"
                ]

            }
        ]).then(function (answer) {
            console.log(answer.choice)
            connection.pause();

            switch (answer.choice) {
                case "View Products for Sale":
                    console.log("Look at this stuff, isn't it neat?");
                    let columns = ["item_id", "product_name", "price", "stock_quantity"];
                    obj.printBreak(columns)
                    obj.printHeaders(columns)
                    obj.printBreak(columns)
                    managerPrompt(obj);
                    break;

                case "View Low Inventory":
                    console.log("Oh we're running out of SPAM");
                    managerPrompt(obj);
                    break;

                case "Add to Inventory":
                    console.log("You need thing-a-ma-bobs?");
                    managerPrompt(obj);
                    break;

                case "Add New Product":
                    console.log("Look at this stuff, isn't it neat?");
                    managerPrompt(obj);
                    break;

                default:
                    console.log("K THX BYE");
                    connection.end();
                    break;
            }
        });
    });

};

main();