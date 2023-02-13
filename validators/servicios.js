const { check, body } = require('express-validator')
const { validateResult } = require('../helpers/validateHelper')

const validateCreate = [
    // check('nombre_categoria')
    body('nombre_empresa', 'el campo nombre_empresa es requerido')
    .exists()
    .not()
    .isEmpty(),
    body('identificacion_empresa', 'el campo identificacion_empresa es requerido y es de tipo numerico')
    .exists()
    .isNumeric()
    .not()
    .isEmpty(),
    body('email_empresa', 'el correo no es valido')
    .isEmail(),
    body('telefono_empresa', 'el campo telefono_empresa es de tipo numerico')
    .isNumeric(),
    body('nro_whatsapp', 'el campo nro_whatsapp es de tipo numerico')
    .isNumeric(),
    body('pais_empresa', 'el campo pais_empresa es de tipo texto')
    .isString()
    .isAlpha(),
    body('estado_empresa', 'el campo estado_empresa es de tipo boolean')
    .isBoolean(),
    body('ciudad_empresa', 'el campo ciudad_empresa es de tipo texto')
    .isString()
    .isAlpha(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]
const validateCreatePut = [
    // check('nombre_categoria')
    body('nombre_empresa', 'el campo nombre_empresa es requerido')
    .exists()
    .not()
    .isEmpty(),
    body('email_empresa', 'el correo no es valido')
    .isEmail(),
    body('telefono_empresa', 'el campo telefono_empresa es de tipo numerico')
    .isNumeric(),
    body('nro_whatsapp', 'el campo nro_whatsapp es de tipo numerico')
    .isNumeric(),
    body('pais_empresa', 'el campo pais_empresa es de tipo texto')
    .isString()
    .isAlpha(),
    body('estado_empresa', 'el campo estado_empresa es de tipo boolean')
    .isBoolean(),
    body('ciudad_empresa', 'el campo ciudad_empresa es de tipo texto')
    .isString()
    .isAlpha(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = {validateCreate, validateCreatePut}