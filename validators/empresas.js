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
    body('password_admin', 'el password_admin es minimo de 5 caracteres').isLength({ min: 6 }),
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
    body('identificacion_empresa', 'el campo identificacion_empresa es requerido y es de tipo numerico')
    .isNumeric(),
    body('categoriasEmpresa_id', 'el campo categoriasEmpresa_id es requerido')
    .exists()
    .not()
    .isEmpty(),
    body('tiposEmpresa_id', 'el campo tiposEmpresa_id es requerido')
    .exists()
    .not()
    .isEmpty(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = {validateCreate, validateCreatePut}