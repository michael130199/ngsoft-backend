'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// cargar Rutas
var user_routes = require('./routes/user.route');
var animal_routes = require('./routes/animal.route');

//middlewares de body-parser

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//configurar cabeceras y cors

//rutas bases

app.use('/api', user_routes);
app.use('/api', animal_routes);


module.exports = app;
