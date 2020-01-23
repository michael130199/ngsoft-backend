'use strict'

var express = require('express');
var AnimalController = require('../controllers/animal.controller');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/animals'})

api.get('/prueba-del-controlador', md_auth.ensureAuth, AnimalController.pruebas);

module.exports = api;
