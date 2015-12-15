require.config({
    paths: {
        'QUnit': '../../../third-party-lib/QUnit/qunit-1.18.0',
        'blanket': '../../../third-party-lib/blanket.min'
    },
    shim: {
       'blanket': {
           exports: 'blanket',
           deps: ['QUnit']
       } 
    }
});
require(['blanket'],function(blanket){
      blanket.options("existingRequireJS",true);
      blanket.options('filter', '../../../classes'); // data-cover-only
      //blanket.options('branchTracking', true); // one of the data-cover-flags 
      blanket.options('debug',true);   

    require(['QUnit', 'group.test', 'test.test','competition.test','team.test','competitor.test'], 
      function(QUnit, group, test, competition,team,competitor) {
        // run the tests.
        group.run();
        test.run();
        competition.run();
        team.run();
        competitor.run();
        // start QUnit.
        QUnit.load();
        QUnit.start();
    });
});
