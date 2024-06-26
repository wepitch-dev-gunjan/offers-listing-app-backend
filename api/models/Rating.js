const { Schema, model } = require('mongoose');

const ratingSchema = new Schema({
  rating: Number,
  comment: String,
  user_id: String
})

module.exports = model('Rating', ratingSchema)