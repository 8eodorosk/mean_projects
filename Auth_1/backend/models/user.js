var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
	email: String,
	password : String,
	name: String, 
	description: String
})


userSchema.pre('save', function(next){
	var user = this

	console.log(user);

	if (!user.isModified('password')) {
		return next()
	}

	bcrypt.hash(user.password, null, null, (err, hash)=>{
		if (err) {
			return next(err)
		}

		user.password = hash
		next()
	})
})


/**
 Middleware (also called pre and post hooks) are functions which are passed control during execution of asynchronous functions. 
 Middleware is specified on the schema level and is useful for writing plugins. Mongoose has 4 types of middleware: document middleware, 
 model middleware, aggregate middleware, and query middleware. Document middleware is supported for the following document functions. 
 In document middleware functions, this refers to the document.
 */



module.exports = mongoose.model('User', userSchema);