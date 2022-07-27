const express = require('express');
// require('dotenv').config();
const dotenv = require('dotenv');
const cors = require('cors')
const { dbConection } = require('./database/config');
dotenv.config()

// console.log(process.env);

//  crear el servidor express
const app = express();

// Base de datos
dbConection();

//  CORS
app.use(cors())

//  directorio publico
app.use( express.static('public'))

//  Lectura y parseo del body, nos permite acceder directamente al .body
app.use( express.json() ) 

//  rutas 
//  todas las rutas que pregunten por auth pasaran lo la ruta definida en auth
app.use('/api/auth', require('./routes/auth'));
//  TODO: CRUD eventos calendario
app.use('/api/events', require('./routes/events'));





//  escuchar peticion 
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en ${ process.env.PORT }`);
})