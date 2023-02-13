const express = require ( 'express');
const rolesAndPermissionsController = require ( '../controllers/roles_controller');
const { verifyToken } = require('../validators/validateToken');

const roles_router = express.Router();

//////////////////////////////////////////////////////////
////////////////       routes roles      /////////////////
//////////////////////////////////////////////////////////

roles_router.get('/', verifyToken, rolesAndPermissionsController.getRoles);
roles_router.get('/byId/:id', rolesAndPermissionsController.getRolById);
roles_router.get('/byIdComp/:id', rolesAndPermissionsController.getRolByIdcompany);
roles_router.post('/', rolesAndPermissionsController.addRol);
roles_router.delete('/byId/:id', rolesAndPermissionsController.eliminarRol);
roles_router.put('/byId/:id', rolesAndPermissionsController.updateRol);

module.exports = roles_router;
