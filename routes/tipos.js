const express = require('express');
const tipos_controller = require('../controllers/tipos_controller');
const { validateCreate } = require("../validators/tipos");


const tipos_router = express.Router();

tipos_router.get('/api/v1/tipos_producto', tipos_controller.getTypeProducto);
tipos_router.get('/api/v1/tipos_producto/:id', tipos_controller.getTypeProductoById);
tipos_router.post('/api/v1/tipos_producto',validateCreate, tipos_controller.addTypeProducto);
tipos_router.put('/api/v1/tipos_producto/:id', validateCreate, tipos_controller.editartypeProducto);
tipos_router.delete('/api/v1/tipos_producto/:id', tipos_controller.eliminarTypeProducto);

tipos_router.get('/api/v1/tipos_empresa', tipos_controller.getTypeEmpresa);
tipos_router.get('/api/v1/tipos_empresa/:id', tipos_controller.getTypeEmpresaById);
tipos_router.post('/tipos_empresa',validateCreate, tipos_controller.addTypeEmpresa);
tipos_router.put('/api/v1/tipos_empresa/:id', validateCreate, tipos_controller.editarTypeEmpresa);
tipos_router.delete('/api/v1/tipos_empresa/:id', tipos_controller.eliminarTypeEmpresa);



module.exports = tipos_router;
