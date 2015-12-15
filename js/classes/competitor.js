//class competitor

define(function () {
    
  // Private methods

    var isValidDate = function(date) {

        if((typeof date) != "string"){
            return false;
        }
        var aux = date.split("-");

        if(date =="" || (aux.length == 3 && parseInt(aux[0]) > 1700 && parseInt(aux[0]) < 2999 &&
            parseInt(aux[1]) > 0 && parseInt(aux[1]) <= 12 && parseInt(aux[2]) > 0 && 
            parseInt(aux[2]) <= 31)){

            return true;

        }else{
            return false;
        }
        
    };

    var isValidString = function(str){
        var regExpression = /^\s+|\s+$/;
        //var regExpression = /^[A-Za-z0-9".-]+( [A-Za-z0-9".-]+)*$/; //checks the word. Only matches a simple sentence with letters and numbers
        return !regExpression.test(str) && str !== "";
    }

  // Public methods
    var Competitor = function(name, surname, birthdate, gender, dorsal, Group_idGroup, Team_idTeam){  
        var err;
        var genderEnum={m:"man",w:"woman"};

        if(arguments.length != 7){
            err = new Error("Número de argumentos incorrecto");
            err.name = "ArgumentException";
            throw err;
        }

        if((typeof name) != "string" || !isValidString(name)){
            err = new Error("Error en el parámetro Nombre");
            err.name = "ArgumentException";
            throw err;
        }else if((typeof surname) != "string" || !isValidString(surname)){
            err = new Error("Error en el parámetro Apellidos");
            err.name = "ArgumentException";
            throw err;
        }else if(!isValidDate(birthdate)){
            err = new Error("Error en el parámetro fecha nacimiento");
            err.name = "ArgumentException";
            throw err;
        }else if(((typeof gender) != "string" &&  gender !== null) || ((typeof gender) == "string" && !genderEnum.hasOwnProperty(gender))){
            err = new Error("Error en el parámetro sexo");
            err.name = "ArgumentException";
            throw err;
        }else if(!((typeof dorsal) == "number" && dorsal > 0)){
            err = new Error("Error en el parámetro dorsal");
            err.name = "ArgumentException";
            throw err;
        }else if(!((typeof Group_idGroup) == "number" && Group_idGroup >= 0) || (typeof Group_idGroup) != "number" ||
         isNaN(Group_idGroup)){
            err = new Error("Error en el parámetro grupo");
            err.name = "ArgumentException";
            throw err;
        }else if(((typeof Team_idTeam) == "number" && Team_idTeam < 0) || 
             isNaN(Team_idTeam)){
            err = new Error("Error en el parámetro equipo");
            err.name = "ArgumentException";
            throw err;
        }

        // properties

        this.name = name;
        this.surname = surname;
        this.birthdate = birthdate;
        this.gender = gender;
        this.dorsal = dorsal;
        this.Group_idGroup = Group_idGroup;
        this.Team_idTeam = Team_idTeam;


        //public methods
        this.toArray = function(arJoin){

            var ar = new Array(this.name,this.surname,this.birthdate, this.gender,this.dorsal,this.Group_idGroup, this.Team_idTeam);
            if(Array.isArray(arJoin)){
                return ar.concat(arJoin);
            }else{
                return ar;
            }
        };

    };

    return {
        Competitor: Competitor
    }

});




