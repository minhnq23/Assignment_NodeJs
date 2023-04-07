const express = require("express");
const app = express();
const fs = require("fs");
const multer = require("multer");
const bodyParser = require("body-parser");
const expressHbs = require("express-handlebars");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const port = 8080;

//import routes
const registerRouter = require("./routers/registerRouter.js");
// const homeRouter = require("./routers/HomeRouter.js");
const productRouter = require("./routers/productRouter.js");
// model
const UserModel = require("./models/user.js");
const { default: mongoose } = require("mongoose");
const ProductModel = require("./models/product.js");

app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// dùng router
app.use("/", registerRouter);
// app.use("/", homeRouter);
app.use("/", productRouter);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "hbs");
app.set("views", "./views");
const uri =
  "mongodb+srv://minhnqph25450:minh31223@cluster.x5v6vum.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri);
// set up rest api
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      await UserModel.findOne({ email: email })
        .then((user) => {
          if (!user) {
            return done(null, false);
          }
          if (user.password !== password) {
            return done(null, false);
          }
          return done(null, user);
        })
        .catch((err) => {
          return done(err);
        });
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

function requireAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) {
    return next();
  } else if (req.user) {
    res.redirect("/register");
  } else {
    res.redirect("/");
  }
}

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

app.get("/home", requireAdmin, async function (req, res, next) {
  mongoose.connect(uri);
  let users = [];

  let products = [];
  products = await ProductModel.find().lean();
  users = await UserModel.find().lean();
  res.render("home", { users: users, products: products });
});
const upload = multer({ storage: storage });
//
//
//
app.post(
  "/",
  passport.authenticate("local", { failureRedirect: "/register" }),

  (req, res) => {
    // await mongoose
    //   .connect(uri)
    //   .then(console.log("connect success"))
    //   .catch(console.log("connect error"));
    res.redirect("/home");
    // console.log("click login");
    // console.log(req.body);
    // const email = req.body.email;
    // const password = req.body.password;
    // let myArray = [];
    // myArray = await UserModel.find().lean();
    // console.log(myArray.length);
    // for (let i = 0; i < myArray.length; i++) {
    //   if (email == myArray[i].email && password == myArray[i].password) {
    //     let userLogin = new UserModel(myArray[i]);
    //     res.redirect("/home");
    //   }
    // }
  }
);
//
// const loginApp = (req, res, users) => {
//   console.log("users: " + users.length);
//   const email = req.body.email;
//   const password = req.body.password;
//   users.forEach((item) => {
//     console.log(item.id + "");
//     if (item.email == email && item.password == password) {
//       res.redirect("/home");
//     }
//   });
// };
//
//
//
app.post("/register", upload.single("myImage"), async (req, res, next) => {
  // await mongoose
  //   .connect(uri)
  //   .then(console.log("connect success"))
  //   .catch(console.log("connect error"));
  console.log(req.body);
  const emailText = req.body.email;
  const passwordText = req.body.password;
  const avatarText = req.file.path;

  const newUser = new UserModel({
    email: emailText,
    password: passwordText,
    avatarPath: avatarText,
    isAdmin: true,
  });
  newUser
    .save()
    .then(() => {
      console.log("Saved!");
    })
    .catch((err) => console.error(err));
  res.redirect("/");
});

app.listen(port);

app.get("/user/delete/:id", async (req, res) => {
  // await mongoose
  //   .connect(uri)
  //   .then(console.log("connect success"))
  //   .catch(console.log("connect error"));
  try {
    const _id = req.params.id;
    const deletedUser = await UserModel.findByIdAndDelete(_id);
    if (!deletedUser) {
      return res.status(404).send("user không tồn tại");
    }
    res.redirect("/home");
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server khi xóa user");
  }
});
app.get("/product/delete/:id", async (req, res) => {
  // await mongoose
  //   .connect(uri)
  //   .then(console.log("connect success"))
  //   .catch(console.log("connect error"));
  try {
    const _id = req.params.id;
    const deletedProduct = await ProductModel.findByIdAndDelete(_id);
    if (!deletedProduct) {
      return res.status(404).send("product không tồn tại");
    }
    res.redirect("/home");
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server khi xóa product");
  }
});

app.get("/user/:id/edit", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UserModel.findById(id).lean();
    if (!user) {
      return res.status(404).send("Không tìm thấy user");
    }
    res.render("editUser", { user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Lỗi server");
  }
});
app.get("/product/:id/edit", async (req, res) => {
  const id = req.params.id;
  try {
    const product = await ProductModel.findById(id).lean();
    if (!product) {
      return res.status(404).send("Không tìm thấy sản phẩm");
    }
    res.render("editProduct", { product });
  } catch (error) {
    console.error(error);
    res.status(500).send("Lỗi server");
  }
});

app.post("/user/:id", async (req, res) => {
  // await mongoose.connect(uri).then(console.log("Ket noi DB thanh cong."));
  const id = req.params.id;
  const emailText = req.body.email;
  const passwordText = req.body.password;
  const avatarText = req.file.path;
  UserModel.findByIdAndUpdate(id, {
    email: nameProduct,
    email: emailText,
    password: passwordText,
    avatarPath: avatarText,
    status: 1,
  });
  res.redirect("/home");
});
