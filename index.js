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
            choices: ['View All Employee',
                'View Employee by Department',
                'Add Employee',
                'Update Role',
                'View All Role',
                'Add Role',
                'View All Department',
                'Add Department',
                'Nothing Further'
            ]
        }
    ])
    .then(function (answer) {
        switch (answer.response) {
            case 'View All Employee':
            case 'View Employee by Department':
            case 'View Employee by Manager':
            case 'View All Role':
            case 'View All Department':
                view(answer.response);
                break;

            case 'Add Employee':
            case 'Add Role':
            case 'Add Department':
                addTo(answer.response);
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
        case 'View All Employee':
        case 'View All Role':
        case 'View All Department':
            query(select.split(' ')[2]);
            break;
        case 'View Employee by Department':
            viewDepartment();
            break;
    }
}

function query (table) {
    let insert = 'SELECT * FROM ' + table;
    if (table === 'employee') {
        insert = `select employee.id, employee.first_name, employee.last_name, role.title, role.salary
        from employee join role on employee.role_id = role.id;`
    }
    connection.query(insert, (err, res) => {
        if (err) throw err;

        console.table(res);
        askQuery();
    });
};

function viewDepartment () {
    let insert = 'SELECT name FROM department ';
    connection.query(insert, (err, res) => {
        if (err) throw err;
        inquirer.prompt ([
            {
                type: 'list',
                name: 'resonse',
                message: 'Please choose department name',
                choices: res
            }
        ]) .then(function (answer) {
            const insert2 = `select employee.first_name, employee.last_name, role.title, department.name AS department_name from employee
            join role on 
            employee.role_id = role.id
            join department on 
            role.department_id = department.id
            WHERE department.name = '${answer.response}'`;
            connection.query(insert2, (err, res) => {
                if (err) throw err;
                console.table(res);
                askQuery();
            })
        })
    });
};

function addTo (add) {
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
};

function addEmp () {
    inquirer.prompt ([
        {
            message: 'What is the department name?',
            name: 'depart'
        }
    ]) .then(function (answer) {
        const insert = connection.query(
            'INSERT INTO department SET ?',
            {
                nAME: answer.depart
            },
            (err, res) => {
                if (err) throw err;
                console.log('Added');
                askQuery();
            }
        );
    })
};

function addEmp () {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'What is first name?'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'What is last name?'
        },
        {
            type: 'input',
            name: 'role_id',
            message: 'What is the role id?'
        },
        {
            type: 'input',
            name: 'manager_id',
            message: 'What is the manager id?'
        },
    ]) .then(function (answer) {
        const insert = connection.query(
            'INSERT INTO employee SET ? ',
            {
                first_name: answer.first_name,
                last_name: answer.last_name,
                role_id: answer.role_id,
                manager_id: answer.manager_id
            },
            (err, res) => {
                if (err) throw err;
                console.log('Added');
                askQuery();
            }
        )
    });
};

function addRole () {
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is role?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is role salary?'
        },
        {
            type: 'input',
            name: 'department_id',
            message: 'What is role department id?'
        },
    ]) .then(function (answer) {
        const insert = connection.query(
            'INSERT INTO role SET ? ',
            {
                title: answer.title,
                salary: answer.salary,
                department_id: answer.department_id
            },
            (err, res) => {
                if (err) throw err;
                console.log('Added');
                askQuery();
            }
        )
    })
};

function addDepart () {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is department name?'
        },
    ]) .then(function (answer) {
        const insert = connection.query(
            'INSERT INTO department SET ? ',
            {
                name: answer.name,
            },
            (err, res) => {
                if (err) throw err;
                console.log('Added');
                askQuery();
            }
        )
    })
};

function update() {
    let arrayEmp = [];
    let insert = 'SELECT first_name, last_name FROM employee ';
    connection.query(insert, (err, resEmp) => {
        if (err) throw err;
        for (let i = 0; i < resEmp.length; i++) {
            arrayEmp.push(resEmp[i].first_name + ' ' + resEmp[i].last_name);
        };
        let arrayRoles = [];
        let insert2 = 'SELECT title FROM role ';
        connection.query(insert2, (err, res) => {
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                arrayRoles.push(res[i].title);
            }
            upEmpRole(arrayEmp, arrayRoles);
        })
    })
};

function upEmpRole (arrayEmploy, allRoleArray) {
    inquirer.prompt([
        {
            type: 'list',
            name:'employ',
            message: 'What employee to update?',
            choices: arrayEmploy,
        },
        {
            type: 'list',
            name: 'roles',
            message: 'What is employee new role?',
            choices: allRoleArray,
        }
    ]) .then(function (answer) {
        let insert = `UPDATE employee SET role_id = (SELECT id FROM role WHERE ?) WHERE ? AND ?;`;
        connection.query(insert, 
            [
                {title: answer.roles},
                {first_name: answer.employ.split(' ')[0]},
                {last_name: answer.employ.split(' ')[1]}
            ], (err, res) => {
                if (err) throw err;
                console.log('Updated');
                askQuery();
            })
    })
}