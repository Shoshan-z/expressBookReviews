const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    let username = req.body.username; 
    let pwd = req.body.password; 

    if (username && pwd) {
        if (users.find((user)=> user.username === username)) {
            res.status(409).json({message: "username already exists, please choose a different username"});
        }
        else {
            users.push({username: username, password: pwd});
            res.status(201).json({message: `User ${username} successfully registered`}); 
        }
    }
    else {
        res.status(404).json({message: "username and/or password not provided"});
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn; 
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn], null, 4));
  }
  return res.status(404).json({message: "Book not found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  if (!author) {
    return res.status(300).json({message: "Please provide an author"});
  }
  let res_books = {};
  for (const [key, value] of Object.entries(books)) {
    if (value.author === author) {
      res_books[key] = value;
    }
  }

  return res.status(200).send(JSON.stringify(res_books, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  if (!title) {
    return res.status(300).json({message: "Please provide a title"});
  }
  let res_books = {};
  for (const [key, value] of Object.entries(books)) {
    if (value.title === title) {
      res_books[key] = value;
    }
  }

  return res.status(200).send(JSON.stringify(res_books, null, 4));

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn; 
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  }
  return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;
