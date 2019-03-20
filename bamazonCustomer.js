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

    // Instantiate a dataTable to pass to the showTablePrompt
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

        // Pause connection until further data fomr the server is required
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

/**
 * Accepts a dataTable object with previously stored SQL results. Use the results
 * to get the user input and purchase items in inventory.
 * @param {dataTable*} obj 
 */
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

            // Get the list of valid IDS to display for purhcase
            let validIDs = obj.data.map(row => row.item_id);

            console.clear();

            if (validIDs.indexOf(Number(response.selectedID)) < 0) { // inputted id does not match the list of valid IDs
                console.log("I'm sorry, that ID doesn't match anything in our records, please try again.");

                // Recursive call to showTablePrompt to loop back to beginning of prompts
                showTablePrompt(obj);
            }

            else { // inputted ID exists in data

                // dataTable object is loaded with SQL data, check that the user input value will not make the inventory negative 
                let newValue = obj.data[Number(response.selectedID) - 1].stock_quantity - Number(response.purchaseAmount);

                if (newValue < 0) { // trying to buy more than is inventory

                    console.log(`Sorry, Bamazon only has ${obj.data[Number(response.selectedID) - 1].stock_quantity} units of ${obj.data[Number(response.selectedID) - 1].product_name}, your request has been cancelled.`);

                    // Recursive call to showTablePrompt to loop back to beginning of prompts
                    showTablePrompt(obj);
                }

                else { // sufficient stock_quantity to purchase

                    let cost = (Number(response.purchaseAmount) * obj.data[Number(response.selectedID) - 1].price).toFixed(2);

                    console.log(`Thank you for your purchase! ${response.purchaseAmount} unit${response.purchaseAmount == 1 ? "" : "s"} of ${obj.data[Number(response.selectedID) - 1].product_name} cost you $${cost}.`)

                    // Update the SQL server with the purchase amount
                    connection.query(`UPDATE products SET stock_quantity = ${newValue}, product_sales = product_sales + ${cost} WHERE item_id=${Number(response.selectedID)}`, function (err) {

                        if (err) {
                            throw err;
                        }
                        // Pause the connection so Node will let the program continue
                        connection.pause();
                        
                        // Recursive call to showTablePrompt to loop back to beginning of prompts
                        showTablePrompt(obj);
                    });
                }
            }
        });
}

// Call the driver function
main();