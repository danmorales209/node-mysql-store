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

        let columns = [];

        switch (answer.choice) {
            case "View Products for Sale":
                console.log("Here are the current items for sale:\n");

                columns = ["item_id", "product_name", "price", "stock_quantity"];

                connection.query("SELECT ??, ??, ??, ?? FROM products", columns, function (error, data) {
                    if (error) throw error;

                    obj.setData(data);

                    obj.initialPrint(columns);

                    connection.pause();
                    managerPrompt(obj);
                });
                
                break;

            case "View Low Inventory":
                console.log("These items have low inventory:\n");
                
                columns = ["item_id", "product_name", "stock_quantity"];

                connection.query("SELECT ??, ??, ?? FROM products WHERE stock_quantity < 5", columns, function (error, data) {
                    if (!data) {
                        console.log("No products currently have low inventory.\n");
                    }
                    else {
                        obj.setData(data);
                        obj.initialPrint(columns)
                    }
                    connection.pause();
                    managerPrompt(obj);
                })

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

};

main();