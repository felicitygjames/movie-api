const express = require("express"),
  morgan = require("morgan");
const app = express();
const bodyParser = require("body-parser"),
  methodOverride = require("method-override");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());
app.use(methodOverride());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.use(morgan("common"));

let topBooks = [
  {
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
  },
  {
    title: "Lord of the Rings",
    author: "J.R.R. Tolkien",
  },
  {
    title: "Twilight",
    author: "Stephanie Meyer",
  },
];

// let myLogger = (req, res, next) => {
//   console.log(req.url);
//   next();
// };

// let requestTime = (req, res, next) => {
//   req.requestTime = Date.now();
//   next();
// };

// app.use(myLogger);
// app.use(requestTime);

// GET requests
app.get("/", (req, res) => {
  res.send("Welcome to my app!");
  //   responseText += "<small>Requested at: " + req.requestTime + "</small>";
  //   res.send(responseText);
});

app.get("/secreturl", (req, res) => {
  let responseText = "This is a secret url with super top-secret content.";
  //   responseText += "<small>Requested at: " + req.requestTime + "</small>";
  //   res.send(responseText);
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

app.get("/books", (req, res) => {
  res.json(topBooks);
});

// listen for requests
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
