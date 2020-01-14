'use strict'

// modulos
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');

//modelos
var User = require('../models/user.model');

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

    var userId = req.params.id;
    var update = req.body;
    
    if(userId != req.user.sub) {
        return res.status(500).send({ message: 'No tienes permiso para actualizar el usuario'});
    }

    User.findByIdAndUpdate(userId, update, {new: true},  (err, userUpdated) => {
        if (err) {
            res.status(500).send({message: 'Error al actualizar usuario'});
        } else {
            if (!userUpdated) {
                res.status(404).send({ message: 'No se a podido actualizar el usuario'});
            }else {
                res.status(200).send({ user: userUpdated});
            }
        }
    });
}

function uploadImage(req, res) {

    var userId = req.params.id;
    var file_name = 'No subido...';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {

            if(userId != req.user.sub) {
                return res.status(500).send({ message: 'No tienes permiso para actualizar el usuario'});
            }

            User.findByIdAndUpdate(userId, {image: file_name}, {new: true},  (err, userUpdated) => {
                if (err) {
                    res.status(500).send({message: 'Error al actualizar usuario'});
                } else {
                    if (!userUpdated) {
                        res.status(404).send({ message: 'No se a podido actualizar el usuario'});
                    }else {
                        res.status(200).send({ user: userUpdated, image: file_name});
                    }
                }
            });

        } else {
            fs.unlink(file_path, (err) => {
                if (err) {
                    res.status(200).send({ message: 'Extension no valida y fichero no borrado'});
                } else {
                    res.status(200).send({ message: 'Extension no valida'});
                }
            });
            
        }

    } else {
        res.status(200).send({ message: 'No se ha subido el archivo'});
    }


}

module.exports = {
    pruebas,
    saveUser,
    login,
    updateUser,
    uploadImage
};
