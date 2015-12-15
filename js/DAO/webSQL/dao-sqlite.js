/**
 * @file Manages the persistence.
 * @author David Doña Corrales <david.dona.corrales@gmail.com>
 * @license Open-Source
 */

define(["DAO/webSQL/competition.dao", "DAO/webSQL/test.dao", "DAO/webSQL/group.dao", "DAO/webSQL/team.dao",
    "DAO/webSQL/competitor.dao", "DAO/webSQL/record.dao","DAO/webSQL/mark.dao", "DAO/webSQL/data-management.dao",
    "DAO/webSQL/user.dao"], 
    function(competition, test, group, team, competitor, record, mark, dataManagement, user) {
    /**
     * Module for the access to persistence (abstract cap)
     * @namespace persistence
     */

    //throw new Error(err.message) don't works
    var errorCB = function(err) {
        console.log(err)
    };
    var successCB = function() {
        console.log("ok")
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


    /******************************************************/
    /******CREATION AND CONFIGURATION OF DATABASE**********/
    /******************************************************/

    /**
     * Creates and configures the local database. This function will execute one time with the first use to the application
     * @function
     * @access public
     * @memberof! persistence
     * @param  {function} callBack - A callBack to execute after.
     * @return {undefined}
     */
    var createDB = function(callBack) {

        function addRows() {
            $.get("js/DAO/dataExample.sql", function(data) {
                var db = connection.getInstance();
                var lines = data.split("\n");
                db.transaction(function(tx) {
                    $.each(lines, function(n, elem) {
                        tx.executeSql(elem);
                    });
                }, errorCB, successCB);
            });
        }

        $.get("js/DAO/db.sqlite.sql", function(data) { //relative path to caller page. In this case, relative to index.html (login)

            var lines = data.split(";");

            var db = connection.getInstance();
            db.transaction(function(tx) {
                var i;

                for (i = 0; i < lines.length; i++) {
                    tx.executeSql(lines[i]);
                }

                //WebSQL can't run SQL statements outside a transaction anyway, so no foreign key enforcement is possible with PRAGMA
                //So that we may have "ON DELETE CASCADE", we can use TRIGGER to simulate the integrity
                tx.executeSql("CREATE TRIGGER fkd_comp_test_group BEFORE DELETE ON Competition" + " FOR EACH ROW BEGIN " +
                    "DELETE from Test WHERE Competition_idCompetition = OLD.idCompetition;" +
                    "DELETE from 'Group' WHERE Competition_idCompetition = OLD.idCompetition;" +
                    "DELETE from UserCompetition WHERE Competition_idCompetition = OLD.idCompetition;" +
                    "END;");
                tx.executeSql("CREATE TRIGGER fkd_group_team_competitor BEFORE DELETE ON 'Group'" + " FOR EACH ROW BEGIN " +
                    "DELETE from Team WHERE Group_idGroup = OLD.idGroup;" +
                    "DELETE from Competitor WHERE Group_idGroup = OLD.idGroup;" +
                    "END;");
                tx.executeSql("CREATE TRIGGER fkd_test_asignedTest BEFORE DELETE ON Test" + " FOR EACH ROW BEGIN " +
                    "DELETE from AsignedTest WHERE Test_idTest = OLD.idTest;" +
                    "END;");
                tx.executeSql("CREATE TRIGGER fkd_asignedTest_mark BEFORE DELETE ON AsignedTest" + " FOR EACH ROW BEGIN " +
                    "DELETE from Mark WHERE AsignedTest_idAsignedTest = OLD.idAsignedTest;" +
                    "END;");
                tx.executeSql("CREATE TRIGGER fkd_competitor_asignedTest BEFORE DELETE ON Competitor" + " FOR EACH ROW BEGIN " +
                    "DELETE from AsignedTest WHERE Competitor_idCompetitor = OLD.idCompetitor;" +
                    "END;");
                tx.executeSql("CREATE TRIGGER fkd_team_asignedTest BEFORE DELETE ON Team" + " FOR EACH ROW BEGIN " +
                    "DELETE from AsignedTest WHERE Team_idTeam = OLD.idTeam;" +
                    "END;");

                tx.executeSql("CREATE TRIGGER fkd_user_userCompetition BEFORE DELETE ON User" + " FOR EACH ROW BEGIN " +
                    "DELETE from UserCompetition WHERE User_idUser = OLD.idUser;" +
                    "END;");

                tx.executeSql('INSERT INTO User (idUser, nick, password, rol) values(1, "admin","admin",2)');
            }, errorCB, function() {
                //addRows();
                callBack();
            });
        });

    };

    //Return of interface for access to dao-modules
    return {
        competition: competition,
        test: test,
        group: group,
        team: team,
        competitor: competitor,
        record: record,
        mark: mark,
        dataManagement: dataManagement,
        user: user,
        createDB: createDB
    }
});