const express = require ( 'express');
const rolesAndPermissionsController = require ( '../controllers/roles_controller');

const permissions_router = express.Router();

////////////////////////////////////////////////////////////////
////////////////       routes permissions      /////////////////
////////////////////////////////////////////////////////////////

permissions_router.get('/permissions', rolesAndPermissionsController.getPermissions);
permissions_router.get('/permissions/idemp/:idemp');
permissions_router.post('/permissions');
permissions_router.get('/permissions/:id');
permissions_router.delete('/permissions/:id');
permissions_router.put('/permissions/:id');

module.exports = permissions_router;
