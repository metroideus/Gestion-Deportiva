/**
 * @file Manages the persistence.
 * @author David Doña Corrales <david.dona.corrales@gmail.com>
 * @license Open-Source
 */

define([], function() {
    /**
     * Module for management the users of the application.
     * @module user
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



    var validateUser = function(nick, password) {
        var def = $.Deferred();

        function success(tx, rs) {
            if (rs.rows.length === 0) {
                def.resolve({
                    result: false
                });
            } else {
                def.resolve({
                    result: true,
                    data: rs.rows.item(0)
                });
            }

        }

        function error(err) {
            def.reject(err)
        }
        var db = connection.getInstance();
        var query = 'SELECT idUser, rol FROM User WHERE nick=? AND password=?';

        db.transaction(function(tx) {
            tx.executeSql(query, [nick, password], success, error);
        });

        return def.promise();
    }

    var insertUser = function(user, asignedCompetitions) {
        var def = new Promise();

        var db = connection.getInstance();
        var query = 'insert into User (nick, password, rol) ' +
            'values(?,?,?)';

        db.transaction(function(tx) {
            tx.executeSql(query, user.toArray(), def.success, def.error);
        });

        return def.promise();

    }

    var insert = function(user, asignedCompetitions) {
        var def = new Promise();

        var db = connection.getInstance();

        $.when(insertUser(user))
            .then(function(rs) {
                if (user.rol != 2) {
                    return assignCompetitions(rs.insertId, asignedCompetitions);
                } else {
                    return new $.Deferred().resolve();
                }
            }).done(function() {
                def.success(null, null);
            }).fail(function(err) {
                def.error(err);
            });

        return def.promise();

    };

    //takes a list of attributes of the table and does "select".
    var _select = function() {
        var def = new Promise();

        var db = connection.getInstance();
        var query = 'SELECT ';
        var i;

        for (i = 0; i < arguments.length; i++) {
            query = query.concat(arguments[i], ",")
        }

        query = query.slice(0, query.length - 1);
        query = query.concat(' from User');

        db.transaction(function(tx) {
            tx.executeSql(query, [], function(tx, rs) {

                def.success(tx, rs.rows);

            }, def.error);
        });
        return def.promise();

    };

    var selectAll = function() {
        return _select("idUser", "nick", "password", "rol");
    };

    var selectRol = function() {
        return _select("rol");
    };

    var selectUserInfo = function(idUser, withPass) {
        var def = new Promise();

        $.when(selectById(idUser), selectAsignedCompetition(idUser))
            .done(function(user, listCompetition) {
                var newUser = {};
                if (withPass) {
                    newUser = user;
                } else {
                    newUser.nick = user.nick;
                    newUser.rol = user.rol;
                }
                newUser.competitions = listCompetition;
                def.success(null, newUser);
            }).fail(function() {
                def.error("The operation could not be completed");
            })
        return def.promise();
    };

    var selectIdNick = function() {
        return _select("idUser", "nick");
    };

    var selectAsignedCompetition = function(idUser) {
        var db = connection.getInstance();
        var def = new Promise();

        var query = "SELECT idCompetition, name FROM Competition WHERE idCompetition IN " +
            "(SELECT Competition_idCompetition FROM UserCompetition WHERE User_idUser=?)";

        db.transaction(function(tx) {
            tx.executeSql(query, [idUser], function(tx, rs) {
                def.success(tx, rs.rows);
            }, def.error);
        });

        return def.promise();
    }


    var selectById = function(idUser) {
        var db = connection.getInstance();
        var def = new Promise();

        var query = "SELECT nick, rol, password FROM User WHERE idUser=?";

        db.transaction(function(tx) {
            tx.executeSql(query, [idUser], function(tx, rs) {
                if (rs.rows.length > 0) {
                    def.success(tx, rs.rows.item(0));
                } else {
                    def.success(tx, null);
                }
            }, def.error);
        });

        return def.promise();
    };

    var remove = function(idUser) {
        var db = connection.getInstance();
        var def = new Promise();

        var query = 'DELETE FROM User WHERE idUser=?';
        var i, admin = 2;
        var cont = 0;

        $.when(selectById(idUser), selectRol())
            .done(function(user, l) {
                if (user.rol == admin) {
                    for (i = 0; i < l.length; i++) {
                        if (l.item(i).rol == admin) {
                            cont++;
                        }
                    }
                }
                if (user.rol == admin && cont < 2) {
                    def.error("Debe existir al menos un administrador en la aplicación");
                } else {
                    db.transaction(function(tx) {
                        tx.executeSql(query, [idUser]);
                    }, def.error, def.success);
                }
                return;
            }).fail(function(err) {
                def.error(err);
            })

        return def.promise();

    };

    var removeAllAsignedCompetition = function(idUser) {
        var db = connection.getInstance();
        var def = new Promise();

        var query = "DELETE FROM UserCompetition WHERE User_idUser=?";

        db.transaction(function(tx) {
            tx.executeSql(query, [idUser]);
        }, def.error, def.success);

        return def.promise();
    }

    var addCompetition = function(idUser, idCompetition) {
        var def = new Promise();

        var db = connection.getInstance();

        db.transaction(function(tx) {
            tx.executeSql('insert into UserCompetition (User_idUser,Competition_idCompetition) ' +
                'values(' + idUser + ',' + idCompetition + ')');
        }, def.error, def.success);

        return def.promise();

    };

    var assignCompetitions = function(idUser, asignedCompetitions) {
        var def = new Promise();
        var asigned = 0;

        var db = connection.getInstance();

        for (i = 0; i < asignedCompetitions.length; i++) {
            $.when(addCompetition(idUser, asignedCompetitions[i].idCompetition))
                .done(function() {
                    asigned++;
                    if (asigned == asignedCompetitions.length) {
                        def.success(null, null);
                    }
                })
                .fail(function(err) {
                    def.error(err);
                })

        }
        if (asignedCompetitions.length > 0) {
            return def.promise();
        } else {
            def.success(null, null);
        }

    }

    var updateUser = function(idUser, user) {

        var def = new Promise();

        var db = connection.getInstance();
        var query = 'UPDATE User SET nick=?, password=?, rol=? WHERE idUser=?';

        db.transaction(function(tx) {
            tx.executeSql(query, user.toArray([idUser]));
        }, def.error, def.success);

        return def.promise();

    }

    var update = function(idUser, user, asignedCompetitions) {
        var def = new Promise();

        var db = connection.getInstance();

        $.when(updateUser(idUser, user))
            .then(function() {
                return removeAllAsignedCompetition(idUser);

            }).then(function() {
                if (user.rol != 2) {
                    return assignCompetitions(idUser, asignedCompetitions);
                } else {
                    return new $.Deferred().resolve();
                }
            }).done(function() {
                def.success(null, null);
            }).fail(function(err) {
                def.error(err);
            });

        return def.promise();

    };

    return {

        insert: insert,
        selectAll: selectAll,
        selectIdNick: selectIdNick,
        selectUserInfo: selectUserInfo,
        removeAllAsignedCompetition: removeAllAsignedCompetition,
        remove: remove,
        update: update,
        validateUser: validateUser
    }



});