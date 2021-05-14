const mysql = require("mysql");
const inq = require("inquirer");
const cTable = require('console.table');
const inquirer = require("inquirer");


const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employee_db',
});
connection.connect((err) => {
    if (err) throw err;
    askQuery()
})
// function runQuery(queryText) {
//     const query = connection.query(queryText, (err, res) => {
//         if (err) throw err;
//         console.log(console.log(res));
//         connection.end();
//     }
//     );
//     console.log(query.sql);
// }
function askQuery() {
    inq.prompt([
        {
            type: 'list',
            name: 'response',
            message: 'What would you like to do?',
            choices: ['View All Employees',
                'View all employees by department',
                'View all employees by role',
                'Add employee',
                'Add department',
                'Add role',
                'Update employee',
                'End selection']
        }
    ])
        .then((answer) => {
            switch (answer.response) {
                case 'View all Employees':
                    allEmployee();
                    break;
            }
        })
}
//View all employees
const allEmployee = () => {
    connection.query('SELECT employee.first_name, emplyee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, " ", e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id LEFT JOIN employee e on employee.manager_id = e.id;');
     const query = connection.query((err, res) => {
        if (err) throw err;
        console.table(res);
        connection.end();
    }
    );
    askQuery();
}

//function to see employees by department or role
const roleEmployee = () => {
    connection.query('SELECT employee.first_name, employee.last_name, role.title AS title FROM employee JOIN role ON employee.role_id = role.id;');
     const query = connection.query((err, res) => {
        if (err) throw err;
        console.table(res);
        connection.end();
    }
    );
    askQuery();
}

const departEmployee = () => {
    connection.query('SELECT employee.first_name, employee.last_name, department.name AS department FROM employee JOIN role ON employee.role_id = role.id JOIN deparment ON role.department_id = department.id ORDER BY employee id;');
     const query = connection.query((err, res) => {
        if (err) throw err;
        console.table(res);
        connection.end();
    }
    );
    askQuery();
}

//function to add employee, department, or role
let roleArray = [];
const roleSelection = () => {
    connection.query('SELECT * FROM role', function (err, res) {
        if (err) throw err
        for (let i = 0; i < res.length; i++) {
            roleArray.push(res[i].title);
        }
    })
    return roleArray;
};

let managerArray = [];
const selectManager = () => {
    connection.query('SELECT first_name, last_name FROM employee WHERE manager_id is NULL', function(err, res){
        if (err) throw err
        for (let i = 0; i < res.length; i++) {
            managerArray.push(res[i].first_name);
        }
    })
    return managerArray;
};

const addEmployee = () => {
    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: 'Please Enter Employees First Name'
        },
        {
            name: 'lastName',
            type: 'input',
            message: 'Please Enter Employees Lase Name'
        },
        {
            name: 'role',
            type: 'list',
            message: 'Please Select Employee Role',
            choices: roleSelection()
        },
        {
            name: 'manager',
            type: 'list',
            message: 'Please Select Manager',
            choices: selectManager()
        }
    ]).then (function(val) {
        let roleId = roleSelection().indexOf(val.role) +1;
        let managerId = selectManager().indexOf(val.choice) +1;
        connection.query('INSERT INTO employee SET ?',
        {
            first_name: val.fistName,
            last_name: val.lastName,
            manager_id: managerId,
            role_id: roleId
        }, function(err){
            if (err) throw err
            console.table(val)
            askQuery();
        })
    })
}

//function to update existing employee
const updateEmployee = () => {
    connection.query('SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;',
    function(err, res) {
        if (err) throw err
        console.log(res);
        inquirer.prompt([
            {
                name: 'lastName',
                type: 'list',
                choices: 
            }
        ])
    })
}
//function to end 
