define(["../../../classes/competition",'QUnit'], function(comp) {
	var errArgumentException = function(err){
		return err.name === "ArgumentException";
	}
	var errImageException = function(err){
		return err.name === "ImageException";
	}	
	var run = function(){
	QUnit.module( "competitions" );	
		test( 'Testing constructor', function(assert) {
			
			//creation
			assert.ok(new comp.Competition("comp","Malaga","2016-04-01","2016-04-15", "FOO", ""),"Call to constructor");
			//name
		  	assert.throws(function(){new comp.Competition(1,"Malaga","2016-04-01","2016-04-15", "FOO", "")},
		  		errArgumentException, "name is a number");
		  	assert.throws(function(){new comp.Competition("","Malaga","2016-04-01","2016-04-15", "FOO", "")},
		  		errArgumentException, "name is a void string");
		  	assert.throws(function(){new comp.Competition(" ","Malaga","2016-04-01","2016-04-15", "FOO", "")},
		  		errArgumentException, "name is a space");
		  	assert.throws(function(){new comp.Competition("        ","Malaga","2016-04-01","2016-04-15", "FOO", "")},
		  		errArgumentException, "name is a set of space");
		  	assert.throws(function(){new comp.Competition(null,"Malaga","2016-04-01","2016-04-15", "FOO", "")},
		  		errArgumentException, "name is null");
		  	assert.throws(function(){new comp.Competition(undefined,"Malaga","2016-04-01","2016-04-15", "FOO", "")},
		  		errArgumentException, "name is undefined");
		  	assert.throws(function(){new comp.Competition(NaN,"Malaga","2016-04-01","2016-04-15", "FOO", "")},
		  		errArgumentException, "name is NaN");

		  	var funcExample = function(){return "str"};
		  	assert.throws(function(){new comp.Competition(funcExample,"Malaga","2016-04-01","2016-04-15", "FOO", "")},
		  		errArgumentException, "name is a function");

		  	//location
		  	assert.throws(function(){new comp.Competition("comp",1,"2016-04-01","2016-04-15", "FOO", "")},
		  		errArgumentException, "location is a number");
		  	assert.throws(function(){new comp.Competition("comp"," ","2016-04-01","2016-04-15", "FOO", "")},
		  		errArgumentException, "location is a void space");
		  	assert.throws(function(){new comp.Competition("comp","         ","2016-04-01","2016-04-15", "FOO", "")},
		  		errArgumentException, "location is a set of spaces");
		  	assert.throws(function(){new comp.Competition("comp",null,"2016-04-01","2016-04-15", "FOO", "")},
		  		errArgumentException, "location is null");
		  	assert.throws(function(){new comp.Competition("comp",undefined,"2016-04-01","2016-04-15", "FOO", "")},
		  		errArgumentException, "location is undefined");
		  	assert.throws(function(){new comp.Competition("comp",NaN,"2016-04-01","2016-04-15", "FOO", "")},
		  		errArgumentException, "location is NaN");
		  	assert.ok(new comp.Competition("comp","","2016-04-01","2016-04-15", "FOO", ""), "void location");

		  	//date
		  	assert.throws(function(){new comp.Competition("comp","Malaga","3016-04-01","2016-04-15", "FOO", "")},
		  		errArgumentException, "start date is bigger than 2999");
		  	assert.throws(function(){new comp.Competition("comp","Malaga","2016-100-01","2016-04-15", "FOO", "")},
		  		errArgumentException, "month of start date is bigger than 12");
		  	assert.throws(function(){new comp.Competition("comp","Malaga","2016-0-01","2016-04-15", "FOO", "")},
		  		errArgumentException, "month of start date is zero");
		  	assert.throws(function(){new comp.Competition("comp","Malaga","2016-04-1000","2016-04-15", "FOO", "")},
		  		errArgumentException, "day of start date is bigger than 31");
		  	assert.throws(function(){new comp.Competition("comp","Malaga","2016-04-0","2016-04-15", "FOO", "")},
		  		errArgumentException, "day of start date is zero");
		  	assert.ok(new comp.Competition("comp","Malaga","","2016-04-15", "FOO", ""), "init date void");	
		  	assert.throws(function(){new comp.Competition("comp","Malaga","2016","2016-04-15", "FOO", "")},
		  		errArgumentException, "start date is set bad");
		  	assert.throws(function(){new comp.Competition("comp","Malaga","2016-05","2016-04-15", "FOO", "")},
		  		errArgumentException, "start date is set bad");
		  	assert.throws(function(){new comp.Competition("comp","Malaga","2016-05-01-01","2016-04-15", "FOO", "")},
		  		errArgumentException, "start date has more fields than expected");

		  	assert.throws(function(){new comp.Competition("comp","Malaga","2016-04-15","3016-04-01", "FOO", "")},
		  		errArgumentException, "end date is bigger than 2999");
		  	assert.throws(function(){new comp.Competition("comp","Malaga","2016-04-15","2016-100-01", "FOO", "")},
		  		errArgumentException, "month of end date is bigger than 12");
		  	assert.throws(function(){new comp.Competition("comp","Malaga","2016-04-15","2016-0-01", "FOO", "")},
		  		errArgumentException, "month of end date is zero");
		  	assert.throws(function(){new comp.Competition("comp","Malaga","2016-04-15","2016-04-1000", "FOO", "")},
		  		errArgumentException, "day of end date is bigger than 12");
		  	assert.throws(function(){new comp.Competition("comp","Malaga","2016-04-15","2016-04-0", "FOO", "")},
		  		errArgumentException, "day of end date is zero");
		  	assert.ok(new comp.Competition("comp","Malaga","2016-04-15","", "FOO", ""), "end date void");	
		  	assert.throws(function(){new comp.Competition("comp","Malaga","2016-04-15","2016", "FOO", "")},
		  		errArgumentException, "end date is set bad");
		  	assert.throws(function(){new comp.Competition("comp","Malaga","2016-04-15","2016-05", "FOO", "")},
		  		errArgumentException, "end date is set bad");
		  	assert.throws(function(){new comp.Competition("comp","Malaga","2016-04-15","2016-05-01-01", "FOO", "")},
		  		errArgumentException, "end date has more fields than expected");

		  	assert.throws(function(){new comp.Competition("comp","Malaga",null,"2016-04-15", "FOO", "")},
		  		errArgumentException, "start date is null");
		  	assert.throws(function(){new comp.Competition("comp","Malaga",undefined,"2016-04-15", "FOO", "")},
		  		errArgumentException, "start date is undefined");	
		  	assert.throws(function(){new comp.Competition("comp","Malaga",NaN,"2016-04-15", "FOO", "")},
		  		errArgumentException, "start date is NaN");
		  	assert.throws(function(){new comp.Competition("comp","Malaga","2016-04-15",null, "FOO", "")},
		  		errArgumentException, "end date is null");
		  	assert.throws(function(){new comp.Competition("comp","Malaga","2016-04-15",undefined, "FOO", "")},
		  		errArgumentException, "end date is undefined");
		  	assert.throws(function(){new comp.Competition("comp","Malaga","2016-04-15",NaN, "FOO", "")},
		  		errArgumentException, "end date is NaN");
		  	assert.throws(function(){new comp.Competition("comp","Malaga","2016-05-15","2016-04-15", "FOO", "")},
		  		errArgumentException, "start date is later than end date");

		  	//organizer
		  	assert.ok(new comp.Competition("comp","Malaga","2016-04-01","2016-05-1", "", ""),"organizer is a void string");	  	 
		  	assert.throws(function(){new comp.Competition("comp","Malaga","2016-03-01","2016-04-1", 0, "")},
		  		errArgumentException, "organizer is a number");
		  	assert.throws(function(){new comp.Competition("comp","Malaga","2016-03-01","2016-04-1", null, "")},
		  		errArgumentException, "organizer is null");
		  	assert.throws(function(){new comp.Competition("comp","Malaga","2016-03-01","2016-04-1", undefined, "")},
		  		errArgumentException, "organizer is undefined");
		  	assert.throws(function(){new comp.Competition("comp","Malaga","2016-03-01","2016-04-1", NaN, "")},
		  		errArgumentException, "organizer is NaN");
		  	assert.throws(function(){new comp.Competition("comp","Malaga","2016-03-01","2016-04-1", " ", "")},
		  		errArgumentException, "organizer is a space");
		  	assert.throws(function(){new comp.Competition("comp","Malaga","2016-03-01","2016-04-1", " name", "")},
		  		errArgumentException, "organizer is a space followed by a name");

		  	//logo
		  	assert.ok(new comp.Competition("comp","Malaga","2016-04-01","2016-05-1", "FOO", ""), "logo is a void string");	  	 
		  	assert.throws(function(){new comp.Competition("comp","Malaga","2016-03-01","2016-04-1", "FOO", 0)},
		  		errArgumentException, "logo is a number");
		  	assert.ok(new comp.Competition("comp","Malaga","2016-03-01","2016-04-1", "FOO", null), "logo is null");
		  	assert.throws(function(){new comp.Competition("comp","Malaga","2016-03-01","2016-04-1", "FOO", undefined)},
		  		errArgumentException, "logo is undefined");
		  	assert.throws(function(){new comp.Competition("comp","Malaga","2016-03-01","2016-04-1", "FOO", NaN)},
		  		errArgumentException, "logo is NaN");
		  	assert.throws(function(){new comp.Competition("comp","Malaga","2016-03-01","2016-04-1", "FOO", " ")},
		  		errImageException, "logo is a space");
		  	assert.throws(function(){new comp.Competition("comp","Malaga","2016-03-01","2016-04-1", "FOO", " name")},
		  		errImageException, "logo is a space followed by a name");
		  	assert.ok(new comp.Competition("comp","Malaga","2016-04-01","2016-05-1", "FOO", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAAeCAIAAADy5JpfAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADvSURBVFhH7ZfhDYQgDIU7lwM5j9O4jMNwl4vCEyjQC1pI6i/TvNgvj7ZUclM9NBWtM9wnz2t6d49tofNZtiNvVYumbvK+Xolo3UHOxb+S1N0WlBaN4Zq79RrwimFqF2r71023ThoKNyb1zZ+OGX13gcBzhpeIuDduJmMSQgSEDXGMNs3Xf+euEJdNw4xpXXcLpgAv+DsMbuFYoHh644p2BnYkROzBXsMVbGSF2s1/RdVd56S8yrjIS1D3Z1UnnaCN6+rtxtwqTdfHE+t5kfi+6qi7e7VUypybiV1wBQvr+9Lp/4Tft0yQ0dwVmCWWfgBwvSAz4nkdngAAAABJRU5ErkJggg=="), 
		  		"logo is a valid base64 image");		
		  	assert.throws(function(){new comp.Competition("comp","Malaga","2016-03-01","2016-04-1", "Bar", "/night/day")},
		  		errImageException, "logo is invalid");
		  	//arguments
			assert.throws(function(){new comp.Competition()},
		  		errArgumentException, "less arguments than necessary");
			assert.throws(function(){new comp.Competition("comp","Malaga","2016-04-01","2016-05-1", "FOO", "bar", "some argument more")},
		  		errArgumentException, "more arguments than necessary");		  	


		});

		test('Testing getArray', function(assert) {
			
			var ar1 = (new comp.Competition("comp","Malaga","2016-04-01","2016-04-15", "FOO", "")).toArray();
			var ar2 = ["comp","Malaga","2016-04-01","2016-04-15", "FOO", ""];
	  		assert.deepEqual( ar1, ar2, "compare 2 equal arrays");

	  		ar1 = (new comp.Competition("comp","Malaga","2016-04-01","2016-04-15", "FOO", "")).toArray(["arrayExtended"]);
	  		ar2 = ar2.concat(["arrayExtended"]);
	  		assert.deepEqual(ar1,ar2, "compare 2 equal arrays with extension");

	  		ar1 = (new comp.Competition("comp","Malaga","2016-04-01","2016-04-15", "FOO", "")).toArray(["arrayExtended"]);
	  		ar2 = ["comp","Malaga","2016-04-01","2016-04-15", "FOO", ""];
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





