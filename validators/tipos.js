const { check, body } = require('express-validator')
const { validateResult } = require('../helpers/validateHelper')

const validateCreate = [
    // check('nombre_categoria')
    body('nombre_type', 'el campo nombre_type es requerido')
    .exists()
    .not()
    .isEmpty(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = {validateCreate}