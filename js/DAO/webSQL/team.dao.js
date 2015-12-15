/**
 * @file Manages the persistence.
 * @author David Doña Corrales <david.dona.corrales@gmail.com>
 * @license Open-Source
 */

define(["app.utils"], function(utils) {
    /**
     * Module for management data referring to teams.
     * @module team
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



    var insert = function(idComp, team, tests) {
        var def = new Promise();
        var privateDef = new Promise(); //for to use in this method

        var db = connection.getInstance();

        $.when(this.selectNamesByCompetition(idComp))
            .then(function(l) {

                if (!utils.stringInList(team.name, l)) { //if the name of group isn't in the competition...
                    db.transaction(function(tx) {
                        tx.executeSql('insert into Team (name,Group_idGroup) ' +
                            'values(?,?)', team.toArray(), privateDef.success, privateDef.error);
                    });

                } else {
                    privateDef.error("Existe ya un elemento con el mismo nombre");
                }
                return privateDef.promise();

            }).done(function(rs) {
                var i;
                for (i = 0; i < tests.length; i++) {
                    addTest(rs.insertId, tests[i]);
                }
                def.success(null, null);
            })
            .fail(function(err) {
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
            query = query.concat("Team.", arguments[i], ",")
        }

        query = query.slice(0, query.length - 1);
        query = query.concat(' FROM Team WHERE Group_idGroup IN (SELECT idGroup FROM "Group" WHERE Competition_idCompetition=?)');

        db.transaction(function(tx) {
            tx.executeSql(query, [idComp], function(tx, rs) {

                def.success(tx, rs.rows);

            }, def.error);
        });
        return def.promise();

    };

    var selectAllByCompetition = function(idComp) {
        var def = new Promise();

        var db = connection.getInstance();
        var query = "SELECT Team.idTeam, Team.Group_idGroup, Team.name AS nameTeam, 'Group'.name AS nameGroup " +
            "FROM Team INNER JOIN 'Group' ON " +
            "Team.Group_idGroup='Group'.idGroup AND 'Group'.idGroup IN " +
            "(SELECT idGroup FROM 'Group' WHERE Competition_idCompetition=?)";

        db.transaction(function(tx) {
            tx.executeSql(query, [idComp], function(tx, rs) {
                def.success(tx, rs.rows);
            }, def.error);
        });
        return def.promise();

    };

    var selectNamesByCompetition = function(idComp) {

        return selectByCompetition("name", idComp);

    };

    var selectIdNameByCompetition = function(idComp) {

        return selectByCompetition("idTeam", "name", idComp);

    };

    var hasAnyCompetitor = function(id) {
        var db = connection.getInstance();

        var def = new Promise();

        var query = 'SELECT idCompetitor FROM Competitor WHERE Team_idTeam=?';

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

    };


    var removeRegistrationOfTeamMembers = function(id) {
        var db = connection.getInstance();
        var def = new Promise();

        var query = 'UPDATE Competitor SET Team_idTeam=NULL WHERE Team_idTeam=?';

        db.transaction(function(tx) {
            tx.executeSql(query, [id], function(tx, rs) {
                def.success(null, null);
            }, def.error);
        });

        return def.promise();

    };


    var selectNameIdGroup = function(idTeam) {
        var def = new Promise();

        var db = connection.getInstance();
        var query = "SELECT name, Group_idGroup FROM Team WHERE idTeam=?";

        db.transaction(function(tx) {
            tx.executeSql(query, [idTeam], function(tx, rs) {
                def.success(tx, rs.rows.item(0));
            }, def.error);
        });
        return def.promise();

    };

    var selectIdNameByGroup = function(idGroup) {
        var def = new Promise();

        var db = connection.getInstance();
        var query = "SELECT idTeam, name FROM Team WHERE Group_idGroup=?";

        db.transaction(function(tx) {
            tx.executeSql(query, [idGroup], function(tx, rs) {
                def.success(tx, rs.rows);
            }, def.error);
        });
        return def.promise();

    };

    var selectTeam = function(idTeam) {
        var def = new Promise();

        var db = connection.getInstance();
        var query = "SELECT Team.idTeam, Team.Group_idGroup, Team.name AS nameTeam, " +
            "'Group'.name AS nameGroup " +
            "FROM Team INNER JOIN 'Group' ON " +
            "Team.Group_idGroup='Group'.idGroup AND Team.idTeam=?";

        db.transaction(function(tx) {
            tx.executeSql(query, [idTeam], function(tx, rs) {
                def.success(tx, rs.rows);
            }, def.error);
        });
        return def.promise();
    };

    var selectTeamInfo = function(idTeam) {
        var def = new Promise();

        $.when(selectTeam(idTeam), selectAsignedTests(idTeam))
            .done(function(team, listTest) {

                var newTeam = team.item(0);
                newTeam.tests = listTest;
                def.success(null, newTeam);

            }).fail(function() {
                def.error("The operation could not be completed");
            })
        return def.promise();
    };

    var selectAsignedTests = function(idTeam) {
        var def = new Promise();

        var db = connection.getInstance();
        var query = "SELECT Test.idTest, Test.name, AsignedTest.specificOrRandom, AsignedTest.idAsignedTest FROM Test INNER JOIN AsignedTest " +
            "ON Test.idTest=AsignedTest.Test_idTest AND AsignedTest.Team_idTeam=?";

        db.transaction(function(tx) {
            tx.executeSql(query, [idTeam], function(tx, rs) {
                def.success(tx, rs.rows);
            }, def.error);
        });
        return def.promise();

    };

    var addTest = function(idTeam, test) {
        var def = new Promise();

        var db = connection.getInstance();

        db.transaction(function(tx) {
            tx.executeSql('insert into AsignedTest (Team_idTeam,Test_idTest,specificOrRandom) values(?,?,?)', [idTeam, test.idTest, test.specificOrRandom]);
        }, def.error, def.success);

        return def.promise();

    };

    var updateTest = function(idTeam, specificOrRandom) {
        var def = new Promise();

        var db = connection.getInstance();

        db.transaction(function(tx) {
            tx.executeSql('UPDATE AsignedTest SET specificOrRandom=? WHERE Team_idTeam=?', [specificOrRandom, idTeam]);
        }, def.error, def.success);

        return def.promise();

    }

    var deleteTest = function(idTeam, test) {
        var def = new Promise();

        var db = connection.getInstance();

        db.transaction(function(tx) {
            tx.executeSql('DELETE FROM AsignedTest WHERE Team_idTeam=? AND Test_idTest=?', [idTeam, test.idTest]);
        }, def.error, def.success);

        return def.promise();

    };

    var remove = function(id) {

        var db = connection.getInstance();
        var query = 'DELETE FROM Team WHERE idTeam=?';

        $.when(removeRegistrationOfTeamMembers(id))
            .done(function() {
                db.transaction(function(tx) {
                    tx.executeSql(query, [id], function(tx, rs) {}, errorCB);
                });
            }).fail(function(err) {
                errorCB(err);
            })


    };

    var update = function(idComp, idTeam, team, arSelectedTests) {

        var def = new Promise();
        var privateDef = new Promise(); //for to use in this method

        var db = connection.getInstance();
        var query = 'UPDATE Team SET name=?, Group_idGroup=? WHERE idTeam=?';

        var testsToRemove = new Array();
        var testsToAdd = new Array();
        var i;

        $.when(selectIdNameByCompetition(idComp))
            .then(function(l) {
                //if the name of group hasn't changed or doesn't exist in the competition...
                if (utils.getNameTeamOfList(idTeam, l) == team.name ||
                    !utils.stringInList(team.name, l)) {
                    db.transaction(function(tx) {
                        tx.executeSql(query, team.toArray([idTeam]));
                    }, privateDef.error, privateDef.success);

                } else {
                    def.error("Existe ya un elemento con el mismo nombre");
                }
                return privateDef.promise();

            })
            .then(function() {
                return selectAsignedTests(idTeam);
            })
            .then(function(prevAsignedTests) {
                var sOr;
                var processItemsDeferred = new Array();

                for (i = 0; i < prevAsignedTests.length; i++) {
                    (function(i) {
                        sOr = utils.getSpecificOrRandomTestFromName(prevAsignedTests.item(i).name, arSelectedTests) //get the type of selection from actual element. 

                        if (!utils.stringInArrayTests(prevAsignedTests.item(i).name, arSelectedTests)) { // the item from the set "prevAsignedTests" that isn't in "arSelectedTests" is to remove.
                            processItemsDeferred.push(deleteTest(idTeam, prevAsignedTests.item(i)));
                        } else if (utils.stringInArrayTests(prevAsignedTests.item(i).name, arSelectedTests) &&
                            prevAsignedTests.item(i).specificOrRandom != sOr) { //the type of selection (random or manual) has been changed
                            processItemsDeferred.push(updateTest(idTeam, sOr));
                        }
                    }(i))
                }

                for (i = 0; i < arSelectedTests.length; i++) {
                    (function(i) {
                        if (!utils.stringInList(arSelectedTests[i].name, prevAsignedTests)) { // the item from the set "arSelectedTests" that isn't in "prevAsignedTests" is to add.
                            processItemsDeferred.push(addTest(idTeam, arSelectedTests[i]));
                        }
                    }(i))
                }

                return $.when.apply(undefined, processItemsDeferred);
            })
            .done(function() {
                def.success(null, null);
            })
            .fail(function(err) {
                def.error(err);
            });

        return def.promise();
    };

    function checkConfigurationTests(arSelectedTests, idTeam) {
        var def = new Promise();

        var processItemsDeferred = new Array();
        var i;
        $.when(selectAsignedTests(idTeam))
            .then(function(prevAsignedTests) {

                for (i = 0; i < prevAsignedTests.length; i++) {
                    if (!utils.stringInArrayTests(prevAsignedTests.item(i).name, arSelectedTests)) { //ifs the user has selected the test for to be deleted
                        (function(i) {
                            processItemsDeferred.push(record.hasAnyMarkAssociated(prevAsignedTests.item(i).idAsignedTest));
                        }(i))
                    }
                }
                return $.when.apply(undefined, processItemsDeferred);
            })
            .done(function() {

                var ok = false;
                i = 0;
                while (i < arguments.length && !ok) {
                    if (arguments[i]) { // if the asigned test has any mark associated
                        ok = true;
                    }
                    i++;
                }
                def.success(null, ok);

            })
            .fail(function(err) {
                def.error(err);
            })

        return def.promise();
    }

    return {

        insert: insert,
        selectAllByCompetition: selectAllByCompetition,
        selectNamesByCompetition: selectNamesByCompetition,
        selectIdNameByCompetition: selectIdNameByCompetition,
        selectNameIdGroup: selectNameIdGroup,
        selectIdNameByGroup: selectIdNameByGroup,
        hasAnyCompetitor: hasAnyCompetitor,
        selectAsignedTests: selectAsignedTests,
        selectTeamInfo: selectTeamInfo,
        remove: remove,
        update: update,
        checkConfigurationTests: checkConfigurationTests
    }



});