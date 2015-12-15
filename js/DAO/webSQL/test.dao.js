/**
 * @file Manages the persistence.
 * @author David Doña Corrales <david.dona.corrales@gmail.com>
 * @license Open-Source
 */

define(["app.utils"], function(utils) {

    /**
     * Module for management data referring to tests.
     * @module test
     * @access public
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



    /**
     * Inserts a new test into the competition.
     * @function
     * @memberof! persistence.test
     * @param {Test} test - object to be inserted
     * @param {function} success - function to execute when the operation has had success.
     * @param {function} error - function to execute when happens some error.
     * @return {null}
     */
    var insert = function(test, success, error) {

        var db = connection.getInstance();
        db.transaction(function(tx) {
            tx.executeSql('insert into Test (Competition_idCompetition, name, type, result, bestMark) values(?,?,?,?,?)', [test.Competition_idCompetition, test.name, test.type, test.result, test.bestMark]);

        }, error, success);
    };

    /**
     * Select all tests by id of competition.
     * @function
     * @memberof! persistence.test
     * @param {number} idComp
     * @param {function} callBack - function to management the result of the request.
     * @return {null}
     */
    var selectAllByCompetition = function(idComp, callBack) {

        var db = connection.getInstance();
        var query = 'SELECT * from Test where Competition_idCompetition=?';

        db.transaction(function(tx) {
            tx.executeSql(query, [idComp], function(tx, rs) {

                callBack(rs.rows);

            }, errorCB);
        });

    };

    var selectAllPropertiesByCompetition = function(idComp) {

        var db = connection.getInstance();
        var def = new Promise();

        var query = 'SELECT * from Test where Competition_idCompetition=?';

        db.transaction(function(tx) {
            tx.executeSql(query, [idComp], function(tx, rs) {
                def.success(tx, rs.rows);
            }, def.error);
        });

        return def.promise();
    };


    /**
     * Gets a list of tests only with attributes "id" and "name".
     * @function
     * @memberof! persistence.test
     * @param {number} idComp - id of competition where getting the set of tests.
     * @return {Promise.<List<Test>,error>}
     */
    var selectIdNameByCompetition = function(idComp) {

        var db = connection.getInstance();
        var def = new Promise();

        var query = 'SELECT idTest, name from Test where Competition_idCompetition=?';

        db.transaction(function(tx) {
            tx.executeSql(query, [idComp], function(tx, rs) {
                def.success(tx, rs.rows);
            }, def.error);
        });

        return def.promise();
    };

    /**
     * @function
     * @memberof! persistence.test
     * @param {number} idComp - id of competition where getting the set of tests.
     * @param {function} callBack - function to management the result of the request.
     */
    var selectNamesByCompetition = function(idComp, callBack) {

        var db = connection.getInstance();
        var query = 'SELECT name from Test where Competition_idCompetition=?';

        db.transaction(function(tx) {
            tx.executeSql(query, [idComp], function(tx, rs) {
                callBack(rs.rows);
            }, errorCB);
        });
    };

    /**
     * @function
     * @memberof! persistence.test
     * @param {number} id - id of test to remove.
     */
    var remove = function(id) {

        var db = connection.getInstance();
        var query = 'DELETE FROM Test WHERE idTest=?';

        db.transaction(function(tx) {
            tx.executeSql(query, [id], function(tx, rs) {}, errorCB);
        });

    };


    var isAsigned = function(id) {
        var def = new Promise();

        var db = connection.getInstance();
        var query = 'SELECT Test_idTest from AsignedTest where Test_idTest=?';

        db.transaction(function(tx) {
            tx.executeSql(query, [id], function(tx, rs) {
                if (rs.rows.length > 0) {
                    def.success(tx, true);
                } else {
                    def.success(tx, false);
                }

            }, def.error);
        });

        return def.promise();
    }

    /**
     * @function
     * @memberof! persistence.test
     * @param {number} idComp - id of competition where the test belongs.
     * @param {number} idTest - id of the test to update.
     * @return {Promise.<null,error>}
     */
    var update = function(idComp, idTest, test) {
        var def = new Promise();

        var db = connection.getInstance();
        var query = 'UPDATE Test SET name=?, type=?, result=?, bestMark=? WHERE idTest=?';

        $.when(isAsigned(idTest), selectAllPropertiesByCompetition(idComp))
            .done(function(asign, l) {
                var oldTest = utils.getTestOfList(idTest, l);

                if (asign && (oldTest.type != test.type || oldTest.result != test.result)) {
                    def.error("No se puede cambiar el tipo o el resultado de una prueba que está asignada");
                } else if (utils.getTestOfList(idTest, l).name == test.name ||
                    !utils.stringInList(test.name, l)) { //if the name of test hasn't changed or doesn't exist in the competition...

                    db.transaction(function(tx) {
                        tx.executeSql(query, test.toArray([idTest]));
                    }, def.error, def.success);

                } else {
                    def.error("Existe ya un elemento con el mismo nombre");
                }
            }).fail(function(err) {
                def.error(err);
            })

        return def.promise();

    };

    /**
     * @function
     * @memberof! persistence.test
     * @param {number} id - id of test.
     * @return {Promise.<Test,error>}
     */
    var selectById = function(id) {

        var db = connection.getInstance();
        var def = new Promise();

        var query = 'SELECT * from Test where idTest=?';

        db.transaction(function(tx) {
            tx.executeSql(query, [id], function(tx, rs) {
                def.success(tx, rs.rows.item(0));
            }, def.error);
        });

        return def.promise();
    };

    /**
     * Gets a list with all tests of type "individual".
     * @function
     * @memberof! persistence.test
     * @param {number} idCompetition - id of competition where the tests belongs.
     * @return {Promise.<List<Test>,error>}
     */
    var selectAllIndividualTestsByCompetition = function(idCompetition) {
        var def = new Promise();

        var db = connection.getInstance();
        var query = "SELECT idTest, name FROM Test WHERE Competition_idCompetition=? AND type='single'";

        db.transaction(function(tx) {
            tx.executeSql(query, [idCompetition], function(tx, rs) {
                def.success(tx, rs.rows);
            }, def.error);
        });
        return def.promise();

    };

    /**
     * Gets a list with all tests of type "Team".
     * @function
     * @memberof! persistence.test
     * @param {number} idCompetition - id of competition where the tests belongs.
     * @return {Promise.<List<Test>,error>}
     */
    var selectAllTeamTestsByCompetition = function(idCompetition) {
        var def = new Promise();

        var db = connection.getInstance();
        var query = "SELECT idTest, name FROM Test WHERE Competition_idCompetition=? AND type='team'";

        db.transaction(function(tx) {
            tx.executeSql(query, [idCompetition], function(tx, rs) {
                def.success(tx, rs.rows);
            }, def.error);
        });
        return def.promise();
    }


    return {

        insert: insert,
        selectAllByCompetition: selectAllByCompetition,
        selectNamesByCompetition: selectNamesByCompetition,
        selectAllIndividualTestsByCompetition: selectAllIndividualTestsByCompetition,
        selectAllTeamTestsByCompetition: selectAllTeamTestsByCompetition,
        selectIdNameByCompetition: selectIdNameByCompetition,
        remove: remove,
        update: update,
        selectById: selectById
    }



});