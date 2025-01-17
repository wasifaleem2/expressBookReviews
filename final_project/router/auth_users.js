const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
let secret_key = "access"

let users = [{username: "Wasif", password:"test123"}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return new Promise((resolve, reject)=>{
        try{
            let usernameExist = users.find((u)=>{
                return u?.username.toLowerCase() == username.toLowerCase();
            })
            if(usernameExist){
                resolve(true);
            }
            else{
                resolve(false);
            }
        }
        catch(error){
            reject(error)
        }
    })
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    return new Promise((resolve, reject)=>{
        try{
            let verifyUser = users.find((u)=>{
                return u.username == username && u.password == password
            })
            resolve(verifyUser);
        }
        catch(error){
            reject(error)
        }
    })
}

//only registered users can login
regd_users.post("/login", async (req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    if(!username || !password){
        res.status(300).json({message: "Please! provide username and password to login."}) 
    }
    try{
        let matchedUser = await authenticatedUser(username, password); 
        console.log("login user matched", matchedUser)
        if(!matchedUser){
            res.status(200).json({message: "username or password is incorrect. Please Try Again!"})
        }
        else{
            const token = jwt.sign(matchedUser, secret_key);
            req.session.authorization = {
                token: token
            }
            res.status(200).json({message: "Login Successful!", username: matchedUser.username, token, token})
        }
    }
    catch(error){
        res.status(500).json({message: "Server Error"})
    }
    
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    // Write your code here
    let username = req.user.username;
    let review = req.query.review;
    let isbn = req.params.isbn;
    let booksArray = Object.values(books);
    let filterBook = booksArray.find((bk)=> {
        return bk.isbn == isbn
    });
    filterBook["reviews"][username] = review;
    return res.status(300).json({message:"your review added", book:filterBook.title, review:review});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Write your code here
    let username = req.user.username;
    let isbn = req.params.isbn;
    let booksArray = Object.values(books);
    let filterBook = booksArray.find((bk)=> {
        return bk.isbn == isbn
    });
    delete filterBook.reviews[username]
    return res.status(300).json({message:"review deleted", book:filterBook.title});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
