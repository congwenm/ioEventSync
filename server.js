"use strict";

var express = require("express"),
	app = express(),
	httpServer = require("http").createServer(app),
	bodyParser = require("body-parser"),
	io = require("socket.io"),
	_ = require("underscore");


// Server's port number
app.set("port", 8080);

app.set("ipaddr", "0.0.0.0");

var allowCrossDomain = function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
	res.header("Access-Control-Allow-Headers", "Content-Type");

	next();
};

app.use(allowCrossDomain);

app.use(bodyParser.json());



/**
 * IO.listen
 */
// io = io.listen(8080);
io = io.listen(httpServer);



/**
 * App Listen
 */
httpServer.listen(
	app.get("port"),
	app.get("ipaddr"),
	function () {
		console.log("Server up and running. Go to http://" + app.get("ipaddr") + ":" + app.get("port"));
	}
);


app.get("/", function(req, res){
	res.json({status: "no method"});
});


/**
 * On establishing connection, bind events
 */
io.on("connection", function (socket) {
	
	socket.on("click", function(clickEvent){
		console.log("clicked!", clickEvent);
	});


});