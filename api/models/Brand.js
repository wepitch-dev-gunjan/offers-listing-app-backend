const { Schema, model } = require("mongoose");

const brandSchema = new Schema(
  {
    title: String,
    description: String,
    logo: String,
    redirect_link: String,
    stores: [Object],
    categories: { type: [Object] }
  },
  {
    timestamps: true,
    strict: false
  }
);

module.exports = model("Brand", brandSchema);
