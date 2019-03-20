var dataTable = function () {
    this.data = [];

    this.width = {
        item_id: 5,
        product_name: 50,
        department_name: 50,
        price: 15,
        stock_quantity: 10
    };


    this.setData = function (sqlData) {
        this.data = sqlData;
    };

    this.getData = function () {
        return this.data;
    };

    this.reset = function () {
        this.data = [];
    };

    this.printBreak = function (columnsArray) {

        let breakString = "";

        if (!columnsArray) {
            for (let i = 0; i < 146; i++) {
                breakString += "-";
            }
        }
        else {
            breakString += "-";
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
                }
            }, this);
        }
        console.log(breakString);
    }

    this.printEntry = function (label, padding) {
        let cellString = "";
        for (let i = 0; i < padding; i++) {
            if (i !== 1) {
                cellString += " ";
            }
            else {
                cellString += label;
                i += label.length - 1;
            }
        }
        return cellString;
    };

    this.printRows = function () {
        let keys = [];
        let outString = "";

        this.data.forEach(row => {
            outString = "| ";
            keys = Object.keys(row);

            for (i in keys) {
                outString += this.printEntry((row[keys[i]]).toString(), this.width[keys[i]]);

                if (keys[Number(i) + 1]) {
                    outString += " | ";
                }
                else {
                    outString += " |";
                }

            }
            console.log(outString);
            this.printBreak();

        }, this);
    }

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
            if (strArray[i + 1]) {
                outString += " | ";
            }
            else {
                outString += " |";
            }
        }
        console.log(outString);
    };

    this.initialPrint = function (headerArray = ["item_id", "product_name", "department_name", "price", "stock_quantity"]) {
        this.printBreak();
        this.printHeaders(headerArray);
        this.printBreak();
        this.printRows();
    };

};

module.exports = dataTable;