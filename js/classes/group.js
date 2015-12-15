//class group

define(function () {
    //private methods
    var isValidString = function(str){
        var regExpression = /^\s+|\s+$/;
        //var regExpression = /^[A-Za-z0-9".-]+( [A-Za-z0-9".-]+)*$/; //checks the word. Only matches a simple sentence with letters and numbers
        return !regExpression.test(str) && str !== "";
    }
    

    //public methods
    var Group = function(name, Group_idGroup){  
        var err;

        if(arguments.length != 2){
            err = new Error("Número de argumentos incorrecto");
            err.name = "ArgumentException";
            throw err;
        }
        if((typeof name) != "string" || !isValidString(name)){
            err = new Error("Error en el parámetro Nombre");
            err.name = "ArgumentException";
            throw err;
        }else if(((typeof Group_idGroup) == "number" && Group_idGroup < 0) || 
            ((typeof Group_idGroup) != "number"  && Group_idGroup !== null) || isNaN(Group_idGroup)){
            err = new Error("Error en el parámetro Group_idGroup");
            err.name = "ArgumentException";
            throw err;
        }

        // properties
        this.name = name;
        this.Group_idGroup = Group_idGroup;

        this.toArray = function(arJoin){

            var ar = new Array(this.name,this.Group_idGroup);
            if(Array.isArray(arJoin)){
                return ar.concat(arJoin);
            }else{
                return ar;
            }
        };

    };

    return {
        Group: Group
    }

});




