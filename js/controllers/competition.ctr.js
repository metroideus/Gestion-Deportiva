define(["classes/competition", DAO, "app.utils"], function(competitionClass, persistence, utils) {

  var list = function() {

    var userInfo = JSON.parse(sessionStorage.getItem("loginData"));

    var callBack = function(l) { //callBack at the end of the transaction. "l" is a list of competitions

      Lungo.dom("#list-competitions").empty();

      var i;
      var aux;

      for (i = 0; i < l.length; i++) {

        aux = "<li value='" + l.item(i).idCompetition + "'>";
        aux = aux + "<div class='list-container-text'>";
        aux = aux + "<strong onclick='competitions.set(this)'>" + l.item(i).name + "</strong>";
        aux = aux + "</div>";

        aux = aux + "<div class='list-container-buttons'>";
        aux = aux + "<span class='icon eye-open button-list' onclick='competitions.view(" + l.item(i).idCompetition + ")'></span>";
        if (userInfo.rol !== 0) { // if the user is distinct to guest
          aux = aux + "<span class='icon trash button-list' onclick='competitions.delete(this)'></span>" +
            "<span class='icon edit button-list' onclick='competitions.modeEdit(" + l.item(i).idCompetition + ")'></span>";
        }
        aux = aux + "</div>";

        aux = aux + "</li>";
        Lungo.dom("#list-competitions").append(aux);
      }

      //for mark the selected competition.
      if (sessionStorage.getItem("idCompSelected") != "") {
        $("#list-competitions").children().each(function(index, obj) {
          if (sessionStorage.getItem("idCompSelected") == $(obj).val()) {
            $(obj).addClass("theme");
          }
        });
      }
    };


    persistence.competition.selectAllByUser(userInfo.idUser, userInfo.rol, callBack);

  }

  var set = function(obj) {

    // if the competition has not been selected...
    if (!$(obj).closest("li").hasClass("theme")) {
      //this sets the new focus in the leftMenu
      Lungo.dom("#competitions li.theme").removeClass("theme");
      $(obj).closest("li").addClass("theme");

      //this sets the name of the top title in leftMenu
      Lungo.dom("#compSelected").html($(obj).html());

      //set application's var
      sessionStorage.setItem("idCompSelected", $(obj).closest("li").attr("value"));

      //check if MLeft's options are hidden
      if (Lungo.dom("#hideMenu").css("display") === "none") {
        Lungo.dom("#hideMenu").css("display", "inline")
      }

      utils.throwSuccess("Competición seleccionada");
    }

  }


  var view = function(id) {
    if (id === undefined || id === null) {
      id = Number(sessionStorage.getItem("idCompSelected"));
    }

    $.when(persistence.competition.selectById(id))
      .done(function(obj) {
        Lungo.Router.article("competitions", "viewcompetition");

        $("#viewname").html(obj.name);
        $("#viewlocation").html(obj.location);
        $("#viewstart").html(obj.start);
        $("#viewend").html(obj.end);
        $("#vieworganizer").html(obj.organizer);

        if (obj.logo != "") {
          Lungo.dom("#viewlogo").attr("src", obj.logo);
        } else {
          Lungo.dom("#viewlogo").attr("src", "img/logo.png");
        }
      }).fail(function(err) {
        utils.throwError(err);
      })

  }

  var save = function() {
    var comp;

    var userInfo = JSON.parse(sessionStorage.getItem("loginData"));
    var logo;
    if ($("#logo").attr("src") != "img/logo.png") {
      logo = $("#logo").attr("src");
    } else {
      logo = "";
    }

    try {
      comp = new competitionClass.Competition($("#nameCompetition").val(),
        $("#location").val(), $("#initDate").val(), $("#endDate").val(), $("#organizer").val(), logo);


      if (sessionStorage.getItem("mode") == "create") {
        if (userInfo.rol === 1) {

          $.when(persistence.competition.insertWithUser(comp, userInfo.idUser))
            .done(function() {
              Lungo.Router.article("competitions", "maincompetition");
            }).fail(function(err) {
              utils.throwError(err);
            })

        } else { // if the rol is administrator (Guest cannot use this actions)

          $.when(persistence.competition.insert(comp))
            .done(function() {
              Lungo.Router.article("competitions", "maincompetition");
            }).fail(function(err) {
              utils.throwError(err);
            })
        }

      } else {

        function callBackUpdate() {
          if (Number(sessionStorage.getItem("idCompSelected")) === Number(sessionStorage.getItem("id"))) { //if the competition is selected
            Lungo.dom("#compSelected").html(comp.name); //this sets the name of the top title in leftMenu
          }
          Lungo.Router.article("competitions", "maincompetition");
        }
        
        persistence.competition.update(Number(sessionStorage.getItem("id")), comp, callBackUpdate, utils.throwError);

      }

    } catch (err) {
      utils.throwError(err.message);
    }


  }

  var modeEdit = function(id) {

    if (id == undefined) {
      sessionStorage.setItem("mode", "create");
      Lungo.Router.article("competitions", "editcompetition");
      Lungo.dom("#logo").attr("src", "img/logo.png");

      utils.cleanInputs("editcompetition");

    } else {
      sessionStorage.setItem("mode", "edition");
      sessionStorage.setItem("id", id);

      $.when(persistence.competition.selectById(id))
        .done(function(obj) {
          Lungo.Router.article("competitions", "editcompetition");

          $("#nameCompetition").val(obj.name);
          $("#location").val(obj.location);
          $("#initDate").val(obj.start);
          $("#endDate").val(obj.end);
          $("#organizer").val(obj.organizer);

          if (obj.logo != "") {
            Lungo.dom("#logo").attr("src", obj.logo);
          } else {
            Lungo.dom("#logo").attr("src", "img/logo.png");
          }
        }).fail(function(err) {
          utils.throwError(err);
        })

    }

  };

  var _delete = function(obj) {

    var callBack = function() {

      //check if the element has been selected as main competition (it uses jQuery)
      if ($(obj).closest("li").hasClass("theme")) {
        Lungo.dom("#hideMenu").css("display", "none");
        utils.exitFromCompetition();
      }

      //delete from database
      persistence.competition.remove(Number($(obj).closest("li").attr("value")),
        function() {
          utils.throwSuccess("Competicion borrada")
        });

      //delete list from view
      $(obj).closest("li").remove();
    }

    utils.throwConfirmDelete(callBack);

  }


  var getLogo = function() {

    // Called when a photo is successfully retrieved
    var onPhotoURISuccess = function(imageURI) {
      Lungo.dom("#logo").attr("src", "data:image/jpeg;base64," + imageURI);
    }

    var onFail = function(message) {
      console.log(message)
    };

    // Retrieve image file location from specified source (PHONEGAP)
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {
      quality: 20,
      destinationType: DESTINATION_TYPE.DATA_URL,
      sourceType: PICTURE_SOURCE.PHOTOLIBRARY
    });

  }

  return {
    list: list,
    set: set,
    view: view,
    save: save,
    modeEdit: modeEdit,
    delete: _delete,
    getLogo: getLogo
  }

});