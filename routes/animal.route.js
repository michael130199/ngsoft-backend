'use strict'

var express = require('express');
var AnimalController = require('../controllers/animal.controller');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/animals'})

api.get('/prueba-animal', md_auth.ensureAuth, AnimalController.pruebas);
api.post('/animal', md_auth.ensureAuth, AnimalController.saveAnimal);
api.get('/animals', AnimalController.getAnimals);
api.get('/animal/:id', md_auth.ensureAuth, AnimalController.getAnimal);
api.put('/update-animal/:id', md_auth.ensureAuth, AnimalController.updateAnimal);


module.exports = api;
