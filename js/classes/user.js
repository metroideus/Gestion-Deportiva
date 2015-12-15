//class user

define(function () {
    //private methods
    var isValidString = function(str){
        var regExpression = /^[A-Za-z0-9]+$/; //checks the word. Only matches a string with basic characters A-Z, a-z, 0-9 without spaces
        return regExpression.test(str);
    }
    

    //public methods
    var User = function(nick, pass, rol){  
        var err;
        var rolEnum = [0,1,2];

        if(arguments.length != 3){
            err = new Error("Número de argumentos incorrecto");
            err.name = "ArgumentException";
            throw err;
        }
        if((typeof nick) != "string" || !isValidString(nick)){
            err = new Error("Error en el parámetro Nick");
            err.name = "ArgumentException";
            throw err;


        }else if((typeof pass) != "string" || !isValidString(pass)){
            err = new Error("Error en el parámetro Contraseña");
            err.name = "ArgumentException";
            throw err;

            
        }else if((typeof rol) != "number" || (rolEnum.indexOf(rol) == -1)){
            err = new Error("Error en el parámetro rol");
            err.name = "ArgumentException";
            throw err;
        }

        // properties
        this.nick = nick;
        this.password = pass;
        this.rol = rol;

        this.toArray = function(arJoin){

            var ar = new Array(this.nick,this.password,this.rol);
            if(Array.isArray(arJoin)){
                return ar.concat(arJoin);
            }else{
                return ar;
            }
        };

    };

    return {
        User: User
    }

});




