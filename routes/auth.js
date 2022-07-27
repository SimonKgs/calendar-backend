//*  Auth
//*  host + /api/auth

// const express = require('express');
const { Router } = require('express');
const { check } = require('express-validator')
const router = Router();

const { createUser, login, renewToken } = require('../controllers/auth');
const { fieldValidator } = require('../middlewares/field-validator');
const { jwtValidator } = require('../middlewares/jwt-validator');

//* rutas, logica en controllers
//  registro
router.post('/new',
    [   // middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de tener mas de 6 caracteres').isLength({ min: 6 }),
        fieldValidator
    ],
    createUser
)

//  login
router.post('/',
[
    check('email', 'El email o el password no es valido').isEmail(),
    check('password', 'El email o el password no es valido').isLength({ min: 6 }),
    fieldValidator
],
login)

//  extender sesion
router.get('/renew', jwtValidator, renewToken)


module.exports = router;