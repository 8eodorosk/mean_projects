const express = require("express");
const router = express.Router();

const Post = require('../models/post');


router.post("", (req, res, next) =>{
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

router.get("", (req, res, next) => {

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

router.get("/:id", (req, res, next)=>{
	Post.findById(req.params.id).then(post => {
		if (post) {
			res.status(200).json(post);
		} else {
			res.status(404).json({message: 'Posts not found'});
		}
	})
});

router.put("/:id", (req, res, next) =>{
	const post = new Post({
		_id: req.body.id,
		title: req.body.title,
		content: req.body.content
	});
	Post.updateOne({_id: req.params.id}, post).then(result =>{
		console.log(result);
		res.status(200).json({message: "Update succesfull"});
	});
});

router.delete("/:id", (req, res, next) =>{
	// console.log(req.params.id);
	Post.deleteOne({_id: req.params.id})
		.then(result =>{
			console.log(result);
			res.status(200).json({message: 'Post deleted!'});
		});	
});

module.exports = router;