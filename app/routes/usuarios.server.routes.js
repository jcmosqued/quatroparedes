'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var usuarios = require('../../app/controllers/usuarios.server.controller');
	var multiparty = require('connect-multiparty');
	var multipartMiddleware = multiparty();


	// Usuarios Routes
	app.route('/usuarios')
		.get(usuarios.list)
		.post(users.requiresLogin, usuarios.create);

	app.route('/usuariosSite/:usuarioId')
		.put(users.requiresLogin, multipartMiddleware, usuarios.update)

	app.route('/usuarios/:usuarioId')
		.get(usuarios.read)
		.put(users.requiresLogin, usuarios.update)
		.delete(users.requiresLogin, usuarios.delete);

	// Finish by binding the Usuario middleware
	app.param('usuarioId', usuarios.usuarioByID);
};
