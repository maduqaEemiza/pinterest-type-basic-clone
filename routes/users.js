const mongoose = require('mongoose');
const plm =  require("passport-local-mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/dataassociation")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  ],
  email: {
    type: String,
    required: true,
    unique: true
  },
  fullname: {
    type: String,
    required: true
  },
  dp:{
    type: String,
    required: false
  }
});

userSchema.plugin(plm)
module.exports= mongoose.model('User', userSchema);
