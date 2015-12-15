define(["interface_actions/competition.action", "interface_actions/user.action"], function(competitionAction, userAction) {

	//Competiciones para usar en el test
	var invitado = ["usuarioInvitado", "passInvitado",0];
	var gestor = ["usuarioGestor", "passGestor",1];
	var administrador = ["usuarioAdmin", "passAdmin",2];	

	var run = function() {

		QUnit.module("Usuarios");
		test('Pruebas CRUD y de login de Usuarios', function(assert) {
			EXEC.clear(); // necesario usarlo en cada modulo de test para limpiar el lote de acciones.
			assert.expect(36); //number of assert to be executed (it's necessary for asynchronous operations)
			var done = assert.async();

			userAction.ingresarComoAdmin();

			/***********CREAR USUARIO***************/

			userAction.verListaUsuarios();

			EXEC.queue(function() { // click en crear usuario
				$('#mainuser button.accept').click();
			});

			userAction.crearUsuario("","unapass",0);

			EXEC.queue(function() {
				assert.equal($("#edituser").css("visibility"), "visible", "crear un usuario sin nick");
			});

			userAction.crearUsuario(...invitado);

			EXEC.queue(function() { // comprobamos si se ha creado correctamente
				assert.ok($("#list-users li:contains('usuarioInvitado')").length, "El usuario invitado debe estar en la lista");
			});

			/***********************/

			EXEC.queue(function() { // click en crear usuario
				$('#mainuser button.accept').click();
			});
			userAction.crearUsuario(...invitado);

			EXEC.queue(function() {
				assert.equal($("#edituser").css("visibility"), "visible", "crear un usuario con un nombre existente");
			});

			/***********************/

			EXEC.queue(function() { // click en crear usuario
				$('#mainuser button.accept').click();
			});
			userAction.crearUsuario(...gestor);

			EXEC.queue(function() { // comprobamos si se ha creado correctamente
				assert.ok($("#list-users li:contains('usuarioGestor')").length, "El usuario gestor debe estar en la lista");
			});

			/**********************/

			EXEC.queue(function() { // click en crear usuario
				$('#mainuser button.accept').click();
			});
			userAction.crearUsuario(...administrador);

			EXEC.queue(function() { // comprobamos si se ha creado correctamente
				assert.ok($("#list-users li:contains('usuarioAdmin')").length, "El usuario admin debe estar en la lista");
			});


			/***********VER USUARIO***************/

			userAction.verListaUsuarios();

			userAction.verUsuario("usuarioInvitado");
			EXEC.queue(function() { // comprobamos los valores del usuario
				assert.ok($("div.sweet-alert.visible p li:contains('usuarioInvitado')"), "nick usuarioInvitado");
				assert.ok($("div.sweet-alert.visible p li:contains('Invitado')"), "rol usuarioInvitado");
			});

			userAction.verUsuario("usuarioGestor");
			EXEC.queue(function() { // comprobamos los valores del usuario
				assert.ok($("div.sweet-alert.visible p li:contains('usuarioGestor')"), "nick usuarioGestor");
				assert.ok($("div.sweet-alert.visible p li:contains('Gestor')"), "rol usuarioGestor");
			});

			userAction.verUsuario("usuarioAdmin");
			EXEC.queue(function() { // comprobamos los valores del usuario
				assert.ok($("div.sweet-alert.visible p li:contains('usuarioAdmin')"), "nick usuarioAdmin");
				assert.ok($("div.sweet-alert.visible p li:contains('Administrador')"), "rol usuarioAdmin");
			});


			/****************LOGIN*******************/

			userAction.cerrarSesion();

			userAction.ingresarComo("usuarioInvitado","passInvitado");
			EXEC.queue(function() {
				assert.equal($("#maincompetition").css("visibility"), "visible", "Ventana principal al loguearse con usuarioInvitado");
			});			
			userAction.cerrarSesion();

			userAction.ingresarComo("usuarioGestor","passGestor");
			EXEC.queue(function() {
				assert.equal($("#maincompetition").css("visibility"), "visible", "Ventana principal al loguearse con usuarioGestor");
			});	
			userAction.cerrarSesion();

			userAction.ingresarComo("usuarioAdmin","passAdmin");
			EXEC.queue(function() {
				assert.equal($("#maincompetition").css("visibility"), "visible", "Ventana principal al loguearse con usuarioAdmin");
			});	
			userAction.cerrarSesion();	

			userAction.ingresarComoAdmin();		


			/***********MODIFICAR USUARIO***************/

			userAction.verListaUsuarios();

			EXEC.queue(function() { //click en editar usuario
				$("#list-users li:contains('usuarioInvitado')").find(".icon.edit").click();
			});
			EXEC.queue(function() { // comprobamos los valores del usuario
				assert.equal($("#user-nick").val(), "usuarioInvitado", "nick");
				assert.ok($("#user-pass").val().length, "existe alguna contraseña");
				assert.equal($("#user-rol option:selected").val(), 0, "rol");
			});

			userAction.verListaUsuarios();

			EXEC.queue(function() { //click en editar usuario
				$("#list-users li:contains('usuarioGestor')").find(".icon.edit").click();
			});
			EXEC.queue(function() { // comprobamos los valores del usuario
				assert.equal($("#user-nick").val(), "usuarioGestor", "nick");
				assert.ok($("#user-pass").val().length, "existe alguna contraseña");
				assert.equal($("#user-rol option:selected").val(), 1, "rol");
			});

			userAction.verListaUsuarios();

			EXEC.queue(function() { //click en editar usuario
				$("#list-users li:contains('usuarioAdmin')").find(".icon.edit").click();
			});
			EXEC.queue(function() { // comprobamos los valores del usuario
				assert.equal($("#user-nick").val(), "usuarioAdmin", "nick");
				assert.ok($("#user-pass").val().length, "existe alguna contraseña");
				assert.equal($("#user-rol option:selected").val(), 2, "rol");
			});

			userAction.modificarUsuario("", "usuarioAdmin", 2);

			EXEC.queue(function() {
				assert.equal($("#edituser").css("visibility"), "visible", "guardar la modificación sin nick puesto");
			});			

			userAction.modificarUsuario("usuarioGestor", "unacontra", 2);

			EXEC.queue(function() {
				assert.equal($("#edituser").css("visibility"), "visible", "guardar la modificación con un nombre existente");
			});	

			userAction.modificarUsuario("otroUsuarioGestor", "otraContra", 1);

			userAction.verListaUsuarios();

			userAction.verUsuario("otroUsuarioGestor");

			EXEC.queue(function() { // comprobamos los valores del usuario
				assert.ok($("div.sweet-alert.visible p li:contains('otroUsuarioGestor')"), "nick otroUsuarioGestor");
				assert.ok($("div.sweet-alert.visible p li:contains('Gestor')"), "rol otroUsuarioGestor");
			});	

			EXEC.queue(function() { //click en editar usuario
				$("#list-users li:contains('otroUsuarioGestor')").find(".icon.edit").click();
			});
			EXEC.queue(function() { // comprobamos los valores del usuario
				assert.equal($("#user-nick").val(), "otroUsuarioGestor", "nuevo nick en edicion");
				assert.equal($("#user-pass").val(),"otraContra", "nueva contraseña en edicion");
				assert.equal($("#user-rol option:selected").val(), 1, "nuevo rol en edicion");
			});			


			/***********ELIMINAR USUARIO***************/

			userAction.verListaUsuarios();

			//ELIMINAMOS usuarioInvitado
			EXEC.queue(function() {
				$("#list-users li:contains('usuarioInvitado')").find(".icon.trash").click();
			});

			EXEC.queue(function() { // comprobamos que sale un mensaje de alerta y aceptamos la eliminación
				assert.ok($("div.sweet-alert.visible").length, "debe de salir un alert al borrar");
				$("div.sweet-alert.visible button.confirm").click();
			});

			EXEC.queue(function() {
				assert.notOk($("#list-users li:contains('usuarioInvitado')").length, "usuarioInvitado no debe estar en la lista");
			});

			//ELIMINAMOS usuarioGestor		
			EXEC.queue(function() {
				$("#list-users li:contains('usuarioGestor')").find(".icon.trash").click();
			});

			EXEC.queue(function() { // comprobamos que sale un mensaje de alerta y aceptamos la eliminación
				assert.ok($("div.sweet-alert.visible").length, "debe de salir un alert al borrar");
				$("div.sweet-alert.visible button.confirm").click();
			});

			EXEC.queue(function() {
				assert.notOk($("#list-users li:contains('usuarioGestor')").length, "usuarioGestor no debe estar en la lista");
			});

			//ELIMINAMOS usuarioAdmin			
			EXEC.queue(function() {
				$("#list-users li:contains('otroUsuarioGestor')").find(".icon.trash").click();
			});

			EXEC.queue(function() { // comprobamos que sale un mensaje de alerta y aceptamos la eliminación
				assert.ok($("div.sweet-alert.visible").length, "debe de salir un alert al borrar");
				$("div.sweet-alert.visible button.confirm").click();
			});

			EXEC.queue(function() { 
				assert.notOk($("#list-users li:contains('otroUsuarioGestor')").length, "otroUsuarioGestor no debe estar en la lista");
			});
			EXEC.queue(function() {
				done(); // the last action must to have this call at the end.
			});

			userAction.cerrarSesion();

			EXEC.run();
		});



	}



	return {
		run: run
	}

});