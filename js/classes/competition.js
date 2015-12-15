//class competition

define(function () {
    
  // Private methods
    var isValidDate = function(date) {

        if((typeof date) != "string"){
            return false;
        }
        var aux = date.split("-");

        if(date =="" || (aux.length == 3 && parseInt(aux[0]) > 1970 && parseInt(aux[0]) < 2999 &&
            parseInt(aux[1]) > 0 && parseInt(aux[1]) <= 12 && parseInt(aux[2]) > 0 && 
            parseInt(aux[2]) <= 31)){

            return true;

        }else{
            return false;
        }
    }

    var isValidImage = function(str){
        if(str == ""){
            return true;
        }
        var regExpression =  /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
        return regExpression.test(str);
    }

    var isValidString = function(str){
        var regExpression = /^\s+|\s+$/;
        //var regExpression = /^[A-Za-z0-9".-]+( [A-Za-z0-9".-]+)*$/; //checks the word. Only matches a simple sentence with letters and numbers
        return !regExpression.test(str) && str !== "";
    }


    //public methods
    var Competition = function(name, location, start, end, organizer, logo){
        var err;

        if(arguments.length != 6){
            err = new Error("Número de argumentos incorrecto");
            err.name = "ArgumentException";
            throw err;
        }
        if((typeof name) != "string" || !isValidString(name)){
            err = new Error("Error en el campo nombre");
            err.name = "ArgumentException";
            throw err;            
        }else if((typeof location) != "string" || (location != "" && !isValidString(location))){
            err = new Error("Error en el campo ciudad");
            err.name = "ArgumentException";
            throw err; 
        }else if(!isValidDate(start)){
            err = new Error("Error en el campo fecha comienzo");
            err.name = "ArgumentException";
            throw err; 
        }else if(!isValidDate(end)){
            err = new Error("Error en el campo fecha finalización");
            err.name = "ArgumentException";
            throw err; 
        }else if((typeof organizer) != "string" || (organizer != "" && !isValidString(organizer))){
            err = new Error("Error en el campo organizador");
            err.name = "ArgumentException";
            throw err; 
        }else if((typeof logo) != "string" &&  logo !== null){
            err = new Error("Error en el campo logo");
            err.name = "ArgumentException";
            throw err; 
        }else if((typeof logo) == "string" &&  !isValidImage(logo)){
            err = new Error("La imagen no está codificada en base64");
            err.name = "ImageException";
            throw err; 
        }else if((new Date(start)) > (new Date(end))){
            err = new Error("Las fechas de inicio y fin no son congruentes");
            err.name = "ArgumentException";
            throw err; 
        }


        // properties
        this.name = name;
        this.location = location;
        this.start = start;
        this.end = end;
        this.organizer = organizer;
        this.logo = logo;

        
        this.toArray = function(arJoin){ //take care with change of order of values in the array.

            var ar = new Array(this.name,this.location,this.start,this.end,this.organizer,this.logo);
            if(Array.isArray(arJoin)){
                return ar.concat(arJoin);
            }else{
                return ar;
            }
        };

    };

    return {
        Competition: Competition
    }
});




