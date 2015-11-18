'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Usuario = mongoose.model('User'),
	fs = require('fs'),
	_ = require('lodash'),
	multiparty = require('multiparty'),
	uuid = require('uuid');

/**
 * Create a Usuario
 */
exports.create = function(req, res) {
	var usuario = new Usuario(req.body);
	usuario.user = req.user;

	usuario.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(usuario);
		}
	});
};

/**
 * Show the current Usuario
 */
exports.read = function(req, res) {
	res.jsonp(req.usuario);
};

/**
 * Update a Usuario
 */
exports.update = function(req, res) {

	
	var usuario = req.usuario ;
	usuario = _.extend(usuario , req.body.usuario);
	console.log(req.files);
	var file = req.files.file;
	console.log(file);
////// Guarda las nuevas imagenes
	if (file != null){
	    req.files.file.forEach(function (element, index, array){
	    	if (index ==0){
	        	var tmpPath = element.path;	
	        	var extIndex = tmpPath.lastIndexOf('.');
	        	var extension = (extIndex < 0) ? '' : tmpPath.substr(extIndex);
		        var fileName = uuid.v4() + extension;
	    	    var destPath = './public/uploads/' + fileName;
	    	    usuario.imgPortada = '/uploads/' + fileName;
		        var is = fs.createReadStream(tmpPath);
		        var os = fs.createWriteStream(destPath);
		        if(is.pipe(os)) {
		            fs.unlink(tmpPath, function (err) { //To unlink the file from temp path after copy
		                if (err) {
		                    console.log(err);
		                }
		            });
		        } else
		            return res.json('Archivo no guardado');
	        }

	    	if (index ==1){
	        	var tmpPath = element.path;	
	        	var extIndex = tmpPath.lastIndexOf('.');
	        	var extension = (extIndex < 0) ? '' : tmpPath.substr(extIndex);
		        var fileName = uuid.v4() + extension;
	    	    var destPath = './public/uploads/' + fileName;
	    	    usuario.imgLogo = '/uploads/' + fileName;
		        var is = fs.createReadStream(tmpPath);
		        var os = fs.createWriteStream(destPath);
		        if(is.pipe(os)) {
		            fs.unlink(tmpPath, function (err) { //To unlink the file from temp path after copy
		                if (err) {
		                    console.log(err);
		                }
		            });
		        } else
		            return res.json('Archivo no guardado');
	        }


	    });

	    /////Elimina los archivos anteriores
	    if (req.body.usuario.imgPortada != 'uploads/defaultP.jpg'){
			fs.unlink('./public' + req.body.usuario.imgPortada, function (err) { //To unlink the file from temp path after copy
			                if (err) {
			                    console.log(err);
			                }
			});
		};
		if (req.body.usuario.imgLogo != 'uploads/defaultL.jpg'){
			fs.unlink('./public' + req.body.usuario.imgLogo, function (err) { //To unlink the file from temp path after copy
			                if (err) {
			                    console.log(err);
			                }
			});
		};
	};
	
	//inmueble.update ()
	usuario.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(usuario);
		}
	});
};

/**
 * Delete an Usuario
 */
exports.delete = function(req, res) {
	var usuario = req.usuario ;

	usuario.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(usuario);
		}
	});
};

/**
 * List of Usuarios
 */
exports.list = function(req, res) { 
	Usuario.find().select('displayName username email estado roles tipo logo telefono paginaweb facebook twitter letraFondo colorFondo letraContacto colorContacto letraMarco colorMarco imgPortada imgLogo estatus').exec(function(err, usuarios) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(usuarios);
		}
	});
};

/**
 * Usuario middleware
 */
exports.usuarioByID = function(req, res, next, id) { 
	Usuario.findById(id).select('displayName username email estado roles tipo logo telefono paginaweb facebook twitter letraFondo colorFondo letraContacto colorContacto letraMarco colorMarco imgPortada imgLogo estatus').exec(function(err, usuario) {
		if (err) return next(err);
		if (! usuario) return next(new Error('Failed to load Usuario ' + id));
		req.usuario = usuario ;
		next();
	});
};

/**
 * Usuario authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.usuario.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
