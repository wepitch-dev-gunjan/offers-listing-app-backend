const { Schema, model } = require('mongoose');

const offerSchema = new Schema({
  name: String,
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  sub_category: String,
  brand: {
    type: Schema.Types.ObjectId,
    ref: 'Brand'
  },
  location: String,
  description: String,
  image: String,
  expires_in: Date,
  discount_value: Number,
  grabbed_by: {
    type: [Schema.Types.ObjectId],
    ref: 'User'
  },
  saved_by: {
    type: [Schema.Types.ObjectId],
    ref: 'User'
  }
}, {
  timestamps: true,
  strict: false
})

module.exports = model('Offer', offerSchema)