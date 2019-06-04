const mongoose = require('mongoose');
// To validate the unique email, mongoose has an extra plugin
// which is installed by npm install --save mongoose-unique-validator
const uniqueValidator = require('mongoose-unique-validator');


const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true}, // unique validator is not built in here, we have to plug it in with mongoose
    password: {type: String, required: true}
});

// Mongoose lets us plugin the validator to the schema
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);