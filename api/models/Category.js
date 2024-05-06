const { Schema, model } = require('mongoose');

const categorySchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  image: String,
  sub_categories: {
    type: [String],
    default: null
  }
}, {
  timestamps: true,
  strict: false
})

module.exports = model('Category', categorySchema)