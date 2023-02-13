const express = require('express');
const credito_controller = require('../controllers/credito_controller');
const { verifyToken } = require("../validators/validateToken");


const credito_router = express.Router();

credito_router.get('/api/v1/credito', verifyToken, credito_controller.getAllcreditos);
credito_router.post('/api/v1/credito', verifyToken, credito_controller.addcredito);
credito_router.get('/api/v1/credito/:id', verifyToken, credito_controller.getOnecredito);
credito_router.delete('/api/v1/credito/:id', verifyToken, credito_controller.deleteOnecredito);
credito_router.put('/api/v1/credito/:id', verifyToken, credito_controller.updatecredito);

credito_router.post('/api/v1/credito/pagarCuota', verifyToken, credito_controller.pagarCuota);

credito_router.get('/api/v1/credito/idservicio/:idservicio', verifyToken, credito_controller.getOnecreditoByServicio);
credito_router.get('/api/v1/credito/idempresa/:idempresa', verifyToken, credito_controller.getOnecreditoByEmpresa);

module.exports = credito_router;
