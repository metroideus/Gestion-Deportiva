//Module app.utils
define(function() {

  /******************************************************/
  /********************MODAL POPUPS**********************/
  /******************************************************/

  /**
   * takes a callback function and shows a modal.
   * @param {function} callBack - Function to run when the user push the confirm button.
   */
  function throwConfirmDelete(callBack) {

    swal({
        title: "¿Borrar?",
        text: "Pulsa Ok si deseas eliminarlo",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Ok",
        closeOnConfirm: false
      },
      callBack);

  }

  function throwConfirmOperation(callBack, message) {

    swal({
        title: "¿Proceder?",
        text: message,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Ok",
        closeOnConfirm: false
      },
      callBack);

  }

  function throwConfirmExit(callBack) {

    swal({
        title: "Salir",
        text: "¿Estás seguro de que deseas cerrar la aplicación?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3fc0a7",
        confirmButtonText: "Ok",
        closeOnConfirm: false
      },
      callBack);
  }

  function throwError(message) {
    var msg = null;

    if (typeof message == "string") {
      msg = message;
    } else {
      msg = message.message;
    }

    swal({
      title: "Error",
      text: msg,
      imageUrl: "img/error.png",
      timer: 2000,
      showConfirmButton: false
    });

  }

  function throwSuccess(message) {
    var msg = null;

    if (typeof message == "string") {
      msg = message;
    } else {
      msg = message.message;
    }

    swal({
      title: "Exito",
      text: msg,
      type: "success",
      timer: 2000,
      showConfirmButton: false
    });

  }

  function throwWarning(message) {
    var msg = null;

    if (typeof message == "string") {
      msg = message;
    } else {
      msg = message.message;
    }

    swal({
      title: "Aviso",
      text: msg,
      type: "warning",
      timer: 2500,
      showConfirmButton: false
    });

  }


  function throwTestList(listTests, asignedTests) {
    var i;
    var heightScreen = Lungo.Core.environment().screen.height;
    var customTitle = "Pruebas";
    var customHTML = "<div style='max-height:" + (heightScreen - Math.round((50 / 100) * heightScreen)) +
      "px' class='list-align-left'><ul id='testEdition'>";

    for (i = 0; i < listTests.length; i++) {
      customHTML = customHTML + "<li class='li-margin-bottom list-align-center' value=" + listTests.item(i).idTest + ">" +
        listTests.item(i).name + "</li>";
    }
    customHTML = customHTML.concat("</ul></div>");

    swal({
        title: customTitle,
        text: customHTML,
        showCancelButton: true,
        animation: "slide-from-bottom",
        html: true
      },
      function(isConfirm) {
        var selectedTests = new Array();
        if (isConfirm) {
          $("#testEdition").children().each(function(index, obj) {
            if ($(obj).hasClass("item-selected")) {
              selectedTests.push({
                name: $(obj).html(),
                idTest: $(obj).val(),
                specificOrRandom: "s"
              });
            } else if ($(obj).hasClass("item-random")) {
              selectedTests.push({
                name: $(obj).html(),
                idTest: $(obj).val(),
                specificOrRandom: "r"
              });
            }
          });

          sessionStorage.setItem("dataTest", JSON.stringify(selectedTests));
        }
      });


    $("#testEdition").children().each(function(index, obj) { //prepare the system select/deselect test
      if (asignedTests != null && stringInArrayTests($(obj).html(), asignedTests)) {
        if (getSpecificOrRandomTestFromName($(obj).html(), asignedTests) == "s") {
          $(obj).addClass("item-selected");
        } else {
          $(obj).addClass("item-random");
        }
      }
      $(obj).on("click", function() {
        if ($(obj).hasClass("item-selected")) {
          $(obj).removeClass("item-selected");
        } else if ($(obj).hasClass("item-random")) {
          $(obj).removeClass("item-random");
        } else {
          $(obj).addClass("item-selected");
        }
      });
    });


  }

  function throwCompetitionList(listCompetitions, asignedCompetitions) {
    var i;
    var heightScreen = Lungo.Core.environment().screen.height;
    var customTitle = "Competiciones";
    var customHTML = "<div style='max-height:" + (heightScreen - Math.round((50 / 100) * heightScreen)) +
      "px' class='list-align-left'><ul id='competitionEdition'>";

    for (i = 0; i < listCompetitions.length; i++) {
      customHTML = customHTML + "<li class='li-margin-bottom list-align-center' value=" + listCompetitions.item(i).idCompetition + ">" +
        listCompetitions.item(i).name + "</li>";
    }
    customHTML = customHTML.concat("</ul></div>");

    swal({
        title: customTitle,
        text: customHTML,
        showCancelButton: true,
        animation: "slide-from-bottom",
        html: true
      },
      function(isConfirm) {
        var selectedCompetitions = new Array();
        if (isConfirm) {
          $("#competitionEdition").children().each(function(index, obj) {
            if ($(obj).hasClass("item-selected")) {
              selectedCompetitions.push({
                name: $(obj).html(),
                idCompetition: $(obj).val()
              });
            } else if ($(obj).hasClass("item-random")) {
              selectedCompetitions.push({
                name: $(obj).html(),
                idCompetition: $(obj).val()
              });
            }
          });

          sessionStorage.setItem("dataCompetition", JSON.stringify(selectedCompetitions));
        }
      });


    $("#competitionEdition").children().each(function(index, obj) { //prepare the system select/deselect competition
      if (asignedCompetitions != null && nameInArray($(obj).html(), asignedCompetitions)) {
        $(obj).addClass("item-selected");
      }
      $(obj).on("click", function() {
        if ($(obj).hasClass("item-selected")) {
          $(obj).removeClass("item-selected");
        } else {
          $(obj).addClass("item-selected");
        }
      });
    });


  }


  // Para lanzar listas de selección/deselección de grupos y de pruebas. Utilizado en el controlador de PDF.
  function throwGroupTestList(sessionVar, list, selectedList) {
    var i;
    var heightScreen = Lungo.Core.environment().screen.height;
    var customTitle;
    var customHTML = "<div style='max-height:" + (heightScreen - Math.round((50 / 100) * heightScreen)) +
      "px' class='list-align-left'><ul id='pdfFilter'>";

    if (list.length > 0 && list.item(0).idGroup === undefined) {
      customTitle = "Pruebas";
      for (i = 0; i < list.length; i++) {
        customHTML = customHTML + "<li class='li-margin-bottom list-align-center' value=" + list.item(i).idTest + ">" +
          list.item(i).name + "</li>";
      }
    } else {
      customTitle = "Grupos";
      for (i = 0; i < list.length; i++) {
        customHTML = customHTML + "<li class='li-margin-bottom list-align-center' value=" + list.item(i).idGroup + ">" +
          list.item(i).name + "</li>";
      }
    }

    customHTML = customHTML.concat("</ul></div>");

    swal({
        title: customTitle,
        text: customHTML,
        showCancelButton: true,
        animation: "slide-from-bottom",
        html: true
      },
      function(isConfirm) {
        var selectedL = new Array();
        if (isConfirm) {
          $("#pdfFilter").children().each(function(index, obj) {
            if ($(obj).hasClass("item-selected")) {
              selectedL.push({
                name: $(obj).html(),
                id: $(obj).val()
              });
            }
          });

          sessionStorage.setItem(sessionVar, JSON.stringify(selectedL));
        }
      });


    $("#pdfFilter").children().each(function(index, obj) { //prepare the system select/deselect competition
      if (selectedList != null && nameInArray($(obj).html(), selectedList)) {
        $(obj).addClass("item-selected");
      }
      $(obj).on("click", function() {
        if ($(obj).hasClass("item-selected")) {
          $(obj).removeClass("item-selected");
        } else {
          $(obj).addClass("item-selected");
        }
      });
    });


  }

  function throwCompetitorInfo(competitor) {
    var i;
    var img;
    var heightScreen = Lungo.Core.environment().screen.height;
    var customHTML = "<div style='max-height:" + (heightScreen - Math.round((50 / 100) * heightScreen)) +
      "px' class='list-align-left'><ul>";

    var gender, nameTeam;

    if (competitor.gender === "m") {
      gender = "Hombre";
    } else {
      gender = "Mujer";
    }

    if (competitor.nameTeam == null) {
      nameTeam = "Ninguno";
    } else {
      nameTeam = competitor.nameTeam;
    }

    customHTML = customHTML + "<li>" + "<span class='bold-word'>Nombre:</span> " + competitor.nameCompetitor + "</li>" +
      "<li>" + "<span class='bold-word'>Apellidos:</span> " + competitor.surname + "</li>" +
      "<li>" + "<span class='bold-word'>Dorsal:</span> " + competitor.dorsal + "</li>" +
      "<li>" + "<span class='bold-word'>Sexo:</span> " + gender + "</li>" +
      "<li>" + "<span class='bold-word'>Fecha nacimiento:</span> " + competitor.birthdate + "</li>" +
      "<li>" + "<span class='bold-word'>Grupo:</span> " + competitor.nameGroup + "</li>" +
      "<li>" + "<span class='bold-word'>Equipo:</span> " + nameTeam + "</li>" +
      "<li>" + "<span class='bold-word'>Pruebas asignadas:</span>" + "</li>";

    for (i = 0; i < competitor.tests.length; i++) { //prepare the icon for to show
      if (competitor.tests.item(i).specificOrRandom == "s") {
        img = "img-hand";
      } else {
        img = "img-dice";
      }
      customHTML = customHTML + "<li>" + competitor.tests.item(i).name + "<img class='" + img + "'></li>";
    }

    if (competitor.tests.length === 0) {
      customHTML = customHTML + "<li>Ninguna</li>";
    }

    customHTML = customHTML.concat("</ul></div>");

    swal({
      title: "Detalles",
      text: customHTML,
      animation: "slide-from-bottom",
      html: true
    });

  }

  function throwTeamInfo(team) {
    var i;
    var img;
    var heightScreen = Lungo.Core.environment().screen.height;
    var customHTML = "<div style='max-height:" + (heightScreen - Math.round((50 / 100) * heightScreen)) +
      "px' class='list-align-left'><ul>";

    customHTML = customHTML + "<li>" + "<span class='bold-word'>Nombre:</span> " + team.nameTeam + "</li>" +
      "<li>" + "<span class='bold-word'>Grupo:</span> " + team.nameGroup + "</li>" +
      "<li>" + "<span class='bold-word'>Pruebas asignadas:</span>" + "</li>";

    for (i = 0; i < team.tests.length; i++) { //prepare the icon for to show
      if (team.tests.item(i).specificOrRandom == "s") {
        img = "img-hand";
      } else {
        img = "img-dice";
      }
      customHTML = customHTML + "<li>" + team.tests.item(i).name + "<img class='" + img + "'></li>";
    }
    customHTML = customHTML.concat("</ul></div>");

    swal({
      title: "Detalles",
      text: customHTML,
      animation: "slide-from-bottom",
      html: true
    });

  }


  function throwUserInfo(user) {
    var i;
    var img;
    var heightScreen = Lungo.Core.environment().screen.height;
    var customHTML = "<div style='max-height:" + (heightScreen - Math.round((50 / 100) * heightScreen)) +
      "px' class='list-align-left'><ul>";
    var rolEnum = {
      0: "Invitado",
      1: "Gestor",
      2: "Administrador"
    };

    customHTML = customHTML + "<li>" + "<span class='bold-word'>Nick:</span> " + user.nick + "</li>" +
      "<li>" + "<span class='bold-word'>Rol:</span> " + rolEnum[user.rol] + "</li>" +
      "<li>" + "<span class='bold-word'>Competiciones:</span>" + "</li>";

    if (user.rol === 2) {
      customHTML = customHTML + "<li>Acceso a todas</li>"
    }
    for (i = 0; i < user.competitions.length; i++) {
      customHTML = customHTML + "<li>" + user.competitions.item(i).name + "</li>";
    }
    customHTML = customHTML.concat("</ul></div>");

    swal({
      title: "Detalles",
      text: customHTML,
      animation: "slide-from-bottom",
      html: true
    });

  }

  /******************************************************/
  /***********************APP UTILS**********************/
  /******************************************************/


  //clean the fields "input" of the actual view.
  function cleanInputs(ancestor) {
    var i;
    for (i = 0; i < $("#" + ancestor + " " + "input").length; i++) {
      $($("#" + ancestor + " " + "input")[i]).val("");
    }
  }

  //clean the fields "select" of the actual view.
  function cleanSelects(ancestor) {
    var i;
    for (i = 0; i < $("#" + ancestor + " " + "select").length; i++) {
      $($("#" + ancestor + " " + "select")[i]).html("");
    }
  }


  function stringParseNullValues(str) {
    return str.replace("'null'", "null");
  }


  function stringInList(str, l) {
    var i;
    for (i = 0; i < l.length; i++) {

      if (l.item(i).name == str) {
        return true;
      }
    }
    return false;
  }

  function dorsalInList(num, l) {
    var i;
    for (i = 0; i < l.length; i++) {

      if (l.item(i).dorsal == num) {
        return true;
      }
    }
    return false;
  }

  function getSpecificOrRandomTestFromName(name, arTests) {
    var i;
    for (i = 0; i < arTests.length; i++) {
      if (name == arTests[i].name) {
        return arTests[i].specificOrRandom;
      }
    }
    return null;

  }

  function subGroupOf(id, l) {
    var i = 0;
    var res = "Ninguno";

    if (id != null) {
      while (i < l.length && l.item(i).idGroup != id) {
        i++;
      }
    }

    if (l.item(i).idGroup == id) {
      res = l.item(i).name;
    }

    return res;
  }



  function getChildren(id, l) {

    var list = new Array();
    var i;

    for (i = 0; i < l.length; i++) {
      if (l.item(i).Group_idGroup == id) {
        list.push(l.item(i).idGroup);
      }
    }
    if (list.length == 0) {
      return null;
    } else {
      return list;
    }
  }


  function getTestOfList(id, l) {
    var i;
    for (i = 0; i < l.length; i++) {

      if (l.item(i).idTest == id) {
        return l.item(i);
      }

    }
  }

  function getNameGroupOfList(id, l) {
    var i;
    for (i = 0; i < l.length; i++) {

      if (l.item(i).idGroup == id) {
        return l.item(i).name;
      }

    }
  }

  function getNameTeamOfList(id, l) {
    var i;
    for (i = 0; i < l.length; i++) {

      if (l.item(i).idTeam == id) {
        return l.item(i).name;
      }

    }
  }

  function equals(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
      return false;
    }
    var propName;
    for (var i = 0; i < aProps.length; i++) {
      propName = aProps[i];

      // If values of same property are not equal,
      // objects are not equivalent
      if (a[propName] !== b[propName]) {
        return false;
      }
    }

    return true;
  }

  function getNameCompetitorOfList(id, l) {
    var i;
    for (i = 0; i < l.length; i++) {

      if (l.item(i).idCompetitor == id) {
        return l.item(i).name;
      }

    }
  }

  function getDorsalCompetitorOfList(id, l) {

    var i;
    for (i = 0; i < l.length; i++) {

      if (l.item(i).idCompetitor == id) {
        return l.item(i).dorsal;
      }

    }

  }

  function stringInArrayTests(str, arTests) {
    var i;
    for (i = 0; i < arTests.length; i++) {
      if (str == arTests[i].name) {
        return true;
      }
    }
    return false;
  }

  function nameInArray(str, arCompetitions) {
    return stringInArrayTests(str, arCompetitions)
  }

  //file manager
  function writeFile(data, url, onError, onSuccess) {
    window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0,
      function(fileSystem) {
        fileSystem.root.getFile(url, {
          create: true
        }, function(fileEntry) {
          var path = fileEntry.nativeURL;
          fileEntry.createWriter(function(writer) {
            writer.onwrite = function(evt) {
              onSuccess(path);
            };
            writer.write(data);
          });
        }, onError);
      }, onError);

  }

  function readFile(url) {
    var def = new $.Deferred();

    function success(tx, rs) {
      def.resolve(rs)
    }

    function error(err) {
      def.reject(err)
    }

    window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0,
      function(fileSystem) {
        fileSystem.root.getFile(url, {
          create: false
        }, function(fileEntry) {
          fileEntry.file(function(file) {
            var reader = new FileReader();
            reader.onloadend = function(evt) {
              success(null, evt.target.result);
              //return evt.target.result;
            };
            reader.readAsText(file);
          });
        }, error);
      }, error);

    return def.promise();

  }



  function getBestQuantityMark(marks, bestMark) {
    if (marks.length == 0)
      throw new Error("List of marks is empty");

    var i;
    var res = marks.item(0).quantity;

    for (i = 0; i < marks.length; i++) {
      if ((bestMark == "h" && marks.item(i).quantity > res) || (bestMark == "l" && marks.item(i).quantity < res)) {
        res = marks.item(i).quantity;
      }
    }

    return res;
  }

  function getBestTimeMark(marks, bestMark) {
    if (marks.length == 0)
      throw new Error("List of marks is empty");

    var d = new Date();
    var i;
    var res = new Date();

    res.setHours(marks.item(0).hours, marks.item(0).minutes, Math.floor(marks.item(0).seconds), (marks.item(0).seconds) % 1);
    for (i = 0; i < marks.length; i++) {
      d.setHours(marks.item(i).hours, marks.item(i).minutes, Math.floor(marks.item(i).seconds), (marks.item(i).seconds) % 1);
      if ((bestMark == "h" && d > res) || bestMark == "l" && d < res) {
        res = d;
      }
    }
    return res;
  }


  function orderListByQuantityMark(ar, bestMark) {
    if (bestMark != "l" && bestMark != "h")
      throw new Error("The value of bestMark isn't correct");

    function compare(a, b) {
      if (getBestQuantityMark(a.listMarks, bestMark) < getBestQuantityMark(b.listMarks, bestMark)) {
        return -1;
      } else if (getBestQuantityMark(a.listMarks, bestMark) > getBestQuantityMark(b.listMarks, bestMark)) {
        return 1;
      }
      return 0;
    }

    if (bestMark == "l") { //ordering ascending
      return ar.sort(compare);
    } else { // ordering descendant
      return ar.sort(compare).reverse(); //it use "reverse" because "ar.sort" always sorts ascending
    }
  }


  function orderListByTimeMark(ar, bestMark) {
    if (bestMark != "l" && bestMark != "h")
      throw new Error("The value of bestMark isn't correct");

    function compare(a, b) {
      if (getBestTimeMark(a.listMarks, bestMark) < getBestTimeMark(b.listMarks, bestMark)) {
        return -1;
      } else if (getBestTimeMark(a.listMarks, bestMark) > getBestTimeMark(b.listMarks, bestMark)) {
        return 1;
      }
      return 0;
    }

    if (bestMark == "l") { //ordering ascending
      return ar.sort(compare);
    } else { // ordering descendant
      return ar.sort(compare).reverse(); //it use "reverse" because "ar.sort" always sorts ascending
    }
  }


  /******************************************************/
  /***********************UI LOGIC***********************/
  /******************************************************/

  // this function changes the focused section of the left menu.
  function changeSectionFocus(id) {
    Lungo.dom("#mcontent li.active").removeClass("active");

    Lungo.dom("#" + id).addClass("active");

  }


  function prepareTactileInterfaceControl() {

    //open the aside
    var sRight = function() {
      Lungo.Aside.show("mleft");
    };
    $$('section').swipeRight(sRight);


    //  $("#competitions").on("swiperight", sRight);

    //close the aside
    var sLeft = function() {
      Lungo.Aside.hide("mleft");
    };
    $$('section').swipeLeft(sLeft);


    //tap out of the option's menu. This is for to close the top menu.

    var tapOut = function(event) {
      var appSections = {
        competitions: "competition",
        competitors: "competitor",
        groups: "group",
        teams: "team",
        tests: "test",
        records: "record"
      };
      var idSection = $(event.target).closest("section").attr("id");
      var idMenu = appSections[idSection] + "-mdown";

      if (appSections[idSection] != undefined) {
        if ($(event.target).hasClass("grid")) {
          if (Lungo.dom("#" + idMenu).css("visibility") == "hidden") {
            Lungo.Element.Menu.show(idMenu);
          } else if (Lungo.dom("#" + idMenu).css("visibility") == "visible") {
            Lungo.Element.Menu.hide(idMenu);
          }
        } else {
          Lungo.Element.Menu.hide(idMenu);
        }
      }
    };
    $$("body").tap(tapOut);

  }


  function createHTMLOptionsGroup(idSelect, l, noneOption) {
    var i;
    var options = "";

    if (noneOption) {
      options = '<option value="none">Ninguno</option>';
    }
    for (i = 0; i < l.length; i++) {
      options = options + '<option value=' + l.item(i).idGroup + '>' + l.item(i).name + '</option>';
    }
    $("#" + idSelect).html(options);

  }

  function createHTMLOptionsTeam(idSelect, l, noneOption) {
    var i;
    var options = "";

    if (noneOption) {
      options = '<option value="none">Ninguno</option>';
    }
    for (i = 0; i < l.length; i++) {
      options = options + '<option value=' + l.item(i).idTeam + '>' + l.item(i).name + '</option>';
    }
    $("#" + idSelect).html(options);

  }

  function createHTMLOptionsCompetitor(idSelect, l, noneOption) {
    var i;
    var options = "";

    if (noneOption) {
      options = '<option value="none">Ninguno</option>';
    }
    for (i = 0; i < l.length; i++) {
      options = options + '<option value=' + l.item(i).idCompetitor + '>' + l.item(i).name + ', ' +
        l.item(i).surname + '</option>';
    }
    $("#" + idSelect).html(options);

  }

  function createHTMLOptionsTest(idSelect, l, noneOption) {
    var i;
    var options = "";

    if (noneOption) {
      options = '<option value="none">Ninguno</option>';
    }
    for (i = 0; i < l.length; i++) {
      options = options + '<option value=' + l.item(i).idTest + '>' + l.item(i).name + '</option>';
    }
    $("#" + idSelect).html(options);

  }

  function fillInFieldsCompetitor(competitor) {

    $("#competitor-name").val(competitor.nameCompetitor);
    $("#competitor-surname").val(competitor.surname);
    $("#competitor-birthdate").val(competitor.birthdate);
    $("#competitor-gender").val(competitor.gender);
    $("#competitor-dorsal").val(competitor.dorsal);
    $("#competitor-selectGroup").val(competitor.Group_idGroup);
    if (competitor.Team_idTeam == null) {
      $("#competitor-selectTeam").val("none");
    } else {
      $("#competitor-selectTeam").val(competitor.Team_idTeam);
    }

  }

  function eventListenerEditCompetitor() {
    require([DAO], function(persistence) {
      $("#competitor-selectGroup").on("change", function() {
        var v = $("#competitor-selectGroup").val();
        if (v != "") {
          $.when(persistence.team.selectIdNameByGroup(Number(v)))
            .done(function(listTeams) {
              createHTMLOptionsTeam("competitor-selectTeam", listTeams, true);
            }).fail(function(err) {
              throwError(err);
            })
        } else {
          $("#competitor-selectTeam").html("<option value=''>Ninguno</option>");
        }
      });
    });
  }


  function exitFromCompetition() {

      //this sets the top title of the leftMenu
      Lungo.dom("#compSelected").html("Competici&oacuten no seleccionada");
      Lungo.dom( "#compSelected" ).removeAttr( "onclick");  
      $("#hideMenu").css("display", "none"); //hides the menu that contains the links to groups, teams...
      //sets the variable competition to void
      sessionStorage.setItem("idCompSelected","");  

  }

  /*************************************************/
  /*******FIX ONLY FOR ANDROID KITKAT 4.4***********/
  /*************************************************/
  function swipeKitKat() {
    // Touchmove events are cancelled on Android KitKat when scrolling is possible on the touched element.  
    // Scrolling is always vertical in our app. Cancel the event when a touchmove is horizontal,  
    // so that all following touchmove events will be raised normally.  
    var startLoc = null;

    $("body").on("touchstart", function(e) {
      if (e.touches.length == 1) { // one finger touch  
        // Remember start location.  
        var touch = e.touches[0];
        startLoc = {
          x: touch.pageX,
          y: touch.pageY
        };
      }
    });

    $("body").on("touchmove", function(e) {
      // Only check first move after the touchstart.  
      if (startLoc) {
        var touch = e.touches[0];
        // Check if the horizontal movement is bigger than the vertical movement.  
        if (Math.abs(startLoc.x - touch.pageX) >
          Math.abs(startLoc.y - touch.pageY)) {
          // Prevent default, like scrolling.  
          e.preventDefault();
        }
        startLoc = null;
      }
    });

  }


  return {
    throwConfirmDelete: throwConfirmDelete,
    throwConfirmOperation: throwConfirmOperation,
    throwConfirmExit: throwConfirmExit,
    throwError: throwError,
    throwSuccess: throwSuccess,
    throwTestList: throwTestList,
    throwCompetitionList: throwCompetitionList,
    throwGroupTestList: throwGroupTestList,
    changeSectionFocus: changeSectionFocus,
    prepareTactileInterfaceControl: prepareTactileInterfaceControl,
    cleanInputs: cleanInputs,
    cleanSelects: cleanSelects,
    stringInList: stringInList,
    subGroupOf: subGroupOf,
    getChildren: getChildren,
    getNameGroupOfList: getNameGroupOfList,
    getTestOfList: getTestOfList,
    getNameTeamOfList: getNameTeamOfList,
    getNameCompetitorOfList: getNameCompetitorOfList,
    createHTMLOptionsGroup: createHTMLOptionsGroup,
    createHTMLOptionsTeam: createHTMLOptionsTeam,
    createHTMLOptionsTest: createHTMLOptionsTest,
    createHTMLOptionsCompetitor: createHTMLOptionsCompetitor,
    swipeKitKat: swipeKitKat,
    throwCompetitorInfo: throwCompetitorInfo,
    throwTeamInfo: throwTeamInfo,
    throwUserInfo: throwUserInfo,
    eventListenerEditCompetitor: eventListenerEditCompetitor,
    fillInFieldsCompetitor: fillInFieldsCompetitor,
    equals: equals,
    throwWarning: throwWarning,
    stringInArrayTests: stringInArrayTests,
    nameInArray: nameInArray,
    dorsalInList: dorsalInList,
    getDorsalCompetitorOfList: getDorsalCompetitorOfList,
    getSpecificOrRandomTestFromName: getSpecificOrRandomTestFromName,
    writeFile: writeFile,
    readFile: readFile,
    stringParseNullValues: stringParseNullValues,

    orderListByQuantityMark: orderListByQuantityMark,
    orderListByTimeMark: orderListByTimeMark,

    exitFromCompetition : exitFromCompetition

  }

});