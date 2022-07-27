
//* host /api/events/
const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

const { jwtValidator } = require('../middlewares/jwt-validator');

const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events'); 
const { fieldValidator } = require('../middlewares/field-validator');
const { isDate } = require('../helpers/isDate');

//  validar el token para todas las rutas
//  si tenemos un middleware que se aplicará en cada ruta lo podemos hacer poniendolo a un nivel mas alto
//  al hacerlo de esta forma nos evitamos escribir el middleware en cada ruta y dejamos el archivo mas limpio
//  si tenemos una ruta que no lo use, escribimos primero la ruta/s que no lo usen y todas las que esten
//  debajo de la declaracion del token lo necesitarán
router.use( jwtValidator );

//  obtener eventos
router.get('/', getEvents);

//  crear evento
router.post('/', [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    //  validaciones personalizadas, usamos el custom esperara un callback, aqui valido que sea una fecha y lo hago desde el helper isDate
    check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
    check('end', 'Fecha de fin es obligatoria').custom( isDate ),
    //  en este ultimo será donde se para si hay fallos o continua, es el que valida el conjunto de errores
    //  middleware propio recibira la req que será un objeto con errors y alli retornará si hay errores el error, si no hay pasa a lo siguiente, next
    fieldValidator  
    
], createEvent );

//  actualizar evento
router.put('/:id', [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    //  validaciones personalizadas, usamos el custom esperara un callback, aqui valido que sea una fecha y lo hago desde el helper isDate
    check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
    check('end', 'Fecha de fin es obligatoria').custom( isDate ),
    //  en este ultimo será donde se para si hay fallos o continua, es el que valida el conjunto de errores
    //  middleware propio recibira la req que será un objeto con errors y alli retornará si hay errores el error, si no hay pasa a lo siguiente, next
    fieldValidator  
    
], updateEvent );

//  borrar evento
router.delete('/:id', deleteEvent );


module.exports = router

