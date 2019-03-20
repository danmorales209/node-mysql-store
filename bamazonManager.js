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

                columns = ["item_id", "product_name", "price", "stock_quantity"];

                connection.query("SELECT ??, ??, ??, ?? FROM products", columns, function (error, data) {
                    if (error) throw error;

                    obj.setData(data);

                    obj.printBreak(columns);
                    console.log("Here are the current items for sale:");
                    obj.initialPrint(columns);

                    connection.pause();
                    managerPrompt(obj);
                });

                break;

            case "View Low Inventory":

                columns = ["item_id", "product_name", "stock_quantity"];

                connection.query("SELECT ??, ??, ?? FROM products WHERE stock_quantity < 5", columns, function (error, data) {
                    if (!data) {
                        console.log("No products currently have low inventory.\n");
                    }
                    else {

                        obj.printBreak(columns);
                        console.log("These items have low inventory:");
                        obj.setData(data);
                        obj.initialPrint(columns)
                    }
                    connection.pause();
                    managerPrompt(obj);
                })

                break;

            case "Add to Inventory":

                connection.query("SELECT item_id, product_name FROM products", function (error, data) {
                    if (error) throw error;
                    let ids = [];
                    data.forEach(function (element) {
                        ids.push(`${element.item_id}: ${element.product_name}`);
                    });

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
                                validate: checkBuyAmount
                            }
                        ]).then(function (answers) {
                            let updateID = Number(answers.inID.split(":")[0]);

                            connection.resume();

                            connection.query(
                                `UPDATE products
                                SET stock_quantity = stock_quantity + ${Number(answers.quantity)}
                                WHERE item_id = ${updateID}`,
                                function (error, data) {
                                    if (error) throw error;

                                    console.log(`${answers.quantity} units of ${ids[updateID - 1].split(": ")[1]} were successfully added to inventory!\n`);

                                    connection.pause();

                                    managerPrompt(obj);
                                });

                        });

                });

                break;

            case "Add New Product":

                connection.query("SELECT DISTINCT department_name FROM products ORDER BY department_name", function (error, data) {
                    if (error) throw error;

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
                                validate: (x => x.length <= obj.width.product_name ? true : `Product name cannot exceed ${obj.width.product_name} characters`)
                            },
                            {
                                name: "price",
                                message: "Please enter the price per unit:\n(Omit currency symbols. Enter up to two digits after the decimal point)\n  $",
                                validate: checkForCurrency
                            },
                            {
                                name: "stock_quantity",
                                message: "Please enter the inital amount to purchase",
                                validate: checkBuyAmount
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
                                (?, ?, ?, ?)`, newProduct, function (error, data) {
                                    if (error) throw error;
                                    console.log("Great success!");

                                    connection.pause();

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

var checkForInt = function (value) {
    let pattern = new RegExp("^\\d+\\.{0}\\d*$");

    return pattern.test(value);

};

var checkBuyAmount = function (amount) {
    let isValidAmount = checkForInt(amount) && Number(amount) > 0;

    if (isValidAmount) {
        return true;
    }

    else {
        return "Please enter a non-negtive integer."
    }
};

var checkForCurrency = function (input) {
    let pattern = new RegExp('^[\\d]+[\\.]{0,1}[\\d]{0,2}$');

    if (pattern.test(input)) {
        return true;
    }
    else {
        return "Please enter a unit price without currency symbols and up to 2 digits after a decimal point";
    }
}

main();