const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", async (req,res) => {
    //Write your code here
    let username = req.body.username;
    let password = req.body.password;
    let userExist = await isValid(username)
    if(userExist){
        res.status(404).json({message: "User already exist with this username"})
    }
    else{
        users.push({username, password})
        return res.status(300).json({message: "User successfully registered!"});
    }  
});


// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    let isbnBookPromise = new Promise((resolve, reject)=>{
        try{
            let allBooks = JSON.stringify(books)
            resolve(allBooks)
        }
        catch(error){
            reject(error)
        }
        
    })
    isbnBookPromise.then((result)=>{
        return res.status(300).json({message: `List of all avilaible Books`, books: result});
    })
    isbnBookPromise.catch((error)=>{
        return res.status(500).json({message: `Server error, unable to get`});
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let isbnBookPromise = new Promise((resolve, reject)=>{
        try{
            let booksArray = Object.values(books);
            let filterBook = booksArray.filter((bk)=> {
                return bk.isbn == isbn;
            })
            resolve(filterBook)
        }
        catch(error){
            reject(error)
        }
        
    })
    isbnBookPromise.then((result)=>{
        if(result.length == 0){
            return res.status(300).json({message: `no book with the isbn ${isbn} / wrong isbn number`});
        }
        else{
            return res.status(300).json({message: `books with the isbn ${isbn}`, books: result});
        }
    })
    isbnBookPromise.catch((error)=>{
        return res.status(500).json({message: `Server error, unable to get`});
    })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    let authorBookPromise = new Promise((resolve, reject)=>{
        try{
            let booksArray = Object.values(books);
            let filterbooks = booksArray.filter((bk)=> {
                return bk.author == author
            });
            resolve(filterbooks)
        }
        catch(error){
            reject(error)
        }
        
    })
    authorBookPromise.then((result)=>{
        if(result.length == 0){
            return res.status(300).json({message: `no books with author name: ${author}`});
        }
        else{
            return res.status(300).json({message: `books with the author ${author}`, books: result});
        }
    })
    authorBookPromise.catch((error)=>{
        return res.status(500).json({message: `serevr error`});
    })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let titleBookPromise = new Promise((resolve, reject)=>{
        try{
            let booksArray = Object.values(books);
            let filterbooks = booksArray.filter((bk)=> {
                return bk.title == title
            });
            resolve(filterbooks)
        }
        catch(error){
            reject(error)
        }
        
    })
    titleBookPromise.then((result)=>{
        if(result.length == 0){
            return res.status(300).json({message: `no books with the title: ${title}`});
        }
        else{
            return res.status(300).json({message: `books with the title ${title}`, books: result});
        }
    })
    titleBookPromise.catch((error)=>{
        return res.status(500).json({message: `Server error, unable to get`});
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let booksArray = Object.values(books);
  let filterbook = booksArray.filter((bk)=> {
      return bk.isbn == isbn
  });
//   console.log("filterbook.reviews", filterbook)
  return res.status(300).json({message: `books reviews with book isbn ${isbn}`, reviews: filterbook.reviews});   
});

module.exports.general = public_users;
