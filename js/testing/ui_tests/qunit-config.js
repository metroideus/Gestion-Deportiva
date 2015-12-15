require.config({
  paths: {
    'QUnit': '../../third-party-lib/QUnit/qunit-1.18.0'
  }
});

var runAllTests = function() {

  require(['QUnit', "tests/competition.test", "tests/user.test", "tests/group.test"],
    function(QUnit, competition, user, group) {

      // run the tests.
      //user.run();
      //competition.run();
      group.run();

      // start QUnit.
      QUnit.load();
      QUnit.start();


    });
}


//"exec" saves a set of actions in "listActions" through the function "queue". The function "run" executes the queue
//adding a delay.
var EXEC = {
  listActions: [],
  queue: function(action) {
    this.listActions.push(action);
  },
  run: function() {
    var acum = 0,
      i;

    for (i = 0; i < EXEC.listActions.length; i++) {
      setTimeout(EXEC.listActions[i], acum * 1000);
      acum += 2;
    }

  },
  clear: function() {
    this.listActions = [];
  }
};


var _zepto = $;
_zepto(document).ready(function() {
  _zepto('#appFrame').on("load", function() {

    $ = window.frames[0].$; //changes the var "$" of the context of window for "$" of the context of frame. This is for to use in tests.
    $(window.frames[0].document.body).on("lungoLoaded", runAllTests); //waits until the framework lungo is loaded.

  })
});