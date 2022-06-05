USE employeesDB;


INSERT INTO department (name)
VALUES 
('Engineering'),
('Finance'),
('Operations');

INSERT INTO role (title, salary, department_id)
VALUES
('Senior Engineer', 150000, 1),
('Engineering Assistant', 80000, 1),
('Engineering Associate', 120000, 1),
('Accountant', 100000, 2),
('Analyst', 70000, 2),
('Chief Operator', 120000, 3),
('Operator', 65000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Madeon', 'Mimi', 1, 3),
('Daniel', 'Kuma', 2, 1),
('Richard', 'Mole', 3, 1),
('Stacy', 'Cruz', 4, 2),
('Nicole', 'Richards', 5, 2),
('Alice', 'Smith', 6, 3),
('Jeremy', 'Torres', 7, 3);