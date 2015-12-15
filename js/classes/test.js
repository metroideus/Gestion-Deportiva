//class test

define(function () {
    //private methods

    var isValidString = function(str){
        var regExpression = /^\s+|\s+$/;
        //var regExpression = /^[A-Za-z0-9".-]+( [A-Za-z0-9".-]+)*$/; //checks the word. Only matches a simple sentence with letters and numbers
        return !regExpression.test(str) && str !== "";
    }

    //public methods
    var Test = function(Competition_idCompetition, name, type, result, bestMark){  
        var err;
        var bestMarkEnum={h:"highest",l:"lowest"};
        var typeEnum={single:"single",team:"team"};
        var resultEnum={distance:"distance",time:"time", numeric:"numeric"};

        if(arguments.length != 5){
            err = new Error("Número de argumentos incorrecto");
            err.name = "ArgumentException";
            throw err;
        }
        if((typeof Competition_idCompetition) != "number" || Competition_idCompetition < 0 || Competition_idCompetition%1 != 0){
            err = new Error("Error en el parámetro Competition_idCompetition");
            err.name = "ArgumentException";
            throw err;
        }
        if((typeof name) != "string" || !isValidString(name)){
            err = new Error("Error en el parámetro Nombre");
            err.name = "ArgumentException";
            throw err;
        }else if((typeof type) != "string" || !typeEnum.hasOwnProperty(type)){
            err = new Error("Error en el parámetro Tipo");
            err.name = "ArgumentException";
            throw err;
        }else if((typeof result) != "string" || !resultEnum.hasOwnProperty(result)){
            err = new Error("Error en el parámetro Resultado");
            err.name = "ArgumentException";
            throw err;
        }else if((typeof bestMark) != "string" || !bestMarkEnum.hasOwnProperty(bestMark)){
            err = new Error("Error en el parámetro Mejor Marca");
            err.name = "ArgumentException";
            throw err;
        }

        // properties
        this.Competition_idCompetition = Number(Competition_idCompetition);
        this.name = name;
        this.type = type;
        this.result = result;
        this.bestMark = bestMark;

        this.toArray = function(arJoin){

            var ar = new Array(this.name,this.type,this.result,this.bestMark);
            if(Array.isArray(arJoin)){
                return ar.concat(arJoin);
            }else{
                return ar;
            }
        };

    };

    return {
        Test: Test
    }

});




