/**
 * @file Manages the persistence.
 * @author David Doña Corrales <david.dona.corrales@gmail.com>
 * @license Open-Source
 */

define(["app.utils","DAO/webSQL/test.dao", "DAO/webSQL/mark.dao"], function(utils, test, mark) {
    /**
     * Module for management data referring to records of competitors/teams
     * @module record
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



    var hasAnyMarkAssociated = function(idAsignedTest) {
        var def = new Promise();

        var db = connection.getInstance();
        var query = 'SELECT idMark FROM Mark WHERE AsignedTest_idAsignedTest=?';

        db.transaction(function(tx) {
            tx.executeSql(query, [idAsignedTest], function(tx, rs) {
                if (rs.rows.length > 0) {
                    def.success(tx, true);
                } else {
                    def.success(tx, false);
                }

            }, def.error);
        });

        return def.promise();
    }


    var selectTeamAsignedTestInfo = function(idTest, idGroup) {
        var db = connection.getInstance();
        var def = new Promise();

        var aux = "";
        if (idGroup != null) {
            aux = " AND Team.Group_idGroup=" + idGroup;
        }
        var query = 'SELECT Team.idTeam, Team.name, AsignedTest.idAsignedTest, AsignedTest.specificOrRandom FROM Team INNER JOIN AsignedTest ' +
            'ON Team.idTeam=AsignedTest.Team_idTeam AND AsignedTest.Test_idTest=?' + aux;

        db.transaction(function(tx) {
            tx.executeSql(query, [idTest], function(tx, rs) {
                def.success(tx, rs.rows);
            }, def.error);
        });

        return def.promise();

    }

    var selectCompetitorAsignedTestInfo = function(idTest, idGroup) {
        var db = connection.getInstance();
        var def = new Promise();

        var aux = "";
        if (idGroup != null) {
            aux = " AND Competitor.Group_idGroup=" + idGroup;
        }
        var query = 'SELECT Competitor.dorsal, Competitor.birthdate, Competitor.idCompetitor, Competitor.name, Competitor.surname, AsignedTest.idAsignedTest, AsignedTest.specificOrRandom FROM Competitor INNER JOIN AsignedTest ' +
            'ON Competitor.idCompetitor=AsignedTest.Competitor_idCompetitor AND AsignedTest.Test_idTest=?' + aux;

        db.transaction(function(tx) {
            tx.executeSql(query, [idTest], function(tx, rs) {
                def.success(tx, rs.rows);
            }, def.error);
        });

        return def.promise();

    }


    var selectByTestByGroup = function(idTest, idGroup) {
        var db = connection.getInstance();
        var def = new Promise();

        var query, typeResult, aux, asigned = 0;
        var dataList = {};
        dataList.records = new Array();

        $.when(test.selectById(idTest))
            .then(function(test) {
                dataList.result = test.result;
                dataList.type = test.type;
                dataList.bestMark = test.bestMark;

                if (test.type == "team") {
                    return selectTeamAsignedTestInfo(idTest, idGroup);
                } else {
                    return selectCompetitorAsignedTestInfo(idTest, idGroup);
                }
            }).done(function(l) {
                var i;
                for (i = 0; i < l.length; i++) {
                    (function(i) {
                        $.when(mark.selectByAsignedTest(l.item(i).idAsignedTest, dataList.result))
                            .done(function(listMarks) {
                                if (listMarks.length > 0) { // Only the team/competitor with some mark, will be in the list.
                                    aux = l.item(i);
                                    aux.listMarks = listMarks;
                                    dataList.records.push(aux);
                                }
                                asigned++;
                                if (asigned == l.length) {
                                    def.success(null, dataList);
                                }
                            }).fail(function(err) {
                                def.error(err);
                            })
                    }(i))
                }
                if (l.length == 0) {
                    def.success(null, dataList);
                }

            }).fail(function(err) {
                def.error(err);
            })

        return def.promise();
    }

    var selectIdNameByAsignedTestByGroup = function(idTest, idGroup) {
        var db = connection.getInstance();
        var def = new Promise();

        var query, typeResult, aux, asigned = 0;
        var dataList = {};
        dataList.records = new Array();

        $.when(test.selectById(idTest))
            .then(function(test) {
                if (test.type == "team") {
                    return selectTeamAsignedTestInfo(idTest, idGroup);
                } else {
                    return selectCompetitorAsignedTestInfo(idTest, idGroup);
                }
            }).done(function(l) {
                def.success(null, l);
            }).fail(function(err) {
                def.error(err);
            })

        return def.promise();
    }

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

                    return privateDef.promise();
                } else {
                    privateDef.error("Existe ya un elemento con el mismo nombre");
                }

            })
            .then(function() {
                return selectAsignedTests(idCompetitor);
            })
            .done(function(prevAsignedTests) {
                var sOr;
                for (i = 0; i < prevAsignedTests.length; i++) {
                    sOr = utils.getSpecificOrRandomTestFromName(prevAsignedTests.item(i).name, arSelectedTests) //get the type of selection from actual element.
                    if (!utils.stringInArrayTests(prevAsignedTests.item(i).name, arSelectedTests)) { // the item from the set "prevAsignedTests" that isn't in "arSelectedTests" is to remove.
                        deleteTest(idCompetitor, prevAsignedTests.item(i));

                    } else if (utils.stringInArrayTests(prevAsignedTests.item(i).name, arSelectedTests) &&
                        prevAsignedTests.item(i).specificOrRandom != sOr) { //the type of selection (random or manual) has been changed
                        updateTest(idCompetitor, sOr);
                    }
                }
                for (i = 0; i < arSelectedTests.length; i++) {
                    if (!utils.stringInList(arSelectedTests[i].name, prevAsignedTests)) { // the item from the set "arSelectedTests" that isn't in "prevAsignedTests" is to remove.
                        addTest(idCompetitor, arSelectedTests[i]);
                    }
                }
                def.success(null, null);

            })
            .fail(function(err) {
                def.error(err);
            });

        return def.promise();
    };


    return {

        selectByTestByGroup: selectByTestByGroup,
        selectIdNameByAsignedTestByGroup: selectIdNameByAsignedTestByGroup,
        remove: remove,
        update: update,
        hasAnyMarkAssociated: hasAnyMarkAssociated
    }


});