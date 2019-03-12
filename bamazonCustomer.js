console.clear();

require('dotenv').config();
var mysql = require('mysql');
var inquire = require('inquirer');
var server = require('./myConnection');
var productTable = require('./util/printTable');

var connection = mysql.createConnection(server);



var main = function () {
    console.clear();
    var myTable = new productTable();
    showTablePrompt(myTable);




}

var showTablePrompt = function (obj) {

    connection.query("SELECT * FROM products", function (error, data) {
        if (error) {
            return console.error(error);
        }

        obj.setData(data);
        obj.initialPrint()
        connection.pause();

        // getUserInput();

        inquire
            .prompt({
                type: "list",
                name: "selection",
                message: "Welcome to Bamazon! HOw can we help you today?",
                choices: ["Buy an item", "Quit"]
            }).then(function (response) {

                if (response.selection === "Buy an item") {
                    console.log("Ok, lets buys someting");
                    connection.resume();
                    getUserInput(obj);
                }
                else {
                    console.log("Goodbye!");
                    connection.end();
                }
            });
    });
};

var getUserInput = function (obj) {
    inquire
        .prompt([
            {
                name: "selectedID",
                message: "Please select an ID to purchase"
            },
            {
                name: "purchaseAmount",
                message: "How much would you like to purchase?"
            }
        ]).then(function (response) {
            let newValue = obj.data[Number(response.selectedID)-1].stock_quantity - Number(response.purchaseAmount);

            if (newValue < 0) {
                newValue = 0;
            }

            connection.query(`UPDATE products SET stock_quantity = ${newValue} WHERE item_id=${Number(response.selectedID)}`, function (err) {

                if (err) {
                    throw err;
                }
                // connection.pause();

                showTablePrompt(obj);
            });

        });

}

main();