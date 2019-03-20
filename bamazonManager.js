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

/**
 * Driver function. Instantiates myTable as a dataTable to handle presenting data
 */
var main = function () {
    let myTable = new dataTable();

    // use mysql.connect to connect to server prior to engaging in the rest of
    // program logic
    connection.connect(function (err) {
        if (err) throw err;

        // Function to display prompts and handle responses
        managerPrompt(myTable);
    });
};

/**
 * Takes in dataTable object to store SQL data and facilitate printing results to console.
 * @param {myTable} obj 
 */
var managerPrompt = function (obj) {

    // Main selections for bamazonManager
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

        // Function gets called recusrively, so this ensures the SQL server connection is resumed before making queries
        connection.resume();

        // Use columns for printing data later, reserve some space now
        let columns = [];

        switch (answer.choice) {

            case "View Products for Sale":

                columns = ["item_id", "product_name", "price", "stock_quantity"];

                connection.query("SELECT ??, ??, ??, ?? FROM products", columns, function (error, data) {
                    if (error) throw error;

                    // store the SQL data
                    obj.setData(data);

                    obj.printBreak(columns);

                    console.log("Here are the current items for sale:");
                    obj.initialPrint(columns);

                    // Pause the connection so Node will let the program continue
                    connection.pause();

                    // Recursive call to managerPrompt to loop back to beginning prompt
                    managerPrompt(obj);
                });

                break; // End of View Products for sale logic

            case "View Low Inventory":

                columns = ["item_id", "product_name", "stock_quantity"];
                
                // use '??' to select colum names
                connection.query("SELECT ??, ??, ?? FROM products WHERE stock_quantity < 5", columns, function (error, data) {
                    if (error) throw error;

                    if (!data) {
                        console.log("No products currently have low inventory.\n");
                    }
                    else {

                        obj.printBreak(columns);
                        console.log("These items have low inventory:");
                        obj.setData(data);
                        obj.initialPrint(columns)
                    }

                    // Pause the connection so Node will let the program continue
                    connection.pause();

                    // Recursive call to managerPrompt to loop back to beginning prompt
                    managerPrompt(obj);
                })

                break; // End view low inventory logic

            case "Add to Inventory":

                connection.query("SELECT item_id, product_name FROM products", function (error, data) {
                    if (error) throw error;

                    // instantiate the ids array here
                    let ids = [];

                    // Push formatted item_id and product name to ids array to print for inquirer query
                    data.forEach(function (element) {
                        ids.push(`${element.item_id}: ${element.product_name}`);
                    });

                    // Pause server connection to get more information from user
                    connection.pause();

                    inquire
                        .prompt([
                            {
                                type: "list",
                                name: "inID",
                                message: "Select the product you wish to replenish",
                                choices: ids
                            },
                            {
                                type: "input",
                                name: "quantity",
                                message: "How much would you like to purchase?",
                                validate: checkBuyAmount // Ensure non-negative and integer
                            }

                        ]).then(function (answers) {

                            // Extract id as number from the first SQL query
                            let updateID = Number(answers.inID.split(":")[0]);

                            connection.resume();

                            // Update the server information
                            connection.query(
                                `UPDATE products
                                SET stock_quantity = stock_quantity + ${Number(answers.quantity)}
                                WHERE item_id = ${updateID}`,
                                function (error, data) {
                                    if (error) throw error;

                                    // use ids[updateID - 1] since the item_ids start @ 1
                                    console.log(`${answers.quantity} units of ${ids[updateID - 1].split(": ")[1]} were successfully added to inventory!\n`);

                                    // Pause the connection so Node will let the program continue
                                    connection.pause();

                                    // Recursive call to managerPrompt to loop back to beginning prompt
                                    managerPrompt(obj);
                                });

                        });

                });

                break; // End Add to Inventory logic

            case "Add New Product":

                connection.query("SELECT DISTINCT department_name FROM products ORDER BY department_name", function (error, data) {
                    if (error) throw error;

                    // Get an array of the distinct department names
                    let departments = data.map(element => element.department_name);

                    connection.pause();

                    inquire
                        .prompt([
                            {
                                type: "list",
                                name: "department_name",
                                message: "Please select a department",
                                choices: departments
                            },
                            {
                                name: "product_name",
                                message: "Please enter the product name:",
                                // Ensure the character length will not break the printing methods for dataTable
                                validate: (x => x.length <= obj.width.product_name ? true : `Product name cannot exceed ${obj.width.product_name} characters`)
                            },
                            {
                                name: "price",
                                message: "Please enter the price per unit:\n(Omit currency symbols. Enter up to two digits after the decimal point)\n  $",
                                validate: checkForCurrency // ensures the format matches the expected value of the SQL server 
                            },
                            {
                                name: "stock_quantity",
                                message: "Please enter the inital amount to purchase",
                                validate: checkBuyAmount // check for non-negative integers
                            }
                        ]).then(function (response) {

                            let newProduct = [
                                response.product_name,
                                response.department_name,
                                response.price,
                                response.stock_quantity
                            ];

                            connection.resume()

                            connection.query(
                                `INSERT INTO products
                                (product_name, department_name, price, stock_quantity)
                                VALUES
                                (?, ?, ?, ?)`, // use '?' as placeholder, data will be entered from next argument
                                newProduct, function (error, data) {
                                    if (error) throw error;
                                    console.log("Great success!");

                                    // Pause the connection so Node will let the program continue
                                    connection.pause();

                                    // Recursive call to managerPrompt to loop back to beginning prompt
                                    managerPrompt(obj);
                                });
                        });
                });

                break;

            default:
                console.log("K THX BYE");
                connection.end();
                break;
        }
    });

};

/**
 * Verifies the intput can be parsed as an integer
 * @param {String} value 
 */
var checkForInt = function (value) {
    let pattern = new RegExp("^\\d+\\.{0}\\d*$");

    return pattern.test(value);

};

/**
 * Verifies the inputs can be parsed as a non-negative integer
 * @param {String*} amount 
 */
var checkBuyAmount = function (amount) {
    let isValidAmount = checkForInt(amount) && Number(amount) > 0;

    if (isValidAmount) {
        return true;
    }

    else {
        return "Please enter a non-negtive integer."
    }
};

/**
 * Verifies the input can be parsed to match DECIMAL (10,2) data in SQL
 * @param {String} input 
 */
var checkForCurrency = function (input) {
    let pattern = new RegExp('^[\\d]{1,10}[\\.]{0,1}[\\d]{0,2}$');

    if (pattern.test(input)) {
        return true;
    }
    else {
        return "Please enter a unit price without currency symbols and up to 2 digits after a decimal point";
    }
}

// Driver function call
main();