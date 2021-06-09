USE employee_db;

CREATE TABLE employee (
    id int auto_increment primary key,
    first_name varchar(30),
    last_name varchar(30),
    role_id int,
    manager_id int,
    foreign key (role_id) references role(id),
    foreign key (manager_id) references employee(id)
);

CREATE TABLE role (
    id int auto_increment primary key,
    title varchar(30),
    salary decimal
    department_id int,
    foreign key (department_id) references department(id)
);

CREATE TABLE  department (
    id int not null auto_increment primary key,
    name varchar (30),
);

--Insert into deparment--
INSERT INTO department (name)
VALUE ('Legal');

INSERT INTO department (name)
VALUE ('Engineering');

INSERT INTO department (name)
VALUE ('Financial');

INSERT INTO department (name)
VALUE ('Human Resources');

--Insert into role---
INSERT INTO role (title, salary, department_id)
VALUE ('Lawyer', 100000, 1);

INSERT INTO role (title, salary, department_id)
VALUE ('Lead Engineer', 90000, 2);

INSERT INTO role (title, salary, department_id)
VALUE ('Sales Lead', 80000, 3);

INSERT INTO role (title, salary, department_id)
VALUE ('Registrar', 60000, 4);

INSERT INTO role (title, salary, department_id)
VALUE ('Software Engineer', 700000, 2);

--Insert into employee--
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ('Jay', 'Craft', null, 1);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ('Home', 'Work', null, 2);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ('Mark', 'Wahl', null, 3);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ('Harper', 'Lead', null, 4);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ('Yoyo', 'Mess', null, 5);


SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;