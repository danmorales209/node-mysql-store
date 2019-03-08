var dataTable = function () {
    this.data = {}

    this.width = {
        id: 6,
        productName: 50,
        departmentName: 50,
        price: 15,
        quantity: 10
    };


    this.setData = function (sqlData) {
        this.data = sqlData;
    };

    this.getData = function () {
        return this.data;
    };

    this.printHeaders = function (strArray) {
        let padding = 0;
        let outString = "| ";
        let tempString = "";

        for (let i = 0; i < strArray.length; i++) {
            if (strArray[i] === "item_id") {
                tempString = "ID";
                padding = this.width.id;

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
                padding = this.width.productName;

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
                padding = this.width.departmentName;

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
                padding = this.width.price;

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
                padding = this.width.quantity;

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

    this.initialPrint = function () {
        this.printHeaders(["item_id", "product_name", "department_name", "price", "stock_quantity"]);
        // this.
    };
};

module.exports = dataTable;