const mysql = require("mysql");
const cTable = require('console.table');
const inquirer = require("inquirer");


const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'dakota2020',
    database: 'employee_db',
});

//connection id
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected as Id' + connection.threadId)
    askQuery();
});

function askQuery() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'response',
            message: 'What would you like to do?',
            choices: ['View All Employees',
                'View Employees by Department',
                'Add Employee',
                'Update Role',
                'View All Roles',
                'Add Role',
                'View All Departments',
                'Add Department',
                'Nothing Further'
            ]
        }
    ])
    .then(function (answer) {
        switch (answer.response) {
            case 'View All Employees':
            case 'View Employees by Department':
            case 'View Employees by Manager':
            case 'View All Roles':
            case 'View All Departments':
                view(answer.response);
                break;

            case 'Add Employee':
            case 'Add Role':
            case 'Add Department':
                add(answer.response);
                break;

            case 'Delete Employee':
            case 'Delete Role':
                del(answer.response);
                break;

            case 'Update Role':
                update(answer.response)
                break;
            
            case 'Nothing Further':
                
        }
    })
}

function view(select) {
    switch (select) {
        case 'View All Employees':
        case 'View All Roles':
        case 'View All Departments':
            query(select.split(' ')[2]);
            break;
        case 'View Employees by Department':
            viewDepartment();
            break;
    }
}

function query (table) {
    let insert = 'SELECT * FROM' + table;
    if (table === 'employees') {
        insert = `select employees.id, employees.first_name, employees.last_name, role.title, role.salary
        from employees join roles on employee.role_id = role.id;`
    }
    connection.insert(insert, (err, res) => {
        if (err) throw err;

        console.table(res);
        askQuery();
    });
};

function viewDepartment () {
    let insert = 'SELECT name FROM departments';
    connection.insert(insert, (err, res) => {
        if (err) throw err;
        inquirer.prompt ([
            {
                type: 'list',
                name: 'resonse',
                message: 'Please choose department name',
                choices: res
            }
        ]) .then(function (answer) {
            const insert2 = `select employees.first_name, employees.last_name, role.title, department.name AS department_name from employees
            join roles on 
            employee.role_id = role.id
            join departments on 
            role.department_id = department.id
            WHERE department.name = '${answer.response}'`;
            connection.insert(insert2, (err, res) => {
                if (err) throw err;
                console.table(res);
                askQuery();
            })
        })
    });
};

function add (add) {
    add = add.split(' ')[1];
    switch (add) {
        case 'Employee':
            addEmp();
            break;

        case 'Department':
            addDepart();
            break;

        case 'Role':
            addRole();
            break;
    }
}
