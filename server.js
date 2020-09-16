const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const timestamp = require('time-stamp');

const env = require('./config');
const routes = require('./src/routes');

const app = express();

app.use(
	bodyparser.urlencoded({
		extended: true,
	})
);
app.use(bodyparser.json());

// CORS
const whitelist = ['http://192.168.6.109','http://192.168.6.195'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
//app.use(cors(corsOptions));

// middleware
const logger = function(req,res,next){
	console.log("Logged : " + timestamp('YYYY-MM-DD HH:mm:ss'))
	next()
}
app.use(logger)

routes(app);

// listen to server with specified port
app.listen(env.PORT, () => {
  console.log("Server listening at port : " + env.PORT);
});