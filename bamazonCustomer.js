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


// Main starts the program and initializes the productTable object;
var main = function () {
    console.clear();
    var myTable = new dataTable();
    connection.connect(function (err) {
        if (err) throw err;
        showTablePrompt(myTable);
    });
}

/**
 * Takes in a dataTable object, and prints the current state of the table before initiating 
 * inquirer prompt to get user data.
 * @param {dataTable} obj 
 */
var showTablePrompt = function (obj) {
    connection.resume();

    connection.query("SELECT * FROM products", function (error, data) {
        if (error) {
            return console.error(error);
        }

        obj.setData(data);
        obj.initialPrint()
        connection.pause();

        inquire
            .prompt({
                type: "list",
                name: "selection",
                message: "Welcome to Bamazon! How can we help you today?",
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

var checkForInt = function (value) {
    let pattern = new RegExp("^\\d+\\.{0}\\d*$");

    let result = pattern.test(value);

    if (result) {
        return true;
    }
    else {
        return "Please enter a number";
    }

};

var checkBuyAmount = function (amount) {
    let isValidAmount = (checkForInt(amount) === true) && (Number(amount) > 0);

    if (isValidAmount) {
        return true;
    }

    else {
        return "Please enter a non-negtive integer."
    }
};

var getUserInput = function (obj) {
    inquire
        .prompt([
            {
                name: "selectedID",
                message: "Please select an ID to purchase",
                validate: checkForInt
            },
            {
                name: "purchaseAmount",
                message: "How much would you like to purchase?",
                validate: checkBuyAmount
            }
        ]).then(function (response) {

            let validIDs = obj.data.map(row => row.item_id);

            console.clear();

            if (validIDs.indexOf(Number(response.selectedID)) < 0) {
                console.log("I'm sorry, that ID doesn't match anything in our records, please try again.");
                showTablePrompt(obj);
            }
            else {
                let newValue = obj.data[Number(response.selectedID) - 1].stock_quantity - Number(response.purchaseAmount);

                if (newValue < 0) {
                    console.log(`Sorry, Bamazon only has ${obj.data[Number(response.selectedID) - 1].stock_quantity} units of ${obj.data[Number(response.selectedID) - 1].product_name}, your request has been cancelled.`);
                    showTablePrompt(obj);
                }
                else {

                    console.log(`Thank you for your purchase! ${response.purchaseAmount} unit${response.purchaseAmount == 1 ? "" : "s"} of ${obj.data[Number(response.selectedID) - 1].product_name} cost you $${(Number(response.purchaseAmount) * obj.data[Number(response.selectedID) - 1].price).toFixed(2)}.`)

                    connection.query(`UPDATE products SET stock_quantity = ${newValue} WHERE item_id=${Number(response.selectedID)}`, function (err) {

                        if (err) {
                            throw err;
                        }
                        connection.pause();
                        showTablePrompt(obj);
                    });
                }
            }


        });
}

main();