define(["interface_actions/competition.action", "interface_actions/user.action",
	"interface_actions/group.action"
], function(competitionAction, userAction, groupAction) {

	//Competiciones para usar en el test
	var grupoA = ["grupoA", "Ninguno"];
	var grupoB = ["grupoB", "grupoA"];
	var grupoC = ["grupoC", "grupoA"];

	var run = function() {

		QUnit.module("Grupos");
		test('Pruebas CRUD Grupos', function(assert) {
			EXEC.clear(); // necesario usarlo en cada modulo de test para limpiar el lote de acciones.
			assert.expect(44); //number of assert to be executed (it's necessary for asynchronous operations)
			var done = assert.async();

			userAction.ingresarComoAdmin();

			// creamos una competición para trabajar dentro de ella
			EXEC.queue(function() {
				$('#maincompetition button.accept').click();
			});

			competitionAction.crearCompeticion("c1", "2016-01-01", "2016-01-01", "Club Deportivo de la UMA",
				"Palacio de deportes - Malaga");

			competitionAction.seleccionarCompeticion("c1");


			/***********CREAR GRUPO***************/

			groupAction.verListaGrupos();

			EXEC.queue(function() { // click en crear
				$('#maingroup button.accept').click();
			});

			groupAction.crearGrupo("", "Ninguno");

			EXEC.queue(function() {
				assert.equal($("#editgroup").css("visibility"), "visible", "crear un grupo sin nombre");
			});

			groupAction.crearGrupo(...grupoA);

			EXEC.queue(function() { // comprobamos si se ha creado correctamente
				assert.ok($("#list-groups li:contains('grupoA')").length, "grupoA debe estar en la lista");
			});

			/***********************/

			EXEC.queue(function() { // click en crear grupo
				$('#maingroup button.accept').click();
			});
			groupAction.crearGrupo(...grupoA);

			EXEC.queue(function() {
				assert.equal($("#editgroup").css("visibility"), "visible", "crear un grupo con un nombre existente");
			});

			/***********************/

			EXEC.queue(function() { // click en crear
				$('#maingroup button.accept').click();
			});
			groupAction.crearGrupo(...grupoB);

			EXEC.queue(function() { // comprobamos si se ha creado correctamente
				assert.ok($("#list-groups li:contains('grupoB')").length, "grupoB debe estar en la lista");
			});

			/**********************/

			EXEC.queue(function() { // click en crear
				$('#maingroup button.accept').click();
			});
			groupAction.crearGrupo(...grupoC);

			EXEC.queue(function() { // comprobamos si se ha creado correctamente
				assert.ok($("#list-groups li:contains('grupoC')").length, "grupoC debe estar en la lista");
			});


			/***********VER GRUPO***************/

			groupAction.verListaGrupos();

			groupAction.verGrupo("grupoA");
			EXEC.queue(function() { // comprobamos los valores del grupoA
				assert.ok($("#list-groups li:contains('grupoA')"), "nombre grupoA");
				assert.ok($("#list-groups li:contains('grupoA')").find("li:contains('Ninguno')"), "grupo al que pertenece grupoA");
			});

			groupAction.verGrupo("grupoB");
			EXEC.queue(function() { // comprobamos los valores del grupoB
				assert.ok($("#list-groups li:contains('grupoB')"), "nombre grupoB");
				assert.ok($("#list-groups li:contains('grupoB')").find("li:contains('grupoA')"), "grupo al que pertenece grupoB");
			});

			groupAction.verGrupo("grupoC");
			EXEC.queue(function() { // comprobamos los valores del grupoC
				assert.ok($("#list-groups li:contains('grupoC')"), "nombre grupoC");
				assert.ok($("#list-groups li:contains('grupoC')").find("li:contains('grupoA')"), "grupo al que pertenece grupoC");
			});



			/***********MODIFICAR GRUPO***************/

			groupAction.verListaGrupos();

			groupAction.modoEditar("grupoA");
			EXEC.queue(function() { // comprobamos los valores
				assert.equal($('#nameGroup').val(), "grupoA", "nombre de grupoA");
				assert.equal($("#selectGroup option:selected").text(), "Ninguno", "grupo de grupoA");
				assert.notEqual(groupAction.getGruposSelect().indexOf("Ninguno"), -1, "Ninguno aparece en la lista");
				assert.equal(groupAction.getGruposSelect().indexOf("grupoB"), -1, "grupoB no aparece en la lista");
				assert.equal(groupAction.getGruposSelect().indexOf("grupoC"), -1, "Ninguno no aparece en la lista");
				assert.equal(groupAction.getGruposSelect().indexOf("grupoA"), -1, "Ninguno no aparece en la lista");

			});



			/************************grupoB**************************/
			groupAction.verListaGrupos();

			groupAction.modoEditar("grupoB");
			EXEC.queue(function() { // comprobamos los valores
				assert.equal($('#nameGroup').val(), "grupoB", "nombre de grupoB");
				assert.equal($("#selectGroup option:selected").text(), "grupoA", "grupo de grupoB");
				assert.notEqual(groupAction.getGruposSelect().indexOf("Ninguno"), -1, "Ninguno aparece en la lista");
				assert.notEqual(groupAction.getGruposSelect().indexOf("grupoA"), -1, "grupoA aparece en la lista");
				assert.notEqual(groupAction.getGruposSelect().indexOf("grupoC"), -1, "grupoC aparece en la lista");
				assert.equal(groupAction.getGruposSelect().indexOf("grupoB"), -1, "grupoB no aparece en la lista");
			});


			/************************grupoC**************************/

			groupAction.verListaGrupos();

			groupAction.modoEditar("grupoC");
			EXEC.queue(function() { // comprobamos los valores
				assert.equal($('#nameGroup').val(), "grupoC", "nombre de grupoC");
				assert.equal($("#selectGroup option:selected").text(), "grupoA", "grupo de grupoC");
				assert.notEqual(groupAction.getGruposSelect().indexOf("Ninguno"), -1, "Ninguno aparece en la lista");
				assert.notEqual(groupAction.getGruposSelect().indexOf("grupoA"), -1, "grupoA aparece en la lista");
				assert.notEqual(groupAction.getGruposSelect().indexOf("grupoB"), -1, "grupoB aparece en la lista");
				assert.equal(groupAction.getGruposSelect().indexOf("grupoC"), -1, "grupoC no aparece en la lista");
			});

			/**************otras comprobaciones de modificacion*****/

			groupAction.modificarGrupo("", "grupoA");

			EXEC.queue(function() {
				assert.equal($("#editgroup").css("visibility"), "visible", "guardar la modificación sin nombre puesto");
			});

			groupAction.modificarGrupo("grupoB", "grupoA");

			EXEC.queue(function() {
				assert.equal($("#editgroup").css("visibility"), "visible", "guardar la modificación con un nombre existente");
			});


			groupAction.modificarGrupo("otroNombreGrupo", "grupoB");

			groupAction.verListaGrupos();

			groupAction.verGrupo("otroNombreGrupo");

			EXEC.queue(function() {
				assert.ok($("#list-groups li:contains('otroNombreGrupo')"), "nombre otroNombreGrupo");
				assert.ok($("#list-groups li:contains('otroNombreGrupo')").find("li:contains('grupoB')"), "grupo al que pertenece el grupo -otroNombreGrupo-");
			});

			groupAction.modoEditar("otroNombreGrupo");
			EXEC.queue(function() { // comprobamos los valores
				assert.equal($('#nameGroup').val(), "otroNombreGrupo", "nombre de -otroNombreGrupo-");
				assert.equal($("#selectGroup option:selected").text(), "grupoB", "grupo del grupo -otroNombreGrupo-");
				assert.notEqual(groupAction.getGruposSelect().indexOf("Ninguno"), -1, "Ninguno aparece en la lista");
				assert.notEqual(groupAction.getGruposSelect().indexOf("grupoB"), -1, "grupoB aparece en la lista");
				assert.notEqual(groupAction.getGruposSelect().indexOf("grupoA"), -1, "grupoA aparece en la lista");
				assert.equal(groupAction.getGruposSelect().indexOf("otroNombreGrupo"), -1, "-otroNombreGrupo- no aparece en la lista");

			});


			/***********ELIMINAR GRUPO***************/

			groupAction.verListaGrupos();

			//ELIMINAMOS otroNombreGrupo
			groupAction.pulsarBorrar("otroNombreGrupo");

			EXEC.queue(function() { // comprobamos que sale un mensaje de alerta y aceptamos la eliminación
				assert.ok($("div.sweet-alert.visible").length, "debe de salir un alert al borrar");
				$("div.sweet-alert.visible button.confirm").click();
			});

			EXEC.queue(function() {
				assert.notOk($("#list-groups li:contains('otroNombreGrupo')").length, "-otroNombreGrupo- no debe estar en la lista");
			});

			//ELIMINAMOS grupoA y con el se debe de eliminar grupoB
			groupAction.pulsarBorrar("grupoA");

			EXEC.queue(function() { // comprobamos que sale un mensaje de alerta y aceptamos la eliminación
				assert.ok($("div.sweet-alert.visible").length, "debe de salir un alert al borrar");
				$("div.sweet-alert.visible button.confirm").click();
			});

			EXEC.queue(function() {
				assert.notOk($("#list-groups li:contains('grupoA')").length, "grupoA no debe estar en la lista");
			});

			EXEC.queue(function() {
				assert.notOk($("#list-groups li:contains('grupoB')").length, "grupoB no debe estar en la lista");
			});


			EXEC.queue(function() {
				done(); // the last action must to have this call at the end.
			});

			competitionAction.eliminarCompeticion("c1");

			userAction.cerrarSesion();

			EXEC.run();
		});



	}



	return {
		run: run
	}

});