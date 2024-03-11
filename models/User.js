const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  name: String,
  phone_no: String,
  email: String,
  location: String,
  age: String,
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    default: 'male'
  }
}, {
  timestamps: true,
  strict: false
})

module.exports = model('User', userSchema)