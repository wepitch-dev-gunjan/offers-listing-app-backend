const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: String,
    phone_no: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      require: true,
    },
    location: String,
    age: String,
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "male",
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

module.exports = model("User", userSchema);
