/**
 * @file Manages the persistence.
 * @author David Doña Corrales <david.dona.corrales@gmail.com>
 * @license Open-Source
 */

define(["../superclasses/competition.dao.superclass"], function(superClass) {
    /**
     * Module for management data referring to competitions.
     * @module competition
     * @access public
     */

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
     * @memberof! competition
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
     * Inserts a new competition associating it with the user with id "idUser".
     * @function
     * @memberof! competition
     * @param {Competition} comp - object type Competition to be inserted
     * @param {number} idUser - a integer with the user's id.
     * @return {Promise.<null,null>}
     */
    var insertWithUser = function(comp, idUser) {
        superClass.insertWithUser.call(this, comp, idUser); //call to Super

        var promise = new Promise();
        var db = connection.getInstance();

        $.when(insert(comp))
            .done(function(rs) {

                var query = 'insert into UserCompetition (User_idUser, Competition_idCompetition) values(?,?)';
                db.transaction(function(tx) {
                    tx.executeSql(query, [idUser, rs.insertId]);
                }, promise.error, promise.success);

            }).fail(function(err) {
                promise.error(err);
            })

        return promise.promise();

    };

    /**
     * Inserts a new competition without associating it. To use when the competition's scope is only for administrators.
     * @function
     * @memberof! persistence.competition
     * @param {Competition} comp - object type Competition to be inserted
     * @param {number} idUser - a integer with the user's id.
     * @return {Promise.<null,null>}
     */
    var insert = function(comp) {
        superClass.insert.call(this, comp); //call to Super

        var def = new Promise();
        var db = connection.getInstance();
        var query = 'insert into Competition (name,location,start,end,organizer,logo) values(?,?,?,?,?,?)';

        $.when(selectByName(comp.name))
            .done(function(res) {
                if (res === null) {
                    db.transaction(function(tx) {
                        tx.executeSql(query, comp.toArray(), def.success, def.error);
                    });
                } else {
                    def.error("Error: Existe ya una competición en la aplicación con el mismo nombre");
                }

            }).fail(function(err) {
                def.error(err);
            })



        return def.promise();
    };

    /**
     * Selects all competitions that the user with id "idUser" has access.
     * @function
     * @memberof! persistence.competition
     * @param {number} idUser - id of user.
     * @param {number} rolUser - a integer with the user's id.
     * @param {function} callBack - function to management the result of the request.
     */
    var selectAllByUser = function(idUser, rolUser, callBack) {
        superClass.selectAllByUser.call(this, idUser, rolUser, callBack); //call to Super

        var db = connection.getInstance();
        var query = 'SELECT * from Competition';

        if (rolUser !== 2) {
            query = query + " WHERE idCompetition IN (SELECT Competition_idCompetition FROM UserCompetition WHERE User_idUser=" + idUser + ")";
        }

        db.transaction(function(tx) {
            tx.executeSql(query, [], function(tx, rs) {

                callBack(rs.rows);

            }, errorCB);
        });

    };

    /**
     * Selects all competitions existing.
     * @function
     * @memberof! persistence.competition
     * @param {function} callBack - function to management the result of the request.
     * @return {undefined}
     */
    var selectAll = function(callBack) {
        superClass.selectAll.call(this, callBack); //call to Super

        var db = connection.getInstance();
        var query = 'SELECT * from Competition';

        db.transaction(function(tx) {
            tx.executeSql(query, [], function(tx, rs) {

                callBack(rs.rows);

            }, errorCB);
        });

    };

    /**
     * Remove a competition.
     * @function
     * @memberof! persistence.competition
     * @param {number} id - id of competition.
     * @param {function} success - function to execute when the operation has had success.
     * @return {undefined}
     */
    var remove = function(id, success) {
        superClass.remove.call(this, id, success); //call to Super

        var db = connection.getInstance();
        var query = 'DELETE FROM Competition WHERE idCompetition=?';

        db.transaction(function(tx) {
            tx.executeSql(query, [id], function(tx, rs) {
                success()
            }, errorCB);
        });

    };

    /**
     * Update a competition.
     * @function
     * @memberof! persistence.competition
     * @param {number} id - id of competition.
     * @param {Competition} comp - Competition with data to update.
     * @param {function} success - function to execute when the operation has had success.
     * @param {function} error - function to execute when happens some error.
     * @return {undefined}
     */
    var update = function(id, comp, success, error) {
        superClass.update.call(this, id, comp, success, error); //call to Super

        var db = connection.getInstance();
        var query = 'UPDATE Competition SET name=?, location=?, start=?, end=?, organizer=?, logo=? WHERE idCompetition=?';

        db.transaction(function(tx) {
            tx.executeSql(query, comp.toArray([id]), function(tx, rs) {
                success();
            }, error);
        });

    };


    /**
     * Gets a competition by id.
     * @function
     * @memberof! persistence.competition
     * @param {number} id - id of competition.
     * @return {Promise.<Competition,error>}
     */
    var selectById = function(id) {
        superClass.selectById.call(this, id); //call to Super

        var def = new Promise();

        var db = connection.getInstance();
        var query = 'SELECT * from Competition where idCompetition=?';

        db.transaction(function(tx) {
            tx.executeSql(query, [id], function(tx, rs) {
                if (rs.rows.length > 0) {
                    def.success(tx, rs.rows.item(0));
                } else {
                    def.success(tx, null);
                }
            }, def.error);
        });

        return def.promise();
    };


    var selectByName = function(name) {
        superClass.selectByName.call(this, name); //call to Super

        var def = new Promise();

        var db = connection.getInstance();
        var query = 'SELECT * from Competition where name=?';

        db.transaction(function(tx) {
            tx.executeSql(query, [name], function(tx, rs) {
                if (rs.rows.length > 0) {
                    def.success(tx, rs.rows.item(0));
                } else {
                    def.success(tx, null);
                }
            }, def.error);
        });

        return def.promise();
    };

    return {

        insert: insert,
        selectAll: selectAll,
        remove: remove,
        update: update,
        selectById: selectById,
        selectAllByUser: selectAllByUser,
        insertWithUser: insertWithUser
    }

});