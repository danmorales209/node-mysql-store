/**
 * Constructor for dataTable Class
 */
var dataTable = function () {
    this.data = [];

    // Use .width for printing data
    this.width = {
        item_id: 5,
        product_name: 50,
        department_name: 50,
        price: 15,
        stock_quantity: 10,
        product_sales: 15
    };


    /**
     * Setter for .data
     */
    this.setData = function (sqlData) {
        this.data = sqlData;
    };
     /**
      * Getter for .data
      */
    this.getData = function () {
        return this.data;
    };

    /**
     * Reset the .data
     */
    this.reset = function () {
        this.data = [];
    };

    /**
     * Accepts an array of strings of column headers.
     * Uses the .width values to build a string of '-' chartacters to print nice breaks
     */

    this.printBreak = function (columnsArray) {

        let breakString = "-";

        columnsArray.forEach((col) => {
            breakString += "-";

            switch (col) {

                case "item_id":
                    for (i = 0; i < this.width.item_id + 2; i++) {
                        breakString += "-";
                    }
                    break;

                case "product_name":
                    for (i = 0; i < this.width.product_name + 2; i++) {
                        breakString += "-";
                    }
                    break;

                case "department_name":
                    for (i = 0; i < this.width.department_name + 2; i++) {
                        breakString += "-";
                    }
                    break;

                case "price":
                    for (i = 0; i < this.width.price + 2; i++) {
                        breakString += "-";
                    }
                    break;

                case "stock_quantity":
                    for (i = 0; i < this.width.stock_quantity + 2; i++) {
                        breakString += "-";
                    }
                    break;

                case "product_sales":
                    for (i = 0; i < this.width.product_sales + 2; i++) {
                        breakString += "-";
                    }
                    break;
            }
        }, this);

        console.log(breakString);
    }

    /**
     * Method formats data for a cell based upon the maxmium width passed into the method
     * Pads the data with a leading space and sufficient spaces after up to the maxWidth paramater
     * 
     * Returns a string
     * @param {String} data
     * @param {int} maxWidth
     */
    this.printEntry = function (data, maxWidth) {
        
        let cellString = "";
        
        for (let i = 0; i < maxWidth; i++) {
            if (i !== 1) {
                cellString += " ";
            }
            else {
                cellString += data;
                // Advance the counter. Use -1 as the for loop with automatically advance i
                i += data.length - 1;
            }
        }
        return cellString;
    };

    /**
     * Accepts an array of strings of the SQL data labels to print from .data
     * 
     * 
     * @param {Array} columns
     */

    this.printRows = function (columns) {
        
        let keys = [];
        let outString = "";

        this.data.forEach(row => {
            
            outString = "| ";
            // get an array of keys from each row object
            keys = Object.keys(row);

            for (i in keys) {


                // keys[i] gets the data in the row, and width [ keys [i] ] gets the max width from the object
                outString += this.printEntry( (row[ keys[i] ]).toString() , this.width[ keys [i] ] );

                // i is stored as a string for some reason
                if (keys[Number(i) + 1]) {
                    outString += " | ";
                }
                else {
                    outString += " |";
                }

            }

            console.log(outString);

            // Prints "-" character break of same width as data
            this.printBreak(columns);

        }, this);
    }

    /**
     * Accepts a string array of SQL data types to prints headers for the table
     * @param {Array} strArray
     */
    this.printHeaders = function (strArray) {
        let padding = 0;
        let outString = "| ";
        let tempString = "";

        for (let i = 0; i < strArray.length; i++) {
            if (strArray[i] === "item_id") {
                tempString = "ID";
                padding = this.width[strArray[i]];

                for (let j = 0; j < padding; j++) {
                    if (j !== 1) {
                        outString += " ";
                    }
                    else {
                        outString += tempString;
                        j += tempString.length - 1;
                    }

                }
            }
            else if (strArray[i] === "product_name") {
                tempString = "Product Name";
                padding = this.width[strArray[i]];

                for (let j = 0; j < padding; j++) {
                    if (j !== 1) {
                        outString += " ";
                    }
                    else {
                        outString += tempString;
                        j += tempString.length - 1;
                    }

                }
            }
            else if (strArray[i] === "department_name") {
                tempString = "Department";
                padding = this.width[strArray[i]];

                for (let j = 0; j < padding; j++) {
                    if (j !== 1) {
                        outString += " ";
                    }
                    else {
                        outString += tempString;
                        j += tempString.length - 1;
                    }

                }
            }
            else if (strArray[i] === "price") {
                tempString = "Price";
                padding = this.width[strArray[i]];

                for (let j = 0; j < padding; j++) {
                    if (j !== 1) {
                        outString += " ";
                    }
                    else {
                        outString += tempString;
                        j += tempString.length - 1;
                    }

                }
            }
            else if (strArray[i] === "stock_quantity") {
                tempString = "In Stock";
                padding = this.width[strArray[i]];

                for (let j = 0; j < padding; j++) {
                    if (j !== 1) {
                        outString += " ";
                    }
                    else {
                        outString += tempString;
                        j += tempString.length - 1;
                    }
                }
            }
            else if (strArray[i] === "product_sales") {
                tempString = "Sales";
                padding = this.width[strArray[i]];

                for (let j = 0; j < padding; j++) {
                    if (j !== 1) {
                        outString += " ";
                    }
                    else {
                        outString += tempString;
                        j += tempString.length - 1;
                    }
                }
            }
            if (strArray[i + 1]) {
                outString += " | ";
            }
            else {
                outString += " |";
            }
        }
        console.log(outString);
    };

    /**
     * Accepts an array of strings with the data labels for the SQL column headers to print a formatted table
     * @param {Array} columns
     */
    this.initialPrint = function (columns = ["item_id", "product_name", "department_name", "price", "stock_quantity", "product_sales"]) {
        this.printBreak(columns);
        this.printHeaders(columns);
        this.printBreak(columns);
        this.printRows(columns);
    };

};

module.exports = dataTable;