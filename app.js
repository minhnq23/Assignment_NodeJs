const express = require("express");
const app = express();
const fs = require("fs");
const multer = require("multer");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

//import routes
const registerRouter = require("./router.js");
const port = 8080;
const expressHbs = require("express-handlebars");
const homeRouter = require("./HomeRouter.js");
const API_URL = "http://192.168.0.100:3000";
const API_USER = `${API_URL}/user`;
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// dùng router
app.use("/", registerRouter);
app.use("/", homeRouter);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "hbs");
app.set("views", "./views");

app.engine(
  ".hbs",
  expressHbs.engine({
    extname: "hbs",
    defaultLayout: false,
    layoutsDir: "views/",
  })
);

app.get("/", (req, res) => {
  res.render("login");
});

// Set up Multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, "MyAvatar" + "-" + Date.now() + "." + cut(file.originalname));
  },
});

var cut = (name) => {
  var extension = name.slice(name.lastIndexOf(".") + 1);
  var lastThreeChars = extension.slice(-3);
  console.log(lastThreeChars); // kết quả sẽ là "png"
  return lastThreeChars;
};

const upload = multer({ storage: storage });
//
//
//
app.post("/", (req, res) => {
  console.log("click login");
  console.log(req.body);

  let myArray = [];

  fetch(API_USER)
    .then((response) => response.json())
    .then((data) => {
      myArray.push(...data);
      console.log("data:" + data.length);
      loginApp(req, res, data);
    });
});
//
const loginApp = (req, res, users) => {
  console.log("users: " + users.length);
  const email = req.body.email;
  const password = req.body.password;
  users.forEach((item) => {
    console.log(item.id + "");
    if (item.email == email && item.password == password) {
      res.redirect("/home");
    }
  });
};
//
//
//
app.post("/register", upload.single("myImage"), (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const avatar = req.file;

  if (!avatar) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
  }
  const newUser = {
    email,
    password,
    avatar,
  };

  fetch(API_USER, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Success:", result);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  res.redirect("/");
});

app.listen(port);
