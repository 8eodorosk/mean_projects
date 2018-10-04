const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const mongoose = require('mongoose');

const postsRoutes = require("./routes/posts");

mongoose.connect("mongodb+srv://<your credentials here>@cluster0-lgx3p.mongodb.net/node-angular?retryWrites=true", { useNewUrlParser: true })
	.then(()=>{
		console.log('Connected to database');
	})
	.catch(()=>{
		console.log('Connection failed!');
	});




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) =>{
	res.setHeader('Access-Control-Allow-Origin', "*");
	res.setHeader(
		"Access-Control-Allow-Headers", 
		"Origin, X-Requested-With, content-Type, Accept"
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
	 	"GET, POST, PATCH, PUT, DELETE,PUT, OPTIONS"
	 );
	next();
})

app.use("/api/posts", postsRoutes);


module.exports = app;


