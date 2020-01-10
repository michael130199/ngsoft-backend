'use strict'

// modulos
var bcrypt = require('bcrypt-nodejs');

//modelos
var User = require('../models/user');




// acciones
function pruebas(req, res) {
    res.status(200).send({
        message: 'probando el controlador de usuarios y la accion pruebas'
    });
}


function saveUser(req, res) {
    // crear el objeto Usuario
    var user = new User();

    // recoger parametros
    var params = req.body;


    if(params.password && params.name && params.surname && params.email) {
        // Asignar valores al objeto de usuario
        user.name =params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.role = "ROLE_USER";
        user.image = null;

        // cifrar contraseña
        bcrypt.hash(params.password, null, null, function(err, hash){
            user.password = hash;

            // guardar usuario en la bd
            user.save((err, userStored) => {
                if(err) {
                    res.status(500).send({message: 'Error al guardar el usuario'});
                } else {
                    if(!userStored) {
                        res.status(404).send({message: 'No se ha registrado el usuario'});
                    } else {
                        res.status(200).send({user: userStored}); 
                    }
                }
            });
        });
    } else {
        res.status(200).send({
            message: 'introduce los datos correctamente para poder registrar al usuario'
        });
    }
    



    
}

module.exports = {
    pruebas,
    saveUser
};