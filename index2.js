// const http = require("http");
// import http from "http";
import path from "path";
import express from "express";
import mongoose, { Schema } from "mongoose";
// import fs from "fs";
// 1. 
// const krishna = require("./features");
// 2.
// import krishna , {one, two, genRandom} from "./features.js";
// 3.
// import * as myObj from "./features.js";


// 1.
// console.log(krishna + " " + one + " " + two);
// console.log(genRandom());
// 2.
// console.log(myObj.default + " " + myObj.one);

//This doesn't work
// const home = fs.readFile("./index.html", ()=>{
//     console.log("File read");
// });

//This works
// const home = fs.readFileSync("./index.html");
// console.log(home);

// console.log(path.extname("/backend/index.html"))
// console.log(path.dirname("/backend/random/index.html"))



// const server = http.createServer((req,res)=>{
//     if(req.url == "/") {
//         // const home = fs.readFile("./index.html", (err,home)=>{
//         //     res.end(home);
//         // });
//         res.end("<h1>Home</h1>");
//     }
//     else if(req.url == "/about") {
//         res.end("<h1>About</h1>");
//     }
//     else {
//         res.end("<h1>Page not found</h1>");
//     }
// })



const app = express();

//setting up view enine
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "views"));

//To serve static files
app.use("/public", express.static(path.join(path.resolve(), "/public")));

//Using Middleware to access body of a form
app.use(express.urlencoded({extended: true}));

// let users = [];

mongoose.connect("mongodb://127.0.0.1:27017", {dbName: "varun", useNewUrlParser: true, useUnifiedTopology: true }).then(()=> {
    console.log("Connected to MongoDB");
}).catch(err => console.log(err));

const mySchema = new Schema({
    name: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", mySchema);
app.get("/", (req,res) => {
    // res.send("Hi");
    // res.sendStatus(404);  400,500
    // or
    // res.status(404).send("Bad reauest");


    // res.json({
    //     success: true,
    //     products: []
    // })

    // res.sendFile(path.resolve() + "/index.html");
    // or
    // res.sendFile(path.join(path.resolve(), "index.html"));
    // can use __dirname instead of path.resolve for "type": "commonjs"


    //ejs:
    // res.render("index.ejs",{varun: "Varun"});
    // or
    // res.render("index", {varun: "Varun"});
    // res.sendFile("index.html");
    

    res.render("login");
    
})

const save = async (name,email,password) => {
    const ss = await User.create({name,email, password});
    return ss;
}
app.post("/", async (req,res) => {
    console.log(req.body);
    const {name,email,password} = req.body;
    save(name,email,password);
    res.render("login");

    
    // const ss = await User.find({name: "q"});
    // console.log(ss);
    // users.push({user: req.body.name, email: req.body.email, password: req.body.password});
    // console.log(users);
    // res.render("login");
    // res.json({users});
})
app.listen(5000, () => {
    console.log("Server listening at http://localhost:5000");
})
//or server.listen...