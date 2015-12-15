define(["interface_actions/competition.action", "interface_actions/user.action"], function(competitionAction, userAction) {

	//Competiciones para usar en el test
	var c1 = ["c1", "2016-01-01", "2016-01-01", "Club Deportivo de la UMA", "Palacio de deportes - Malaga"];
	var c2 = ["c2", "2015-01-01", "2015-10-11", "Club Nautico",	"Rio de Janeiro"]

	var run = function() {

		QUnit.module("Competiciones");
		test('Pruebas CRUD de competiciones', function(assert) {
			EXEC.clear(); // necesario usarlo en cada modulo de test para limpiar el lote de acciones.
			assert.expect(27); //number of assert to be executed (it's necessary for asynchronous operations)
			var done = assert.async();

			userAction.ingresarComoAdmin();
			

			/***********CREAR COMPETICION***************/

			EXEC.queue(function() { // click en crear competición
				$('#maincompetition button.accept').click();
			});

			competitionAction.crearCompeticion("", "2016-01-01", "2016-01-01", "Club Deportivo de la UMA",
				"Palacio de deportes - Malaga");

			EXEC.queue(function() {
				assert.equal($("#editcompetition").css("visibility"), "visible", "nombre no introducido");
			});

			competitionAction.crearCompeticion(...c1);

			EXEC.queue(function() { // comprobamos si se ha creado correctamente y luego lo borramos
				assert.ok($("#list-competitions li:contains('c1')").length, "La competición debe estar en la lista");
			});

			EXEC.queue(function() { // click en crear competición
				$('#maincompetition button.accept').click();
			});

			competitionAction.crearCompeticion("c1", "", "", "Club Deportivo de la UMA",
				"Palacio de deportes - Malaga");

			EXEC.queue(function() {
				assert.equal($("#editcompetition").css("visibility"), "visible", "crear una competición con un nombre existente");
			});



			/***********VER COMPETICION***************/

			competitionAction.verListaCompeticiones();

			competitionAction.verCompeticion("c1");

			EXEC.queue(function() { // comprobamos los valores de la competicion
				assert.equal($("#viewname").html(), "c1", "nombre");
				assert.equal($("#viewstart").html(), "2016-01-01", "fecha inicio");
				assert.equal($("#viewend").html(), "2016-01-01", "fecha finalizacion");
				assert.equal($("#vieworganizer").html(), "Club Deportivo de la UMA", "organizador");
				assert.equal($("#viewlocation").html(), "Palacio de deportes - Malaga", "lugar");
			});




			/***********SELECCION DE COMPETICION***************/

			competitionAction.verListaCompeticiones();

			EXEC.queue(function() {
				assert.equal($("#hideMenu").css("visibility"), "hidden", "Menú con secciones esta oculto");
			});	

			competitionAction.seleccionarCompeticion("c1");

			EXEC.queue(function() { 
				assert.equal($("#hideMenu").css("display"), "inline", "Menú con secciones se muestra");
			});			

			EXEC.queue(function() {
				assert.ok($("#list-competitions li:contains('c1')").hasClass('theme'), "La competición aparece seleccionada");
			});

			EXEC.queue(function() { // click en crear competición
				$('#maincompetition button.accept').click();
			});




			/***********MODIFICAR COMPETICION***************/

			competitionAction.verListaCompeticiones();

			EXEC.queue(function() { // click en crear competición
				$('#maincompetition button.accept').click();
			});

			competitionAction.crearCompeticion(...c2);

			competitionAction.verListaCompeticiones();

			EXEC.queue(function() { //click en editar la competición
				$("#list-competitions li:contains('c1')").find(".icon.edit").click();
			});

			EXEC.queue(function() { // comprobamos los valores de la competicion
				assert.equal($("#nameCompetition").val(), "c1", "nombre");
				assert.equal($("#initDate").val(), "2016-01-01", "fecha inicio");
				assert.equal($("#endDate").val(), "2016-01-01", "fecha finalizacion");
				assert.equal($("#organizer").val(), "Club Deportivo de la UMA", "organizador");
				assert.equal($("#location").val(), "Palacio de deportes - Malaga", "lugar");
			});

			competitionAction.modificarCompeticion("", "2011-01-02", "2012-01-04", "Otro club", "Otro sitio");

			EXEC.queue(function() {
				assert.equal($("#editcompetition").css("visibility"), "visible", "guardar la modificación sin nombre puesto");
			});			

			competitionAction.modificarCompeticion("c2", "2011-01-02", "2012-01-04", "Otro club", "Otro sitio");

			EXEC.queue(function() {
				assert.equal($("#editcompetition").css("visibility"), "visible", "guardar la modificación con un nombre existente");
			});	

			competitionAction.modificarCompeticion("c1", "2011-01-02", "2012-01-04", "Otro club", "Otro sitio");

			competitionAction.verListaCompeticiones();

			competitionAction.verCompeticion("c1");

			EXEC.queue(function() { // comprobamos los valores de la competicion
				assert.equal($("#viewname").html(), "c1", "nombre");
				assert.equal($("#viewstart").html(), "2011-01-02", "fecha inicio");
				assert.equal($("#viewend").html(), "2012-01-04", "fecha finalizacion");
				assert.equal($("#vieworganizer").html(), "Otro club", "organizador");
				assert.equal($("#viewlocation").html(), "Otro sitio", "lugar");
			});			


			/***********ELIMINAR COMPETICION***************/

			competitionAction.verListaCompeticiones();

			//ELIMINAMOS C1
			EXEC.queue(function() {
				$("#list-competitions li:contains('c1')").find(".icon.trash").click();
			});

			EXEC.queue(function() { // comprobamos que sale un mensaje de alerta y aceptamos la eliminación
				assert.ok($("div.sweet-alert.visible").length, "debe de salir un alert al borrar");
				$("div.sweet-alert.visible button.confirm").click();
			});

			EXEC.queue(function() {
				assert.notOk($("#list-competitions li:contains('c1')").length, "la competición c1 no debe estar en la lista");
			});

			//ELIMINAMOS C2			
			EXEC.queue(function() {
				$("#list-competitions li:contains('c2')").find(".icon.trash").click();
			});

			EXEC.queue(function() { // comprobamos que sale un mensaje de alerta y aceptamos la eliminación
				assert.ok($("div.sweet-alert.visible").length, "debe de salir un alert al borrar");
				$("div.sweet-alert.visible button.confirm").click();
			});

			EXEC.queue(function() { 
				assert.notOk($("#list-competitions li:contains('c2')").length, "la competición c2 no debe estar en la lista");
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