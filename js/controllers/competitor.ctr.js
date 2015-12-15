define(["classes/competitor",DAO,"app.utils"], function (competitorClass, persistence, utils) {

  var list = function(order){
        var orderRes = "ASC";
        if(order != null && order != undefined){
          orderRes = order;
        }
    
        $.when(persistence.competitor.selectAllByCompetition(sessionStorage.getItem("idCompSelected"), orderRes))
        .done(function (l) {
            var i;
            var aux;
            var rolUser = (JSON.parse(sessionStorage.getItem("loginData"))).rol;

            Lungo.dom("#list-competitors").empty();
            for(i = 0; i < l.length; i++){

              aux = "<li value="+ l.item(i).idCompetitor +">";

              aux = aux + "<div class='list-container-text'>";
              aux = aux + "<strong>" + l.item(i).dorsal + ": " + (l.item(i).surname == undefined ? "" : l.item(i).surname + ", ") + 
              l.item(i).nameCompetitor + "</strong>";
               aux = aux + "</div>";

              
              if(rolUser !== 0){
                aux = aux + "<div class='list-container-buttons'>";
                aux = aux + "<span class='icon trash button-list' onclick='competitors.delete(this)'></span>" + 
                "<span class='icon edit button-list' onclick='competitors.modeEdit("+ l.item(i).idCompetitor + ")'></span>";
                aux = aux + "</div>";
              }
              
              aux = aux + "</li>";
              Lungo.dom("#list-competitors").append(aux);
            }

            $("#list-competitors").children().each(function(index,obj){  //for each element of list...
              $(obj).children("div.list-container-text").on("click",function(){ //for each button of element...
                competitors.viewCompetitor(obj);
              });
            });            
        }).fail(function (err) {
            utils.throwError(err);
        });

  }

  var viewCompetitor = function(obj){

        $.when(persistence.competitor.selectCompetitorInfo(Number($(obj).attr("value"))))
        .done(function(competitor){
            utils.throwCompetitorInfo(competitor);
        }).fail(function(err){
            utils.throwError(err);
        });

    
  }

  var _delete = function(obj){

      var callBack = function(){       
        persistence.competitor.remove(Number($(obj).closest("li").attr("value")));  //delete from database

        //remove from the UI list
        //"closest" travels up the DOM tree and returns the first (single) ancestor that matches the passed expression
        $(obj).closest("li").remove();
        utils.throwSuccess("Elemento borrado");
      }
      utils.throwConfirmDelete(callBack);

  }

  var save = function(){
        var competitor;
        var selectGroup;
        var selectTeam;
        var asignedTests;

        $("#competitor-selectGroup").val() == "none" ? selectGroup = null : selectGroup = Number($("#competitor-selectGroup").val());
        $("#competitor-selectTeam").val() == "none" ? selectTeam = null : selectTeam = Number($("#competitor-selectTeam").val());
        try {
          competitor = new competitorClass.Competitor($("#competitor-name").val(), $("#competitor-surname").val(), 
            $("#competitor-birthdate").val(), $("#competitor-gender").val(), Number($("#competitor-dorsal").val()), 
            selectGroup, selectTeam);

            asignedTests = JSON.parse(sessionStorage.getItem("dataTest"));

          if(sessionStorage.getItem("mode") == "create"){
            $.when(persistence.competitor.insert(Number(sessionStorage.getItem("idCompSelected")),competitor, asignedTests))
            .done(function(){
              utils.throwSuccess("Elemento creado");
              Lungo.Router.article("competitor","maincompetitor");
            }).fail(function(err){
              utils.throwError(err);
            });
          }else{

            var idCompetitor = Number(sessionStorage.getItem("id"));
            var updateFunction = function(){
                $.when(persistence.competitor.update(Number(sessionStorage.getItem("idCompSelected")), idCompetitor,competitor, asignedTests))
                .done(function(){
                  utils.throwSuccess("Elemento actualizado");
                  Lungo.Router.article("competitors","maincompetitor");
                }).fail(function(err){
                  utils.throwError(err);
                });
            }

            $.when(persistence.competitor.checkConfigurationTests(asignedTests,idCompetitor)) // first checks if exists any mark associated
            .done(function(existsAssociatedMarks){
              if(existsAssociatedMarks){
                utils.throwConfirmOperation(updateFunction,"Existen pruebas deseleccionadas que contienen marcas. Si pulsas aceptar se eliminarán también las marcas");
              }else{
                updateFunction();
              }
            }).fail(function(err){
              utils.throwError(err);
            })

          }

        }catch(err){
          utils.throwError(err.message);
        }
            
  }

  var modeEdit = function(id){
      var aux;
      var i;
      Lungo.Router.article("competitors","editcompetitor");

        utils.cleanInputs("editcompetitor");
        if(id==undefined){ //if the user wants to create a new competitor...
          sessionStorage.setItem("mode","create");
          sessionStorage.setItem("dataTest",JSON.stringify(new Array())); //configure the set of user's tests to empty
          $.when(persistence.group.selectIdNameByCompetition(sessionStorage.getItem("idCompSelected")))
          .done(function (listGroups) {
              utils.createHTMLOptionsGroup("competitor-selectGroup", listGroups, false);
              aux = $("#competitor-selectGroup").html();
              $("#competitor-selectGroup").html('<option selected value="none"></option>' + aux); //initialice the selector of group to null
              $("#competitor-selectTeam").html('<option value="none">Ninguno</option>');
              utils.eventListenerEditCompetitor();
          }).fail(function (err) {
            utils.throwError(err);
          });
        }else{//if the user wants to edit a competitor...
          sessionStorage.setItem("mode","edition");
          sessionStorage.setItem("id",id);

          $.when(persistence.group.selectIdNameByCompetition(sessionStorage.getItem("idCompSelected")),
            persistence.competitor.selectNameIdGroup(id))
          .then(function(listGroups, data){
              utils.createHTMLOptionsGroup("competitor-selectGroup", listGroups, false);
              return persistence.team.selectIdNameByGroup(data.Group_idGroup);
          
          })
          .then(function(listTeams){
              utils.createHTMLOptionsTeam("competitor-selectTeam", listTeams, true);
              return persistence.competitor.selectAsignedTests(id);
          })
          .then(function(asignedTests){
              aux = new Array();
              for(i=0; i < asignedTests.length; i++){
                aux.push(asignedTests.item(i));
              }
              sessionStorage.setItem("dataTest",JSON.stringify(aux)); //configure the set of user's tests with his asigned tests
              return persistence.competitor.selectCompetitorInfo(Number(id));
          })          
          .done(function(competitor){
              utils.fillInFieldsCompetitor(competitor);
              utils.eventListenerEditCompetitor();
          })
          .fail(function(err){
            utils.throwError(err);
          })
          
        }
      
  }

  var editTests = function(){
      var asignedTests = JSON.parse(sessionStorage.getItem("dataTest"));
      $.when(persistence.test.selectAllIndividualTestsByCompetition(sessionStorage.getItem("idCompSelected")))
      .done(function(listTests){
          if(asignedTests.length == 0){
            utils.throwTestList(listTests, null);
          }else{
            utils.throwTestList(listTests, asignedTests);
          }
              
      }).fail(function(err){
          utils.throwError(err);
      });

  }

  var randomTest = function(){
      var testsToRandom = new Array();
      var i;
      var test;
      
      $.when(persistence.test.selectAllIndividualTestsByCompetition(sessionStorage.getItem("idCompSelected")))
      .done(function(allTests){
        var result;
        var aux;

        aux = JSON.parse(sessionStorage.getItem("dataTest"));

        for(i = 0; i < allTests.length; i++){ 
            if(!utils.stringInArrayTests(allTests.item(i).name, aux)){ // the item from the set "prevAsignedTests" that isn't in "selectedTests" is to remove.
                testsToRandom.push(allTests.item(i));
            }  
        }          
        if(testsToRandom.length > 0){
          result = Math.floor(Math.random() * testsToRandom.length);
          test = testsToRandom[result];
          test.specificOrRandom = "r";
          aux.push(test);
          sessionStorage.setItem("dataTest", JSON.stringify(aux));
          utils.throwSuccess("prueba seleccionada: " + testsToRandom[result].name);
        }else{
          utils.throwWarning("No existen nuevas pruebas que se puedan asignar");
        }

      }).fail(function(err){
        utils.throwError(err);
      })

  }

	return{
	  	list : list,
	  	viewCompetitor : viewCompetitor,
	  	save : save,
	  	modeEdit : modeEdit,
	  	editTests : editTests,
	  	randomTest : randomTest,
	  	delete : _delete
  	}

})