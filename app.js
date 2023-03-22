const express = require("express");
const app = express();
const fs = require("fs");
//import routes
const registerRouter = require("./router.js");

const port = 8080;
// const router = express.Router();
const expressHbs = require("express-handlebars");

// dùng router
app.use("/", registerRouter);

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
app.listen(port);
app.get("/", (req, res) => {
  res.render("login");
});

// router.get("/register", function (req, res) {
//   res.render("register"); // render file register.hbs
// });

// module.exports = router;
