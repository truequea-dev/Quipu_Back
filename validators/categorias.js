const { check, body } = require('express-validator')
const { validateResult } = require('../helpers/validateHelper')

const validateCreate = [
    // check('nombre_categoria')
    body('nombre_categoria', 'el campo nombre_categoria es requerido')
    .exists()
    .not()
    .isEmpty(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = {validateCreate}