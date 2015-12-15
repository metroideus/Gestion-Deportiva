define(["classes/test",DAO,"app.utils"], function (testClass, persistence, utils) {

var list = function(){
    //callBack at the end of the transaction. "l" is a list of competitions
    var callBack = function(l){

      Lungo.dom("#list-tests").empty();

      var i;
      var aux;
      var rolUser = (JSON.parse(sessionStorage.getItem("loginData"))).rol;    
        
      for(i = 0; i < l.length; i++){

        aux = "<li value='" + l.item(i).idTest + "'>";

        if(rolUser !== 0){
          aux = aux + "<span class='icon trash list-button-summary' onclick='tests.delete(this)'></span>" +
          "<span class='icon edit list-button-summary' onclick='tests.modeEdit("+ l.item(i).idTest + ")'></span>";      
        }
        
        aux = aux + "<details><summary>" + l.item(i).name + "</summary><ul><li><label>Tipo:</label>" + l.item(i).type + "</li>" +
        "<li><label>Resultado:</label>" + l.item(i).result + "</li></ul></details></li>";

        Lungo.dom("#list-tests").append(aux);
      }    

    };

      persistence.test.selectAllByCompetition(sessionStorage.getItem("idCompSelected"),callBack);
  };

  var _delete = function(obj){
    
      var callBack = function(){       
        //delete from database
        persistence.test.remove(Number($(obj).parent().attr("value")));

        //"closest" travels up the DOM tree and returns the first (single) ancestor that matches the passed expression
        $(obj).closest("li").remove();
        utils.throwSuccess("Elemento borrado");

      }
      utils.throwConfirmDelete(callBack);
    
    
  }

  var save = function(){
    
    //Actions passed to asynchronous request "selectAllNames"
    var callBack = function(l){
        try {
              var test;
              test = new testClass.Test(Number(sessionStorage.getItem("idCompSelected")),$("#nameTest").val(), 
                $("#typeTest").val(), $("#resultTest").val(), $("#bestMarkTest").val());
              
              if(sessionStorage.getItem("mode") == "create"){
                  if(!utils.stringInList(test.name, l)){  //if the name of test isn't in the competition...
                    persistence.test.insert(test, function(){
                      utils.throwSuccess("Elemento creado");
                      Lungo.Router.article("tests","maintest");
                    },utils.throwError);
                }else{
                  utils.throwError("Existe ya un elemento con el mismo nombre");
                }
              }else{
                $.when(persistence.test.update(Number(sessionStorage.getItem("idCompSelected")),
                  Number(sessionStorage.getItem("id")),test))
                .done(function(){
                  utils.throwSuccess("Elemento actualizado");
                  Lungo.Router.article("tests","maintest");                
                }).fail(function(err){
                  utils.throwError(err);
                })
              }

        }catch(err){
              utils.throwError(err.message);
        }
      
    } 
    persistence.test.selectNamesByCompetition(sessionStorage.getItem("idCompSelected"),callBack);
            
  };

  var modeEdit = function(id){
      
      Lungo.Router.article("tests","edittest");
      
      if(id==undefined){
        sessionStorage.setItem("mode","create");
         utils.cleanInputs("edittest");
      

      }else{
        sessionStorage.setItem("mode","edition");
        sessionStorage.setItem("id",id);

        $.when(persistence.test.selectById(id))
        .done(function(obj){
            $("#nameTest").val(obj.name);
            $("#typeTest").val(obj.type); 
            $("#resultTest").val(obj.result);
            $("#bestMarkTest").val(obj.bestMark);
        }).fail(function(err){
            utils.throwError(err);
        })
        

      }
      
  }

  return{
  	list : list,
  	delete : _delete,
	save : save,
	modeEdit : modeEdit
  }


})