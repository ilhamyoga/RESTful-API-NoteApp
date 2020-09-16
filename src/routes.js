'use strict'

module.exports = function(app){
	const controller = require('./controller');

	// GET
	app.get('/notes',controller.notes); //get all note
	app.get('/notes/:id',controller.onenote) //get one note
	app.get('/categories',controller.category); //get all category
	app.get('/categories/:id',controller.noteBycategory); //get note by category

	// POST
	app.post('/notes/',controller.insert);
	app.post('/categories/',controller.incategory);

	// PUT
	// PUT and PATCH is same HTTP method to update data. On PUT, we have to send all the requested data and are not allowed to send undefined data whereas with PATCH, you can send only the data parameters you want to update
	app.put('/notes/:id',controller.updated);
	app.put('/categories/:id',controller.upcategory);

	// DELETE
	app.delete('/notes/:id',controller.delete);
	app.delete('/categories/:id',controller.delBycategory); // delete note by category
}