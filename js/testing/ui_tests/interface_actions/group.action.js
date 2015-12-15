define(function() {


	function verGrupo(nombre) {

		EXEC.queue(function() {
			$("#list-groups li:contains('" + nombre + "')").find("details").children().click();
		});

	}

	function verListaGrupos() {

		EXEC.queue(function() {
			$("#groupsMleft").click();
		});

	}

	function modificarGrupo(nombre, subgrupoDe) {
		crearGrupo(nombre, subgrupoDe);
	}

	function crearGrupo(nombre, subgrupoDe) {
		EXEC.queue(function() {
			$('#nameGroup').val(nombre);
			$("#selectGroup option").filter(function() {
				return this.text == subgrupoDe;
			}).attr('selected', true);
			$('#editgroup button.accept').click();
		});
	}

	function modoEditar(nombre) {
		EXEC.queue(function() {
			$("#list-groups li details summary:contains('" + nombre + "')").parent().siblings(".icon.edit").click();
		});
	}

	function pulsarBorrar(nombre) {
		EXEC.queue(function() {
			$("#list-groups li details summary:contains('" + nombre + "')").parent().siblings(".icon.trash").click();
		});
	}

	function getGruposSelect() {
		var values = $.map($('#selectGroup option'), function(option) {
			return option.text;
		});

		return values;
	}


	return {
		verGrupo: verGrupo,
		verListaGrupos: verListaGrupos,
		modificarGrupo: modificarGrupo,
		crearGrupo: crearGrupo,
		modoEditar: modoEditar,
		getGruposSelect : getGruposSelect,
		pulsarBorrar : pulsarBorrar

	}

});