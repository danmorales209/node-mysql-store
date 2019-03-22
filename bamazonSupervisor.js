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
/**
 * Accepts a dataTable for storing and formatting SQL data. Uses inquirer.prompt to facilitate user input
 * and response. supervisorPrompt() is called recursivly to loop back to the initial prompts. Required becasue
 * inquire.prompt and mysql methods are asynchronous.
 * @param {dataTable} obj 
 */
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
            console.clear();
            switch (response.choice) {
                case choices[0]:
                    connection.resume();

                    // Columns for printing data
                    let columns = [
                        "department_id",    // 0
                        "department_name",  // 1
                        "overhead_cost",    // 2
                        "product_sales",    // 3
                        "total_profit"      // 4
                    ];

                    // Build out the query to join the products table and departments table
                    // Use left join to display departments even if they do not yet have 
                    // products assiged to a department yet.
                    let query =
                        `SELECT
                            departments.${columns[0]} AS ${columns[0]}, 
                            departments.${columns[1]} AS ${columns[1]},
                            departments.${columns[2]} AS ${columns[2]},
                            SUM(products.${columns[3]}) AS  ${columns[3]},
                            SUM(products.${columns[3]}) - ${columns[2]} AS ${columns[4]}
                        FROM departments
                        LEFT JOIN products
                        ON departments.${columns[1]} = products.${columns[1]}
                        GROUP BY ${columns[1]}
                        ORDER BY ${columns[0]}`;

                    connection.query(query, function (error, data) {
                        if (error) throw error;

                        // Use dataTable object to store and format output of the SQL query
                        obj.printBreak(columns);
                        console.log("Here is an overview of the department sales:")

                        obj.setData(data);
                        obj.initialPrint(columns);

                        // Pause the server connection that until another request is made
                        connection.pause();
                        // recusrive call to supervisorPrompt() to loop back to beginning
                        supervisorPrompt(obj);
                    });

                    break; // End View Product Sales by Department

                case choices[1]:
                    console.log("Let's make a department");

                    inquire
                        .prompt([
                            {
                                name: "department_name",
                                message: "What is the department name?",
                                // ensure the department name will fit in the table format from the passes dataTable object
                                validate: x => x.length <= obj.width.department_name ? true : `Department name cannot exceed ${obj.width.department_name} characters`
                            },
                            {
                                name: "overhead_cost",
                                message: "What is the overhead cost for this department?\n   $",
                                validate: checkForOverhead // Ensure the data matches the SQL data decimal(10,2) for the overhead

                            }
                        ]).then(function (response) {

                            // Resume mySQL server connection once the prompts have been answered
                            connection.resume();

                            // Build the mySQL query
                            let query =
                                `INSERT INTO departments
                                (department_name, overhead_cost)
                                VALUES
                                (? , ?)`;

                            connection.query(query, [response.department_name, response.overhead_cost], function (error) {
                                if (error) throw error;


                                console.log(`${response.department_name} has been successfully added to the database!`);
                                // Pause the conneciton to the mySQL sever until needed
                                connection.pause();

                                // Recursive call to supervisorPrompt to loop back to beginning
                                supervisorPrompt(obj);
                            });
                        });
                    break; // End Add deparment logic

                case choices[2]: // Selected Quit
                    console.log("Have a nice day!");

                    // End the mySQL connection
                    connection.end();
                    break;
            }
        });
};

/**
 * Verifies the input can be parsed to match DECIMAL (10,2) data in SQL
 * @param {String} input 
 */
var checkForOverhead = function (input) {
    let pattern = new RegExp('^[\\d]{1,10}[\\.]{0,1}[\\d]{0,2}$');

    if (pattern.test(input)) {
        return true;
    }
    else {
        return "Please enter a unit price without currency symbols and up to 2 digits after a decimal point";
    }
}

main();