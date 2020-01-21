'use strict'

var express = require('express');
var UserController =  require('../controllers/user.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

var multipart =  require('connect-multiparty');
var mdUpload = multipart({ uploadDir: './uploads/users'})

api.get('/pruebas-del-controlador', mdAuth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.login);
api.post('/upload-image-user/:id', [mdAuth.ensureAuth, mdUpload] , UserController.uploadImage);
api.put('/update-user/:id', mdAuth.ensureAuth, UserController.updateUser);
api.get('/get-image-file/:imageFile', UserController.getImageFile);

module.exports = api;
