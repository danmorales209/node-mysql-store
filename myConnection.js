var server = {
    host:"localhost",
    port: "3306",
    user: process.env.SERVER_USER,
    password: process.env.SERVER_SECRET,
    database: "bamazon"
};

module.exports = server;