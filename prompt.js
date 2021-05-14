const mysql = require("mysql");
const inq = require("inquirer");
const cTable = require('console.table');


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
    connection.query('SELECT employee.first_name, emplyee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, " ", e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id LEFT JOIN employee e on employee.manager_id = e.id'),
    function (err, res) {
        if (err) throw err
        console.table(res);
        askQuery();
    }
}
//function to see employees by department or role
//function to add employee, department, or role
//function to update existing employee
//function to end 

askQuery();
