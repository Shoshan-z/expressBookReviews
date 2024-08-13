const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //returns boolean
  return users.findIndex((user)=> user.username === username && user.password === password) > -1; 
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res
      .status(404)
      .json({ message: "username and/or password not provided" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: password }, "mySecret", {
      expiresIn: 60 * 60,
    });

    // Store access token and username in session
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username;
  if (!username) {
    return res.status(401).json({ message: "Please login to post a review" }); 
  }
  const isbn = req.params.isbn; 
  if (!books[isbn]) {
    return res.status(404).json({message: "No book with such ISBN"});
  }

  const review = req.body.review; 
  if (!review) {
    res.status(400).json({message: "Please provide a review"});
  }

  books[isbn].reviews[username] = review; 
  return res.status(200).json({ message: `Review for book ${isbn} published` });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username;
  if (!username) {
    return res.status(401).json({ message: "Please login to delete a review" }); 
  }
  const isbn = req.params.isbn; 
  delete books[isbn].reviews[username];
  return res.status(200).json({ message: `Review for book ${isbn} deleted` });

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
