define(function() {

	function verCompeticion(nombre) {

		EXEC.queue(function() {
			$("#list-competitions li:contains('" + nombre + "')").find(".icon.eye-open").click();
		});

	}

	function seleccionarCompeticion(nombre) {

		EXEC.queue(function() {
			$("#list-competitions li:contains('" + nombre + "')").find(".list-container-text").children().click();
		});

	}

	function verListaCompeticiones() {

		EXEC.queue(function() {
			$("#competitionsMleft").click();
		});

	}

	function modificarCompeticion(nombre, fechaInicio, fechaFin, organizador, lugar) {
		crearCompeticion(nombre, fechaInicio, fechaFin, organizador, lugar);
	}

	function crearCompeticion(nombre, fechaInicio, fechaFin, organizador, lugar) {
		EXEC.queue(function() {
			$('#nameCompetition').val(nombre);
			$('#initDate').val(fechaInicio);
			$('#endDate').val(fechaFin);
			$('#organizer').val(organizador);
			$('#location').val(lugar);
			$('#editcompetition button.accept').click();
		});
	}

	function eliminarCompeticion(nombre) {

		verListaCompeticiones();

		EXEC.queue(function() {
			$("#list-competitions li:contains('" + nombre + "')").find(".icon.trash").click();
		})
		EXEC.queue(function() {
			$("div.sweet-alert.visible button.confirm").click();
		});

	}

	return {
		crearCompeticion: crearCompeticion,
		verCompeticion: verCompeticion,
		verListaCompeticiones: verListaCompeticiones,
		modificarCompeticion: modificarCompeticion,
		seleccionarCompeticion: seleccionarCompeticion,
		eliminarCompeticion : eliminarCompeticion
	}

});