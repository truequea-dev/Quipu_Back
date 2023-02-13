const express = require ('express');
const producto_controller = require ('../controllers/producto_controller');
const { validateCreate, validateUpdate } = require ("../validators/productos");
const { verifyToken } = require ("../validators/validateToken");

const router = express.Router();

//get todos los productos
router.get('/api/v1/producto', verifyToken, producto_controller.getAllProductos);
//guardar producto
router.post('/api/v1/producto', verifyToken, validateCreate, producto_controller.addProducto);
//get  producto
router.get('/api/v1/producto/:id', verifyToken, producto_controller.getOneProducto);
//get  producto id empresa
router.get('/api/v1/producto/idemp/:idemp', verifyToken, producto_controller.getOneProductoByIdEmp);
//eliminar un producto
router.delete('/api/v1/producto/:id', verifyToken, producto_controller.deleteOneProducto);
//actualizar producto
router.put('/api/v1/producto/:id', verifyToken, validateUpdate, producto_controller.updateProducto);

//traer producto por c'odigo
router.get('/api/v1/producto/codigo/:codigo', verifyToken, producto_controller.getOneProductoCodigo);

module.exports = router;
