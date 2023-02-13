const { check, body } = require('express-validator')
const { validateResult } = require('../helpers/validateHelper')

const validateCreateSal = [
    // check('nombre_categoria')
    body('valor_sal', 'el campo valor_sal es requerido y es de tipo numerico')
    .isNumeric()
    .notEmpty(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]
const validateCreateEnt = [
    // check('nombre_categoria')
    body('valor_ent', 'el campo valor_ent es requerido y es de tipo numerico')
    .isNumeric()
    .notEmpty(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = {validateCreateSal, validateCreateEnt}