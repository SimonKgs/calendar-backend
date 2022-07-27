//  ok: true
//  msg: servicio

const { response } = require('express');
const Event = require('../models/Event')

const getEvents = async (req, res = response) => {

    //  populate sirve para mostrar la info del campo al que hace referencia, si este es otro objeto de la db
    //  primer argumento el objeto segundo sin comas los campos a mostrar
    const eventos = await Event.find().populate('user', 'name');

    res.json({
        ok: true,
        eventos
    })
}

const createEvent = async (req, res = response) => {

    //  verificar el evento, se lo debemos enviar en el body de la peticion como un JSON 
    const evento = new Event(req.body);

    try {

        evento.user = req.uid

        const eventoDB = await evento.save()

        res.status(201).json({
            ok: true,
            event: eventoDB
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: "Hable con el admin"
        });
    }

}

const updateEvent = async (req, res = response) => {

    //  coger valor de la url con el nombre que le dimos en las rutas
    const eventId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Event.findById(eventId)

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese Id'
            })
        }

        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permiso para modificar el evento'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        //  la tercera opcion new para que devuelva el objeto actualizado, por defecto devuelve el antiguo
        const eventoActualizado = await Event.findByIdAndUpdate( eventId, nuevoEvento, { new: true } );

        res.json({
            ok: true,
            events: eventoActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }

}

const deleteEvent = async(req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {
        //  obtengo el evento
        const evento = await Event.findById(eventId);
        
        //  validar si existe ese evento
        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese Id'
            })
        }

        //  compruebo si el usuario es el mismo que creo el evento
        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permiso para modificar el evento'
            })
        }


        //  borro el evento
        const eventDeleted = await Event.findByIdAndDelete( eventId )

        res.json({
            ok: true,
            eventDeleted
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }

}

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}