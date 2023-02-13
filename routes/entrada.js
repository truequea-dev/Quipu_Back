const express = require('express');
const entrada_controller = require('../controllers/entrada_controller');
const { verifyToken } = require("../validators/validateToken");


const entrada_router = express.Router();

entrada_router.get('/api/v1/entrada', verifyToken, entrada_controller.getAllEntradas);
entrada_router.post('/api/v1/entrada', verifyToken, entrada_controller.addEntrada);
entrada_router.get('/api/v1/entrada/:id', verifyToken, entrada_controller.getOneEntrada);
entrada_router.delete('/api/v1/entrada/:id', verifyToken, entrada_controller.deleteOneEntrada);
entrada_router.put('/api/v1/entrada/:id', verifyToken, entrada_controller.updateEntrada);

module.exports = entrada_router;
