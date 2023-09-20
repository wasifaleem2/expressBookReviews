const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let allBooks = JSON.stringify(books)
  return res.status(300).json({books: allBooks});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    let isbn = req.params.isbn;
    let booksArray = Object.values(books);
    let filterBook = booksArray.filter((bk)=> {
        return bk.isbn == isbn;
    })
    return res.status(300).json({message: `heres the book with the isbn: ${isbn}`, book:filterBook});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    let booksArray = Object.values(books);
    let filterbooks = booksArray.filter((bk)=> {
        return bk.author == author
    });
    return res.status(300).json({message: `books with the author ${author}`, books: filterbooks});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let booksArray = Object.values(books);
    let filterbooks = booksArray.filter((bk)=> {
        return bk.title == title
    });
    return res.status(300).json({message: `books with the author ${title}`, books: filterbooks});   
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  
});

module.exports.general = public_users;
