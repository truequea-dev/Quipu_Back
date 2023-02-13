const { body } = require('express-validator')
const { validateResult } = require('../helpers/validateHelper')

const validateCreate = [
    body('usuario', 'el campo usuario es requerido')
    .exists()
    .not()
    .isEmpty(),
    body('password', 'el password es minimo de 5 caracteres').isLength({ min: 5 }),
    body('email', 'el correo no es valido')
    .exists()
    .isEmail()
    .not()
    .isEmpty(),
    body('estado_usuario', 'el campo estado_usuario es de tipo boolean')
    .isBoolean(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]
const validateCreateSignIn = [
    body('email', 'el correo no es valido')
    .isEmail()
    .exists(),
    body('password', 'el password es minimo de 5 caracteres').isLength({ min: 5 }),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = {validateCreate, validateCreateSignIn}