/**
 * @file Manages the persistence.
 * @author David Doña Corrales <david.dona.corrales@gmail.com>
 * @license Open-Source
 */

define([], function() {
    /**
     * Module for management data referring to marks.
     * @module mark
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



    var insertDistance = function(n, asignedTest) {
        var def = new Promise();

        var db = connection.getInstance();

        $.when(selectByAsignedTest(asignedTest, null))
            .done(function(l) {
                db.transaction(function(tx) {
                    tx.executeSql('insert into Mark (quantity, AsignedTest_idAsignedTest, attempt) ' +
                        'values(?,?,?)', [n, asignedTest, l.length + 1]);
                }, def.error, def.success);
            }).fail(function(err) {
                def.error(err);
            })
        return def.promise();
    };

    var insertNumeric = function(n, asignedTest) {
        insertDistance(n, asignedTest);
    };

    var insertTime = function(h, m, s, asignedTest) {
        var def = new Promise();

        var db = connection.getInstance();
        $.when(selectByAsignedTest(asignedTest, null))
            .done(function(l) {
                db.transaction(function(tx) {
                    tx.executeSql('insert into Mark (hours, minutes, seconds, AsignedTest_idAsignedTest,attempt) ' +
                        'values(?,?,?,?,?)', [h, m, s, asignedTest, l.length + 1], def.success, def.error);
                });
            }).fail(function(err) {
                def.error(err);
            })
        return def.promise();
    };

    var selectByAsignedTest = function(idAsignedTest, result) {
        var db = connection.getInstance();
        var def = new Promise();

        var aux;
        if (result == "distance" || result == "numeric") {
            aux = ",quantity"
        } else {
            aux = ",hours,minutes,seconds"
        }
        var query = 'SELECT idMark, attempt' + aux + ' FROM Mark WHERE AsignedTest_idAsignedTest=?';
        db.transaction(function(tx) {
            tx.executeSql(query, [idAsignedTest], function(tx, rs) {
                def.success(tx, rs.rows);
            }, def.error);
        });

        return def.promise();

    }

    var removeAllMarkByAsignedTest = function(idAsignedTest) {
        var db = connection.getInstance();
        var query = 'DELETE FROM Mark WHERE AsignedTest_idAsignedTest=?';

        db.transaction(function(tx) {
            tx.executeSql(query, [idAsignedTest], function(tx, rs) {}, errorCB);
        });
    }


    var remove = function(id) {

        var db = connection.getInstance();
        var query = 'DELETE FROM Mark WHERE idMark=?';

        db.transaction(function(tx) {
            tx.executeSql(query, [id], function(tx, rs) {}, errorCB);
        });

    };

    var updateQuantity = function(idMark, n) {

        var def = new Promise();

        var db = connection.getInstance();
        var query = 'UPDATE Mark SET quantity=? WHERE idMark=?';

        db.transaction(function(tx) {
            tx.executeSql(query, [n, idMark]);
        }, def.error, def.success);

        return def.promise();
    };


    var updateTime = function(idMark, h, m, s) {

        var def = new Promise();

        var db = connection.getInstance();
        var query = 'UPDATE Mark SET hours=?, minutes=?, seconds=? WHERE idMark=?';

        db.transaction(function(tx) {
            tx.executeSql(query, [h, m, s, idMark]);
        }, def.error, def.success);

        return def.promise();
    };

    return {

        insertDistance: insertDistance,
        insertNumeric: insertNumeric,
        insertTime: insertTime,
        selectByAsignedTest: selectByAsignedTest,
        remove: remove,
        updateQuantity: updateQuantity,
        updateTime: updateTime,
        removeAllMarkByAsignedTest: removeAllMarkByAsignedTest
    }


});