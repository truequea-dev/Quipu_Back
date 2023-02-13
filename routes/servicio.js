const express = require('express');
const servicio_controller = require('../controllers/servicio_controller');
const {verifyToken} = require('../validators/validateToken');
const controller = require('../controllers/upload_controller');


const servicio_router = express.Router();

servicio_router.get('/api/v1/servicio', verifyToken, servicio_controller.getAllServicios);
servicio_router.post('/api/v1/servicio', verifyToken, servicio_controller.addServicio);
servicio_router.get('/api/v1/servicio/:id', verifyToken, servicio_controller.getOneServicio);
servicio_router.delete('/api/v1/servicio/:id', verifyToken, servicio_controller.deleteOneServicio);
servicio_router.put('/api/v1/servicio/:id', verifyToken, servicio_controller.updateServicio);

servicio_router.get('/api/v1/serviciosByIdEmp/:idEmp', verifyToken, servicio_controller.getServiciosByEmp);
servicio_router.get('/api/v1/serviciosByIdCliente/:idCliente', verifyToken, servicio_controller.getOneServicioByIdCliente);
servicio_router.post('/api/v1/servicio/email', verifyToken, controller.upload, controller.sendServByEmail);



module.exports = servicio_router;
