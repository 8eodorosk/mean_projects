const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
	title: {type:String, required: true}, // in nodejs it needs a CAPITAL 'S' for the string kai episis 
	content: {type:String, required: true},
	imagePath: {type:String, required: true}
});

module.exports = mongoose.model('Posts', postSchema);