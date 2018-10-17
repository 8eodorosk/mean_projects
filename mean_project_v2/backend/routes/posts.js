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
		//console.log(file);
		const name = file.originalname.toLowerCase().split(' ').join('-');
		const ext = MIME_TYPE_MAP[file.mimetype]; 
		//console.log(name, ext);
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
	
	const url = req.protocol + '://' + req.get("host");
	const post = new Post({
		title: req.body.title,
		content: req.body.content,
		imagePath: url + '/images/' + req.file.filename
	});

	// console.log(post);
	post.save()
		.then(createdPost => {
			res.status(201).json({
				message: 'Post added successfully',
				post: {
					//...createdPost, // create a post with all the properties of createdPost then override this with the below
					id: createdPost._id,
					title: createdPost.title,
					content: createdPost.content,
					imagePath: createdPost.imagePath
				}
			});
		});
	
});

router.get("", (req, res, next) => {

	// req.query pairneis ta dedomena poy einai se morfi query string!!	
	const pageSize = +req.query.pagesize; // to + mprosta einai gia na metatrepsei to string se arithmo
										  // ayto giati apo to url pairnei tis times se morfi string 
	const currentPage = +req.query.page;
	const postQuery = Post.find(); // it will be executed as soon as we call then!!!! 
								   // ayto einai gia na kanoyme dynamic queries....!!
	let fetchedPosts;					
								   
	if (pageSize && currentPage) {
		postQuery
			.skip(pageSize * (currentPage -1))
			.limit(pageSize);  // ayto gia na ferei osa documents thekoyme sti sigkekrimeni periptwsi pageSize


		// https://stackoverflow.com/questions/5539955/how-to-paginate-with-mongoose-in-node-js
		// ayto to skip einai poly CPU costly!!!! 
		// READ MONGOOSE DOCUMENTATION WELL!!!
	}
	postQuery.then(documents =>{
		fetchedPosts = documents;
		return Post.countDocuments();
	})
	.then( count =>{
		res.status(200).json({
			message:'Posts fetched successfully',
			posts: fetchedPosts,
			maxPosts: count 
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

router.put("/:id", multer({storage: storage}).single("image"), (req, res, next) =>{
	

	let imagePath = req.body.imagePath;

	if (req.file) {
		const url = req.protocol + '://' + req.get("host");
		imagePath = url + '/images/' + req.file.filename;
	}


	const post = new Post({
		_id: req.body.id,
		title: req.body.title,
		content: req.body.content,
		imagePath: imagePath
	});
	console.log("lalalalalala",post);
	Post.updateOne({_id: req.params.id}, post).then(result =>{
		//console.log(result);
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