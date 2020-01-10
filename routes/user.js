'use strict'

var express = require('express');
var UserController =  require('../controllers/user');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

api.get('/pruebas-del-controlador', mdAuth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.login);
api.put('/update-user/:id', mdAuth.ensureAuth, UserController.updateUser);

module.exports = api;
