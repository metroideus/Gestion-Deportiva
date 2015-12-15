define(["../../../classes/test",'QUnit'], function(t) {
	var errArgumentException = function(err){
		return err.name === "ArgumentException";
	}

	var run = function(){
		QUnit.module( "tests" );
		test( 'Testing constructor', function(assert) {
			
			//creation
			assert.ok(new t.Test(1,"prueba1","single","distance", "h"),"Call to constructor");
			//competition
			assert.throws(function(){new t.Test("1","prueba1","single","distance", "h")},
		  		errArgumentException, "id is a string");
			assert.throws(function(){new t.Test("","prueba1","single","distance", "h")},
		  		errArgumentException, "id is a void string");		
			assert.throws(function(){new t.Test(-1,"prueba1","single","distance", "h")},
		  		errArgumentException, "id is a negative number");	
			assert.throws(function(){new t.Test(1.1,"prueba1","single","distance", "h")},
		  		errArgumentException, "id is a decimal number");
			assert.throws(function(){new t.Test(null,"prueba1","single","distance", "h")},
		  		errArgumentException, "id is null");	
		  	assert.throws(function(){new t.Test("1","prueba1","single","distance", "h")},
		  		errArgumentException,"id is a string with a number");	
  				
			//name
		  	assert.throws(function(){new t.Test(1,0,"single","distance", "h")},
		  		errArgumentException, "name is a number");
		  	assert.throws(function(){new t.Test(1,null,"single","distance", "h")},
		  		errArgumentException,"name is null");	  	
		  	assert.throws(function(){new t.Test(1,"","single","distance", "h")},
		  		errArgumentException,"name is a void string");
		  	assert.throws(function(){new t.Test(1,23,"single","distance", "h")},
		  		errArgumentException,"name is a number");
		  	assert.throws(function(){new t.Test(1," ","single","distance", "h")},
		  		errArgumentException,"name is a space");
		  	assert.throws(function(){new t.Test(1,"         ","single","distance", "h")},
		  		errArgumentException,"name is a set of space");
		  	assert.ok(new t.Test(1,"23","single","distance", "h"),"name is a string with a number");

		  	//type
		  	assert.throws(function(){new t.Test(1,"prueba1",-1,"distance", "h")},
		  		errArgumentException, "type is a negative number");
		  	assert.throws(function(){new t.Test(1,"prueba1","","distance", "h")},
		  		errArgumentException, "type is a void string");
		  	assert.throws(function(){new t.Test(1,"prueba1",12,"distance", "h")},
		  		errArgumentException, "type is a number");
		  	assert.throws(function(){new t.Test(1,"prueba1","asd","distance", "h")},
		  		errArgumentException, "type is a string distinct of single-team");
		  	assert.ok(new t.Test(1,"prueba1","single","distance", "h"),"type is single");
		  	assert.ok(new t.Test(1,"prueba1","team","distance", "h"),"type is team");

		  	//result
		  	assert.throws(function(){new t.Test(1,"prueba1","single",0, "h")},
		  		errArgumentException, "result is a number");
		  	assert.throws(function(){new t.Test(1,"prueba1","single","", "h")},
		  		errArgumentException, "result is a void string");
		  	assert.throws(function(){new t.Test(1,"prueba1","single","sdsd", "h")},
		  		errArgumentException, "result is a string distinct of distance-numeric-time");
		  	assert.ok(new t.Test(1,"prueba1","single","distance", "h"),"result is distance");
		  	assert.ok(new t.Test(1,"prueba1","team","time", "h"),"result is time");
		  	assert.ok(new t.Test(1,"prueba1","team","numeric", "h"),"result is numeric");

		  	//bestMark
		  	assert.throws(function(){new t.Test(1,"prueba1","single","distance", "")},
		  		errArgumentException, "bestMark is a void string");
		  	assert.throws(function(){new t.Test(1,"prueba1","single","distance", 0)},
		  		errArgumentException, "bestMark is a number");	  			  	 
		  	assert.throws(function(){new t.Test(1,"prueba1","single","distance", "another thing")},
		  		errArgumentException, "bestMark is distinct of l-h");
		  	assert.ok(new t.Test(1,"prueba1","single","distance", "h"),"bestMark is h");
		  	assert.ok(new t.Test(1,"prueba1","single","distance", "l"), "bestMark is l");

		  	//arguments
			assert.throws(function(){new t.Test()},
		  		errArgumentException, "less arguments than necessary");
			assert.throws(function(){new t.Test(null,"prueba1","single","distance", "h", "some argument more")},
		  		errArgumentException, "more arguments than necessary");

		});

		test('Testing toArray', function(assert) {
			
			var ar1 = (new t.Test(1,"prueba1","single","distance", "l")).toArray();
			var ar2 = ["prueba1","single","distance", "l"];
	  		assert.deepEqual( ar1, ar2 , "compare 2 equal arrays");

	  		ar1 = (new t.Test(1,"prueba1","single","distance", "l")).toArray(["arrayExtended"]);
	  		ar2 = ar2.concat(["arrayExtended"]);
	  		assert.deepEqual(ar1,ar2, "compare 2 equal arrays with extension");

	  		ar1 = (new t.Test(1,"prueba1","single","distance", "h")).toArray();
	  		ar2 = ["prueba1","single","distance", "l"];
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
