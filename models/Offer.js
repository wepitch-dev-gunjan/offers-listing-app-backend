const { Schema, model } = require('mongoose');

const offerSchema = new Schema({
  name: String,
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  brand: {
    type: Schema.Types.ObjectId,
    ref: 'Brand'
  },
  location: String,
  description: String,
  image: String,
  expire_at: Date,
  discount_value: Number
}, {
  timestamps: true,
  strict: false
})

module.exports = model('Offer', offerSchema)