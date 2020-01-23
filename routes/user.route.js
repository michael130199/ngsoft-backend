'use strict'

var express = require('express');
var UserController =  require('../controllers/user.controller');
var md_auth = require('../middlewares/authenticated');

var api = express.Router();

var multipart =  require('connect-multiparty');
var mdUpload = multipart({ uploadDir: './uploads/users'})

api.get('/pruebas-del-controlador', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.login);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, mdUpload] , UserController.uploadImage);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.get('/get-image-file/:imageFile', UserController.getImageFile);
api.get('/keepers', UserController.getKeepers);

module.exports = api;
