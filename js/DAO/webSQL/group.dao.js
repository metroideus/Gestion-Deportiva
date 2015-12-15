/**
 * @file Manages the persistence.
 * @author David Doña Corrales <david.dona.corrales@gmail.com>
 * @license Open-Source
 */

define(["app.utils"], function(utils) {
    /**
     * Module for management data referring to group.
     * @module group
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
     * Inserts a new group into the competition.
     * @function
     * @memberof! persistence.group
     * @param {number} idComp - id of competition where the group belongs.
     * @param {Group} group - object to be inserted
     * @return {Promise.<null,error>}
     */
    var insert = function(idComp, group) {
        var def = new Promise();

        var db = connection.getInstance();

        $.when(this.selectNamesByCompetition(idComp))
            .done(function(l) {

                if (!utils.stringInList(group.name, l)) { //if the name of group isn't in the competition...
                    db.transaction(function(tx) {
                        tx.executeSql('insert into "Group" (Competition_idCompetition,name,Group_idGroup) values(?,?,?)', [idComp, group.name, group.Group_idGroup]);
                    }, def.error, def.success);
                } else {
                    def.error("Existe ya un elemento con el mismo nombre");
                }

            }).fail(function(err) {
                def.error(err);
            });

        return def.promise();

    };

    //takes a list of attributes of the table and does "select"
    //"arguments.length - 1" is the number of attributes for to do the "select"
    //The last argument is always "idComp".
    var selectByCompetition = function() {
        var def = new Promise();

        var db = connection.getInstance();
        var idComp = arguments[arguments.length - 1];
        var query = 'SELECT ';
        var i;

        for (i = 0; i < arguments.length - 1; i++) {
            query = query.concat(arguments[i], ",");
        }

        query = query.slice(0, query.length - 1);
        query = query.concat(' from "Group" where Competition_idCompetition=?');

        db.transaction(function(tx) {
            tx.executeSql(query, [idComp], function(tx, rs) {

                def.success(tx, rs.rows);

            }, def.error);
        });
        return def.promise();

    };

    /**
     * Selects all groups belongs to a competition.
     * @function
     * @memberof! persistence.group
     * @param {number} idComp - id of competition where the group belongs.
     * @param {Group} group - object to be inserted
     * @return {Promise.<List<Group>,error>}
     */
    var selectAllByCompetition = function(idComp) {
        return selectByCompetition("idGroup", "Competition_idCompetition", "name", "Group_idGroup", idComp);
    };

    /**
     * Gets a list with names of groups belonging to a competition.
     * @function
     * @memberof! persistence.group
     * @param {number} idComp - id of competition where the group belongs.
     * @return {Promise.<List<Group>,error>}
     */
    var selectNamesByCompetition = function(idComp) {
        return selectByCompetition("name", idComp);
    };

    /**
     * Gets a list with names of groups belonging to a competition.
     * @function
     * @memberof! persistence.group
     * @param {number} idComp - id of competition where the group belongs.
     * @return {Promise.<List<Group>,error>}
     */
    var selectIdNameByCompetition = function(idComp) {
        return selectByCompetition("idGroup", "name", idComp);
    };

    var selectListOfSubgroups = function(idComp, idGroup) {
        var db = connection.getInstance();
        var def = new Promise();

        $.when(selectByCompetition("idGroup", "Group_idGroup", idComp))
            .done(function(l) {
                var listSubgroups = new Array(); //subgroups of group selected

                //this function write in "listSubgroups" all the tree of subgroups of group with id "id".
                function listOfSubgroups(id) {
                    var list = utils.getChildren(id, l);
                    if (list != null) {
                        listSubgroups = listSubgroups.concat(list);
                        list.forEach(listOfSubgroups);
                    }
                }

                listOfSubgroups(idGroup); //get in the variable "listSubgroups" the subtree belonging to group
                def.success(null, listSubgroups);
            }).fail(function(err) {
                def.error(err);
            });

        return def.promise();
    };


    var selectNameById = function(idGroup) {
        var db = connection.getInstance();
        var def = new Promise();

        var query = "SELECT name FROM 'Group' WHERE idGroup=?";

        db.transaction(function(tx) {
            tx.executeSql(query, [idGroup], function(tx, rs) {
                if (rs.rows.length > 0) {
                    def.success(tx, rs.rows.item(0));
                } else {
                    def.success(tx, null);
                }
            }, def.error);
        });

        return def.promise();
    };


    var selectById = function(idGroup) {
        var db = connection.getInstance();
        var def = new Promise();

        var query = "SELECT * FROM 'Group' WHERE idGroup=?";

        db.transaction(function(tx) {
            tx.executeSql(query, [idGroup], function(tx, rs) {
                if (rs.rows.length > 0) {
                    def.success(tx, rs.rows.item(0));
                } else {
                    def.success(tx, null);
                }
            }, def.error);
        });

        return def.promise();
    };


    var remove = function(idComp, idGroup) {
        var db = connection.getInstance();
        var def = new Promise();

        var query = 'DELETE FROM "Group" WHERE idGroup=?';
        var i;

        $.when(selectListOfSubgroups(idComp, idGroup))
            .done(function(l) {
                db.transaction(function(tx) {

                    for (i = 0; i < l.length; i++) {
                        tx.executeSql(query, [l[i]]);
                    }
                    tx.executeSql(query, [idGroup]);

                }, def.error, def.success);
            }).fail(function(err) {
                def.error("No se pudo completar el borrado");
            })
        return def.promise();

    };

    var update = function(idComp, idGroup, group) {
        var def = new Promise();

        var db = connection.getInstance();
        var query = 'UPDATE "Group" SET name=?, Group_idGroup=? WHERE idGroup=?';

        $.when(this.selectIdNameByCompetition(idComp))
            .done(function(l) {
                //if the name of group hasn't changed or doesn't exist in the competition...
                if (utils.getNameGroupOfList(idGroup, l) == group.name ||
                    !utils.stringInList(group.name, l)) {
                    db.transaction(function(tx) {
                        tx.executeSql(query, group.toArray([idGroup]));
                    }, def.error, def.success);

                } else {
                    def.error("Existe ya un elemento con el mismo nombre");
                }

            }).fail(function(err) {
                def.error(err);
            });

        return def.promise();

    };

    return {

        insert: insert,
        selectAllByCompetition: selectAllByCompetition,
        selectNamesByCompetition: selectNamesByCompetition,
        selectIdNameByCompetition: selectIdNameByCompetition,
        selectNameById: selectNameById,
        selectById: selectById,
        selectListOfSubgroups: selectListOfSubgroups,
        remove: remove,
        update: update
    }



});