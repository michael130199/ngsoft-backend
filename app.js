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
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers', 
        'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
    );
    res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, DELETE'
    );
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
})
//rutas bases

app.use('/api', user_routes);
app.use('/api', animal_routes);


module.exports = app;
