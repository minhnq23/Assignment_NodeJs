const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  email: {
    type: "string",
  },
  password: { type: "string" },
  avatarPath: {
    type: "string",
  },
  isAdmin: {
    type: "Boolean",
  },
});
const UserModel = mongoose.model("user", UserSchema);
module.exports = UserModel;
