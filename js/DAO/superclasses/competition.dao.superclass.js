define(function() {


    var insertWithUser = function(comp, idUser) {
        checkObjectCompetition(comp);
        if (typeof idUser !== "number" || idUser < 0) {
            err = new Error("Error en el parámetro idUser");
            err.name = "ArgumentException";
            throw err;
        }

    };


    var insert = function(comp) {
        checkObjectCompetition(comp);
    };


    var selectAllByUser = function(idUser, rolUser, callBack) {

        if (typeof idUser !== "number" || idUser < 0) {
            err = new Error("Error en el parámetro idUser");
            err.name = "ArgumentException";
            throw err;
        } else if (typeof rolUser !== "number") {
            err = new Error("Error en el parámetro rolUser");
            err.name = "ArgumentException";
            throw err;
        } else if (typeof callBack !== "function") {
            err = new Error("Error en el parámetro callBack");
            err.name = "ArgumentException";
            throw err;
        }

    };


    var selectAll = function(callBack) {

        if (typeof callBack !== "function") {
            err = new Error("Error en el parámetro callBack");
            err.name = "ArgumentException";
            throw err;
        }

    };


    var remove = function(id, success) {

        if (typeof id !== "number" || id < 0) {
            err = new Error("Error en el parámetro idUser");
            err.name = "ArgumentException";
            throw err;
        } else if(typeof success !== "function"){
            err = new Error("Error en el parámetro success");
            err.name = "ArgumentException";
            throw err;            
        }
    };


    var update = function(id, comp, success, error) {

        checkObjectCompetition(comp);
        if (typeof id !== "number" || id < 0) {
            err = new Error("Error en el parámetro idUser");
            err.name = "ArgumentException";
            throw err;
        } else if(typeof error !== "function"){
            err = new Error("Error en el parámetro error");
            err.name = "ArgumentException";
            throw err;            
        } else if(typeof success !== "function"){
            err = new Error("Error en el parámetro success");
            err.name = "ArgumentException";
            throw err;            
        }

    };


    var selectById = function(id) {
        if (typeof id !== "number" || id < 0) {
            err = new Error("Error en el parámetro idUser");
            err.name = "ArgumentException";
            throw err;
        }
    };


    var selectByName = function(name) {
        if (typeof name !== "string") {
            err = new Error("Error en el parámetro name");
            err.name = "ArgumentException";
            throw err;
        }
    };  

    /****************************************/
    /***********PRIVATE FUNCTIONS************/
    /****************************************/

    function checkObjectCompetition(competition) {

        if (typeof competition !== "object") {
            err = new Error("Error en el objeto Competition");
            err.name = "ArgumentException";
            throw err;

        } else if (typeof competition.name !== "string") {
            err = new Error("Error en la propiedad name del objeto Competition");
            err.name = "ArgumentException";
            throw err;

        } else if (typeof competition.location !== "string" && competition.location !== null) {
            err = new Error("Error en la propiedad location del objeto Competition");
            err.name = "ArgumentException";
            throw err;

        } else if (typeof competition.start !== "string" && competition.start !== null) {
            err = new Error("Error en la propiedad start del objeto Competition");
            err.name = "ArgumentException";
            throw err;

        } else if (typeof competition.end !== "string" && competition.end !== null) {
            err = new Error("Error en la propiedad end del objeto Competition");
            err.name = "ArgumentException";
            throw err;

        } else if (typeof competition.organizer !== "string" && competition.organizer !== null) {
            err = new Error("Error en la propiedad organizer del objeto Competition");
            err.name = "ArgumentException";
            throw err;

        } else if (typeof competition.logo !== "string" && competition.logo !== null) {
            err = new Error("Error en la propiedad logo del objeto Competition");
            err.name = "ArgumentException";
            throw err;
        } else if (typeof competition.toArray !== "function") {
            err = new Error("Error en la propiedad toArray del objeto Competition");
            err.name = "ArgumentException";
            throw err;
        }
    }


    return {

        insert: insert,
        selectAll: selectAll,
        remove: remove,
        update: update,
        selectById: selectById,
        selectAllByUser: selectAllByUser,
        insertWithUser: insertWithUser,
        selectByName : selectByName
    }

});