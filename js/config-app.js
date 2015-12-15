/******************************************************/
/******************GLOBAL VARIABLES********************/
/******************************************************/

var DAO = null; //global var that saves the instance of persistence
var PICTURE_SOURCE = null; // picture source
var DESTINATION_TYPE = null; // sets the format of returned value
var BASE_URL_CLASS = "classes/";


/******************************************************/
/*****************FUNCTIONAL LOGIC*********************/
/******************************************************/


//******COMPETITION CONTROLLER*********//
var competitions = {

  list: function() {
    require(["controllers/competition.ctr"], function(ctr) {
      ctr.list();
    });
  },
  set: function(obj) {
    require(["./controllers/competition.ctr"], function(ctr) {
      ctr.set(obj);
    });
  },
  view: function(id) {
    require(["./controllers/competition.ctr"], function(ctr) {
      ctr.view(id);
    });
  },
  save: function() {
    require(["./controllers/competition.ctr"], function(ctr) {
      ctr.save();
    });
  },
  modeEdit: function(id) {
    require(["./controllers/competition.ctr"], function(ctr) {
      ctr.modeEdit(id);
    });
  },
  delete: function(obj) {
    require(["./controllers/competition.ctr"], function(ctr) {
      ctr.delete(obj);
    });
  },
  getLogo: function() {
    require(["./controllers/competition.ctr"], function(ctr) {
      ctr.getLogo();
    });
  }

};

//******TEST CONTROLLER*********//
var tests = {

  list: function() {
    require(["controllers/test.ctr"], function(ctr) {
      ctr.list();
    });
  },
  delete: function(obj) {
    require(["./controllers/test.ctr"], function(ctr) {
      ctr.delete(obj);
    });
  },
  save: function() {
    require(["./controllers/test.ctr"], function(ctr) {
      ctr.save();
    });
  },
  modeEdit: function(id) {
    require(["./controllers/test.ctr"], function(ctr) {
      ctr.modeEdit(id);
    });
  }

};

//******GROUP CONTROLLER*********//
var groups = {

  list: function() {

    require(["./controllers/group.ctr"], function(ctr) {
      ctr.list();
    });
  },
  delete: function(obj) {
    require(["./controllers/group.ctr"], function(ctr) {
      ctr.delete(obj);
    });
  },
  save: function() {

    require(["./controllers/group.ctr"], function(ctr) {
      ctr.save();
    });
  },
  modeEdit: function(id) {
    require(["./controllers/group.ctr"], function(ctr) {
      ctr.modeEdit(id);
    });
  }
};

//******TEAMS CONTROLLER*********//
var teams = {

  list: function() {
    require(["./controllers/team.ctr"], function(ctr) {
      ctr.list();
    });
  },
  viewTeam: function(obj) {
    require(["./controllers/team.ctr"], function(ctr) {
      ctr.viewTeam(obj);
    });
  },
  delete: function(obj) {
    require(["./controllers/team.ctr"], function(ctr) {
      ctr.delete(obj);
    });
  },
  save: function() {
    require(["./controllers/team.ctr"], function(ctr) {
      ctr.save();
    });
  },
  modeEdit: function(id) {
    require(["./controllers/team.ctr"], function(ctr) {
      ctr.modeEdit(id);
    });
  },
  editTests: function() {
    require(["./controllers/team.ctr"], function(ctr) {
      ctr.editTests();
    });
  },
  saveTests: function(arSelectedTests) {
    require(["./controllers/team.ctr"], function(ctr) {
      ctr.saveTests(arSelectedTests);
    });

  },
  randomTest: function() {
    require(["./controllers/team.ctr"], function(ctr) {
      ctr.randomTest();
    });
  }

};


//******COMPETITORS CONTROLLER*********//
var competitors = {

  list: function(order) {
    require(["./controllers/competitor.ctr"], function(ctr) {
      ctr.list(order);
    });
  },
  viewCompetitor: function(obj) {
    require(["./controllers/competitor.ctr"], function(ctr) {
      ctr.viewCompetitor(obj);
    });
  },
  delete: function(obj) {
    require(["./controllers/competitor.ctr"], function(ctr) {
      ctr.delete(obj);
    });
  },
  save: function() {
    require(["./controllers/competitor.ctr"], function(ctr) {
      ctr.save();
    });
  },
  modeEdit: function(id) {
    require(["./controllers/competitor.ctr"], function(ctr) {
      ctr.modeEdit(id);
    });
  },
  editTests: function() {
    require(["./controllers/competitor.ctr"], function(ctr) {
      ctr.editTests();
    });
  },
  saveTests: function(arSelectedTests) {
    require(["./controllers/competitor.ctr"], function(ctr) {
      ctr.saveTests(arSelectedTests);
    });
  },
  randomTest: function() {
    require(["./controllers/competitor.ctr"], function(ctr) {
      ctr.randomTest();
    });
  }

}


//******RECORDS CONTROLLER*********//
var records = {

  setGroupTestSelection: function() {
    require(["./controllers/record.ctr"], function(ctr) {
      ctr.setGroupTestSelection();
    });
  },
  viewRecords: function(order) {
    require(["./controllers/record.ctr"], function(ctr) {
      ctr.viewRecords(order);
    });
  },
  saveFilter: function() {
    require(["./controllers/record.ctr"], function(ctr) {
      ctr.saveFilter();
    });
  },
  delete: function(obj) {
    require(["./controllers/record.ctr"], function(ctr) {
      ctr.delete(obj);
    });
  },
  deleteMark: function(obj) {
    require(["./controllers/record.ctr"], function(ctr) {
      ctr.deleteMark(obj);
    });
  },
  save: function() {
    require(["./controllers/record.ctr"], function(ctr) {
      ctr.save();
    });
  },
  modeCreate: function() {
    require(["./controllers/record.ctr"], function(ctr) {
      ctr.modeCreate();
    });
  },
  editMarkQuantity: function(obj, n) {
    require(["./controllers/record.ctr"], function(ctr) {
      ctr.editMarkQuantity(obj, n);
    });
  },
  editMarkTime: function(obj, h, m, s) {
    require(["./controllers/record.ctr"], function(ctr) {
      ctr.editMarkTime(obj, h, m, s);
    });
  },
  setViewMMP: function() {
    require(["./controllers/record.ctr"], function(ctr) {
      ctr.setViewMMP();
    });
  }
}


//******BACKUP CONTROLLER*********//

var dataManagement = {

  backup: function() {
    require(["./controllers/backup.ctr"], function(ctr) {
      ctr.backup();
    });
  },
  restore: function() {
    require(["./controllers/backup.ctr"], function(ctr) {
      ctr.restore();
    });
  },
  writePathInfo: function() {
    require(["./controllers/backup.ctr"], function(ctr) {
      ctr.writePathInfo();
    });
  }

}


//******USER CONTROLLER*********//
var users = {

  list: function() {
    require(["./controllers/user.ctr"], function(ctr) {
      ctr.list();
    });
  },
  viewUser: function(obj) {

    require(["./controllers/user.ctr"], function(ctr) {
      ctr.viewUser(obj);
    });
  },
  delete: function(obj) {
    require(["./controllers/user.ctr"], function(ctr) {
      ctr.delete(obj);
    });
  },
  save: function() {
    require(["./controllers/user.ctr"], function(ctr) {
      ctr.save();
    });
  },
  modeEdit: function(id) {
    require(["./controllers/user.ctr"], function(ctr) {
      ctr.modeEdit(id);
    });
  },
  editCompetitions: function() {
    require(["./controllers/user.ctr"], function(ctr) {
      ctr.editCompetitions();
    });
  },
  signOut: function() {
    require(["./controllers/user.ctr"], function(ctr) {
      ctr.signOut();
    });
  },
  signIn: function() {
    require(["controllers/user.ctr"], function(ctr) {
      ctr.signIn();
    });
  }
};



//******PDF CONTROLLER*********//

var pdf = {

  generate: function() {
    require(["./controllers/pdf.ctr"], function(ctr) {
      ctr.generate();
    });
  },
  config: function() {
    require(["./controllers/pdf.ctr"], function(ctr) {
      ctr.config();
    });
  },
  edit: function(section) {
    require(["./controllers/pdf.ctr"], function(ctr) {
      ctr.edit(section);
    });
  },
  allGroups: function() {
    require(["./controllers/pdf.ctr"], function(ctr) {
      ctr.allGroups();
    });
  },
  allTests: function() {
    require(["./controllers/pdf.ctr"], function(ctr) {
      ctr.allTests();
    });
  },
  writePathInfo: function() {
    require(["./controllers/pdf.ctr"], function(ctr) {
      ctr.writePathInfo();
    });
  }

}

/******************************************************/
/**********************FUNCTIONS***********************/
/******************************************************/

//this function is called one time for section when the section is charged for first time.
//configures the left menu, top menu, and buttons for the type of user
function prepareRolUserInterface() {

  var rolUser = (JSON.parse(sessionStorage.getItem("loginData"))).rol;

  if (rolUser === 2) { // if the user is a administrator

    $("[name='admin-feature']").show();
    $("[name='protected-feature']").show();

  } else if (rolUser === 1) { // if the user is a guest

    $("[name='protected-feature']").show();
    $("[name='admin-feature']").hide();

  } else if (rolUser === 0) { // if the user is a guest

    $("[name='protected-feature']").hide();
    $("[name='admin-feature']").hide();

  }
}


//for recharge the main article
function showMainArticle(data) {

  var section = data.split("Mleft")[0];
  if (Lungo.dom("#" + section).length === 0) {
    Lungo.Resource.load(section + "/" + section + ".html");
    Lungo.Boot.Data.init("#" + section);
  }

  switch (data) {
    case "competitionsMleft":

      Lungo.Router.section("competitions");
      $(document.body).one("competitions", function() {
        Lungo.Router.article("competitions", "maincompetition");
        $(document.body).trigger("maincompetition");
      });

      break;
    case "groupsMleft":

      Lungo.Router.section("groups");
      $(document.body).one("groups", function() {
        Lungo.Router.article("groups", "maingroup");
        $(document.body).trigger("maingroup");
      });

      break;
    case "competitorsMleft":

      Lungo.Router.section("competitors");
      $(document.body).one("competitors", function() {
        Lungo.Router.article("competitors", "maincompetitor");
        $(document.body).trigger("maincompetitor");
      });

      break;
    case "teamsMleft":

      Lungo.Router.section("teams");
      $(document.body).one("teams", function() {
        Lungo.Router.article("teams", "mainteam");
        $(document.body).trigger("mainteam");
      });

      break;
    case "testsMleft":

      Lungo.Router.section("tests");
      $(document.body).one("tests", function() {
        Lungo.Router.article("tests", "maintest");
        $(document.body).trigger("maintest");
      });

      break;
    case "recordsMleft":

      Lungo.Router.section("records");
      $(document.body).one("records", function() {
        Lungo.Router.article("records", "mainrecord");
        $(document.body).trigger("mainrecord");
      });

      break;
    case "usersMleft":

      Lungo.Router.section("users");
      $(document.body).one("users", function() {
        Lungo.Router.article("users", "mainuser");
        $(document.body).trigger("mainuser");
      });

      break;
    case "pdfMleft":

      Lungo.Router.section("pdf");
      $(document.body).one("pdf", function() {
        Lungo.Router.article("pdf", "mainpdf");
        $(document.body).trigger("mainpdf");
      });

      break;
    case "iodataMleft":

      Lungo.Router.section("iodata");
      $(document.body).one("iodata", function() {
        Lungo.Router.article("iodata", "mainiodata");
        $(document.body).trigger("mainiodata");
      });

      break;
  }
}

// device APIs are available
function onDeviceReady() {

  sessionStorage.setItem("device", "mobile"); //this variable will be used to detect in pdf controller if the device is a phone.

  require(["app.utils"], function(utils) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, utils.throwError);
  });
  PICTURE_SOURCE = navigator.camera.PictureSourceType;
  DESTINATION_TYPE = navigator.camera.DestinationType;

  if (device.platform == "Android" && device.version.substr(0, 3) == "4.4") {
    require(["app.utils"], function(utils) {
      utils.swipeKitKat();
    });
  }

  document.addEventListener("backbutton", onBackButton, false);

}

function propagation(event) {
  $(document.body).trigger(event.currentTarget.id);
  //console.log(event.currentTarget.id);
}

//Updates the focus in left menu and shows the main article
function changeSectionFocus(data) {
  var sectionToShow = data.split("Mleft")[0];

  require(["app.utils"], function(utils) {
    utils.changeSectionFocus(data);

    if (sessionStorage.getItem("MenuSectionShown") !== sectionToShow) { // Para evitar cuando se le da repetidamente a la misma seccion en el menu
      showMainArticle(data);
      sessionStorage.setItem("MenuSectionShown", sectionToShow);
    }

  });
}


function onBackButton() {
  require(["app.utils"], function(utils) {
    utils.throwConfirmExit(function() {
      navigator.app.exitApp();
    });
  });
}

function gotFS(fileSystem) {
  console.log("got filesystem");
  // save the file system for later access
  console.log(fileSystem.root.nativeURL);
  localStorage.setItem("rootFS", fileSystem.root.nativeURL);
  //window.rootFS = fileSystem.root;
}



/******************************************************/
/****************APPLICATION CONFIG********************/
/******************************************************/
require.config({
  "waitSeconds": 0
});

//this prepare the auto-update of the sections list.
Lungo.Events.init({
  'load section#competitions': propagation,
  'load article#maincompetition': propagation,

  'load section#tests': propagation,
  'load article#maintest': propagation,

  'load section#groups': propagation,
  'load article#maingroup': propagation,

  'load section#teams': propagation,
  'load article#mainteam': propagation,

  'load section#competitors': propagation,
  'load article#maincompetitor': propagation,

  'load section#records': propagation,
  'load article#mainrecord': propagation,
  'load article#viewrecord': propagation,

  'load section#iodata': propagation,

  'load section#users': propagation,
  'load article#mainuser': propagation,

  'load section#pdf': propagation
    //...
});

//initialize Lungo and environment
Lungo.init({

  name: 'App_Gestion_Deportiva',
  resources: ['menuleft.html'],
  history: false

});


Lungo.ready(function() {

  //for to login through the key "enter"
  $(document).keypress(function(e) {
    if (e.which == 13 && ($("#login-user").is(":focus") || $("#login-pass").is(":focus"))) {
      users.signIn();
    }
  });

  //Throws the event "lungoLoaded" when lungo has been loaded. It used by UI_TESTS
  $(document.body).trigger("lungoLoaded");

  //*********************************
  //configures the refresh of the lists and the rol interface when the main article is loaded
  //*********************************

  $(document.body).on("maincompetition", function() {
    competitions.list();
    prepareRolUserInterface();
  });

  $(document.body).on("maintest", function() {
    tests.list();
    prepareRolUserInterface();
  });

  $(document.body).on("maincompetitor", function() {
    competitors.list();
    prepareRolUserInterface();
  });

  $(document.body).on("maingroup", function() {
    groups.list();
    prepareRolUserInterface();
  });

  $(document.body).on("mainteam", function() {
    teams.list();
    prepareRolUserInterface();
  });

  $(document.body).on("mainrecord", function() {
    records.setGroupTestSelection();
  }).on("viewrecord", function() {
    records.viewRecords();
    prepareRolUserInterface();
  });

  $(document.body).one("iodata", function() {
    dataManagement.writePathInfo(); //for first execution of the view
  })

  $(document.body).on("mainuser", function() {
    users.list();
  });

  $(document.body).one("pdf", function() {
    pdf.writePathInfo();
  }).on("pdf", function() {
    pdf.config();
  });


  //*********************************
  //gets the object of persistence and refresh the initial list
  //*********************************

  require(["DAO/DAOFactory", "app.utils"], function(DAOFactory, utils) {
    utils.prepareTactileInterfaceControl();
    DAO = "DAO/" + DAOFactory.getDAO(); //gets the object of persistence
  });

  //reset the selected competition
  sessionStorage.setItem("idCompSelected", "");

});

// Wait for device API libraries to load. ONLY FOR USE IN MOBILE PHONE
document.addEventListener("deviceready", onDeviceReady, false);