define(["classes/group", DAO, "app.utils"], function(groupClass, persistence, utils) {


  var list = function() {


    $.when(persistence.group.selectAllByCompetition(sessionStorage.getItem("idCompSelected")))
      .done(function(l) {
        var i;
        var aux;
        var rolUser = (JSON.parse(sessionStorage.getItem("loginData"))).rol;

        Lungo.dom("#list-groups").empty();
        for (i = 0; i < l.length; i++) {

          aux = "<li value='" + l.item(i).idGroup + "'>";
          if (rolUser !== 0) {
            aux = aux + "<span class='icon trash list-button-summary' onclick='groups.delete(this)'></span>" +
              "<span class='icon edit list-button-summary' onclick='groups.modeEdit(" + l.item(i).idGroup + ")'></span>";
          }

          aux = aux + "<details><summary>" + l.item(i).name + "</summary><ul>" +
            "<li><label>Subgrupo de: </label>" + utils.subGroupOf(l.item(i).Group_idGroup, l) + "</li></ul></details>";
          aux = aux + "</li>";

          Lungo.dom("#list-groups").append(aux);
        }

      }).fail(function(err) {
        utils.throwError(err);
      });


  }

  var _delete = function(obj) {

    var callBack = function() {
      //delete from database
      $.when(persistence.group.remove(Number(sessionStorage.getItem("idCompSelected")), Number($(obj).parent().attr("value")))) //across jQuery we get the id of the group
        .done(function() {
          list(); //refresh UI list
          utils.throwSuccess("Elemento borrado");
        }).fail(function(err) {
          utils.throwError(err);
        })

    }
    utils.throwConfirmDelete(callBack);
  }


  var save = function() {
    var group;
    var selectGroup;

    $("#selectGroup").val() == "none" ? selectGroup = null : selectGroup = Number($("#selectGroup").val());
    try {
      group = new groupClass.Group($("#nameGroup").val(), selectGroup);
      if (sessionStorage.getItem("mode") == "create") {
        $.when(persistence.group.insert(Number(sessionStorage.getItem("idCompSelected")), group))
          .done(function(r) {
            utils.throwSuccess("Elemento creado");
            Lungo.Router.article("groups", "maingroup");
          }).fail(function(err) {
            utils.throwError(err);
          });
      } else {
        $.when(persistence.group.update(Number(sessionStorage.getItem("idCompSelected")), sessionStorage.getItem("id"), group))
          .done(function() {
            utils.throwSuccess("Elemento actualizado");
            Lungo.Router.article("groups", "maingroup");

          }).fail(function(err) {
            utils.throwError(err);
          })

      }
    } catch (err) {
      utils.throwError(err.message);
    }

  }

  var modeEdit = function(id) {

    var options = null;
    var i;

    //go to article of edition and clean fields
    Lungo.Router.article("groups", "editgroup");
    utils.cleanInputs("editgroup");
    utils.cleanSelects("editgroup");

    if (id == undefined) { //if the user wants to create a new Group...
      sessionStorage.setItem("mode", "create");
      //construction of the options for the "select"
      $.when(persistence.group.selectIdNameByCompetition(sessionStorage.getItem("idCompSelected")))
        .done(function(l) {
          utils.createHTMLOptionsGroup("selectGroup", l, true);
        }).fail(function(err) {
          utils.throwError(err);
        });
    } else { // if the user wants to edit a existing group...
      sessionStorage.setItem("mode", "edition");
      sessionStorage.setItem("id", id);
      //get the name of group from actual competition and show it
      $.when(persistence.group.selectNameById(id))
        .done(function(obj) {
          $("#nameGroup").val(obj.name);
        }).fail(function(err) {
          utils.throwError(err);
        });

      $.when(persistence.group.selectListOfSubgroups(sessionStorage.getItem("idCompSelected"), id),
          persistence.group.selectIdNameByCompetition(sessionStorage.getItem("idCompSelected")),
          persistence.group.selectById(id))
        .done(function(listSubgroups, listGroups, group) {
          //construction of the options for the "select"
          listSubgroups.push(id);
          options = '<option value="none">Ninguno</option>';
          for (i = 0; i < listGroups.length; i++) {
            if (listSubgroups.indexOf(listGroups.item(i).idGroup) == -1) {
              options = options + '<option value=' + listGroups.item(i).idGroup + '>' + listGroups.item(i).name + '</option>';
            }
          }
          $("#selectGroup").html(options);
          if(group.Group_idGroup !== null){
            $("#selectGroup").val(group.Group_idGroup);
          }
        }).fail(function(err) {
          utils.throwError(err);
        });
    }
  }



  return {
    list: list,
    save: save,
    modeEdit: modeEdit,
    delete: _delete
  }

})