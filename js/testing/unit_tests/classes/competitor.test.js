define(["../../../classes/competitor",'QUnit'], function(comp) {
	var errArgumentException = function(err){
		return err.name === "ArgumentException";
	}
	var errImageException = function(err){
		return err.name === "ImageException";
	}	
	var run = function(){
	QUnit.module( "competitors" );	
		test( 'Testing constructor', function(assert) {
			
			//creation
			assert.ok(new comp.Competitor("Leonhard","Euler","1707-04-15","m", 11, 2,1),"Call to constructor");
			//name
		  	assert.throws(function(){new comp.Competitor(1,"Euler","1707-04-15","m", 11, 2,1)},
		  		errArgumentException, "name is a number");
		  	assert.throws(function(){new comp.Competitor("","Euler","1707-04-15","m", 11, 2,1)},
		  		errArgumentException, "name is a void string");
		  	assert.throws(function(){new comp.Competitor(" ","Euler","1707-04-15","m", 11, 2,1)},
		  		errArgumentException, "name is a space");
		  	assert.throws(function(){new comp.Competitor("        ","Euler","1707-04-15","m", 11, 2,1)},
		  		errArgumentException, "name is a set of space");
		  	assert.throws(function(){new comp.Competitor(null,"Euler","1707-04-15","m", 11, 2,1)},
		  		errArgumentException, "name is null");
		  	assert.throws(function(){new comp.Competitor(undefined,"Euler","1707-04-15","m", 11, 2,1)},
		  		errArgumentException, "name is undefined");
		  	assert.throws(function(){new comp.Competitor(NaN,"Euler","1707-04-15","m", 11, 2,1)},
		  		errArgumentException, "name is NaN");

		  	var funcExample = function(){return "str"};
		  	assert.throws(function(){new comp.Competitor(funcExample,"Euler","1707-04-15","m", 11, 2,1)},
		  		errArgumentException, "name is a function");

			//surname
		  	assert.throws(function(){new comp.Competitor("Leonhard",1,"1707-04-15","m", 11, 2,1)},
		  		errArgumentException, "surname is a number");
		  	assert.throws(function(){new comp.Competitor("Leonhard","","1707-04-15","m", 11, 2,1)},
		  		errArgumentException, "surname is a void string");
		  	assert.throws(function(){new comp.Competitor("Leonhard"," ","1707-04-15","m", 11, 2,1)},
		  		errArgumentException, "surname is a space");
		  	assert.throws(function(){new comp.Competitor("Leonhard","        ","1707-04-15","m", 11, 2,1)},
		  		errArgumentException, "surname is a set of space");
		  	assert.throws(function(){new comp.Competitor("Leonhard",null,"1707-04-15","m", 11, 2,1)},
		  		errArgumentException, "surname is null");
		  	assert.throws(function(){new comp.Competitor("Leonhard",undefined,"1707-04-15","m", 11, 2,1)},
		  		errArgumentException, "surname is undefined");
		  	assert.throws(function(){new comp.Competitor("Leonhard",NaN,"1707-04-15","m", 11, 2,1)},
		  		errArgumentException, "surname is NaN");

		  	var funcExample = function(){return "str"};
		  	assert.throws(function(){new comp.Competitor("Leonhard",funcExample,"1707-04-15","m", 11, 2,1)},
		  		errArgumentException, "surname is a function");

		  	//birthdate
		  	assert.throws(function(){new comp.Competitor("Leonhard","Euler","3000-04-15","m", 11, 2,1)},
		  		errArgumentException, "birthdate is bigger than 2999");
		  	assert.throws(function(){new comp.Competitor("Leonhard","Euler","1707-13-15","m", 11, 2,1)},
		  		errArgumentException, "month of birthdate is bigger than 12");
		  	assert.throws(function(){new comp.Competitor("Leonhard","Euler","1707-0-15","m", 11, 2,1)},
		  		errArgumentException, "month of birthdate is zero");
		  	assert.throws(function(){new comp.Competitor("Leonhard","Euler","1707-04-32","m", 11, 2,1)},
		  		errArgumentException, "day of birthdate is bigger than 31");
		  	assert.throws(function(){new comp.Competitor("Leonhard","Euler","1707-04-0","m", 11, 2,1)},
		  		errArgumentException, "day of birthdate is zero");
		  	assert.ok(new comp.Competitor("Leonhard","Euler","","m", 11, 2,1), "init date void");	
		  	assert.throws(function(){new comp.Competitor("Leonhard","Euler","1707-04","m", 11, 2,1)},
		  		errArgumentException, "birthdate is set bad");
		  	assert.throws(function(){new comp.Competitor("Leonhard","Euler","04-15","m", 11, 2,1)},
		  		errArgumentException, "birthdate is set bad");
		  	assert.throws(function(){new comp.Competitor("Leonhard","Euler","1707-04-15-03","m", 11, 2,1)},
		  		errArgumentException, "birthdate has more fields than expected");

		  	assert.throws(function(){new comp.Competitor("Leonhard","Euler",null,"m", 11, 2,1)},
		  		errArgumentException, "birthdate is null");
		  	assert.throws(function(){new comp.Competitor("Leonhard","Euler",undefined,"m", 11, 2,1)},
		  		errArgumentException, "birthdate is undefined");	
		  	assert.throws(function(){new comp.Competitor("Leonhard","Euler",NaN,"m", 11, 2,1)},
		  		errArgumentException, "birthdate is NaN");

		  	//gender
			assert.ok(new comp.Competitor("Leonhard","Euler","1707-04-15","m", 11, 2,1),"gender is m");
			assert.ok(new comp.Competitor("Leonhard","Euler","1707-04-15","m", 11, 2,1),"gender is w");

		  	assert.throws(function(){new comp.Competitor("Leonhard","Euler","1707-04-15","male", 11, 2,1)},
		  		errArgumentException, "gender is male");
		  	assert.throws(function(){new comp.Competitor("Leonhard","Euler","1707-04-15"," ", 11, 2,1)},
		  		errArgumentException, "gender is a void space");
		  	assert.throws(function(){new comp.Competitor("Leonhard","Euler","1707-04-15","         ", 11, 2,1)},
		  		errArgumentException, "gender is a set of spaces");
		  	assert.throws(function(){new comp.Competitor("Leonhard","Euler","1707-04-15",undefined, 11, 2,1)},
		  		errArgumentException, "gender is undefined");
		  	assert.throws(function(){new comp.Competitor("Leonhard","Euler","1707-04-15",NaN, 11, 2,1)},
		  		errArgumentException, "gender is NaN");
		  	assert.throws(function(){new comp.Competitor("Leonhard","Euler","1707-04-15","", 11, 2,1)},
		  		errArgumentException, "gender is a void string");
		  	assert.ok(new comp.Competitor("Leonhard","Euler","1707-04-15",null, 11, 2,1), "null gender");

		  	//dorsal
			assert.throws(function(){new comp.Competitor("Leonhard","Euler","1707-04-15","m", 0, 2,1)}, errArgumentException, 
				"dorsal is zero");
			assert.throws(function(){new comp.Competitor("Leonhard","Euler","1707-04-15","m", null, 2,1)}, errArgumentException, 
			"dorsal is null");

			assert.throws(function(){new comp.Competitor("Leonhard","Euler","1707-04-15","m", -1, 2,1)}, errArgumentException, 
				"dorsal is negative");
		  	assert.throws(function(){new comp.Competitor("Leonhard","Euler","1707-04-15","m", "string", 2,1)}, errArgumentException, 
		  		"dorsal is a string");	
		  	assert.throws(function(){new comp.Competitor("Leonhard","Euler","1707-04-15","m", undefined, 2,1)}, errArgumentException, 
		  		"dorsal is undefined");
		  	assert.throws(function(){new comp.Competitor("Leonhard","Euler","1707-04-15","m", NaN, 2,1)}, errArgumentException, 
		  		"dorsal is NaN");	

			//Group_idGroup
			assert.ok(new comp.Competitor("Leonhard","Euler","1707-04-15","m", 11, 0,1),"Group_idGroup is zero");
			assert.throws(function(){new comp.Competitor("Leonhard","Euler","1707-04-15","m", 11, null,1)},  errArgumentException,
				"Group_idGroup is null");

			assert.throws(function(){new comp.Competitor("Leonhard","Euler","1707-04-15","m", 11, -1,1)}, errArgumentException, "Group_idGroup is negative");
		  	assert.throws(function(){new comp.Competitor("Leonhard","Euler","1707-04-15","m", 11, "string",1)}, errArgumentException, "Group_idGroup is a string");	
		  	assert.throws(function(){new comp.Competitor("Leonhard","Euler","1707-04-15","m", 11, undefined,1)}, errArgumentException, "Group_idGroup is undefined");
		  	assert.throws(function(){new comp.Competitor("Leonhard","Euler","1707-04-15","m", 11, NaN,1)}, errArgumentException, "Group_idGroup is NaN");

			//Team_idTeam
			assert.ok(new comp.Competitor("Leonhard","Euler","1707-04-15","m", 11, 1,0),"Team_idTeam is zero");
			assert.ok(new comp.Competitor("Leonhard","Euler","1707-04-15","m", 11, 1,null), "Team_idTeam is null");

			assert.throws(function(){new comp.Competitor("Leonhard","Euler","1707-04-15","m", 11, 1,-1)}, errArgumentException, "Team_idTeam is negative");
		  	assert.throws(function(){new comp.Competitor("Leonhard","Euler","1707-04-15","m", 11, 1,"string")}, errArgumentException, "Team_idTeam is a string");	
		  	assert.throws(function(){new comp.Competitor("Leonhard","Euler","1707-04-15","m", 11, 1,undefined)}, errArgumentException, "Team_idTeam is undefined");
		  	assert.throws(function(){new comp.Competitor("Leonhard","Euler","1707-04-15","m", 11, 1,NaN)}, errArgumentException, "Team_idTeam is NaN");


		  	//arguments
			assert.throws(function(){new comp.Competitor()},
		  		errArgumentException, "less arguments than necessary");
			assert.throws(function(){new comp.Competitor("comp","Malaga","2016-04-01","2016-05-1", "FOO", "bar", "some argument more")},
		  		errArgumentException, "more arguments than necessary");		  	


		});

		test('Testing getArray', function(assert) {
			
			var ar1 = (new comp.Competitor("Leonhard","Euler","1707-04-15","m", 11, 2,1)).toArray();
			var ar2 = ["Leonhard","Euler","1707-04-15","m", 11, 2,1];
	  		assert.deepEqual( ar1, ar2, "compare 2 equal arrays");

	  		ar1 = (new comp.Competitor("Leonhard","Euler","1707-04-15","m", 11, 2,1)).toArray(["arrayExtended"]);
	  		ar2 = ar2.concat(["arrayExtended"]);
	  		assert.deepEqual(ar1,ar2, "compare 2 equal arrays with extension");

	  		ar1 = (new comp.Competitor("Leonhard","Euler","1707-04-15","m", 11, 2,1)).toArray(["arrayExtended"]);
	  		ar2 = ["Leonhard","Euler","1707-04-15","m", 11, 2,1];
	  		assert.notDeepEqual(ar1,ar2, "compare 2 distinct arrays");

		  	assert.ok(function(){ar1.toArray(12222)}, "Value into arrayExtended is a number");	  		
		  	assert.ok(function(){ar1.toArray(null)}, "null value in arrayExtended");
		  	assert.ok(function(){ar1.toArray("null")}, "string in arrayExtended");
			assert.ok(function(){ar1.toArray([1])}, "array in arrayExtended");
			assert.ok(function(){ar1.toArray([[1]])}, "array of arrays in arrayExtended");

		});
	}

	return{
		run:run
	}

});





