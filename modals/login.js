const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LoginSchema = new Schema({
    type_compte: String,
    id_type_compte: Number,
    Password: String,
});


const Login = mongoose.model('Login', LoginSchema);

module.exports = Login;
