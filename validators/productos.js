const { check, body } = require('express-validator')
const { validateResult } = require('../helpers/validateHelper')

const validateCreate = [
    // check('nombre_categoria')
    body('nombre_producto', 'el campo nombre_producto es requerido')
    .exists()
    .not()
    .isEmpty(),
    body('cantidad_producto', 'el campo cantidad_producto es requerido y es de tipo numerico')
    .exists()
    .isNumeric(),
    body('estado_producto', 'el campo estado_producto es requerido y es de tipo boolean')
    .exists()
    .isBoolean(),
    body('categoriaProducto_id', 'el campo categoriaProducto_id es requerido')
    .exists()
    .isAlphanumeric(),
    body('tiposProducto_id', 'el campo tiposProducto_id es requerido')
    .exists()
    .isAlphanumeric(),
    body('empresa_id', 'el campo empresa_id es requerido')
    .exists()
    .isAlphanumeric(),
    body('codigo_producto', 'el campo codigo_producto es requerido y es de tipo numerico')
    .exists()
    .isNumeric()
    .not()
    .isEmpty(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]
const validateUpdate = [
    // check('nombre_categoria')
    body('nombre_producto', 'el campo nombre_producto es requerido')
    .exists()
    .not()
    .isEmpty(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = {validateCreate, validateUpdate}