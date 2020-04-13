'use strict'

var express = require('express');
var AnimalController = require('../controllers/animal.controller');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var md_admin = require('../middlewares/is_admin');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/animals'})

api.get('/prueba-animal', md_auth.ensureAuth, AnimalController.pruebas);
api.post('/animal', [md_auth.ensureAuth, md_admin.isAdmin], AnimalController.saveAnimal);//admin
api.get('/animals', AnimalController.getAnimals);
api.get('/animal/:id', AnimalController.getAnimal);
api.get('/get-image-animal/:imageFile', AnimalController.getImageFile);
api.put('/update-animal/:id', [md_auth.ensureAuth, md_admin.isAdmin], AnimalController.updateAnimal);//admin
api.post('/upload-image-animal/:id', [md_auth.ensureAuth, md_upload, md_admin.isAdmin] , AnimalController.uploadImage);//admin
api.delete('/animal/:id', [md_auth.ensureAuth, md_admin.isAdmin], AnimalController.deleteAnimal);//admin

module.exports = api;
