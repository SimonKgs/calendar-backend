//  aqui ira la logica que se implementara en cada una de las rutas

//  para que nos mantenga las ayudas importamos expres y lo igualamos a la req y a la res
const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const createUser = async (req, res = response) => {

    // console.log(req.body);
    const { email, password } = req.body;

    try {
        //  comprobacion de si ya existe el usuario, null si no existe, el objeto si existe
        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe'
            });
        }

        //  creacion y guardado del nuevo usuario
        usuario = new Usuario(req.body);

        // encriptacion del pass
        const salt = bcrypt.genSaltSync();

        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save()

        //  Generar JWT
        const token = await generarJWT( usuario.id, usuario.name)

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })

    }
}

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        let usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o pass incorrecto'
            });
        }

        //  comprobar el password
        const validPassword = bcrypt.compareSync( password, usuario.password);

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o pass incorrecto'
            })
        }

        //  Generar JWT
        const token = await generarJWT( usuario.id, usuario.name)

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })

    }
}

const renewToken = async(req, res = response) => {

    const { name, uid } = req;

    //  generar token
    const token = await generarJWT(uid, name);

    res.json({
        ok: true,
        token
    })
}

module.exports = {
    createUser,
    login,
    renewToken
}