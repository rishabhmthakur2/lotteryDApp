const express = require("express");
const path = require("path");
const hbs = require("hbs");
const BN = require('bn.js');
const bodyParser = require('body-parser')

const app = express();
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "./public");
const viewsPath = path.join(__dirname, "./templates/views");
const partialsPath = path.join(__dirname, "./templates/partials");

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(bodyParser.json())

app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
    res.render("index");
});

app.get("/", (req, res) => {
    res.render("index");
  });
  
  app.get("/about", (req, res) => {
    res.render("about");
  });
  
  app.get("/check", (req, res) => {
    res.render("check");
  });

  app.get("/admin", (req, res) => {
    res.render("admin");
  });
  
app.listen(port, () => {
    console.log("Server is listening for calls.");
});