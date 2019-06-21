const express = require('express');
const app = express();
const cors = require('cors');
const env = require('./config');
const bodyParser = require('body-parser');
const routes = require('./routes');
const timestamp = require('time-stamp');

//CORS
var whitelist = ['http://192.168.6.109','http://192.168.6.195'];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

//middleware
const logger = function(req,res,next){
	console.log("Logged : " + timestamp('YYYY-MM-DD HH:mm:ss'))
	next()
}
app.use(logger)

app.use(cors());

app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.use(bodyParser.json());

routes(app);

app.listen(env.PORT || 3000);
console.log("Running...");