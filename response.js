'use strict'

exports.come = function(values,res){
	const data = {
		status : 200,
		values: values,
	};
	res.json(data);
	res.end();
}

exports.ok = function(values,rows,res){
	const data = {
		error : false,
		data : rows,
		status: values,
	};
	res.json(data);
	res.end()
}

exports.info = function(values,values2,values3,rows,res){ //(data2,page,limit,data note,respon)
	const data = {
		status: 200,
		data : rows,
		totalNote : values.length, // display lots of data notes
		page : parseInt(values2), 
		totalPage : Math.ceil(values.length/values3)
	};
	res.json(data);
	res.end()
}