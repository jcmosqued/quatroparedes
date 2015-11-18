'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Inmueble = mongoose.model('Inmueble'),
	//User = mongoose.model('User'),
	fs = require('fs'),
	_ = require('lodash'),
	multiparty = require('multiparty'),
	uuid = require('uuid');

/**
 * Create a Inmueble
 */
exports.create = function(req, res) {
	var inmueble = new Inmueble(req.body);
	inmueble.user = req.user;
	inmueble.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(inmueble);
		}
	});
};

/**
 * Create a inmueble with Upload
 */
exports.createWithUpload = function(req, res) {
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        var file = req.files.file;
        var inmueble = new Inmueble(req.body.inmueble);
        inmueble.user = req.user;

        req.files.file.forEach(function (element, index, array){
        	if (index <=9){
	        	var tmpPath = element.path;	
	        	var extIndex = tmpPath.lastIndexOf('.');
	        	var extension = (extIndex < 0) ? '' : tmpPath.substr(extIndex);
		        var fileName = uuid.v4() + extension;
	    	    var destPath = './public/uploads/' + fileName;
	    	    inmueble.image[index] = '/uploads/' + fileName;
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
////////////////////////////////
            inmueble.save(function(err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(inmueble);
                }
            }
            );
    });

};
/**
 * Show the current Inmueble
 */
exports.read = function(req, res) {
	res.jsonp(req.inmueble);
};

/**
 * Update a Inmueble
 */
exports.update = function(req, res) {
	var inmueble = req.inmueble ;
	inmueble = _.extend(inmueble , req.body.inmueble);
	var file = req.files.file;
////// Guarda las nuevas imagenes
	if (file != null){
	    req.files.file.forEach(function (element, index, array){
	    	if (index <=9){
	        	var tmpPath = element.path;	
	        	var extIndex = tmpPath.lastIndexOf('.');
	        	var extension = (extIndex < 0) ? '' : tmpPath.substr(extIndex);
		        var fileName = uuid.v4() + extension;
	    	    var destPath = './public/uploads/' + fileName;
	    	    inmueble.image.set(index, '/uploads/' + fileName);
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
	}
    /////Elimina los archivos anteriores
	req.body.inmueble.image.forEach(function (element, index, array){
		fs.unlink('./public' + req.body.inmueble.image[index], function (err) { //To unlink the file from temp path after copy
		                if (err) {
		                    console.log(err);
		                }
		});
	});
	
	//inmueble.update ()
	inmueble.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(inmueble);
		}
	});
};

/**
 * Delete an Inmueble
 */
exports.delete = function(req, res) {
	var inmueble = req.inmueble ;

	//Elimina registro
	inmueble.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(inmueble);
		}
	})
//Elimina archivos
	inmueble.image.forEach(function (element, index, array){
		fs.unlink('./public' + inmueble.image[index], function (err) { //To unlink the file from temp path after copy
		                if (err) {
		                    console.log(err);
		                }
		});
	});

};

/**
 * List of Inmuebles
 */
exports.list = function(req, res) { 	
	Inmueble.find()
		.sort('-tipoDestacado')
		.populate('user').exec(function(err, inmuebles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(inmuebles);
		}
	});
	
};

/**
 * Inmueble middleware
 */
exports.inmuebleByID = function(req, res, next, id) { 
	Inmueble.findById(id).populate('user').exec(function(err, inmueble) {
		if (err) return next(err);
		if (! inmueble) return next(new Error('Failed to load Inmueble ' + id));
		req.inmueble = inmueble ;
		next();
	});
};

/**
 * Inmueble authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.inmueble.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
