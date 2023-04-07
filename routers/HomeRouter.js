const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// model
const UserModel = require("../models/user");
const ProductModel = require("../models/product");

const uri =
  "mongodb+srv://minhnqph25450:minh31223@cluster.x5v6vum.mongodb.net/?retryWrites=true&w=majority";

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
router.use(bodyParser.json());
router.get("/home", async function (req, res, next) {
  await mongoose
    .connect(uri)
    .then(console.log("connect success"))
    .catch(console.log("connect error"));
  let users = [];
  let products = [];
  products = await ProductModel.find().lean();
  users = await UserModel.find().lean();
  res.render("home", { users: users, products: products });
});

module.exports = router;
