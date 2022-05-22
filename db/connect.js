//REQUIRE
const mysql = require('mysql');
const inquirer = require('inquirer');

//CONNECTION TO MySQL Database
const db = mysql.createConnection(
    {
        host: 'localhost',
        
        //MySQL username
        user: 'root',

        //MySQL password
        password: '',
        database: 'employeesDatabase'
    },
    console.log('Connected to the employee database.')
);

//EXPORT
module.exports = db;