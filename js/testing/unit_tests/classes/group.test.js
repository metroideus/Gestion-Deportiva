define(['../../../classes/group','QUnit'],function(t,QUnit){
	var errArgumentException = function(err){
		return err.name === "ArgumentException";
	}
	var run = function(){
		QUnit.module( "groups" );
		test( 'Testing constructor', function(assert) {
			
			//creation
			assert.ok(new t.Group("grupo1", 1),"Call to constructor");
			
			//name
		  	assert.throws(function(){new t.Group(1,1)}, errArgumentException, "name is a number");
		  	assert.throws(function(){new t.Group("",1)}, errArgumentException, "name is a void string");
		  	assert.throws(function(){new t.Group(" ",1)}, errArgumentException, "name is a space");
		  	assert.throws(function(){new t.Group("        ",1)}, errArgumentException, "name is a set of space");
		  	assert.throws(function(){new t.Group(null,1)},	errArgumentException, "name is null");
		  	assert.throws(function(){new t.Group(undefined,1)}, errArgumentException, "name is undefined");
		  	assert.throws(function(){new t.Group(NaN,1)}, errArgumentException, "name is NaN");			
		  	assert.throws(function(){new t.Group(" name",1)}, errArgumentException, "name is space followed by a name");	
			assert.ok(new t.Group("set of words", 1),"name is a sentence");

			//Group_idGroup
			assert.ok(new t.Group("group1", 0),"Group_idGroup is zero");
			assert.ok(new t.Group("group",null), "Group_idGroup is null");

			assert.throws(function(){new t.Group("group",-1)}, errArgumentException, "Group_idGroup is negative");
		  	assert.throws(function(){new t.Group("group",new String())}, errArgumentException, "Group_idGroup is a string");	
		  	assert.throws(function(){new t.Group("group",undefined)}, errArgumentException, "Group_idGroup is undefined");
		  	assert.throws(function(){new t.Group("group",NaN)}, errArgumentException, "Group_idGroup is NaN");	

		  	//arguments
			assert.throws(function(){new t.Group()},
		  		errArgumentException, "less arguments than necessary");
			assert.throws(function(){new t.Group("grupo1", 1, "some argument more")},
		  		errArgumentException, "more arguments than necessary");	

		});



		test('Testing getArray', function(assert) {
			
			var ar1 = (new t.Group("group1",0)).toArray();
			var ar2 = ["group1",0];
	  		assert.deepEqual( ar1, ar2, "compare 2 equal arrays");

	  		ar1 = (new t.Group("group1",0)).toArray(["arrayExtended"]);
	  		ar2 = ar2.concat(["arrayExtended"]);
	  		assert.deepEqual(ar1,ar2, "compare 2 equal with extension");

	  		ar1 = (new t.Group("group1",0)).toArray(["arrayExtended"]);
	  		ar2 = ["group1",0];
	  		assert.notDeepEqual(ar1,ar2,"compare 2 distinct arrays");

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
