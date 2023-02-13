const express = require('express');
const cliente_controller = require('../controllers/cliente_controller');
const { validateCreate } = require("../validators/cliente");
const { verifyToken } = require("../validators/validateToken");


const cliente_router = express.Router();

cliente_router.get('/api/v1/cliente', verifyToken, cliente_controller.getAllClientes);
cliente_router.post('/api/v1/cliente', verifyToken, validateCreate, cliente_controller.addCliente);
cliente_router.get('/api/v1/cliente/:id', verifyToken, cliente_controller.getOneCliente);
cliente_router.delete('/api/v1/cliente/:id', verifyToken, cliente_controller.deleteOneCliente);
cliente_router.put('/api/v1/cliente/:id', verifyToken, validateCreate, cliente_controller.updateCliente);

//por dni
cliente_router.get('/api/v1/cliente/dni/:dni', verifyToken, cliente_controller.getOneClienteDni);
cliente_router.get('/api/v1/cliente/idemp/:idemp', verifyToken, cliente_controller.getOneClienteByIdEmp);
cliente_router.delete('/api/v1/cliente/dni/:dni', verifyToken, cliente_controller.deleteOneClienteDni);
cliente_router.put('/api/v1/cliente/dni/:dni', verifyToken, validateCreate, cliente_controller.updateClienteDni);


module.exports = cliente_router;

