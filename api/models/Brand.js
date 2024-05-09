const { Schema, model } = require("mongoose");

const brandSchema = new Schema(
  {
    title: String,
    description: String,
    logo: String,
    redirect_link: String,
    stores: {
      type: [Object],
    },
    categories: { type: [Object] },
    sub_categories: { type: [String] },
  },
  {
    timestamps: true,
    strict: false,
  }
);

module.exports = model("Brand", brandSchema);
