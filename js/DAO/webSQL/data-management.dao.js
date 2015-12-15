/**
 * @file Manages the persistence.
 * @author David Doña Corrales <david.dona.corrales@gmail.com>
 * @license Open-Source
 */

define(["app.utils"], function(utils) {
    /**
     * Module for management data of the application.
     * @namespace competition
     * @access public
     * @memberof persistence
     */


    //throw new Error(err.message) don't works
    var errorCB = function(err) {
        console.log(err)
    };
    var successCB = function() {
        console.log("ok")
    };


    //class for to use in promises management
    function Promise() {
        // properties
        var def = $.Deferred();

        //functions
        this.success = function(tx, rs) {
            def.resolve(rs);
        }
        this.error = function(err) {
            def.reject(err)
        }
        this.promise = function() {
            return def.promise();
        }

    };

    /******************************************************/
    /***********CONNECTION TO DB (SINGLETON)***************/
    /******************************************************/

    /**
     * Allows to get the connection to database (implemented with Singleton pattern).
     * @function
     * @access public
     * @memberof! persistence
     * @return {object}   connection to database
     */
    var connection = (function() {
        var db = null;
        var getInstance = function() {
            if (db == null) {
                db = openDatabase('database', '1.0', 'sqlite database', 5 * 1024 * 1024);
                return db;
            }
            return db;
        }
        return {
            getInstance: getInstance
        }

    }());



    function makeInsert(row, nameTable) {
        var i;
        var query = "INSERT INTO " + nameTable + " (";
        var nameCols = "";
        var valRow = "values(";
        var aux;

        for (j = 0; j < Object.keys(row).length; j++) { //aqui tengo cada propiedad del objeto
            nameCols = nameCols + Object.keys(row)[j] + ",";
            if (typeof row[Object.keys(row)[j]] == "number") {
                valRow = valRow + row[Object.keys(row)[j]] + ","; // obj["name property"]
            } else {
                valRow = valRow + "'" + row[Object.keys(row)[j]] + "'" + ",";
            }

        }
        nameCols = nameCols.slice(0, nameCols.length - 1);
        nameCols = nameCols + ")"
        valRow = valRow.slice(0, valRow.length - 1);
        valRow = valRow + ");"

        query = query + nameCols + " " + valRow;

        return utils.stringParseNullValues(query);

    }

    function convertResults(resultset) {
        var results = new Array();
        var i, prop, obj, row;

        for (var i = 0; i < resultset.rows.length; i++) {
            row = resultset.rows.item(i);
            results.push(row);
        }
        return results;
    }

    function tableBackup(table) {
        var db = connection.getInstance();
        var def = new Promise();

        db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM " + table, [], function(tx, rs) {
                var data = convertResults(rs);
                //console.log(data);
                def.success(tx, data);
            }, def.error);
        });

        return def.promise();
    }

    function createBackup() {
        var i;
        var tables = ["Competition", "Test", "'Group'", "Team", "Competitor", "AsignedTest", "Mark", "User", "UserCompetition"];
        var appData = {};
        var def = new Promise();

        for (i = 0; i < tables.length; i++) {
            (function(i) { //this auto-executable function is for to save correctly the value of "i"
                $.when(tableBackup(tables[i]))
                    .done(function(data) {
                        appData[tables[i]] = data;
                        //the asynchronous call can be executed in random order. For that, each one checks if it finished the operations.
                        if (Object.keys(appData).length == tables.length) {
                            def.success(null, appData);
                        }
                    })
                    .fail(function(err) {
                        def.error(err);
                    })
            }(i));

        }
        return def.promise();
    }

    function tableDelete(table) {
        var db = connection.getInstance();
        var def = new Promise();

        db.transaction(function(tx) {
            tx.executeSql("DELETE FROM " + table, []);
        }, def.error, def.success);

        return def.promise();
    }

    function dataDelete() {
        var db = connection.getInstance();
        var def = new Promise();

        var tables = ["Competition", "Test", "'Group'", "Team", "Competitor", "AsignedTest", "Mark", "User", "UserCompetition"];
        var deleted = 0;
        for (i = 0; i < tables.length; i++) {
            (function(i) { //this auto-executable function is for to save correctly the value of "i"
                $.when(tableDelete(tables[i]))
                    .done(function() {
                        deleted++;
                        //the asynchronous call can be executed in random order. For that, each one checks if it finished the operations.
                        if (deleted == tables.length) {
                            def.success(null, null);
                        }
                    })
                    .fail(function(err) {
                        def.error(err);
                    })
            }(i));
        }

        return def.promise();
    }



    function restoreBackup(appData) {
        var db = connection.getInstance();
        var def = new Promise();

        var i, j;
        var dataTable, query, obj, tableName;
        $.when(dataDelete())
            .done(function() {
                for (i = 0; i < Object.keys(appData).length; i++) {
                    dataTable = appData[Object.keys(appData)[i]];
                    tableName = Object.keys(appData)[i];
                    (function(dataTable, tableName) {
                        db.transaction(function(tx) {
                            for (j = 0; j < dataTable.length; j++) { //aqui tengo cada elemento del array
                                obj = dataTable[j];
                                query = makeInsert(obj, tableName);
                                tx.executeSql(query);
                            }
                        }, def.error);
                    }(dataTable, tableName));
                }
                def.success(null, null);

            }).fail(function(err) {
                def.error(err);
            })

        return def.promise();

    }


    return {
        createBackup: createBackup,
        restoreBackup: restoreBackup,
        dataDelete: dataDelete
    }


});