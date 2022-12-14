import Router from"express";
import path from"path";
import news from"../models/news.js";
import users from "../models/user.js"
import methodOverride from"method-override";
import { add_user } from"../controllers/user.controller.js";
import { add_news } from"../controllers/news.controller.js";
import bcrypt from"bcryptjs";
import Users from "../models/user.js";
import log4js from "log4js";
import fs from "fs";
import express_validator from 'express-validator';
const __dirname = path.resolve();
const router = Router();
router.use(methodOverride("X-HTTP-Method")); //          Microsoft
router.use(methodOverride("X-HTTP-Method-Override")); // Google/GData
router.use(methodOverride("X-Method-Override")); //      IBM
router.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      const method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);


let username = "";
let logger = log4js.getLogger();


router
  .route("/")
  .get((req, res) => {
    //res.sendFile(path.resolve(__dirname, "views", "index.html"));
    //let username = "";
    // if (req.cookies && req.cookies.username) {
    //   username = req.cookies.username;
    // }
    logger = "Get Request to Index";
    fs.appendFile("../log.txt","Get Request to Index" + req.ip.toString(), function(error){
      if(error) throw error;}) // если возникла ошибка
    res.render("index.ejs",{
        title:"Index",
        username:username
    });
  })
  .post((req, res) => {
    fs.appendFile("../log.txt","POST Request to Index" + req.ip.toString(), function(error){
      if(error) throw error;}) // если возникла ошибка
    res.send("<h1>Express POST REQUEST</h1>");
  });

router.route("/forms").get((req,res)=>{
  fs.appendFile("../log.txt","Get Request to Forms" + req.ip.toString(), function(error){
    if(error) throw error;}) // если возникла ошибка
  res.render("forms.ejs",{
    title:"Form",
    username:username
});
})
.post((req,res)=>{
  fs.appendFile("../log.txt","post Request to Forms" + req.ip.toString(), function(error){
    if(error) throw error;})
  if(username != "")
  {
    let user = Users.forEach(user => {
      if(user.username == username)
      {
        return user;
      }
    })

    console.log(user.id);
    const { email, text } = req.body;
    console.log(email);
    console.log(text);
    res.redirect('/');
  }
  else
  {
    const { email, text } = req.body;
    console.log(email);
    console.log(text);
    res.redirect('/');
  }
})

router
  .route("/news")
  .get((req, res) => {
    fs.appendFile("../log.txt","Get Request to News" + req.ip.toString(), function(error){
      if(error) throw error;})
    res.render("news.ejs",{
        title:"News",
        news:news,
        username:username
    });
  })
  .post(add_news,(req, res) => {
    fs.appendFile("../log.txt","POSt Request to News" + req.ip.toString(), function(error){
      if(error) throw error;})
    res.redirect("/");
  });

router
  .route("/news/:id")
  .get((req, res) => {
    console.log("TEST");
    let obj = news.find((el) => el.id === parseInt(req.params.id));
    res.send(obj);
  })
  .delete((req, res) => {
    let obj = news.find((el) => el.id === parseInt(req.params.id));
    if (obj) {
      let i = news.indexOf(obj);
      news.splice(i, 1);
    }
    res.redirect("/");
  })
  .put((req, res) => {
    let obj = news.find((el) => el.id === parseInt(req.params.id));
    if (obj) {
      const { title, text } = req.body;
      obj.title = title;
      obj.text = text;
    }
    res.redirect("/");
  });

router
  .route("/register")
  .get((req, res) => {
    fs.appendFile("../log.txt","Get Request to Reg" + req.ip.toString(), function(error){
      if(error) throw error;})
    if(!req.session.username == "")
    {
        console.log(req.session.username);
        username = req.session.username;
        res.redirect("/");
    }
    res.render("register",{
        title:"Register",
        username: username
    });
  })
  .post(add_user, (req, res) => {
    fs.appendFile("../log.txt","POST Request to Reg" + req.ip.toString(), function(error){
      if(error) throw error;})
    res.render("index",{title:"Index", username:username});
  });

router
  .route("/login")
  .get((req, res) => {
    fs.appendFile("../log.txt","Get Request to Login" + req.ip.toString(), function(error){
      if(error) throw error;})
    if(!req.session.username == "")
    {
        username = req.session.username;
    }
    res.render("login", { title: "Login" , username:username});
  })
  .post(async (req, res) => {
    const { login, password } = req.body;
    let obj = users.find((el) => el.login === login);
    if (obj) {
      const hash = await bcrypt.hashSync(password, obj.salt);
      if (hash === obj.password) {
        //req.session.username = obj.name;
        //console.log(req.session.username, req.sessionID);
        // res.cookie("username", obj.name, {
        //   maxAge: 3600 * 24, // 1 сутки
        //   signed: true,
        // });
        res.session.username = obj.name;  //  !!!!
      }
    }
    res.redirect("/");
  });

router.route("/logout").get((req, res) => {
  fs.appendFile("../log.txt","Get Request to Logout" + req.ip.toString(), function(error){
    if(error) throw error;})
    req.session.username = "";
    //req.session = null;
  res.redirect("/");
});

export default router;