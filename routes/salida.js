const express = require ( 'express');
const salida_controller = require ( '../controllers/salida_controller');
const { validateCreateSal } = require ( "../validators/salida_entrada");
const { verifyToken } = require ( "../validators/validateToken");

const salida_router = express.Router();

salida_router.get('/api/v1/salida', verifyToken, salida_controller.getAllSalidas);
salida_router.get('/api/v1/salida/idemp/:idemp', verifyToken, salida_controller.getSalidaByIdEmp);
salida_router.post('/api/v1/salida', verifyToken, validateCreateSal, salida_controller.addSalida);
salida_router.get('/api/v1/salida/:id', verifyToken, salida_controller.getOneSalida);
salida_router.delete('/api/v1/salida/:id', verifyToken, salida_controller.deleteOneSalida);
salida_router.put('/api/v1/salida/:id', verifyToken, validateCreateSal, salida_controller.updateSalida);

module.exports = salida_router;
