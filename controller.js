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
	var query = `SELECT sim_note.id,title,note,sim_note.createAt,sim_note.updateAt,category_id,category FROM sim_note LEFT JOIN cate_note ON sim_note.category_id=cate_note.id `
	var query2 = `SELECT * FROM sim_note`

	let search = req.query.search
	let sort = req.query.sort || 'DESC'
	let page = req.query.page || 1
	let limit = req.query.limit || 10

	// search by title
	if(!isEmpty(search)){ 
		query += `WHERE title LIKE'%`+search+`%' `
	}
	// sorting descending and ascending
	if(!isEmpty(sort)){
		query += `ORDER BY updateAt `+sort
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
        			return res.send({ status: 400, message: 'note not found', totalNote: 0 });
        		}
        		else if(page<=0){
        			return res.send({ status: 400, message: 'note not found' });
        		}
        		else if(!isEmpty(search)){
        			return res.send({ 
        				status: 200,
        				data: rows,
        				totalNote : rows.length, // display lots of data notes
						page : parseInt(page),
						sortBy : sort, 
						totalPage : Math.ceil(rows.length/limit) 
        			})
        		}
        		else{
    				connection.query(query2,function(error,row,field){
    					response.info(row,page,limit,sort,rows,res); 		
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
	let page = 1
	connection.query(
		`SELECT sim_note.id,title,note,sim_note.createAt,sim_note.updateAt,category_id,category FROM sim_note LEFT JOIN cate_note ON sim_note.category_id=cate_note.id WHERE category_id=?`,
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
					response.infoby(page,rows,res);
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
				connection.query(
					`SELECT sim_note.id,title,note,sim_note.createAt,sim_note.updateAt,category_id,category FROM sim_note LEFT JOIN cate_note ON sim_note.category_id=cate_note.id WHERE sim_note.id=${rows.insertId}`,
					function (error, row, field){
						const data = {
							id: rows.insertId,
							title: title,
							note: note,
							createAt: updateAt,
							updateAt: updateAt,
							category_id: row[0].category_id,
							category: row[0].category
						}
						response.ok(data,rows,res);
					}
				)
			}
		}
	);
}

//ADD NEW CATEGORY
exports.incategory = function(req, res){
	let category = req.body.category;
	let icon_image = req.body.icon_image;
	let updateAt = timestamp(`YYYY-MM-DD HH:mm:ss`)
	connection.query(
		`INSERT INTO cate_note SET category=?,icon_image=?,updateAt=?`,
		[category, icon_image, updateAt],
		function(error,rows,field){
			if(error){
				console.log(error);
			}
			else{
				const data = {
					id: rows.insertId,
					category:category,
					icon_image:icon_image,
					createAt: updateAt,
					updateAt: updateAt
				}
				response.ok(data,rows,res);
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
   				connection.query(
					`SELECT sim_note.id,title,note,sim_note.createAt,sim_note.updateAt,category_id,category FROM sim_note LEFT JOIN cate_note ON sim_note.category_id=cate_note.id WHERE sim_note.id=${id}`,
					function (error, row, field){
						const data = {
							id: parseInt(id),
							title: title,
							note: note,
							createAt: row[0].createAt,
							updateAt: updateAt,
							category_id: row[0].category_id,
							category: row[0].category
						}
						response.ok(data,rows,res);
					}
				)
   			}
  		}
  	);
}

//UPDATE CATEGORY
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
					response.ok(parseInt(id),rows,res);
				}
     		}
		}
	);
}

//DELETE NOTE BY CATEGORY
exports.delBycategory = function(req, res){
	let id = req.params.id;
	connection.query(
		'DELETE FROM cate_note WHERE id=?',
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
					response.ok(parseInt(id),rows,res);
				}
	     	}
 		}
 	);
}	