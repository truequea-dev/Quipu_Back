const express = require('express');
const login_controller = require('../controllers/login_controller');
const { validateCreate, validateCreateSignIn } = require('../validators/user');
const { verifyToken } = require('../validators/validateToken');


const login_router = express.Router();

login_router.post('/signup', validateCreate, login_controller.signup);
login_router.post('/signin', validateCreateSignIn, login_controller.signIn)

module.exports = login_router;
