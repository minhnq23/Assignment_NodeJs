const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// model
const ProductModel = require("../models/product");

const uri =
  "mongodb+srv://minhnqph25450:minh31223@cluster.x5v6vum.mongodb.net/?retryWrites=true&w=majority";

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
router.use(bodyParser.json());
router.get("/product/post", async function (req, res, next) {
  res.render("postProduct");
});

router.post("/product/post", async function (req, res, next) {
  await mongoose
    .connect(uri)
    .then(console.log("connect success"))
    .catch(console.log("connect error"));
  const nameProduct = req.body.nameProduct;
  const priceProduct = req.body.price;
  const colorProduct = req.body.color;
  const newProduct = new ProductModel({
    name: nameProduct,
    price: priceProduct,
    image: "",
    color: colorProduct,
  });
  newProduct.save();
  res.redirect("/home");
});
module.exports = router;
