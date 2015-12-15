define(function() {



	function ingresarComoAdmin() {

		EXEC.queue(function() { // se mete en la cola ordenada de acciones sobre la interfaz
			//write user and password
			$('#login-user').val("admin");
			$('#login-pass').val("admin");
			$('#login button.accept').click();
		});

	}

	function ingresarComo(nick, pass) {

		//write user and password
		EXEC.queue(function() { // se mete en la cola ordenada de acciones sobre la interfaz

			$('#login-user').val(nick);
			$('#login-pass').val(pass);
			$('#login button.accept').click();
		});

	}

	function cerrarSesion() {

		EXEC.queue(function() { // se mete en la cola ordenada de acciones sobre la interfaz
			$("#mcontent li[data-icon='remove']").click();
		});
	}


	function verUsuario(nombre) {

		EXEC.queue(function() {
			$("#list-users li:contains('" + nombre + "')").find(".list-container-text").children().click();
		});

	}

	function verListaUsuarios() {

		EXEC.queue(function() {
			$("#usersMleft").click();
		});

	}

	function modificarUsuario(nick, pass, rol) {
		crearUsuario(nick, pass, rol);
	}

	function crearUsuario(nick, pass, rol) {
		EXEC.queue(function() {
			$('#user-nick').val(nick);
			$('#user-pass').val(pass);
			$('#user-rol').val(rol);
			$('#edituser button.accept').click();
		});
	}


	return {
		ingresarComoAdmin: ingresarComoAdmin,
		ingresarComo: ingresarComo,
		verUsuario: verUsuario,
		verListaUsuarios: verListaUsuarios,
		modificarUsuario: modificarUsuario,
		crearUsuario: crearUsuario,
		cerrarSesion: cerrarSesion

	}

});