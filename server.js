//REQUIRE
const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const db = require('./db/connect');

//CONNECT TO DATABASE AND START FUNCTION
db.connect(function (err) {
    if (err) throw err;
    console.log('Database connection successful.');
    initialSelection();
})

//FUNCTION - INITIAL SELECTION PROMPT
const initialSelection = async () => {
    try {
        let answer = await inquirer.prompt({
            name: 'selection',
            type: 'list',
            message: 'Select from following options.',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add Departments',
                'Add Roles',
                'Add Employees',
                'Update Employee Role',
                'Exit'
            ]
        });
        //CALL FUNCTION BASED ON USER SELECTION
        switch (answer.selection) {
            
            case 'View All Departments':
                viewDepartment();
                break;

            case 'View All Roles':
                viewRole();
                break;

            case 'View All Employees':
                viewEmployee();
                break;

            case 'Add Departments':
                addDepartment();
                break

            case 'Add Roles':
                addRole();
                break

            case 'Add Employees':
                addEmployee();
                break

            case 'Update Employee Role':
                employeeUpdate();
                break

            case 'Exit':
                connection.end();
                break;
        };
    } catch (err) {
        console.log(err);
        initialSelection();
    };
}


//VIEW ALL DEPARTMENTS
const viewDepartment = async () => {
    console.log('Department View');
    try {
        let query = 'SELECT * FROM department';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let departmentArray = [];
            res.forEach(department => departmentArray.push(department));
            console.table(departmentArray);
            initialSelection();
        });
    } catch (err) {
        console.log(err);
        initialSelection();
    };
}

//VIEW ALL ROLES
const viewRole = async () => {
    console.log('Role View');
    try {
        let query = 'SELECT * FROM role';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let roleArray = [];
            res.forEach(role => roleArray.push(role));
            console.table(roleArray);
            initialSelection();
        });
    } catch (err) {
        console.log(err);
        initialSelection();
    };
}

//VIEW EMPLOYEES
const viewEmployee = async () => {
    console.log('Employee View');
    try {
        let query = 'SELECT * FROM employee';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let employeeArray = [];
            res.forEach(employee => employeeArray.push(employee));
            console.table(employeeArray);
            initialSelection();
        });
    } catch (err) {
        console.log(err);
        initialSelection();
    };
}

//TO ADD NEW DEPARTMENT
const addDepartment = async () => {
    try {
        console.log('Department Add');

        let answer = await inquirer.prompt([
            {
                name: 'deptName',
                type: 'input',
                message: 'Enter name of new department.'
            }
        ]);

        let result = await connection.query("INSERT INTO department SET ?", {
            department_name: answer.deptName
        });

        console.log(`${answer.deptName} added successfully.`)
        initialSelection();

    } catch (err) {
        console.log(err);
        initialSelection();
    };
}

//TO ADD ROLE
const addRole = async () => {
    try {
        console.log('Role Add');

        let departments = await connection.query("SELECT * FROM department")

        let answer = await inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'Enter title of new role.'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'Enter salary of new role.'
            },
            {
                name: 'departmentId',
                type: 'list',
                choices: departments.map((departmentId) => {
                    return {
                        name: departmentId.department_name,
                        value: departmentId.id
                    }
                }),
                message: 'Select department ID for this role.',
            }
        ]);
        
        let chosenDepartment;
        for (i = 0; i < departments.length; i++) {
            if(departments[i].department_id === answer.choice) {
                chosenDepartment = departments[i];
            };
        }
        let result = await connection.query("INSERT INTO role SET ?", {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.departmentId
        })

        console.log(`${answer.title} role added successfully.`)
        initialSelection();

    } catch (err) {
        console.log(err);
        initialSelection();
    };
}

//TO ADD EMPLOYEE
const addEmployee = async () => {
    try {
        console.log('Employee Add');

        let roles = await connection.query("SELECT * FROM role");

        let managers = await connection.query("SELECT * FROM employee");

        let answer = await inquirer.prompt([
            {
                name: 'firstName',
                type: 'input',
                message: 'Enter employee\'s first name.'
            },
            {
                name: 'lastName',
                type: 'input',
                message: 'Enter employee\'s last name.'
            },
            {
                name: 'employeeRoleId',
                type: 'list',
                choices: roles.map((role) => {
                    return {
                        name: role.title,
                        value: role.id
                    }
                }),
                message: 'Select employee\'s role ID.'
            },
            {
                name: 'employeeManagerId',
                type: 'list',
                choices: managers.map((manager) => {
                    return {
                        name: manager.first_name + " " + manager.last_name,
                        value: manager.id
                    }
                }),
                message: 'Select employee\'s manager\'s ID.'
            }
        ])

        let result = await connection.query("INSERT INTO employee SET ?", {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: (answer.employeeRoleId),
            manager_id: (answer.employeeManagerId)
        });

        console.log(`New Employee - ${answer.firstName} ${answer.lastName} added successfully.`);
        initialSelection();

    } catch (err) {
        console.log(err);
        initialSelection();
    };
}

//UPDATE EMPLOYEE ROLE
const employeeUpdate = async () => {
    try {
        console.log('Employee Update');
        
        let employees = await connection.query("SELECT * FROM employee");

        let employeeSelection = await inquirer.prompt([
            {
                name: 'employee',
                type: 'list',
                choices: employees.map((employeeName) => {
                    return {
                        name: employeeName.first_name + " " + employeeName.last_name,
                        value: employeeName.id
                    }
                }),
                message: 'Select an employee to update.'
            }
        ]);

        let roles = await connection.query("SELECT * FROM role");

        let roleSelection = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: roles.map((roleName) => {
                    return {
                        name: roleName.title,
                        value: roleName.id
                    }
                }),
                message: 'Select updated role.'
            }
        ]);

        let result = await connection.query("UPDATE employee SET ? WHERE ?", [{ role_id: roleSelection.role }, { id: employeeSelection.employee }]);

        console.log(`The role was successfully updated.`);
        initialSelection();

    } catch (err) {
        console.log(err);
        initialSelection();
    };
}