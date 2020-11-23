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

let topMovies = [
  {
    title: "The Fellowship of the Ring",
    director: "Peter Jackson",
  },
  {
    title: "The Two Towers",
    director: "Peter Jackson",
  },
  {
    title: "The Return of the King",
    director: "Peter Jackson",
  },
  {
    title: "The King's Speech",
    director: "Tom Hooper",
  },
  {
    title: "The Imitation Game",
    director: "Morten Tyldum",
  },
  {
    title: "Inception",
    director: "Christopher Nolan",
  },
  {
    title: "Spirited Away",
    director: "Hayao Miyazaki",
  },
  {
    title: "Django Unchained",
    director: "Quentin Tarantino",
  },
  {
    title: "Rear Window",
    director: "Alfred Hitchcock",
  },
  {
    title: "Casablanca",
    director: "Michael Curtiz",
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

app.get("/movies", (req, res) => {
  res.json(topMovies);
});

// listen for requests
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
