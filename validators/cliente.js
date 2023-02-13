const { check, body } = require('express-validator')
const { validateResult } = require('../helpers/validateHelper')

const validateCreate = [
    // check('nombre_categoria')
    body('nombres_cliente', 'el campo nombres_cliente es requerido')
    .exists()
    .not()
    .isEmpty(),
    body('dni_cliente', 'el campo dni_cliente es requerido y es de tipo numerico')
    .exists()
    .isNumeric(),
    body('correo_cliente', 'el correo no es valido')
    .isEmail(),
    body('cel_cliente', 'el campo cel_cliente es de tipo numerico')
    .isNumeric(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = {validateCreate}