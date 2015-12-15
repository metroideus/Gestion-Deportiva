define([DAO, "app.utils"], function(persistence, utils) {

	var generate = function() {
		var arTests = null;
		var arGroups = null;
		var i, j;
		var cont = 0;
		var aux, text;
		var doc = new jsPDF('p', 'pt');
		var spaceY = 60;
		var spaceX = 40;
		var idCompetition = Number(sessionStorage.getItem("idCompSelected"));

		$.when(persistence.competition.selectById(idCompetition), persistence.group.selectIdNameByCompetition(idCompetition),
				persistence.test.selectIdNameByCompetition(idCompetition))
			.then(function(competition, allGroups, allTests) {

				doc.setFontSize(18);
				spaceY = writeText(doc, competition.name, spaceX, spaceY);

				doc.setFontSize(12);

				spaceY += 10;
				if (competition.location !== "" && competition.location !== null) {
					spaceY = writeText(doc, "Lugar: " + competition.location, spaceX, spaceY + 10);
				}

				if (competition.start !== "" && competition.start !== null) {
					spaceY = writeText(doc, "Fecha comienzo: " + competition.start, spaceX, spaceY);
				}

				if (competition.end !== "" && competition.end !== null) {
					spaceY = writeText(doc, "Fecha Finalización: " + competition.end, spaceX, spaceY);
				}

				if (competition.organizer !== "" && competition.organizer !== null) {
					spaceY = writeText(doc, "Organizador: " + competition.organizer, spaceX, spaceY);
				}

				if (competition.logo !== "" && competition.logo !== null) {
					doc.addImage(competition.logo, 'JPEG', 470, 50, 70, 70); //addImage currently only supports format 'JPEG'
				} else {
					$.get("img/defaultPDFimage.base64", function(data) { //relative path to caller page. In this case, relative to index.html
						doc.addImage(data, 'JPEG', 470, 50, 70, 70);
					});
				}

				doc.autoTable([], [], {
					startY: spaceY - 30
				}); // this is a trick for to use after doc.autoTableEndPosY() without write a table previously

				if ($("span[name='allTests']").hasClass("check-empty")) {
					arTests = JSON.parse(sessionStorage.getItem("testPdfFilter"));
					if (arTests.length === 0) {
						utils.throwError("No se ha seleccionado ninguna prueba");
					}
				} else {
					arTests = convertTestListToArray(allTests);
				}
				if ($("span[name='allGroups']").hasClass("check-empty")) {
					arGroups = JSON.parse(sessionStorage.getItem("groupPdfFilter"));
					if (arGroups.length === 0) {
						utils.throwError("No se ha seleccionado ningun grupo");
					}
				} else {
					arGroups = convertGroupListToArray(allGroups);
				}

				for (i = 0; i < arTests.length; i++) {
					for (j = 0; j < arGroups.length; j++) {
						(function(i, j) {
							$.when(persistence.record.selectByTestByGroup(arTests[i].id, arGroups[j].id))
								.done(function(dataList) {

									doc.setTextColor(0, 0, 255);
									writeText(doc, "Prueba: " + arTests[i].name, spaceX, doc.autoTableEndPosY() + 60);
									spaceY = writeText(doc, "Grupo: " + arGroups[j].name, spaceX + 350, doc.autoTableEndPosY() + 60);

									aux = createTable(dataList);
									doc.autoTable(aux.columns, aux.rows, getJsPDFOptions(doc, spaceY - 15));

									cont++;
									if (cont == (arTests.length * arGroups.length)) {
										if (sessionStorage.getItem("device") === "mobile") {
											var pdfContent = doc.output();
											var buffer = new ArrayBuffer(pdfContent.length);
											var array = new Uint8Array(buffer);
											var k;
											for (k = 0; k < pdfContent.length; k++) {
												array[k] = pdfContent.charCodeAt(k);
											}
											utils.writeFile(buffer, competition.name + "-report.pdf", utils.throwError,
												function(locationPath) {
													utils.throwSuccess("PDF guardado en: " + locationPath)
												});
										} else {
											doc.save('table.pdf');
										}
									}
								}).fail(function(err) {
									utils.throwError(err);
								})

						}(i, j))
					}

				}

				if(arTests.length === 0 || arGroups.length === 0){
					utils.throwError("No se puede generar el pdf porque no existen grupos o pruebas creadas");
				}
			}).fail(function(err) {
				utils.throwError(err);
			})

	}

	var config = function() {
		sessionStorage.setItem("groupPdfFilter", JSON.stringify(new Array())); //configure the set of selected items to empty
		sessionStorage.setItem("testPdfFilter", JSON.stringify(new Array()));
	}

	var edit = function(section) {

		var sectionEnum = ["group", "test"];
		if (sectionEnum.indexOf(section) == -1) {
			throwError("Error interno: no se ha seleccionado el controlador adecuado");
		} else {
			var sessionVar = section + "PdfFilter";
			var selectedItems;
			$.when(persistence[section].selectIdNameByCompetition(sessionStorage.getItem("idCompSelected")))
				.done(function(l) {
					selectedItems = JSON.parse(sessionStorage.getItem(sessionVar));
					if (selectedItems.length == 0) {
						utils.throwGroupTestList(sessionVar, l, null);
					} else {
						utils.throwGroupTestList(sessionVar, l, selectedItems);
					}

				})
				.fail(function(err) {
					utils.throwError(err);
				});
		}

	}

	var allGroups = function() {
		if ($("span[name='allGroups']").hasClass("check-empty")) {

			$("span[name='allGroups']").removeClass('check-empty').addClass('check');
			$("button[name='allGroups']").removeClass('accept').addClass('disabled').prop('disabled', true);
		} else {

			$("span[name='allGroups']").removeClass('check').addClass('check-empty');
			$("button[name='allGroups']").removeClass('disabled').addClass('accept').prop('disabled', false);
		}

	}


	var allTests = function() {
		if ($("span[name='allTests']").hasClass("check-empty")) {

			$("span[name='allTests']").removeClass('check-empty').addClass('check');
			$("button[name='allTests']").removeClass('accept').addClass('disabled').prop('disabled', true);
		} else {

			$("span[name='allTests']").removeClass('check').addClass('check-empty');
			$("button[name='allTests']").removeClass('disabled').addClass('accept').prop('disabled', false);
		}

	}



	function writePathInfo() {

		customHTML = "El directorio de aplicación donde se guardará el PDF es: <span class='text bold'>" +
			localStorage.getItem("rootFS") + "</span>";

		$("#pdf-infoPath").html(customHTML);

	}



	/****************************************/
	/*********PRIVATE FUNCTIONS**************/
	/****************************************/

	/**
	 * Retorna la marca formateada para su representación textual
	 * @param  {Mark} mark - marca para obtener su representación
	 * @param  {string} resultType tipo de marca
	 * @return {string}
	 */
	function formatMark(mark, resultType) {
		if (mark != "") {
			if (resultType == "numeric" || resultType == "distance") {
				mark = mark.quantity;
			} else {
				mark = mark.hours + "h " + mark.minutes + "m " + mark.seconds + "s";
			}
		}
		return mark;
	}


	/**
	 * Retorna la mejor marca de una lista de marcas de tipo distancia o numérica
	 * @param  {List<Mark>} marks
	 * @param  {string} bestMark - Indica cual es la mejor marca ("h" o "l").
	 * @return {Mark}
	 */
	function getQuantityMMP(marks, bestMark) {
		if (marks.length == 0)
			throw new Error("List of marks is empty");

		var i, pos = 0;
		var res = marks.item(0).quantity;

		for (i = 0; i < marks.length; i++) {
			if ((bestMark == "h" && marks.item(i).quantity > res) || (bestMark == "l" && marks.item(i).quantity < res)) {
				res = marks.item(i).quantity;
				pos = i;
			}
		}

		return marks.item(pos);
	}


	/**
	 * Retorna la mejor marca de una lista de marcas de tipo tiempo
	 * @param  {List<Mark>} marks
	 * @param  {string} bestMark - Indica cual es la mejor marca ("h" o "l").
	 * @return {Mark}
	 */
	function getTimeMMP(marks, bestMark) {
		if (marks.length == 0)
			throw new Error("List of marks is empty");

		var d = new Date();
		var i, pos = 0;
		var res = new Date();

		res.setHours(marks.item(0).hours, marks.item(0).minutes, Math.floor(marks.item(0).seconds), (marks.item(0).seconds) % 1);
		for (i = 0; i < marks.length; i++) {
			d.setHours(marks.item(i).hours, marks.item(i).minutes, Math.floor(marks.item(i).seconds), (marks.item(i).seconds) % 1);
			if ((bestMark == "h" && d > res) || (bestMark == "l" && d < res)) {
				res = d;
				pos = i;
			}
		}

		return marks.item(pos);
	}

	/**
	 * Retorna la marca de un intento concreto
	 * @param  {integer} numberAttempt intento que se desea obtener
	 * @param  {List<Mark>} lMarks - Lista de marcas para buscar el intento
	 * @return {Mark}
	 */
	function getAttempt(numberAttempt, lMarks) {

		var i = 0;
		var ok = false;
		var res = "";

		if (lMarks.length > 0) {
			while (i < lMarks.length && !ok) {
				if (lMarks.item(i).attempt == numberAttempt) {
					res = lMarks.item(i);
					ok = true;
				} else {
					i++;
				}
			}
		}
		return res;
	}

	/**
	 * Crea una fila de una tabla del pdf a generar
	 * @param  {string} resultType - Tipo de resultado (distance, numeric o time)
	 * @param  {string} modalityType - Tipo de prueba (individual o equipo)
	 * @param  {string} bestMark     ("h" o "l")
	 * @param  {integer} rating - posición en la prueba
	 * @param  {integer} points - puntos de la clasificación
	 * @param  {Object} row - Participante o equipo
	 * @return {Array} Fila construida en un array para jsPDF
	 */
	function createRow(resultType, modalityType, bestMark, rating, points, row) {
		var i = 0;
		var ar = new Array();
		var ok = false;
		var aux;

		//Importante mantener el orden de los push en el array
		if (modalityType === "single") {
			ar.push(row.dorsal);
			ar.push(row.surname);
		}
		ar.push(row.name);
		if (modalityType === "single") {
			ar.push(row.birthdate);
		}
		if (row.specificOrRandom == "s") {
			ar.push("elegida");
		} else {
			ar.push("sorteo");
		}

		aux = getAttempt(1, row.listMarks);
		ar.push(formatMark(aux, resultType));

		aux = getAttempt(2, row.listMarks);
		ar.push(formatMark(aux, resultType));

		if (resultType == "distance" || "numeric") {
			aux = getQuantityMMP(row.listMarks, bestMark);
			ar.push(formatMark(aux, resultType));
		} else if (resultType == "time") {
			aux = getTimeMMP(row.listMarks, bestMark);
			ar.push(formatMark(aux, resultType));
		}

		ar.push(rating);
		ar.push(points);

		return ar;
	}

	/** Crea y devuelve una tabla con los datos */
	function createTable(dataList) {

		var i;
		var columns = new Array();
		var rows = new Array();
		var table = {};
		var orderedRecords;

		if (dataList.type == "single") {
			columns.push("Dorsal");
			columns.push("Apellidos");
		}
		columns.push("Nombre");

		if (dataList.type == "single") {
			columns.push("F. Nacimiento");
		}

		columns.push("Asignación");
		columns.push("Intento 1");
		columns.push("Intento 2");
		columns.push("MMP");
		columns.push("Puesto");
		columns.push("Puntos");

		if (dataList.result == "distance" || dataList.result == "numeric") {
			orderedRecords = utils.orderListByQuantityMark(dataList.records, dataList.bestMark);
		} else if (dataList.result == "time") {
			orderedRecords = utils.orderListByTimeMark(dataList.records, dataList.bestMark);
		}

		for (i = 0; i < dataList.records.length; i++) {
			rows[i] = createRow(dataList.result, dataList.type, dataList.bestMark, i + 1, dataList.records.length - i, orderedRecords[i]);
		}

		table.columns = columns;
		table.rows = rows;

		return table;
	}

	/**
	 * Escribe un texto en el documento pdf y devuelve la posición Y que queda justo debajo del texto escrito.
	 * @param  {Object} doc - documento jsPDF
	 * @param  {string} text - texto a escribir
	 * @param  {integer} spaceX - Desplazamiento horizontal
	 * @param  {integer} actualSpaceY - Desplazamiento vertical
	 * @return {integer} posición Y
	 */
	function writeText(doc, text, spaceX, actualSpaceY) {

		doc.text(text, spaceX, actualSpaceY);
		return (doc.splitTextToSize(text, 595).length * 20) + actualSpaceY;
	}

	/** Opciones de configuración del documento jsPDF */
	function getJsPDFOptions(doc, offset) {
		var obj = {
			startY: offset,
			styles: {
				fontSize: 9,
				overflow: 'linebreak'
			},
			pageBreak: 'avoid',
			margin: {
				horizontal: 10
			},
			tableWidth: 'auto'
		}
		return obj;
	}

	function convertTestListToArray(l) {
		var i;
		var ar = new Array();
		for (i = 0; i < l.length; i++) {
			ar.push(l.item(i));
			ar[i].id = l.item(i).idTest;
		}
		return ar;

	}

	function convertGroupListToArray(l) {
		var i;
		var ar = new Array();
		for (i = 0; i < l.length; i++) {
			ar.push(l.item(i));
			ar[i].id = l.item(i).idGroup;
		}
		return ar;

	}


	return {
		generate: generate,
		edit: edit,
		config: config,
		allGroups: allGroups,
		allTests: allTests,
		writePathInfo: writePathInfo
	}


})