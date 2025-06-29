const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  loyaltyCounter: {
    type: Number,
    default: 0
  },
  resetToken: String,
  resetTokenExpires: Date,
});

const UserModel = mongoose.model("Users", UserSchema);
module.exports = UserModel;
