const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const API_URL = "http://192.168.0.100:3000";
const API_USER = `${API_URL}/user`;

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
router.use(bodyParser.json());
router.get("/home", function (req, res, next) {
  let users = [];
  fetch(API_USER)
    .then((response) => response.json())
    .then((data) => {
      users.push(...data);
      console.log("data:" + data.length);
      res.render("home", { title: "Users", users });
    });
});

module.exports = router;
