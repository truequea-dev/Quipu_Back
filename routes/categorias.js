const express = require('express');
const categorias_controller = require('../controllers/categorias_controller');
const { validateCreate } = require("../validators/categorias");


const categorias_router = express.Router();

categorias_router.get('/api/v1/categorias_producto', categorias_controller.getCategoriaProducto);
categorias_router.get('/api/v1/categorias_producto/:id', categorias_controller.getCategoriaProductoById);
categorias_router.post('/api/v1/categorias_producto',validateCreate, categorias_controller.addCategoriaProducto);
categorias_router.put('/api/v1/categorias_producto/:id', validateCreate, categorias_controller.editarCategoriaProducto);
categorias_router.delete('/api/v1/categorias_producto/:id', categorias_controller.eliminarCategoriaProducto);

categorias_router.get('/api/v1/categorias_empresa', categorias_controller.getCategoriaEmpresa);
categorias_router.get('/api/v1/categorias_empresa/:id', categorias_controller.getCategoriaEmpresaById);
categorias_router.post('/categorias_empresa',validateCreate, categorias_controller.addCategoriaEmpresa);
categorias_router.put('/api/v1/categorias_empresa/:id', validateCreate, categorias_controller.editarCategoriaEmpresa);
categorias_router.delete('/api/v1/categorias_empresa/:id', categorias_controller.eliminarCategoriaEmpresa);



module.exports = categorias_router;
