const express = require('express');
const empresa_controller = require('../controllers/empresa_controller');
const { validateCreate, validateCreatePut } = require("../validators/empresas");
const { verifyToken } = require('../validators/validateToken');
const controller = require('../controllers/upload_controller');

const empresa_router = express.Router();

empresa_router.get('/api/v1/empresa', empresa_controller.getAllEmpresas);
empresa_router.post('/', empresa_controller.addEmpresa);
// empresa_router.post('/api/v1/empresa', validateCreate, controller.upload, empresa_controller.addEmpresa);
empresa_router.get('/api/v1/empresa/:id', empresa_controller.getOneEmpresa);
empresa_router.delete('/api/v1/empresa/:id', verifyToken, empresa_controller.deleteOneEmpresa);
empresa_router.put('/api/v1/empresa/:id', verifyToken, validateCreatePut, empresa_controller.updateEmpresa);

//por cc
empresa_router.get('/api/v1/empresa/cccliente/:ccCliente', empresa_controller.getVehiculoCcCliente);
empresa_router.get('/api/v1/empresa/config/:idconfig', verifyToken, empresa_controller.getConfigEmp);
empresa_router.put('/api/v1/empresa/logo/:id', controller.upload, verifyToken, empresa_controller.updateLogoEmp);
empresa_router.put('/api/v1/empresa/config/:idconfig', verifyToken, empresa_controller.updateConfigByIdEmp);

module.exports = empresa_router;


