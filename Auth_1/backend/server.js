var express = require('express');
var cors = require('cors');
var app = express(); 
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/user.js');
var auth = require('./auth.js')
var Post = require('./models/post.js');

const port = 3000; 


app.get('/posts/:id', async (req, res)=>{
	var author = req.params.id;
	var posts =  await Post.find({author});

	// console.log(posts);
	res.send(posts);

})


app.use(cors());
app.use(bodyParser.json());

app.post('/post', (req,res) => {


	var postData = req.body;
	postData.author = '5b969cef3f30428fd2e258e4';

	let post  = new Post(postData);

	console.log(post);

	post.save((err, result)=>{
		if (err) {
			console.log('Saving Post Error');
			return res.status(500).send({message: 'Saving Post Causing an error'});
		}
		res.sendStatus(200);
	})
});

app.get('/users', async (req, res)=>{
	
	try {
		let users = await User.find({}, '-password -__v');
		res.send(users); 
	} catch(e) {
		console.log(e);
		res.sendStatus(500);
	}

});

app.get('/profile/:id', async (req, res)=>{
	
	// console.log(req.params);

	try {
		let user = await User.findById(req.params.id, '-password -__v');
		// console.log(user);
		res.send(user); 
	} catch(e) {
		console.log(e);
		res.sendStatus(500);fdfsfsdfsd
	}

});

// app.post('/register', auth.register);

// app.post('/login', auth.login);

mongoose.connect('mongodb://thodoris:abc123@ds243502.mlab.com:43502/meanstack', { useNewUrlParser: true }, (err)=>{
	if(!err){
		console.log('Connected to the mongo Database');
	}
});



app.use('/auth', auth);
app.listen(port); 






