var express = require('express');
var jwt = require('jwt-simple');
var bcrypt = require('bcrypt-nodejs');
var User = require('./models/user.js');
var router = express.Router();

router.post('/register', (req,res) => {
	let userData = req.body;
	console.log(userData);
	let user = new User(userData);

	user.save((err)=>{
		if(err){
			console.log(err);
		}else{
			// console.log('olaPOPA');
			res.sendStatus(200);
		}
	})
})

router.post('/login', async (req,res) => {
	let userData = req.body;
	
	let user = await User.findOne({email : userData.email});

	if (!user) {
		return res.status(401).send({message: 'Email or password invalid'});
	}

	bcrypt.compare(userData.password, user.password, (err, isMatch)=>{
		if (!isMatch) {
			return res.status(401).send({message: 'Email or password invalid'})
		}

		let payload = { sub : user._id };

		let token = jwt.encode(payload, '123');

		res.status(200).send({token});
	})
})

module.exports = router