'use strict'

//modulos
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');

//modelos
var Animal = require('../models/animal.model');
var User = require('../models/user.model');

//servicios
var jwt = require('../services/jwt');

//acciones
function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando el controlador de Animales',
        user: req.user
    });
}

function saveAnimal(req, res) {
    var animal = new Animal();
    var params = req.body;

    if(params.name) {
        animal.name = params.name;
        animal.description = params.description;
        animal.year = params.year;
        animal.nickname = params.nickname;
        animal.image = null;
        animal.user = req.user.sub;

        animal.save((err, userStored) => {
            if(err) {
                res.status(500).send({message: 'Error en el servidor'});
            } else {
                if(!userStored) {
                    res.status(404).send({message: 'No se ha registrado el animal'});
                } else {
                    res.status(200).send({animal: userStored}); 
                }
            }
        });
    }else {
        res.status(200).send({message: 'El nombre es obligatorio'});
    }
    
}

function getAnimals(req, res) {

    Animal.find({}).populate({path: 'user'}).exec((err, animals) => {
        if(err) {
            res.status(500).send({message: 'Error en la peticion'});
        } else {
            if (!animals) {
                res.status(404).send({message: 'No hay animales'});
            } else {
                res.status(200).send({ animals });
            }
        }
    });
}

function getAnimal(req, res) {
    var animalId = req.params.id;
    Animal.findById( animalId ).populate({path: 'user'}).exec((err, animal) => {
        if(err) {
            res.status(500).send({message: 'Error en la peticion'});
        } else {
            if (!animal) {
                res.status(404).send({message: 'El animal no existe'});
            } else {
                res.status(200).send({ animal });
            }
        }
    });
}

function updateAnimal(req, res){
    var animalId = req.params.id;
    var update = req.body;

    Animal.findByIdAndUpdate(animalId, update, {new: true}, (err, animalUpdate) => {
        if (err) {
            res.status(500).send({ message: 'Error al actualizar animal' });
        } else {
            if(!animalUpdate) {
                res.status(404).send({ message: 'No se a podido actualizar el animal' });
            } else {
                res.status(200).send({ animal: animalUpdate });
            }
        }
    });

}

function uploadImage(req, res) {

    var animalId = req.params.id;
    var file_name = 'No subido...';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            
            // console.log(req.user);
            // if(animalId != req.animal.user) {
            //     return res.status(500).send({ message: 'No tienes permiso para actualizar el animal'});
            // }

            Animal.findOneAndUpdate(animalId, {image: file_name}, {new: true},  (err, animalUpdated) => {
                if (err) {
                    res.status(500).send({message: 'Error al actualizar el animal'});
                } else {

                    if (!animalUpdated) {
                        res.status(404).send({ message: 'No se a podido actualizar el animal'});
                    }else {
                        res.status(200).send({ user: animalUpdated, image: file_name});
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

//exportar
module.exports = {
    pruebas,
    saveAnimal, 
    getAnimals,
    getAnimal,
    updateAnimal,
    uploadImage
};
