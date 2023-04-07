const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
  name: {
    type: "string",
  },
  price: { type: "number" },
  color: { type: "string" },
  image: { type: "string" },
});
const ProductModel = mongoose.model("product", ProductSchema);
module.exports = ProductModel;
