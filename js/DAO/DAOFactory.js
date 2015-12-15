/**
 * @file Manages the persistence (Factory Method pattern).
 * @author David Doña Corrales <david.dona.corrales@gmail.com>
 * @license Open-Source
 */

define(function () {
    
    // Private vars
    var baseURL_DAO = "DAO/"
    //sets the implementation of persistence (DAO). The value of var DAO must be the name of module without extension ".js".
    var implementation = {name: "dao-sqlite", url: "webSQL/dao-sqlite"};

    //methods
    var getDAO = function(){

        switch(implementation.name){

            //Implementation of an internal non-shared database
            case "dao-sqlite":

                if(localStorage.getItem("dbCreated") == null || localStorage.getItem("dbCreated") == "false"){
                    require([baseURL_DAO + implementation.url], function(persistence) {
                        persistence.createDB(function(){localStorage.setItem("dbCreated","true")});
                    });
                    
                };
                break;

            //To add other implementations
            //...
    
            default:
                console.log("no selected implementation or an internal error");

        }

        return implementation.url;

    };
        

    return {
        getDAO: getDAO
    }
});
