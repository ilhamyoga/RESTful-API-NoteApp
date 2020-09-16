'use strict'

const response  = require('./response');
const connection  = require('./database/connect');
const timestamp = require('time-stamp');
const isEmpty = require('lodash.isEmpty');
const { query } = require('express');

exports.welcome = function (req, res){
	return response.message('Welcome!',res);
}

//GET ALL NOTE
exports.notes = function(req, res){
	let search = req.query.search
	let sort = req.query.sort || 'DESC'
	let page = req.query.page || 1
	let limit = req.query.limit || 10
	
	let query = `SELECT note_items.id, title, note, category_id, category, note_items.createAt, note_items.updateAt FROM note_items LEFT JOIN note_categories ON note_items.category_id = note_categories.id`
	
	// search by title
	if(!isEmpty(search)){ 
		query += ` WHERE title LIKE'%`+search+`%'`
	}

	// sorting descending and ascending
	query += ` ORDER BY note_items.updateAt `+ sort

	let offset
	// pagination
	if(page<=0){
		offset = 0;
	}
	else{
		offset = (page - 1)*limit
	}

	query += ` LIMIT `+limit+` OFFSET `+offset

	connection.query(query, (error, rows, field) => {
			if(error){
				console.log(error);
				return response.error(res)
			}
			else{
				return response.info(rows,page,limit,sort,res);
			}
		}
  )
}

//GET A NOTE BY ID
exports.onenote = function(req, res){
	let id = req.params.id;

	let query = `SELECT * FROM note_items WHERE id=${id}`
	connection.query(query, (error, rows, field) => {
		if(error){
			console.log(error)
			return response.error(res)
		}
		else{
			return response.ok(rows,res);
		}
	})
}

//GET NOTE BY CATEGORY
exports.noteBycategory = function(req, res){
	let id = req.params.id;

	let query = `SELECT note_items.id,title,note,category_id,category,color,note_items.createAt,note_items.updateAt FROM note_items LEFT JOIN note_categories ON note_items.category_id=note_categories.id WHERE note_items.category_id=${id}`

	let search = req.query.search
	let sort = req.query.sort || 'DESC'
	let page = req.query.page || 1
	let limit = req.query.limit || 10

	// search by title
	if(!isEmpty(search)){ 
		query += ` AND title LIKE'%`+search+`%'`
	}

	// sorting descending and ascending
	query += ` ORDER BY note_items.updateAt `+ sort

	let offset
	// pagination
	if(page<=0){
		offset = 0;
	}
	else{
		offset = (page - 1)*limit
	}

	query += ` LIMIT `+limit+` OFFSET `+offset
	connection.query(query, (error, rows, field) => {
		if(error){
			console.log(error);
			return response.error(res)
		}
    else{
			return response.info(rows,page,limit,sort,res);
		}
	});
}

//GET ALL CATEGORY
exports.category = function(req, res){
	let query = `SELECT * FROM note_categories`
	connection.query(query, (error, rows, field) => {
		if(error){
			console.log(error);
			return response.error(res);
		}
		else{
			return response.ok(rows,res);
		}
  });
}

//ADD NEW NOTE
exports.insert = function(req, res){
	let {title, note, category_id} = req.body
	// let updateAt = timestamp(`YYYY-MM-DD HH:mm:ss`);

	let query = `INSERT INTO note_items SET title='${title}',note='${note}',category_id=${category_id}`
	connection.query(query, (error,rows,field) => {
			if(error){
				console.log(error);
				return response.error(res)
			}
			else{
				let query = `SELECT note_items.id,title,note,category_id,category,color,note_items.createAt,note_items.updateAt FROM note_items LEFT JOIN note_categories ON note_items.category_id = note_categories.id WHERE note_items.id=${rows.insertId}`
				connection.query(query, (error, row, field) => {
					if(error){
						console.log(error)
						return response.error(res);
					}
					else {
						return response.ok(row,res);
					}
				})
			}
		}
	);
}

//ADD NEW CATEGORY
exports.incategory = function(req, res){
	let {category, color, icon} = req.body
	let updateAt = timestamp(`YYYY-MM-DD HH:mm:ss`)

	let query = `INSERT INTO note_categories SET category='${category}',icon='${icon},color='${color}'`
	connection.query(query, (error,rows,field) => {
		if(error) {
			console.log(error);
			return response.error(res)
		}
		else{
			const data = {
				id: rows.insertId,
				category: category,
				icon: icon,
				color: color,
				createAt: updateAt,
				updateAt: updateAt
			}
			return response.ok(data,res);
		}
	});
}

//UPDATE NOTE
exports.updated = function(req, res){
	let id = req.params.id;
	let {title, note, category_id} = req.body
	// let updateAt = timestamp(`YYYY-MM-DD HH:mm:ss`)
	
	let query = `UPDATE note_items SET title='${title}',note='${note}',category_id=${category_id} WHERE id=${id}`
 	connection.query(query, (error, rows, field) => {
		if (error){
			console.log(error);
			return response.error(res)
		}
		else{
			if (rows.affectedRows == 0) {
				return response.notFound(res)
			}
			else {
				let query = `SELECT note_items.id,title,note,category_id,category,color,note_items.createAt,note_items.updateAt FROM note_items LEFT JOIN note_categories ON note_items.category_id=note_categories.id WHERE note_items.id=${id}`
				connection.query(query, (error, row, field) => {
					if (error){
						console.log(error);
						return response.error(res)
					}
					else{
						return response.ok(row,res);
					}
				})
   		}
		}
	})
}

//UPDATE CATEGORY
exports.upcategory = function(req, res){
	let id = req.params.id;
	let {category, color, icon} = req.body
	// let updateAt = timestamp(`YYYY-MM-DD HH:mm:ss`)
	 
	let query = `UPDATE note_categories SET category='${category}',color='${color}',icon='${icon}' WHERE id=${id}`
 	connection.query(query, (error, rows, field) => {
		if (error){
			console.log(error)
			return response.error(res)
		}
		else{
			if (rows.affectedRows == 0) {
				return response.notFound(res)
			}
			else{
				return response.ok(rows,res);
			}
		}
	})
}

//DELETE NOTE
exports.delete = function(req,res){
	let id = req.params.id;

	let query = `DELETE FROM note_items WHERE id=${id}`
	connection.query(query, (error, rows, field) => {
		if (error){
			console.log(error)
			return response.error(res)
		}
		else{
			if (rows.affectedRows == 0) {
				return response.notFound(res)
			}
			else{
				return response.ok(rows, res);
			}
		}
	})
}

//DELETE CATEGORY
exports.delBycategory = function(req, res){
	let id = req.params.id;

	let query = `DELETE FROM note_categories WHERE id=${id}`
	connection.query(query, (error, rows, field) => {
		if (error){
			console.log(error)
			return response.error(res)
		}
		else{
			if (rows.affectedRows == 0) {
				return response.notFound(res)
			}
			else{
				return response.ok(rows,res);
			}
		}
	})
}	