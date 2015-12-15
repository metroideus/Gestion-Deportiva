define(["classes/user", DAO, "app.utils"], function(userClass, persistence, utils) {

  var list = function() {

    $.when(persistence.user.selectIdNick())
      .done(function(l) {
        var i;
        var aux;
        Lungo.dom("#list-users").empty();
        for (i = 0; i < l.length; i++) {

          aux = "<li value='" + l.item(i).idUser + "'>";
          aux = aux + "<div class='list-container-text'>";
          aux = aux + "<strong>" + l.item(i).nick + "</strong></div>";

          aux = aux + "<div class='list-container-buttons'>";
          aux = aux + "<span class='icon trash button-list' onclick='users.delete(this)'></span>" +
            "<span class='icon edit button-list' onclick='users.modeEdit(" + l.item(i).idUser + ")'></span>";
          aux = aux + "</div></li>";

          Lungo.dom("#list-users").append(aux);
        }

        $("#list-users").children().each(function(index, obj) { //for each element of list...
          $(obj).children("div.list-container-text").on("click", function() { //for each button of element...
            users.viewUser(obj);
          });
        });

      }).fail(function(err) {
        utils.throwError(err);
      });

  };

  var viewUser = function(obj) {

    $.when(persistence.user.selectUserInfo(Number($(obj).attr("value"))), false)
      .done(function(user) {
        utils.throwUserInfo(user);
      }).fail(function(err) {
        utils.throwError(err);
      });

  }

  var _delete = function(obj) {

    var callBack = function() {
      $.when(persistence.user.remove(Number($(obj).closest("li").attr("value"))))
        .done(function() {
          //remove from the UI list
          //"closest" travels up the DOM tree and returns the first (single) ancestor that matches the passed expression
          $(obj).closest("li").remove();
          utils.throwSuccess("Elemento borrado");
        }).fail(function(err) {
          utils.throwError(err);
        })
    }
    utils.throwConfirmDelete(callBack);


  }

  var modeEdit = function(id) {
    var aux;
    var i;
    Lungo.Router.article("users", "edituser");

    utils.cleanInputs("edituser");
    if (id == undefined) {
      sessionStorage.setItem("mode", "create");
      sessionStorage.setItem("dataCompetition", JSON.stringify(new Array())); //configure the set of competitions to empty

    } else {

      sessionStorage.setItem("mode", "edition");
      sessionStorage.setItem("id", id);

      $.when(persistence.user.selectUserInfo(id, true))
        .done(function(user) {

          $("#user-nick").val(user.nick);
          $("#user-pass").val(user.password);
          $("#user-rol").val(user.rol);

          aux = new Array();
          for (i = 0; i < user.competitions.length; i++) {
            aux.push(user.competitions.item(i));
          }
          sessionStorage.setItem("dataCompetition", JSON.stringify(aux)); //save as local variable the set of competitions that the user has access
        })
        .fail(function(err) {
          utils.throwError(err);
        });

    }

  }

  var editCompetitions = function() {
    var asignedCompetitions = JSON.parse(sessionStorage.getItem("dataCompetition"));

    var callBack = function(listCompetitions) {
      if (asignedCompetitions.length == 0) {
        utils.throwCompetitionList(listCompetitions, null);
      } else {
        utils.throwCompetitionList(listCompetitions, asignedCompetitions);
      }
    }
    if ($("#user-rol").val() == 2) {
      utils.throwWarning("Este tipo de usuario tiene acceso a todas las competiciones");
    } else {
      persistence.competition.selectAll(callBack);
    }

  }


  var save = function() {
    var user;
    var selectRol;
    var asignedCompetitions;
    $("#user-rol").val() == "" ? selectRol = null : selectRol = Number($("#user-rol").val());
    try {
      user = new userClass.User($("#user-nick").val(), $("#user-pass").val(), selectRol);
      asignedCompetitions = JSON.parse(sessionStorage.getItem("dataCompetition"));

      if (sessionStorage.getItem("mode") == "create") {
        $.when(persistence.user.insert(user, asignedCompetitions))
          .done(function() {
            utils.throwSuccess("Elemento creado");
            Lungo.Router.article("users", "mainuser");
          }).fail(function(err) {
            utils.throwError(err);
          });
      } else {
        $.when(persistence.user.update(Number(sessionStorage.getItem("id")), user, asignedCompetitions))
          .done(function() {
            utils.throwSuccess("Elemento actualizado");
            Lungo.Router.article("users", "mainuser");
          }).fail(function(err) {
            utils.throwError(err);
          });

      }
    } catch (err) {
      utils.throwError(err.message);
    }

  }


  function signIn() {

    var nick = $("#login-user").val();
    var pass = $("#login-pass").val();

    try {
      var user = new userClass.User(nick, pass, 0); //the rol is not important for this step. With this the sintaxis of nick and password is checked.
      $.when(persistence.user.validateUser(nick, pass))
        .done(function(res) {

          if (res.result === true) { //password and nick OK
            sessionStorage.setItem("loginData", JSON.stringify(res.data));

            if (Lungo.dom("#competitions").length === 0) { //if the section competitions is not charged.
              //charges the section competitions and prepares it.
              Lungo.Resource.load("competitions/competitions.html");
              Lungo.Boot.Data.init("#competitions");
            }

            //redirect to list competitions
            sessionStorage.setItem("MenuSectionShown","competitions"); //set the actual section shown
            Lungo.dom("#competitionsMleft").addClass("active");
            Lungo.Router.article("competitions", "maincompetition");
            $(document.body).trigger("maincompetition");

          } else { //password or nick failed
            utils.throwError("Usuario o contraseña no válidos");
          }
        }).fail(function(err) {
          utils.throwError(err);
        })

    } catch (err) {

      if (err === false) {
        utils.throwError("Usuario o contraseña no válidos");
      } else {
        utils.throwError(err);
      }

    }


  }

  function signOut() {

    Lungo.dom("#mcontent li.active").removeClass("active");
    $("#mleft").removeClass('show');

    utils.exitFromCompetition();

    sessionStorage.setItem("loginData", "");

    sessionStorage.setItem("MenuSectionShown",""); //section shown sets to void

    utils.cleanInputs("login");
    Lungo.Router.section("login");

  }

  return {
    list: list,
    viewUser: viewUser,
    delete: _delete,
    modeEdit: modeEdit,
    editCompetitions: editCompetitions,
    save: save,
    signIn: signIn,
    signOut: signOut
  }

})