const express = require("express"),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  uuid = require("uuid");
mongoose = require("mongoose");
Models = require("./models.js");
const app = express();
const cors = require("cors");
app.use(cors());
const Movies = Models.Movie;
const Users = Models.User;
// mongoose.connect("mongodb://localhost:27017/myFlixDB", {
//   useNewUrlParser: true,
// });
mongoose.connect(
  "mongodb+srv://felicityjames:felicityjames@cluster0.a6roq.mongodb.net/myFlixDB?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

const passport = require("passport");
require("./passport");

// const cors = require("cors");
// app.use(cors());

const { check, validationResult } = require("express-validator");

app.use(morgan("common"));
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.json());

let auth = require("./auth")(app);

//list of all movies
/**
 * This method calls the endpoint for all movies,
 * authenticates the user and token with passport
 * and displays an array of movies.
 * @method getMovies
 * @param {string} moviesEndpoint - http://localhost:8080/movies
 * @param {func} passportAuthentication - Authenticates web tokens using passport.
 * @param {func} callback - Uses Movies schema to find list of movies.
 * @returns {Array} - Displays an array of movies.
 */

app.get("/", function (req, res) {
  return res.status(400).send("Welcome to my Flix App");
});

app.get(
  "/movies",
  // passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

/**
 * gets information about movie by title
 *
 */

/**
 * This method calls the movie title endpoint,
 * authenticates the user using web tokens and passport
 * and displays a single movie.
 * @method getMovieByTitle
 * @param {string} movieEndpoint - http://localhost:8080/movies/:Title
 * @param {func} passportAuthentication - Authenticates tokens by using passport.
 * @param {func} callback - Uses Movies schema to find a single movie by title.
 * @returns {Object} - Displays a single movie.
 */

app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    Movies.findOne({ Title: req.params.Title })
      .then(function (movies) {
        res.json(movies);
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//get data about director

/**
 * This method calls the movie director name endpoint,
 * authenticates the user using web tokens and passport
 * and displays a director object.
 * @method getDirectorByName
 * @param {string} directorEndpoint - http://localhost:8080/movies/director/:Name
 * @param {func} passportAuthentication - Authenticates tokens using passport.
 * @param {func} callback - Uses Movies schema to find director by name.
 * @returns {Object} - Displays director information.
 */

app.get(
  "/movies/director/:Name",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    Movies.findOne({ "Director.Name": req.params.Name })
      .then(function (movies) {
        res.json(movies.Director);
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//get data about genre by name

/**
 * This method calls the movie genre name endpoint,
 * authenticates the user using web tokens and passport
 * and displays a genre.
 * @method getGenreByName
 * @param {string} genreEndpoint - http://localhost:8080/movies/genre/:Name
 * @param {func} passportAuthentication - Authenticates tokens by using passport.
 * @param {func} callback - Uses Movies schema to find genre by name.
 * @returns {Object} - Displays genre info object.
 */

app.get(
  "/movies/genre/:Name",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    Movies.findOne({ "Genre.Name": req.params.Name })
      .then(function (movies) {
        res.json(movies.Genre);
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//get list of users

/**
 * This method calls the users endpoint,
 * authenticates users using tokens and passport
 * and displays an array of users.
 * @method getUsers
 * @param {string} usersEndpoint - http://localhost:8080/users
 * @param {func} passportAuthentication - Authenticates tokens by using passport.
 * @param {func} callback - Uses Users schema to find all users.
 * @returns {Array} - Displays array of users.
 */

app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    Users.find()
      .then(function (users) {
        res.status(201).json(users);
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//get a user by username

/**
 * This method calls the user's username endpoint,
 * authenticates users by using tokens and passport
 * and returns a user's information.
 * @method getUser
 * @param {string} userNameEndpoint - http://localhost:8080/users/:Username
 * @param {func} passportAuthentication - Authenticates tokens using passport.
 * @param {func} callback - Uses Users schema to find user by username.
 * @returns {Object} - Displays user information.
 */

app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    Users.findOne({ Username: req.params.Username })
      .then(function (user) {
        res.json(user);
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//Add a new user
/**
 * This method calls the users endpoint,
 * validates the object sent through the request
 * and creates a user object in the users array
 * if the same username doesn't already exist.
 * We’ll expect JSON in this format for the user object:
 * {
 *	ID: Integer,
 *	Username: String,
 *	Password: String,
 *	Email: String,
 *	Birthday: Date
 * }
 * @method addUser
 * @param {string} usersEndpoint - http://localhost:8080/users
 * @param {Array} expressValidator - Validate form input using express-validator.
 * @param {func} callback - Uses Users schema to register a new user.
 */

app.post(
  "/users",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then(function (user) {
        if (user) {
          return res.status(400).send(req.body.Username + " already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then(function (user) {
              res.status(201).json(user);
            })
            .catch(function (error) {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch(function (error) {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);
// delete user from the list by username
/**
 * This method calls the user username endpoint,
 * validates the object sent through the request
 * and deletes a user from the users array.
 * @method removeUser
 * @param {string} usernameEndpoint - http://localhost:8080//users/:Username
 * @param {Array} expressValidator - Validate form input using express-validator.
 * @param {func} callback - Uses Users schema to delete user.
 */

app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then(function (user) {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found");
        } else {
          res.status(200).send(req.params.Username + " was deleted.");
        }
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Update a user's information by their username.
 * We’ll expect JSON in this format
 * {
 *	Username: String,
 *	(required)
 *	Password: String,
 *	(required)
 *	Email: String,
 *	(required)
 *	Birthday: Date
 * }
 * @method updateUser
 * @param {string} userNameEndpoint - http://localhost:8080/users/:Username
 * @param {Array} expressValidator - Validate form input using express-validator.
 * @param {func} callback - Uses Users schema to update user's info by their username.
 */

app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }, //this line makes sure that the updated document is returned
      function (err, updatedUser) {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// Add movie to favorites list
/**
 * This method calls the user's movies endpoint,
 * validates the object sent through the request
 * and adds the movieID into the FavoriteMovies array.
 *
 * We’ll expect JSON in this format for the request object:
 * {
 *	ID: Integer,
 *	Username: String,
 * }
 * @method addToFavorites
 * @param {string} userNameMoviesEndpoint - http://localhost:8080/users/:Username/Movies/:MovieID
 * @param {Array} expressValidator - Validate form input using express-validator.
 * @param {func} callback - Uses Users schema to add movieID to list of a user's favorite movies.
 */

app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }, // This line makes sure that the updated document is returned
      function (err, updatedUser) {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// delete movie from favorite list for user

/**
 * This method calls the user's movies endpoint,
 * validates the object sent through the request
 * and deletes the movieID from the FavoriteMovies array.
 *
 * We’ll expect JSON in this format for the request object:
 * {
 *	ID: Integer,
 *	Username: String,
 * }
 * @method removeFromFavorites
 * @param {string} userNameMoviesEndpoint - http://localhost:8080//users/:Username/Movies/:MovieID
 * @param {Array} expressValidator - Validate form input using express-validator.
 * @param {func} callback - Uses Users schema to remove movieID from list of a user's favorite movies.
 */

app.delete(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.MovieID } },
      { new: true },
      function (err, updatedUser) {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

var port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", function () {
  console.log("Listening on port 8080");
});
