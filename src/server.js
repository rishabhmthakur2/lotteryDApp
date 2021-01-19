const express = require("express");
const path = require("path");
const hbs = require("hbs");
const BN = require('bn.js');
const referrers = require('./.transactions/.referrers.js');
const bodyParser = require('body-parser')

const app = express();
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "./public");
const viewsPath = path.join(__dirname, "./templates/views");
const partialsPath = path.join(__dirname, "./templates/partials");

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Ether@123",
  database: 'etheratm'
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

app.get("/isReferrer/:id", async (req, res) => {
    const referrerAddress = req.params.id;
    con.query(`SELECT * FROM customers where Address=${referrerAddress}`, function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
            const isReferrer = true;
            return res.send({
                isReferrer
            });
        }
        else {
            res.send(false);
        }
    });

});

app.post("/addInvester/", async (req, res) => {
    const investerAddress = req.body.id;
    const investedAmount = req.body.amount;
    const isReferrer = await referrers.includes(investerAddress);
    if (isReferrer) {
        res.send();
    }
    else {
        con.query(`INSERT INTO users (Address, Amount) VALUES (${investerAddress}, ${investedAmount})`, function (err, result, fields) {
            if (err) throw err;
            console.log(result);
        });
        res.send();
    }
});


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

// app.get("/isReferrer/:id", async (req, res) => {
//     const referrerAddress = req.params.id;
//     const isReferrer = await referrers.includes(referrerAddress);
//     return res.send({
//         isReferrer
//     });
// });

// app.post("/addInvester/:id", async (req, res) => {
//     const investerAddress = req.params.id;
//     const isReferrer = await referrers.includes(investerAddress);
//     if (isReferrer) {
//         res.send();
//     }
//     else {
//         referrers.push(investerAddress);
//         res.send();
//     }
// });

app.get("/isReferrer/:id", async (req, res) => {
    const referrerAddress = req.params.id;
    con.query(`SELECT * FROM transactions where Address=${referrerAddress}`, function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
            const isReferrer = true;
            return res.send({
                isReferrer
            });
        }
        else {
            res.send(false);
        }
    });

});

app.post("/addInvester/", async (req, res) => {
    const investerAddress = req.body.id;
    const investedAmount = req.body.amount;
    const isReferrer = await referrers.includes(investerAddress);
    if (isReferrer) {
        res.send();
    }
    else {
        con.query(`INSERT INTO transactions (Address, Amount) VALUES (${investerAddress}, ${investedAmount})`, function (err, result, fields) {
            if (err) throw err;
            console.log(result);
        });
        res.send();
    }
});


app.listen(port, () => {
    console.log("Server is listening for calls.");
});