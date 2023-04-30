import path from "path";
import express from "express";
import mongoose, { Schema } from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const app = express();

//setting up view enine
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "views"));

//To serve static files
app.use("/public", express.static(path.join(path.resolve(), "/public")));

//Using Middleware to access body of a form
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());
mongoose.connect("mongodb://127.0.0.1:27017", {dbName: "varun", useNewUrlParser: true, useUnifiedTopology: true }).then(()=> {
    console.log("Connected to MongoDB");
}).catch(err => console.log(err));

const mySchema = new Schema({
    name: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", mySchema);



const isAuthenticated = async (req,res,next) => {
    const {token} = req.cookies;
    if(token) {
        const decoded = jwt.verify(token, "rghlrbjrehnj");
        next();
    }
    else {
        res.render("home");
    }
}

app.get("/", isAuthenticated, (req,res) => {
    res.render("logout");
})

app.get("/login", (req,res) => {
    res.render("login");
})

app.get("/logout", (req,res) => {
    res.cookie("token", null, {
        httpOnly: true, expires: new Date(Date.now())
    })
    res.render("home");
})

app.get("/register", (req,res) => {
    res.render("register");
}) 

app.post("/login", async (req,res) => {
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        return res.redirect("/register");
    }
    else {
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch)
        {
            const tokenValue = jwt.sign({_id: user._id}, "rghlrbjrehnj");
            res.cookie("token", tokenValue , {
            httpOnly: true
        });
        res.redirect("/");
        }
        else {
            res.render("login" , {email, message: "Incorrect Password"});
        }
    }
})

app.post("/register", async (req,res) => {
    const {name,email,password} = req.body;
    let user = await User.findOne({email});
    if(user) {
        res.redirect("/login");
    }
    else {
        const hashedPwd = await bcrypt.hash(password,10);
        user = await User.create({
            name, email, password: hashedPwd
        });
        const tokenValue = jwt.sign({_id: user._id}, "rghlrbjrehnj");
        res.cookie("token", tokenValue , {
            httpOnly: true
        });
        res.redirect("/");
    }
})

app.listen(5000, () => {
    console.log("Server listening at http://localhost:5000");
})
