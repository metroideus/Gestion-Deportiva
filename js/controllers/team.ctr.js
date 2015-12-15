define(["classes/team", DAO, "app.utils"], function(teamClass, persistence, utils) {

  var list = function() {

    $.when(persistence.team.selectAllByCompetition(sessionStorage.getItem("idCompSelected")))
      .done(function(l) {
        var i;
        var aux;
        var rolUser = (JSON.parse(sessionStorage.getItem("loginData"))).rol;

        Lungo.dom("#list-teams").empty();
        for (i = 0; i < l.length; i++) {

          aux = "<li value='" + l.item(i).idTeam + "'>";
          aux = aux + "<div class='list-container-text'>";
          aux = aux + "<strong>" + l.item(i).nameTeam + "</strong></div>";

          if (rolUser !== 0) {
            aux = aux + "<div class='list-container-buttons'>";
            aux = aux + "<span class='icon trash button-list' onclick='teams.delete(this)'></span>" +
              "<span class='icon edit button-list' onclick='teams.modeEdit(" + l.item(i).idTeam + ")'></span>";
            aux = aux + "</div>";
          }

          aux = aux + "</li>";

          Lungo.dom("#list-teams").append(aux);
        }

        $("#list-teams").children().each(function(index, obj) { //for each element of list...
          $(obj).children("div.list-container-text").on("click", function() { //for each button of element...
            teams.viewTeam(obj);
          });
        });

      }).fail(function(err) {
        utils.throwError(err);
      });

  }

  var viewTeam = function(obj) {

    $.when(persistence.team.selectTeamInfo(Number($(obj).attr("value"))))
      .done(function(team) {
        utils.throwTeamInfo(team);
      }).fail(function(err) {
        utils.throwError(err);
      });


  }

  var _delete = function(obj) {

    var callBack = function() {
      //across jQuery we get the id of the team
      persistence.team.remove(Number($(obj).closest("li").attr("value")));

      //remove from the UI list
      //"closest" travels up the DOM tree and returns the first (single) ancestor that matches the passed expression
      $(obj).closest("li").remove();
      utils.throwSuccess("Elemento borrado");
    }
    utils.throwConfirmDelete(callBack);

  }

  var save = function() {
    var team;
    var selectGroup;
    var asignedTests;
    $("#team-selectGroup").val() == "" ? selectGroup = null : selectGroup = Number($("#team-selectGroup").val());
    try {
      team = new teamClass.Team($("#team-nameTeam").val(), selectGroup);
      asignedTests = JSON.parse(sessionStorage.getItem("dataTest"));

      if (sessionStorage.getItem("mode") == "create") {
        $.when(persistence.team.insert(Number(sessionStorage.getItem("idCompSelected")), team, asignedTests))
          .done(function() {
            utils.throwSuccess("Elemento creado");
            Lungo.Router.article("teams", "mainteam");
          }).fail(function(err) {
            utils.throwError(err);
          });
      } else {

        var idTeam = Number(sessionStorage.getItem("id"));
        var updateFunction = function() {
          $.when(persistence.team.update(Number(sessionStorage.getItem("idCompSelected")), idTeam, team, asignedTests))
            .done(function() {
              utils.throwSuccess("Elemento actualizado");
              Lungo.Router.article("teams", "mainteam");
            }).fail(function(err) {
              utils.throwError(err);
            });
        }

        $.when(persistence.team.checkConfigurationTests(asignedTests, idTeam)) // first checks if exists any mark associated
          .done(function(existsAssociatedMarks) {
            if (existsAssociatedMarks) {
              utils.throwConfirmOperation(updateFunction, "Existen pruebas deseleccionadas que contienen marcas. Si pulsas aceptar se eliminarán también las marcas");
            } else {
              updateFunction();
            }
          }).fail(function(err) {
            utils.throwError(err);
          })

      }
    } catch (err) {
      utils.throwError(err.message);
    }


  }

  var modeEdit = function(id) {
    var aux;
    var i;
    Lungo.Router.article("teams", "editteam");

    utils.cleanInputs("editteam");
    utils.cleanSelects("editteam");
    if (id == undefined) {
      sessionStorage.setItem("mode", "create");
      sessionStorage.setItem("dataTest", JSON.stringify(new Array())); //configure the set of team's tests to empty
      $.when(persistence.group.selectIdNameByCompetition(sessionStorage.getItem("idCompSelected")))
        .done(function(l) {
          $("#team-selectGroup").prop("disabled", false);
          utils.createHTMLOptionsGroup("team-selectGroup", l, false);
        }).fail(function(err) {
          utils.throwError(err);
        });
    } else {
      sessionStorage.setItem("mode", "edition");
      sessionStorage.setItem("id", id);
      $.when(persistence.group.selectIdNameByCompetition(sessionStorage.getItem("idCompSelected")),
          persistence.team.selectNameIdGroup(id), persistence.team.hasAnyCompetitor(Number(sessionStorage.getItem("id"))))
        .then(function(listGroups, obj, competitorsInTeam) {
          $("#team-nameTeam").val(obj.name);
          if (!competitorsInTeam) {
            $("#team-selectGroup").prop("disabled", false);
            utils.createHTMLOptionsGroup("team-selectGroup", listGroups, false);
            $("#team-selectGroup").val(obj.Group_idGroup);
          } else {
            $("#team-selectGroup").prop("disabled", true);
          }
          return persistence.team.selectAsignedTests(sessionStorage.getItem("id"));
        })
        .done(function(asignedTests) {
          aux = new Array();
          for (i = 0; i < asignedTests.length; i++) {
            aux.push(asignedTests.item(i));
          }
          sessionStorage.setItem("dataTest", JSON.stringify(aux)); //configure the set of user's tests with his asigned tests

        })
        .fail(function(err) {
          utils.throwError(err);
        });

    }

  }

  var editTests = function() {
    var asignedTests = JSON.parse(sessionStorage.getItem("dataTest"));
    $.when(persistence.test.selectAllTeamTestsByCompetition(sessionStorage.getItem("idCompSelected")))
      .done(function(listTests) {
        if (asignedTests.length == 0) {
          utils.throwTestList(listTests, null);
        } else {
          utils.throwTestList(listTests, asignedTests);
        }

      }).fail(function(err) {
        utils.throwError(err);
      });
  }

  var randomTest = function() {
    var testsToRandom = new Array();
    var i;

    $.when(persistence.test.selectAllTeamTestsByCompetition(sessionStorage.getItem("idCompSelected")))
      .done(function(allTests) {
        var result;
        var aux;

        aux = JSON.parse(sessionStorage.getItem("dataTest"));

        for (i = 0; i < allTests.length; i++) {
          if (!utils.stringInArrayTests(allTests.item(i).name, aux)) { // the item from the set "prevAsignedTests" that isn't in "selectedTests" is to remove.
            testsToRandom.push(allTests.item(i));
          }
        }
        if (testsToRandom.length > 0) {
          result = Math.floor(Math.random() * testsToRandom.length);
          test = testsToRandom[result];
          test.specificOrRandom = "r";
          aux.push(test);
          sessionStorage.setItem("dataTest", JSON.stringify(aux));
          utils.throwSuccess("prueba seleccionada: " + testsToRandom[result].name);
        } else {
          utils.throwWarning("No existen nuevas pruebas que se puedan asignar");
        }

      }).fail(function(err) {
        utils.throwError(err);
      })
  }

  return {
    list: list,
    viewTeam: viewTeam,
    save: save,
    modeEdit: modeEdit,
    editTests: editTests,
    randomTest: randomTest,
    delete: _delete
  }



})