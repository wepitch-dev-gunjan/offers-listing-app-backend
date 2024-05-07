const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: String,
    phone_no: {
      type: String,
      unique: true,
      required: true
    },
    email: {
      type: String
    },
    location: String,
    age: String,
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "male"
    },
    profile_pic: String
  },
  {
    timestamps: true,
    strict: false,
  }
);

module.exports = model("User", userSchema);
