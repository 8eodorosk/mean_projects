const express = require("express");
const router = express.Router();
const multer = require("multer");

const Post = require('../models/post');


const MIME_TYPE_MAP = {
	'image/png': 'png',
	'image/jpeg': 'jpg',
	'image/jpg': 'jpg'
}



const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const isValid = MIME_TYPE_MAP[file.mimetype];
		let error = new Error("Invalid mime type");
		if (isValid) {
			error = null;
		}
		cb(error, "images");
	},
	filename: (req, file, cb) => {
		const name = file.originalname.toLowerCase().split(' ').join('-');
		const ext = MIME_TYPE_MAP[file.mimetype]; 
		cb(null, name + '-' + Date.now() + '.' + ext);
	}
})

// sto express mporoyme na baloyme osa arguments theloume kai tha ginontai
// execute apo aristera sta dexia, edw px to prwto einai to path
// kai twra tha valoyme ena middleware na trexei prin to requet
// tha trexoume ton multer kai tha perimenei ena single file typoy 
// image
router.post("", multer({storage: storage}).single("image") ,(req, res, next) =>{
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