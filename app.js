'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// cargar Rutas
var user_routes = require('./routes/user');


//middlewares de body-parser

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//configurar cabeceras y cors

//rutas bases

app.use('/api', user_routes);

app.post('/probando', (req, res) => {
    res.status(200).send({
        message: 'Este es el metodo probando'
    });
});

module.exports = app;
