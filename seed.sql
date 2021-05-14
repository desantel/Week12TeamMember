USE employee_db;

CREATE TABLE employee (
    id int primary key,
    first_name varchar(30),
    last_name varchar(30),
    employee_role_id int,
    manager_id int,
);

CREATE TABLE employee_role (
    id int primary key,
    title varchar(30),
    salary decimal
    department_id int,
);

CREATE TABLE  department (
    id int,
    department_name varchar (30),
);
