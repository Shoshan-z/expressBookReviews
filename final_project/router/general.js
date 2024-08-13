const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  let username = req.body.username;
  let pwd = req.body.password;

  if (username && pwd) {
    if (!isValid(username)) {
      res.status(409).json({
        message: "username already exists, please choose a different username",
      });
    } else {
      users.push({ username: username, password: pwd });
      res
        .status(201)
        .json({ message: `User ${username} successfully registered` });
    }
  } else {
    res.status(404).json({ message: "username and/or password not provided" });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  let books_promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Object.keys(books).length !== 0) {
        resolve(books);
      } else {
        reject("No books found");
      }
    }, 2000); //adding 2 seconds delay to imitate getting books from a db
  });
  books_promise
    .then((books_list) => {
      return res.status(200).send(JSON.stringify(books_list, null, 4));
    })
    .catch((message) => {
      return res.status(404).send(message);
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  let book_promise = new Promise((resolve, reject) =>
    setTimeout(() => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found");
      }
    }, 2000)
  );

  book_promise
    .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
    .catch((error) => {
      return res.status(404).json({ message: error });
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  if (!author) {
    return res.status(400).json({ message: "Please provide an author" });
  }
  let pr = new Promise((resolve, reject) => {
    setTimeout(() => {
      let res_books = {};
      for (const [key, value] of Object.entries(books)) {
        if (value.author === author) {
          res_books[key] = value;
        }
      }
      if (Object.keys(res_books).length !== 0) {
        resolve(res_books);
      } else {
        reject("No books found for this author");
      }
    }, 1000);
  });

  pr.then((books_list) => {
    return res.status(200).send(JSON.stringify(books_list, null, 4));
  }).catch((message) => res.status(404).send(message));
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  if (!title) {
    return res.status(300).json({ message: "Please provide a title" });
  }

  let pr = new Promise((resolve, reject) => {
    setTimeout(() => {
      let res_books = {};
      for (const [key, value] of Object.entries(books)) {
        if (value.title === title) {
          res_books[key] = value;
        }
      }
      if (Object.keys(res_books).length !== 0) {
        resolve(res_books);
      } else {
        reject("No books with this title found");
      }
    }, 2000);
  });

  pr.then((books_list) => {
    return res.status(200).send(JSON.stringify(books_list, null, 4));
  }).catch((mesage) => {
    res.status(404).send(mesage);
  });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  }
  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
