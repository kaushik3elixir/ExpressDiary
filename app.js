// heroku link
// https://fast-cliffs-67680.herokuapp.com/

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

// set templating engine as ejs
app.set("view engine", "ejs");

// serving statis files
app.use(express.static("public"));

// bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// middleware for method override
app.use(methodOverride("_method"));

// connecting to database using mongoose
// How to Set Environment Variables on Heroku...
// https://catalins.tech/heroku-environment-variables
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Mongo DB connected!"))
  .catch((err) => {
    console.log(err);
  });

//   Imoprt diary model
const diaryModel = require("./models/Diary");
// const Diary = require("./models/Diary");
// const req = require("express/lib/request");

// ----Routes----

// route for home page

app.get("/", (req, res) => {
  // we have set the view engine so the extension is not required. Otherwise we would have to specify the extension
  //   we don't even have to specify the folder, because by convension, it is in the "views" folder
  res.render("Home");
});

// route for About page
app.get("/about", (req, res) => {
  res.render("About");
});

// route for Diary page
app.get("/diary", (req, res) => {
  diaryModel
    .find()
    .then((data) => {
      // console.log(data);
      res.render("Diary", { data: data });
    })
    .catch((err) => {
      console.log(err);
    });
});

// route for adding records
app.get("/add", (req, res) => {
  res.render("Add");
});

// route for saving diary
app.post("/add-to-diary", (req, res) => {
  console.log(req.body);
  // Save data on database
  const Data = new diaryModel({
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
  });

  //save method returns a promise
  Data.save()
    .then(() => {
      res.redirect("/diary");
    })
    .catch((err) => {
      console.log(err);
    });
});

// route for displaying records
app.get("/diary/:id", (req, res) => {
  diaryModel
    .findOne({
      _id: req.params.id,
    })
    .then((data) => {
      res.render("Page", { data: data });
    })
    .catch((err) => {
      console.log(err);
    });
});

// routes for editing data
app.get("/diary/edit/:id", (req, res) => {
  diaryModel
    .findOne({
      _id: req.params.id,
    })
    .then((data) => {
      res.render("Edit", { data, data });
    })
    .catch((err) => {
      console.log(err);
    });
});

// Route to edit data
app.put("/diary/edit/:id", (req, res) => {
  //   res.send(req.params.id);
  diaryModel
    .findOne({
      _id: req.params.id,
    })
    .then((data) => {
      data.title = req.body.title;
      data.description = req.body.description;
      data.date = req.body.date;

      data
        .save()
        .then(() => {
          res.redirect("/diary");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

// route to delete data
app.delete("/data/delete/:id", (req, res) => {
  //   res.send(req.params.id);
  diaryModel
    .remove({
      _id: req.params.id,
    })
    .then(() => {
      res.redirect("/diary");
    })
    .catch((err) => {
      console.log(err);
    });
});

// server
app.listen(port, () => {
  console.log(`Express diary app listening at http://localhost:${port}`);
});
