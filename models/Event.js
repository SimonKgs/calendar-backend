//* Formato que tendran los eventos en la db

const { Schema, model } = require('mongoose');

const EventSchema = Schema({
    title: {
        type: String,
        required: true
    },
    notes: {    //  ¿?description
        type: String
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    //  esta es la forma de decir que esto será un objeto que hace referencia a un tipo definido en la DB en este caso Usuario el otro Schema
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
});

//  especificamos como devuelve el objeto, sobreescribiendo las propiedades del toJSON
EventSchema.method('toJSON', function(){
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
})


module.exports = model('Event', EventSchema );