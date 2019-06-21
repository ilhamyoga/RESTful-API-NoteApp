'use strict'

const response  = require('./response');
const connection  = require('./connect');
const timestamp = require('time-stamp');
const isEmpty = require('lodash.isEmpty');

exports.welcome = function (req, res){
	response.come('Welcome!',res);
}

//GET ALL NOTE
exports.notes = function(req, res){
	var query = `SELECT * FROM sim_note `
	var query2 = `SELECT * FROM sim_note`

	let search = req.query.search
	let sort = req.query.sort
	let page = req.query.page
	let limit = req.query.limit || 10

	// search by title
	if(!isEmpty(search)){ 
		query += `WHERE title LIKE'%`+search+`%' `
	}
	// sorting descending and ascending
	if(!isEmpty(sort)){
		query += `ORDER BY updateAt `+Sort
	}
	else{
		query += `ORDER BY updateAt DESC`
	}

	var offset
	// pagination
	if(isEmpty(page)||page<=0){
		offset = 0;
	} 
	else{
		offset = (page - 1)*limit
	}

	query += ` LIMIT `+limit+` OFFSET `+offset

	console.log(query)
	connection.query(
		query,
		function (error, rows, field){
        	if(error){
        		console.log(error);
        	}
        	else{
        		if(rows.length==0){
        			return res.send({ status: 400, message: 'note not found' });
        		}
        		else if(page<=0){
        			return res.send({ status: 400, message: 'note not found' });
        		}
        		else{
        			connection.query(query2,function(error,row,field){
        				response.info(row,page,limit,rows,res);
        			})      		
        		}
        	}
    	}
    )
}

//GET ONE NOTE BY ID
exports.onenote = function(req, res){
	let id = req.params.id;
	connection.query(
		`SELECT * FROM sim_note WHERE id=?`,
		[id],
		function (error, rows, field){
        	if(error){
            	console.log(error);
        	}
        	else{
        		if (rows.length==0) {
	    			return res.send({ status: 400, message: 'id not found' });
				}
				else{
					response.ok('200',rows,res);
				}
        	}
    	}
    );
}

//GET NOTE BY CATEGORY
exports.noteBycategory = function(req, res){
	let id = req.params.id;
	connection.query(
		`SELECT * FROM sim_note WHERE category_id=?`,
		[id],
		function (error, rows, field){
        	if(error){
            	console.log(error);
        	}
        	else{
        		if (rows.length==0) {
	    			return res.send({ status: 400, message: 'id not found' });
				}
				else{
					response.ok('200',rows,res);
				}
        	}
    	}
    );
}

//GET ALL CATEGORY
exports.category = function(req, res){
	connection.query(
		`SELECT * FROM cate_note`, 
		function (error, rows, field){
        	if(error){
            	console.log(error);
        	}
        	else{
            	response.ok('category list',rows,res);
        	}
    	}
    );
}

//ADD NEW NOTE
exports.insert = function(req, res){
	let title = req.body.title;
	let note = req.body.note;
	let updateAt = timestamp(`YYYY-MM-DD HH:mm:ss`);
	let category = req.body.category;

	connection.query(
		`INSERT INTO sim_note SET title=?,note=?,updateAt=?,category_id=?`,
		[title, note, updateAt, category],
		function(error,rows,field){
			if(error){
				console.log(error);
			}
			else{
				response.ok('new note has been created',rows,res);
			}
		}
	);
}

//ADD NEW CATEGORY
exports.incategory = function(req, res){
	let category = req.body.category;
	let updateAt = timestamp(`YYYY-MM-DD HH:mm:ss`)
	connection.query(
		`INSERT INTO cate_note SET category=?,updateAt=?`,
		[category,updateAt],
		function(error,rows,field){
			if(error){
				console.log(error);
			}
			else{
				response.ok('new category has been created',rows,res);
			}
		}
	);
}

//UPDATE NOTE
exports.updated = function(req, res){
	let id = req.params.id;
 	let title = req.body.title;
 	let note = req.body.note;
 	let category = req.body.category
 	let updateAt = timestamp(`YYYY-MM-DD HH:mm:ss`)
 	connection.query(
 		'UPDATE sim_note SET title=?,note=?,category_id=?,updateAt=? WHERE id=?',
 		[title, note, category, updateAt, id],
 		function (error, rows, field) {
   			if (error){
   				console.log();
   			}
   			else{
   				if (rows.affectedRows==0) {
	    			return res.send({ status: 400, message: 'id not found' });
				}
   				response.ok('note has been updated successfully',rows,res);
   			}
  		}
  	);
}

//UPDATE NOTE
exports.upcategory = function(req, res){
	let id = req.params.id;
 	let category = req.body.category;
 	let updateAt = timestamp(`YYYY-MM-DD HH:mm:ss`)
 	connection.query(
 		'UPDATE cate_note SET category=?,updatedAt=? WHERE id=?',
 		[category,updateAt,id],
 		function (error, rows, field) {
   			if (error){
   				console.log(error);
   			}
   			else{
   				if (rows.affectedRows==0) {
	    			return res.send({ status: 400, message: 'id not found' });
				}
				else{
					response.ok('category has been updated successfully',rows,res);
				}
   			}
  		}
  	);
}

//DELETE NOTE
exports.delete = function(req,res){
	let id = req.params.id;
	connection.query(
		'DELETE FROM sim_note WHERE id=?',
		[id],
		function (error, rows, field) {
     		if (error){
     			console.log(error)
     		}
     		else{
     			if (rows.affectedRows==0) {
	    			return res.send({ status: 400, message: 'id not found' });
				}
				else{
					response.ok('Note has been DELETE successfully',rows,res);
				}
     		}
		}
	);
}

//DELETE NOTE BY CATEGORY
exports.delBycategory = function(req, res){
	let id = req.params.id;
	connection.query(
		'DELETE sim_note,cate_note FROM cate_note LEFT JOIN sim_note ON cate_note.id=sim_note.category_id WHERE cate_note.id=?',
		[id],
		function (error, rows, field) {
	     	if (error){
	     		console.log(error)
	     	}
	   		else{
	   			if (rows.affectedRows==0) {
	    			return res.send({ status: 400, message: 'id not found' });
				}
				else{
					response.ok('category has been DELETE successfully',rows,res);
				}
	     	}
 		}
 	);
}	