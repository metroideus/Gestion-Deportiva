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
      blanket.options('filter', '../../../DAO/superclasses'); // data-cover-only
      //blanket.options('branchTracking', true); // one of the data-cover-flags 
      blanket.options('debug',true);   

    require(['QUnit','competition.test'], 
      function(QUnit, competition) {
        // run the tests.
        competition.run();

        // start QUnit.
        QUnit.load();
        QUnit.start();
    });
});
