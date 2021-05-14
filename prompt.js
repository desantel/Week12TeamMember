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
            name: 'userQuery',
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
        .then(answers => {
            if (answers.userQuery === 'View all Employees') {
                //add in code to see all employees
            }
        })
}

//function to see employees by department or role
//function to add employee, department, or role
//function to update existing employee
//function to end 

askQuery();