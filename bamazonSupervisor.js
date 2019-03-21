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
    var myTable = new dataTable;

    connection.connect(function (error) {
        if (error) throw error;

        supervisorPrompt(myTable);
    })
}

var supervisorPrompt = function (obj) {
    let choices = ["View Product Sales by Department", "Create New Department", "Quit"];
    inquire
        .prompt(
            {
                type: "rawlist",
                name: "choice",
                message: "What would you like to do?",
                choices: choices,
            }
        ).then(function (response) {
            switch (response.choice) {

                case choices[0]:
                    connection.resume()

                    let columns = [
                        "department_id",
                        "department_name",
                        "overhead_cost",
                        "product_sales",
                        "total_profit"
                    ];

                    let query =
                        `SELECT
                            departments.${columns[0]} AS ${columns[0]},
                            departments.${columns[1]} AS ${columns[1]},
                            departments.${columns[2]} AS ${columns[2]},
                            SUM(products.${columns[3]}) AS  ${columns[3]},
                            SUM(products.${columns[3]}) - ${columns[2]} AS ${columns[4]}
                        FROM departments
                        JOIN products
                        WHERE departments.${columns[1]} = products.${columns[1]}
                        GROUP BY ${columns[1]}
                        ORDER BY ${columns[0]}`;

                    connection.query(query, function (error, data) {
                        if (error) throw error;
                        
                        obj.printBreak(columns);
                        console.log("Here is an overview of the department sales:")

                        obj.setData(data);
                        obj.initialPrint(columns);

                        connection.pause();

                        supervisorPrompt(obj);
                    });

                    break;

                case choices[1]:
                    console.log("Let's make a department");
                    break;

                case choices[2]:
                    console.log("Leave then why don't you");
                    break;
            }
        });
};

main();