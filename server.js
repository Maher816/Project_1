//included for mongodb
require("dotenv").config();                         //for mongodb
const mongoose = require("mongoose")                //for mongodb
const clientSessions = require("client-sessions");  //for mongodb
const bcrypt = require('bcryptjs');                 //for mongodb
const Schema = mongoose.Schema      

////
//const { render } = require("ejs");
//const { set } = require("mongoose");  //doesn't seem to be needed
//const path = require('path'); //doesn't seem to be needed
//const { render } = require('ejs');
const path = require('path');
// const userData = require("./modules/users");
const express = require('express');
const app = express();
//note for tailwind css stuff use
//npm run tw:build
const HTTP_PORT = process.env.PORT || 2001;
app.use(express.static('public'));
app.set('views', __dirname + '/views'); //for vercel
app.set('view engine', 'ejs');


////also for mongodb
app.use(express.urlencoded({ extended: true }));
mongoose.connect(process.env.MONGODB_CONNECTION)

//I believe it creates the sessions for logged in users
app.use(
    clientSessions({
        cookieName: "session",  //important don't change
        secret: process.env.SESSION_SECRET,
        duration: 2 * 60 * 1000,
        activeDuration: 1000 * 60,
    })
)

let userSchema = new Schema({
    name: String,
    email: String,
    password: String,
});
let User = mongoose.model("users", userSchema);

//redirects users to login page if they are not logged in
function ensureLogin(req,res,next){
    if (!req.session.user) {
        res.redirect("/login");
      } else {
        next();
      }
}

// REGISTRATION
app.get("/register", (req, res) => {
    res.render("register", { error: "" });
  });
//make register.ejs

app.post("/register", async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email})
  if(existingUser){
    return res.render("register", { error: "Email is already in use!" });
  } 

    // Encrypt the plain text: "myPassword123"
  bcrypt
  .hash(req.body.password, 10)
  .then((hash) => {
      const user = new User({
          name: req.body.name,
          email: req.body.email,
          //password: hash,
          password: req.body.password,
        });
        return user.save()
      }).then(() => {
        //if()
          console.log(//this gets printed in the terminal when a user has registered
            `SAVED! Name: ${req.body.name} | Email: ${req.body.email} | Password: ${req.body.password}`
          );
          res.redirect("/login");
        })
        .catch((err) => {
          res.render("register", { error: "Something Went Wrong!" });
        })
  });



// LOGIN
app.get("/login", (req, res) => {
    res.render("login", { error: "" });
  });
  
  app.post("/login", (req, res) => {
    User.findOne({ email: req.body.email })
      .exec()
      .then((user) => {
        if (user && user.password == req.body.password) {
          req.session.user = { //this .user here doesn't seem like it matters, should look into it
            name: user.name,
            email: user.email,
          };
          res.redirect("/");
        } else if(user.password != req.body.password){
          res.render("login", { error: "Email or password is incorrect!" })
        } else {
          res.render("login", { error: "User Not Found!" });
        }
      })
      .catch((err) => {
        res.render("login", { error: "Something Went Wrong!" });
      });
  });


  // DASHBOARD
app.get("/dashboard", ensureLogin, (req, res) => {
    res.render("dashboard", { data: req.session.user });
  });//the propety name (data) here has to match the property name in the dashboard.ejs
  
  // LOGOUT
  app.get("/logout", ensureLogin, (req, res) => {
    req.session.reset();
    //res.redirect("/login");
    res.redirect("/");
  });


////read on everything done for mongodb so I can understand how each line works

//navbar dynamic login/logout/register buttons
app.get((req,res) => {
  res.render("/partials/navbar", {data: req.session.user});
})

app.get('/', (req,res) => {
  res.render("home", { data: req.session.user });
  /*  
  let user = [
        {
            name:'maher816',
            password:'123',
        }
    ]
    res.render('home',{
        data:user,
    });
    */
    //res.sendFile(path.join(__dirname, '/views/home.html'));
});


app.get('/about', (req,res) => {
    res.render('about', { data: req.session.user })
});

app.get('/image', (req,res) => {
    res.render('test')
});

app.get('/urukcity', (req,res) => {
    res.render('UrukCrypto', { data: req.session.user })
});


//open a list of all existing users
app.get('/user', ensureLogin, async(req,res) => { //may remove the ensureLogin here
 
    try{
        //let set = await userData.getAllUsers();
        //object copies the data if they exist 
        let users = await User.find({})

        res.render("users",{
            data:users,
        })
        //sends data of object user to user.ejs
        //res.render("user",{set:set});   //"user" is the user.ejs file use <% %> stuff for this
    }catch(err){
        res.status(404).render("404", {message: "Unable to find page"});
    }
    //res.render('users')
})

/*
//note check assignment 4 line 35 from server.js
//it is able to perform the ? = query search with ejs files
//should displays temp_users in json format
app.get('/user',async(req,res) => {
    userData.getAllUsers()
    .then(sets => {
        res.json(sets);
    }).catch(err => {
        res.status(500).json({error:err});
    })

    /*
        try{
        if(req.query.userName){
          let sets = await userData.getAllUsers(req.query.userName);
    
          res.render("sets", {sets: sets});
          //note to self idk
        }else{
          let sets = await userData.getAllSets();
    
          res.render("sets", {sets: sets});
        }
      }catch(err){
        res.status(404).render("404", {message: "Unable to find users"});
      }*
      //check its message: 
      //is gonna be useful
})
*/
//displays in json format, this is a redundant dupe
// app.get('/users',async(req,res) => {
//     userData.getAllUsers()
//     .then(sets => {
//         res.json(sets);
//     }).catch(err => {
//         res.status(500).json({error:err});
//     })
// })



//this block is responsible for displaying user info in their own pages
app.get('/user/:id',ensureLogin, async(req,res) =>{
    //userData.getUserByID(req.params.id)
    try{
        //let set = await userData.getUserByID(req.params.num);
        //object copies the data if they exist
        let set = await User.findById(req.params.id);   //wot is params vs session
        //console.log(set)
        let user = {
            // name: set.username,
            name: set.name,
            // isPrivate: set.private,
        }
        //with data found, object copies the username 

        res.render("user",{
            data:user,
        })
        //sends data of object user to user.ejs
        //res.render("user",{set:set});   //"user" is the user.ejs file use <% %> stuff for this
    }catch(err){
        res.status(404).render("404", {message: "Unable to find requested ID", data: req.session.user});
    }
})


//if user searches a page that doesn't exist
app.use((req, res, next) => {
    res.status(404).render("404", { message: "I'm sorry, we're unable to find what you're looking for", data: req.session.user });
    //the comma in the {} helps seperate the 404 message and the user data (if logged in) for the navbar to process wether the navbar
    //would diplay 'logout' or 'login / create an account'
  });

// userData.initialize().then(() =>{
app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) })
// });