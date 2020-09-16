'use strict'

exports.message = function(values,res){
	const data = {
		status : 200,
		message: values,
	};
	res.status(200).json(data);
	res.end();
}

exports.ok = function(values,res){
	const data = {
		status : 200,
		error : false,
		data : values,
	};
	res.status(200).json(data);
	res.end()
}

exports.error = function(res){
	const data = {
		status : 500,
		message: "Terjadi Kesalahan",
	};
	res.status(500).json(data);
	res.end();
}

exports.notFound = function(res){
	const data = {
		status : 404,
		message: 'Cannot find data with your id'
	}
	res.status(404).json(data);
	res.end();
}

exports.info = function(values,values2,values3,sort,res){ //(data2,page,limit,data note,respon)
	const data = {
		status: 200,
		data : values,
		totalNote : values.length, // display lots of data notes
		page : parseInt(values2),
		sortBy : sort,
		totalPage : Math.ceil(values.length/values3)
	};
	res.status(200).json(data);
	res.end()
}