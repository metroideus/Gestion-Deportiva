define([DAO, "app.utils","controllers/user.ctr"], function(persistence, utils,userCtr) {

	function backup() {

		$.when(persistence.dataManagement.createBackup())
			.done(function(appData) {
				console.log("DATOS:");
				console.log(appData);
				utils.writeFile(JSON.stringify(appData), "backup.bak", utils.throwError, function(locationPath) {
					utils.throwSuccess("Copia de seguridad guardada en: " + locationPath);
				});
			}).fail(function(err) {
				utils.throwError("Error exportando los datos");
			})

	}

	function restore() {

		var callBack = function() {
			var appData;
			$.when(utils.readFile("backup.bak"))
				.then(function(data) {
					appData = JSON.parse(data);
					return persistence.dataManagement.restoreBackup(appData);
				})
				.done(function() {
					utils.throwSuccess("Restauración de datos completada");
					userCtr.signOut();
				}).fail(function(err) {
					utils.throwError("Error restaurando datos");
				})
		}

		utils.throwConfirmOperation(callBack, "Al restaurar los datos, se eliminarán todos los existentes, " + 
			"incluidos los usuarios. También se cerrará la sesión");

	}


	function writePathInfo() {

		customHTML = "El directorio de aplicación para el uso de guardar/restaurar copias de seguridad es: <span class='text bold'>" +
			localStorage.getItem("rootFS") + "</span><br>El nombre de archivo para leer/guardar la copia será " +
			"<span class='text bold'>backup.bak</span>";

		$("#infoPath").html(customHTML);

	}


	return {
		backup: backup,
		restore: restore,
		writePathInfo: writePathInfo
	}


})