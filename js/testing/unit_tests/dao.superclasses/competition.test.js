define(["../../../DAO/superclasses/competition.dao.superclass",'QUnit'], function(competitionDAO) {
	var errArgumentException = function(err){
		return err.name === "ArgumentException";
	}
	
	var run = function(){
	QUnit.module( "competitionDAO" );	
		test( 'Testing insertWithUser', function(assert) {
			
		  	assert.throws(function(){ competitionDAO.insertWithUser("a",1)},
		  		errArgumentException, "Objeto Competition es un string");
		});

		test( 'Testing insert', function(assert) {
			
		  	assert.throws(function(){ competitionDAO.insert([])},
		  		errArgumentException, "Objeto Competition es un array");
		});

		test( 'Testing selectAllByUser', function(assert) {
			
		  	assert.throws(function(){ competitionDAO.selectAllByUser(function(){})},
		  		errArgumentException, "Objeto Competition es una función");
		});

		test( 'Testing selectAll', function(assert) {
			
		  	assert.throws(function(){ competitionDAO.selectAll("")},
		  		errArgumentException, "Función callBack es un string");
		});

		test( 'Testing remove', function(assert) {
			
		  	assert.throws(function(){ competitionDAO.remove("",function(){})},
		  		errArgumentException, "El id es un string");

		  	assert.throws(function(){ competitionDAO.remove(1,2)},
		  		errArgumentException, "Función success es un número");
		});

		test( 'Testing update', function(assert) {
			

		  	assert.throws(function(){ competitionDAO.update(new Function(), new Object(), new Function(), new Function())},
		  		errArgumentException, "El id es una función");
		  	
		});

		test( 'Testing selectById', function(assert) {
			

		  	assert.throws(function(){ competitionDAO.selectById(new Function())},
		  		errArgumentException, "El id es una función");
		  	
		});

		test( 'Testing selectByName', function(assert) {
			

		  	assert.throws(function(){ competitionDAO.selectByName(23)},
		  		errArgumentException, "El nombre es un numero");
		  	
		});

	}

	return{
		run:run
	}

});





