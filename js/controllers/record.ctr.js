define(["classes/team", DAO, "app.utils"], function(teamClass, persistence, utils) {

  function isNumeric(n) {
    if (isNaN(n) || n % 1 != 0 || n === "") { // if isn't a number or is a decimal
      return false;
    }
    return true;
  }

  function isDistance(n) {
    if (isNaN(n) || n === "") { // if isn't a number
      return false;
    }
    return true;
  }

  function isTime(h, m, s) {
    if(h === "" && m === "" && s === ""){
      return false;
    }

    if (isNaN(h) || isNaN(m) || isNaN(s) || h % 1 != 0 || m % 1 != 0) { // if isn't a time format or hours and minutes are decimal...
      return false;
    }
    return true;
  }

  function throwEditMarkQuantity(oldValue, callBack) {

    swal({
        title: "Editar marca",
        type: "input",
        inputValue: oldValue,
        showCancelButton: true,
        closeOnConfirm: false,
        animation: "slide-from-top"
      },
      function(inputValue) {
        if (inputValue === false) return false;

        if (inputValue === "") {
          swal.showInputError("Escribe algún valor para esta marca");
          return false;
        } else if (sessionStorage.getItem("resultTest") == "numeric" && !isNumeric(inputValue)) {
          swal.showInputError("Escribe un valor numérico");
          return false;
        } else if (sessionStorage.getItem("resultTest") == "distance" && !isDistance(inputValue)) {
          swal.showInputError("Escribe un valor de tipo distancia");
          return false;
        }

        callBack(Number(inputValue));
      });

    $('.sweet-alert').find("input[type='text']").attr('maxlength', 10);

  }

  function throwEditMarkTime(oldH, oldM, oldS, callBack) {

    var customHTML = "<input type='text' id='record-swal-h'>" +
      "<input type='text' id='record-swal-m'>" +
      "<input type='text' id='record-swal-s'>";

    swal({
        title: "Editar marca",
        text: customHTML,
        showCancelButton: true,
        closeOnConfirm: false,
        animation: "slide-from-bottom",
        html: true
      },
      function() {
        if (!isTime($("#record-swal-h").val(), $("#record-swal-m").val(), $("#record-swal-s").val())) {
          swal.showInputError("Escribe un valor de tipo tiempo correcto");
          return false;
        }

        callBack(Number($("#record-swal-h").val()), Number($("#record-swal-m").val()), Number($("#record-swal-s").val()));
      });

    $("#record-swal-h").val(oldH);
    $("#record-swal-m").val(oldM);
    $("#record-swal-s").val(oldS);

    $("#record-swal-h").attr('maxlength', 3).attr('placeholder', 'horas');
    $("#record-swal-m").attr('maxlength', 2).attr('placeholder', 'minutos');
    $("#record-swal-s").attr('maxlength', 6).attr('placeholder', 'segundos');



  }

  function getHTMLTimeMMP(marks, bestMark) {
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

    return "<li value=" + marks.item(pos).idMark + ">" + "Intento " + marks.item(pos).attempt + ": " +
      marks.item(pos).hours + "h " + marks.item(pos).minutes + "m " + marks.item(pos).seconds + "s" +
      "<span class='icon trash list-button-summary' onclick='records.deleteMark(this)'></span>" +
      "<span class='icon edit list-button-summary' onclick='records.editMarkTime(this," + marks.item(pos).hours + "," +
      marks.item(pos).minutes + "," + marks.item(pos).seconds + ")'></span></li>";
  }

  function getHTMLQuantityMMP(marks, bestMark) {
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

    return "<li value=" + marks.item(pos).idMark + ">" + "Intento " + marks.item(pos).attempt + ": " + marks.item(pos).quantity +
      "<span class='icon trash list-button-summary' onclick='records.deleteMark(this)'></span>" +
      "<span class='icon edit list-button-summary' onclick='records.editMarkQuantity(this," + marks.item(pos).quantity + ")'></span></li>";
  }


  function orderListBySurname(ar, order) {
    function compare(a, b) {
      if (a.surname < b.surname) {
        return -1;
      } else if (a.surname > b.surname) {
        return 1;
      }
      return 0;
    }
    if (order == "desc") {
      return ar.sort(compare).reverse();
    } else {
      return ar.sort(compare);
    }

  }


  var saveFilter = function() {
    var selectedGroup, selectedTest;

    $("#record-selectGroup").val() == "none" ? selectedGroup = null : selectedGroup = Number($("#record-selectGroup").val());
    $("#record-selectTest").val() == "" ? selectedTest = null : selectedTest = Number($("#record-selectTest").val());

    if (selectedTest != null) { // if there is some test selected...
      sessionStorage.setItem("idTest", selectedTest);
      sessionStorage.setItem("idGroup", selectedGroup);
      //puts into subtitle of header the name of test  and the filtered group
      if (selectedGroup == null) {
        $("div[name='record-subtitle-info']").html("<h6>Todos los grupos - " + $("#record-selectTest option:selected").text() + "</h6>");
      } else {
        $("div[name='record-subtitle-info']").html("<h6>" + $("#record-selectGroup option:selected").text() + " - " + $("#record-selectTest option:selected").text() + "</h6>");
      }

      sessionStorage.setItem("MMP", "false");
      $("#records .icon.star-empty").removeClass("red");
      Lungo.Router.article("records", "viewrecord");

    } else { //if there isn't any test selected
      utils.throwError("No existen pruebas en la competición");
    }
  }


  //Función para activar o desactivar el filtro de MMP al pulsar el botón del menú.
  var setViewMMP = function() {
    if (sessionStorage.getItem("MMP") == "true") {
      sessionStorage.setItem("MMP", "false");
      $("#records .icon.star-empty").removeClass("red");
    } else {
      sessionStorage.setItem("MMP", "true");
      $("#records .icon.star-empty").addClass("red");
    }
    viewRecords();
  }

  var viewRecords = function(order) { //order is an optional parameter for ordering the list
    var selectedTest = Number(sessionStorage.getItem("idTest"));
    var selectedGroup = (sessionStorage.getItem("idGroup") == "null" ? null : sessionStorage.getItem("idGroup"));

    $.when(persistence.record.selectByTestByGroup(selectedTest, selectedGroup), persistence.test.selectById(Number(sessionStorage.getItem("idTest"))))
      .done(function(dataList, test) {
        var i, j;
        var aux;
        var rolUser = (JSON.parse(sessionStorage.getItem("loginData"))).rol;

        sessionStorage.setItem("typeTest", dataList.type);
        sessionStorage.setItem("resultTest", dataList.result);
        if (dataList.type == "team") {
          $("#record-subtitle").html("Lista de registros (equipos)");
          $("#records [data-icon='arrow-down']").css("display", "none");
          $("#records [data-icon='arrow-up']").css("display", "none");
        } else {
          $("#record-subtitle").html("Lista de registros (participantes)");
          $("#records [data-icon='arrow-down']").css("display", "inline");
          $("#records [data-icon='arrow-up']").css("display", "inline");
        }

        Lungo.dom("#list-records").empty(); //clean the list
        for (i = 0; i < dataList.records.length; i++) { // recorre todos los registros y va añadiendo uno a uno a la vista
          if (dataList.records[i].specificOrRandom == "s") {
            img = "img-hand";
          } else {
            img = "img-dice";
          }

          if (order == "mark") {
            if (dataList.result == "numeric" || dataList.result == "distance") {
              dataList.records = utils.orderListByQuantityMark(dataList.records, test.bestMark);
            } else {
              dataList.records = utils.orderListByTimeMark(dataList.records, test.bestMark);
            }
          } else if (order == "surname-desc") {
            dataList.records = orderListBySurname(dataList.records, "desc");
          } else if (order == "surname-asc") {
            dataList.records = orderListBySurname(dataList.records, "asc");
          }

          //construction of summary and action buttons
          aux = "<li value='" + dataList.records[i].idAsignedTest + "'>";

          if (rolUser !== 0) {
            aux = aux + "<span class='icon trash list-button-summary' onclick='records.delete(this)'></span><img class='" +
              img + " list-button-summary'>";
          }
          aux = aux + "<details><summary>";
          if (dataList.type == "team") {
            aux = aux + dataList.records[i].name + "</summary><ul>";

          } else if (dataList.type == "single") {
            aux = aux + dataList.records[i].surname + ", " + dataList.records[i].name + "</summary><ul>";
          }

          //construction of list of marks.
          if (dataList.result == "time") {
            if (sessionStorage.getItem("MMP") == "true") {
              aux = aux + getHTMLTimeMMP(dataList.records[i].listMarks, test.bestMark);
            } else {
              for (j = 0; j < dataList.records[i].listMarks.length; j++) {
                aux = aux + "<li value=" + dataList.records[i].listMarks.item(j).idMark + ">" + "Intento " +
                  dataList.records[i].listMarks.item(j).attempt + ": " + dataList.records[i].listMarks.item(j).hours + "h " +
                  dataList.records[i].listMarks.item(j).minutes +
                  "m " + dataList.records[i].listMarks.item(j).seconds + "s";
                if (rolUser !== 0) {
                  aux = aux + "<span class='icon trash list-button-summary' onclick='records.deleteMark(this)'></span>" +
                    "<span class='icon edit list-button-summary' onclick='records.editMarkTime(this," + dataList.records[i].listMarks.item(j).hours + "," +
                    dataList.records[i].listMarks.item(j).minutes + "," + dataList.records[i].listMarks.item(j).seconds + ")'></span>";
                }
                aux = aux + "</li>";

              }
            }

          } else if (dataList.result == "numeric" || dataList.result == "distance") {
            if (sessionStorage.getItem("MMP") == "true") {
              aux = aux + getHTMLQuantityMMP(dataList.records[i].listMarks, test.bestMark);
            } else {
              for (j = 0; j < dataList.records[i].listMarks.length; j++) {
                aux = aux + "<li value=" + dataList.records[i].listMarks.item(j).idMark + ">" +
                  "Intento " + dataList.records[i].listMarks.item(j).attempt + ": " + dataList.records[i].listMarks.item(j).quantity;
                if (rolUser !== 0) {
                aux = aux + "<span class='icon trash list-button-summary' onclick='records.deleteMark(this)'></span>" +
                  "<span class='icon edit list-button-summary' onclick='records.editMarkQuantity(this," + dataList.records[i].listMarks.item(j).quantity + ")'></span>";
                }
                aux = aux + "</li>";
              }
            }

          }

          aux = aux + "</ul></details></li>";

          if (dataList.records[i].listMarks.length > 0) {
            Lungo.dom("#list-records").append(aux);
          }

        } // end for


      }).fail(function(err) {
        utils.throwError(err);
      });

  }

  //Configura los selectores de grupo y pruebas para filtrar las acciones
  var setGroupTestSelection = function() {

    utils.cleanSelects("mainrecord");
    $("#subtitle-info").html("");
    $.when(persistence.group.selectIdNameByCompetition(sessionStorage.getItem("idCompSelected")))
      .then(function(l) { //"l" list of groups

        utils.createHTMLOptionsGroup("record-selectGroup", l, false);
        $("#record-selectGroup").prepend('<option value="none">Todos los grupos</option>');

        return persistence.test.selectIdNameByCompetition(Number(sessionStorage.getItem("idCompSelected")));

      }).done(function(l) { // "l" list of tests
        utils.createHTMLOptionsTest("record-selectTest", l, false);
      }).fail(function(err) {
        utils.throwError(err);
      });
  }

  var modeCreate = function() {
    Lungo.Router.article("records", "createrecord");
    var options = "";
    var selectedGroup = sessionStorage.getItem("idGroup");

    utils.cleanSelects("createrecord");
    utils.cleanInputs("createrecord");

    if (sessionStorage.getItem("resultTest") == "time") {
      $("#record-numericMark").addClass("element-hidden");
      $("#record-timeMark").removeClass("element-hidden");
    } else {
      $("#record-numericMark").removeClass("element-hidden");
      $("#record-timeMark").addClass("element-hidden");
    }

    if (selectedGroup == "null") {
      selectedGroup = null;
    } else {
      selectedGroup = Number(selectedGroup);
    }

    $.when(persistence.record.selectIdNameByAsignedTestByGroup(Number(sessionStorage.getItem("idTest")), selectedGroup)) //select teams/competitors that have asigned that test and optionally by group
      .done(function(l) {

        if (sessionStorage.getItem("typeTest") == "team") {
          $("#record-titleTeamCompetitor").html("Equipo");
          //creation of options
          for (i = 0; i < l.length; i++) {
            options = options + '<option value=' + l.item(i).idAsignedTest + '>' + l.item(i).name + '</option>';
          }
          $("#record-selectTeamCompetitor").html(options);

        } else {
          $("#record-titleTeamCompetitor").html("Participante");
          //creation of options
          for (i = 0; i < l.length; i++) {
            options = options + '<option value=' + l.item(i).idAsignedTest + '>' + l.item(i).name + ', ' +
              l.item(i).surname + '</option>';
          }
          $("#record-selectTeamCompetitor").html(options);
        }
        if (l.length == 0) { //If there isn't any competitor/team...
          utils.throwWarning("No existe ningún participante/equipo con esta prueba asignada");
          Lungo.Router.article("records", "viewrecord");
        }
      }).fail(function(err) {
        utils.throwError(err);
      })

  }

  var save = function() {
    var h, m, s, n, asignedTest;

    try {

      if ($("#record-selectTeamCompetitor").length == 0) {
        throw new Error("No existe ningún participante/equipo con esta prueba asignada");
      }

      asignedTest = Number($("#record-selectTeamCompetitor").val());

      if (sessionStorage.getItem("resultTest") == "time") {

        h = $("#record-timeMark input[name='hours']").val();
        m = $("#record-timeMark input[name='minutes']").val();
        s = $("#record-timeMark input[name='seconds']").val();

        if (!isTime(h, m, s)) {
          throw new Error("Error en el valor de la marca");
        } else {
          persistence.mark.insertTime(Number(h), Number(m), Number(s), asignedTest);
        }
      } else if (sessionStorage.getItem("resultTest") == "numeric") {

        n = $("#record-numericMark input[name='num']").val();

        if (!isNumeric(n)) {
          throw new Error("Error en el valor de la marca");
        } else {
          persistence.mark.insertNumeric(Number(n), asignedTest);
        }

      } else if (sessionStorage.getItem("resultTest") == "distance") {

        n = $("#record-numericMark input[name='num']").val();

        if (!isDistance(n)) {
          throw new Error("Error en el valor de la marca");
        } else {
          persistence.mark.insertDistance(Number(n), asignedTest);
        }

      }
      Lungo.Router.article("records", "viewrecord");
    } catch (err) {
      utils.throwError(err.message);
    }

  }

  var deleteMark = function(obj) {
    var callBack = function() {
      persistence.mark.remove(Number($(obj).parent().attr("value"))); //delete from database

      //remove from the UI list
      //"closest" travels up the DOM tree and returns the first (single) ancestor that matches the passed expression
      $(obj).closest("li").remove();
      utils.throwSuccess("Elemento borrado");
    }
    utils.throwConfirmDelete(callBack);
  }

  var editMarkQuantity = function(obj, n) {
    var callBack = function(newValue) {
      persistence.mark.updateQuantity(Number($(obj).parent().attr("value")), newValue); //delete from database
      utils.throwSuccess("Valor guardado correctamente");
      viewRecords();
    }
    throwEditMarkQuantity(n, callBack);
  }

  var editMarkTime = function(obj, h, m, s) {
    var callBack = function(newH, newM, newS) {
      persistence.mark.updateTime(Number($(obj).parent().attr("value")), newH, newM, newS); //delete from database
      utils.throwSuccess("Valor guardado correctamente");
      viewRecords();
    }
    throwEditMarkTime(h, m, s, callBack);
  }

  var _delete = function(obj) {
    var idAsignedTest = Number($(obj).parent().attr("value"));
    var idAsignedTest;
    var callBack = function() {
      persistence.mark.removeAllMarkByAsignedTest(idAsignedTest); //delete from database

      $(obj).closest("li").remove();
      utils.throwSuccess("Conjunto de marcas borrado");
    }

    //CAMBIAR EL ID DE LA FILA PRINCIPAL (esta puesto el id de team/competitor) POR EL ID DE ASIGNEDTEST, NO AFECTA A OTRAS FUNCIONES
    //Y CAMBIAR EL metodo getIdAsignedTestByIdTeam de la bd porke esta mal
    utils.throwConfirmDelete(callBack);


  }

  return {
    setGroupTestSelection: setGroupTestSelection,
    viewRecords: viewRecords,
    saveFilter: saveFilter,
    modeCreate: modeCreate,
    save: save,
    deleteMark: deleteMark,
    editMarkQuantity: editMarkQuantity,
    editMarkTime: editMarkTime,
    delete: _delete,
    setViewMMP: setViewMMP
  }


})