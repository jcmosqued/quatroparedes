'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var inmuebles = require('../../app/controllers/inmuebles.server.controller');
	
	var multiparty = require('connect-multiparty');
	var multipartMiddleware = multiparty();
	
	// Inmuebles Routes

	app.route('/inmuebleupload')
    .post(users.requiresLogin, multipartMiddleware, inmuebles.createWithUpload);

	app.route('/inmuebles')
		.get(inmuebles.list)
		.post(users.requiresLogin, inmuebles.create);

	app.route('/inmuebles/:inmuebleId')
		.get(inmuebles.read)
		.put(users.requiresLogin,  inmuebles.update)
		.delete(users.requiresLogin, inmuebles.hasAuthorization, inmuebles.delete);

	// Finish by binding the Inmueble middleware
	app.param('inmuebleId', inmuebles.inmuebleByID);
};
