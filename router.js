const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
router.use(bodyParser.json());
router.get("/register", function (req, res, next) {
  
  res.render("register");
});

module.exports = router;

/// dùng thư viện express tạo router  ở dòng số 2 rồi dùng lệnh get ddeer render trang register
// export router ra để dùng muốn dùng cái gì ở file khác thì phải export
// ở trang app.js gọi và sử dụng lệnh user để dùng
// sử lý sự kiên thẻ a thì herf = "/register" còn cái khác thì dùng js để sử lý
