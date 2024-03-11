const { Schema, model } = require('mongoose');

const categorySchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  }
}, {
  timestamps: true,
  strict: false
})

module.exports = model('Category', categorySchema)