const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://II__dominus__II:4Negh94r5MGXZf9X@cluster0-lgx3p.mongodb.net/node-angular?retryWrites=true", { useNewUrlParser: true })
	.then(()=>{
		console.log('Connected to database');
	})
	.catch(()=>{
		console.log('Connection failed!');
	});



const Post = require('./models/post');

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
	 	"GET, POST, PATCH, DELETE,PUT, OPTIONS"
	 );
	next();
})

app.post("/api/posts", (req, res, next) =>{
	//const post = req.body;
	
	const post = new Post({
		title: req.body.title,
		content: req.body.content
	});

	// console.log(post);
	post.save()
		.then(createdPost => {
			res.status(201).json({
				message: 'Post added successfully',
				postId: createdPost._id
			});
		});
	
});

app.get('/api/posts', (req, res, next) => {

	Post.find()
		.then(documents =>{
			res.status(200).json({
				message:'Posts fetched successfully',
				posts: documents
			});
		});

	// SMANTIKO prepei na einai mesa sto then giati perimenoyme na erthoun kai meta prpeie na ta steiloume ama ta 
	// xrhsimopoihsoume edw tha prin ferei tha prospathisei na ta steilei xwris na exei tipota
	// 
	// res.status(200).json({
	// 	message:'Posts fetched successfully',
	// 	posts: posts
	// });
});

app.delete("/api/posts/:id", (req, res, next) =>{
	// console.log(req.params.id);
	Post.deleteOne({_id: req.params.id})
		.then(result =>{
			console.log(result);
			res.status(200).json({message: 'Post deleted!'});
		});	
});

module.exports = app;


// 4Negh94r5MGXZf9X
// II__dominus__II
// 195.251.23.46