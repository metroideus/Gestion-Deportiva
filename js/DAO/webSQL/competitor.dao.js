/**
 * @file Manages the persistence.
 * @author David Doña Corrales <david.dona.corrales@gmail.com>
 * @license Open-Source
 */

define(["app.utils"], function(utils) {
    /**
     * Module for management data referring to competitors.
     * @module competitor
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


    var insert = function(idCompetition, competitor, tests) {
        var def = new Promise();
        var privateDef = new Promise(); //for to use in this method

        var db = connection.getInstance();

        $.when(selectDorsalByCompetition(idCompetition))
            .then(function(l) {
                if (!utils.dorsalInList(competitor.dorsal, l)) { //if the dorsal of competitor isn't in the competition...
                    db.transaction(function(tx) {
                        tx.executeSql('insert into Competitor (name,surname,birthdate,gender,dorsal, Group_idGroup, Team_idTeam) ' +
                            'values(?,?,?,?,?,?,?)', competitor.toArray(), privateDef.success, privateDef.error);
                    });

                } else {
                    privateDef.error("Existe ya un participante con el mismo dorsal");
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


    var addTest = function(idCompetitor, test) {
        var def = new Promise();

        var db = connection.getInstance();

        db.transaction(function(tx) {
            tx.executeSql('insert into AsignedTest (Competitor_idCompetitor,Test_idTest,specificOrRandom) values(?,?,?)', [idCompetitor, test.idTest, test.specificOrRandom]);
        }, def.error, def.success);

        return def.promise();

    };

    var updateTest = function(idCompetitor, specificOrRandom) {
        var def = new Promise();

        var db = connection.getInstance();

        db.transaction(function(tx) {
            tx.executeSql('UPDATE AsignedTest SET specificOrRandom=? WHERE Competitor_idCompetitor=?', [specificOrRandom, idCompetitor]);
        }, def.error, def.success);

        return def.promise();

    }

    var deleteTest = function(idCompetitor, test) {
        var def = new Promise();

        var db = connection.getInstance();

        db.transaction(function(tx) {
            tx.executeSql('DELETE FROM AsignedTest WHERE Competitor_idCompetitor=? AND Test_idTest=?', [idCompetitor, test.idTest]);
        }, def.error, def.success);

        return def.promise();

    };


    var selectByCompetition = function() {
        var def = new Promise();

        var db = connection.getInstance();
        var idComp = arguments[arguments.length - 1];
        var query = 'SELECT ';
        var i;

        for (i = 0; i < arguments.length - 1; i++) {
            query = query.concat("Competitor.", arguments[i], ",")
        }

        query = query.slice(0, query.length - 1);
        query = query.concat(' FROM Competitor WHERE Group_idGroup IN (SELECT idGroup FROM "Group" WHERE Competition_idCompetition=?)');

        db.transaction(function(tx) {
            tx.executeSql(query, [idComp], function(tx, rs) {

                def.success(tx, rs.rows);

            }, def.error);
        });
        return def.promise();

    };

    var selectAllByCompetition = function(idCompetition, orderBy) {
        var def = new Promise();

        var db = connection.getInstance();
        var query = "SELECT Competitor.idCompetitor, Competitor.Group_idGroup, Competitor.name AS nameCompetitor, " +
            "Competitor.surname, Competitor.dorsal, Competitor.gender, Competitor.birthdate, " +
            "'Group'.name AS nameGroup " +
            "FROM Competitor INNER JOIN 'Group' ON " +
            "Competitor.Group_idGroup='Group'.idGroup AND 'Group'.idGroup IN " +
            "(SELECT idGroup FROM 'Group' WHERE Competition_idCompetition=?) ORDER BY Competitor.surname " + orderBy;

        db.transaction(function(tx) {
            tx.executeSql(query, [idCompetition], function(tx, rs) {
                def.success(tx, rs.rows);
            }, def.error);
        });
        return def.promise();

    };

    var selectAsignedTests = function(idCompetitor) {
        var def = new Promise();

        var db = connection.getInstance();
        var query = "SELECT Test.idTest, Test.name, AsignedTest.specificOrRandom, AsignedTest.idAsignedTest FROM Test INNER JOIN AsignedTest " +
            "ON Test.idTest=AsignedTest.Test_idTest AND AsignedTest.Competitor_idCompetitor=?";

        db.transaction(function(tx) {
            tx.executeSql(query, [idCompetitor], function(tx, rs) {
                def.success(tx, rs.rows);
            }, def.error);
        });
        return def.promise();

    };

    var selectNamesByCompetition = function(idComp) {
        return selectByCompetition("name", idComp);
    };

    var selectDorsalByCompetition = function(idComp) {
        return selectByCompetition("dorsal", idComp);
    }

    var selectCompetitor = function(idCompetitor) {
        var def = new Promise();

        var db = connection.getInstance();
        var query = "SELECT Competitor.idCompetitor, Competitor.Group_idGroup, Competitor.name AS nameCompetitor, " +
            "Competitor.surname, Competitor.dorsal, Competitor.gender, Competitor.birthdate, Competitor.Team_idTeam,  " +
            "'Group'.name AS nameGroup " +
            "FROM Competitor INNER JOIN 'Group' ON " +
            "Competitor.Group_idGroup='Group'.idGroup AND Competitor.idCompetitor=?";

        db.transaction(function(tx) {
            tx.executeSql(query, [idCompetitor], function(tx, rs) {
                def.success(tx, rs.rows);
            }, def.error);
        });
        return def.promise();
    };

    var selectTeam = function(idCompetitor) {
        var def = new Promise();

        var db = connection.getInstance();
        var query = "SELECT Team.name " +
            "FROM Team INNER JOIN Competitor ON " +
            "Competitor.Team_idTeam=Team.idTeam AND Competitor.idCompetitor=?";

        db.transaction(function(tx) {
            tx.executeSql(query, [idCompetitor], function(tx, rs) {
                def.success(tx, rs.rows);
            }, def.error);
        });
        return def.promise();
    };


    var selectCompetitorInfo = function(idCompetitor) {
        var def = new Promise();

        $.when(this.selectAsignedTests(idCompetitor), this.selectCompetitor(idCompetitor), selectTeam(idCompetitor))
            .done(function(listTest, competitor, team) {
                var newCompetitor = competitor.item(0);
                newCompetitor.tests = listTest;
                newCompetitor.nameTeam = (team.length == 0 ? null : team.item(0).name);
                def.success(null, newCompetitor);
            }).fail(function() {
                def.error("The operation could not be completed");
            })
        return def.promise();
    };

    var selectIdDorsalByCompetition = function(idComp) {
        return selectByCompetition("idCompetitor", "dorsal", idComp);
    };

    var selectIdTeamIdGroup = function(idCompetitor) {
        var def = new Promise();

        var db = connection.getInstance();
        var query = "SELECT Team_idTeam, Group_idGroup FROM Competitor WHERE idCompetitor=?";

        db.transaction(function(tx) {
            tx.executeSql(query, [idCompetitor], function(tx, rs) {
                def.success(tx, rs.rows.item(0));
            }, def.error);
        });
        return def.promise();
    };

    var selectNameIdGroup = function(idCompetitor) {
        var def = new Promise();

        var db = connection.getInstance();
        var query = "SELECT name, Group_idGroup FROM Competitor WHERE idCompetitor=?";

        db.transaction(function(tx) {
            tx.executeSql(query, [idCompetitor], function(tx, rs) {
                def.success(tx, rs.rows.item(0));
            }, def.error);
        });
        return def.promise();

    };

    var remove = function(id) {

        var db = connection.getInstance();
        var query = 'DELETE FROM Competitor WHERE idCompetitor=?';

        db.transaction(function(tx) {
            tx.executeSql(query, [id], function(tx, rs) {}, errorCB);
        });

    };

    var update = function(idCompetition, idCompetitor, competitor, arSelectedTests) {

        var def = new Promise();
        var privateDef = new Promise(); //for to use in this method

        var db = connection.getInstance();
        var query = 'UPDATE Competitor SET name=?, surname=?, birthdate=?, gender=?, dorsal=?, Group_idGroup=?, ' +
            'Team_idTeam=? WHERE idCompetitor=?';

        var testsToRemove = new Array();
        var testsToAdd = new Array();
        var i;

        $.when(selectIdDorsalByCompetition(idCompetition))
            .then(function(l) {
                //if the name of group hasn't changed or doesn't exist in the competition...
                if (utils.getDorsalCompetitorOfList(idCompetitor, l) == competitor.dorsal ||
                    !utils.dorsalInList(competitor.dorsal, l)) {
                    db.transaction(function(tx) {
                        tx.executeSql(query, competitor.toArray([idCompetitor]));
                    }, privateDef.error, privateDef.success);
                } else {
                    privateDef.error("Existe ya un participante con el mismo dorsal");
                }
                return privateDef.promise();

            })
            .then(function() {
                return selectAsignedTests(idCompetitor);
            })
            .then(function(prevAsignedTests) {
                var sOr;
                var processItemsDeferred = new Array();

                for (i = 0; i < prevAsignedTests.length; i++) {
                    (function(i) {
                        sOr = utils.getSpecificOrRandomTestFromName(prevAsignedTests.item(i).name, arSelectedTests) //get the type of selection from actual element. 

                        if (!utils.stringInArrayTests(prevAsignedTests.item(i).name, arSelectedTests)) { // the item from the set "prevAsignedTests" that isn't in "arSelectedTests" is to remove.
                            processItemsDeferred.push(deleteTest(idCompetitor, prevAsignedTests.item(i)));
                        } else if (utils.stringInArrayTests(prevAsignedTests.item(i).name, arSelectedTests) &&
                            prevAsignedTests.item(i).specificOrRandom != sOr) { //the type of selection (random or manual) has been changed
                            processItemsDeferred.push(updateTest(idCompetitor, sOr));
                        }
                    }(i))
                }

                for (i = 0; i < arSelectedTests.length; i++) {
                    (function(i) {
                        if (!utils.stringInList(arSelectedTests[i].name, prevAsignedTests)) { // the item from the set "arSelectedTests" that isn't in "prevAsignedTests" is to add.
                            processItemsDeferred.push(addTest(idCompetitor, arSelectedTests[i]));
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
    }

    function checkConfigurationTests(arSelectedTests, idCompetitor) {
        var def = new Promise();

        var processItemsDeferred = new Array();
        var i;
        $.when(selectAsignedTests(idCompetitor))
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
        selectNameIdGroup: selectNameIdGroup,
        selectAsignedTests: selectAsignedTests,
        selectCompetitorInfo: selectCompetitorInfo,
        selectCompetitor: selectCompetitor,
        selectIdTeamIdGroup: selectIdTeamIdGroup,
        remove: remove,
        update: update,
        deleteTest: deleteTest,
        addTest: addTest,
        checkConfigurationTests: checkConfigurationTests
    }



});