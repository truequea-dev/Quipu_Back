const express = require ( 'express');
const employeesController = require ( '../controllers/employees_controller');

const employees_router = express.Router();

//////////////////////////////////////////////////////////
////////////////       routes Employees      /////////////////
//////////////////////////////////////////////////////////

employees_router.get('/', employeesController.getEmployees);
employees_router.get('/byId/:id', employeesController.getEmployeesById);
employees_router.get('/byIdComp/:id', employeesController.getEmployeesByIdcompany);
employees_router.post('/', employeesController.addEmployees);
employees_router.delete('/byId/:id', employeesController.eliminarEmployees);
employees_router.put('/byId/:id', employeesController.updateEmployees);

module.exports = employees_router;
