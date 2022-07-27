//  uso moment para las validaciones de las fechas
const moment = require('moment');

//  desestructuramos de rest, esos valores, hay mas cosas pero con estos valen
const isDate = (value, { req, location, path }) => {


    if (!value) {
        return false;
    }

    // console.log(value);
    // console.log(location);
    // console.log(path);

    const fecha = moment(value);

    if (fecha.isValid()) {
        return true;
    } else {
        return false;
    }

}

module.exports = { isDate }