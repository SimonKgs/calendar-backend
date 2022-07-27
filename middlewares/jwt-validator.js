const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const jwtValidator = ( req = request, res = response, next ) => {

    //  x-token
    const token = req.header('x-token');

    if ( !token ){
        return res.status(401).json({
            ok: false,
            msg: 'No se encontro el token'
        })
    }

    try {
        
        const { uid, name } = jwt.verify( token, process.env.SECRET_JWT_SEED );
        
        req.uid = uid;
        req.name = name;

    } catch (error) {

        return res.status(401).json({
            ok: false,
            msg: 'token no valido'
        })   
    }

    next();

}

module.exports = {
    jwtValidator
}