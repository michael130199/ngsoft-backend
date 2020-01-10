'use strict'

// modulos
var bcrypt = require('bcrypt-nodejs');

//modelos
var User = require('../models/user');

//servicios
var jwt = require('../services/jwt');




// acciones
function pruebas(req, res) {
    res.status(200).send({
        message: 'probando el controlador de usuarios y la accion pruebas',
        user: req.user
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

        User.findOne({email: user.email.toLowerCase()}, (err, issetUser) => {
            if(err) {
                res.status(500).send({message: 'Error al comnprobar al usuario el ususario'})
            } else {
                if (!issetUser) {
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
                        message: 'El Usuario no puede ser registrado'
                    });
                }
            }
        });
        
    } else {
        res.status(200).send({
            message: 'introduce los datos correctamente para poder registrar al usuario'
        });
    }

}

function login(req, res) {

    var params = req.body;
    var email = params.email;
    var password = params.password;


    User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if(err) {
            res.status(500).send({message: 'Error al comnprobar al usuario el ususario'})
        } else {
            if (user) {
                bcrypt.compare(password, user.password, (err, check) => {
                    if (check) {
                        if(params.getToken) {
                            //devolver token jwt
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        } else {
                            res.status(200).send({ user });
                        }
                    }else {
                        res.status(404).send({ 
                            message: 'el usuario no a podido loguearse correctamente'
                        });
                    }
                });
            } else {
                res.status(404).send({ message: 'el usuario no a podido loguearse'});
            }
        }
    });
}

function updateUser(req, res) {
    res.status(200).send({
        message: 'Actializar usuario'
    });
}

module.exports = {
    pruebas,
    saveUser,
    login,
    updateUser
};
