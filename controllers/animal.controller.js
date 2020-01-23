'use strict'

//modulos
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');

//modelos
var Animal = require('../models/animal.model');
var User = require('../models/user.model');

//servicios
var jwt = require('../services/jwt');

//acciones
function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando el controlador de Animales',
        user: req.user
    });
}


//exportar
module.exports = {
    pruebas
};
