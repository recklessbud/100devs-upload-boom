//devDependencies
const express = require("express")
const MongoStore = require("connect-mongo")
const session = require("express-session");
const flash = require('express-flash')
const passport = require('passport')
const methodOverride = require('method-override')
const morgan = require("morgan")
const mongoose = require("mongoose")

//path to mongodb
  const connectToDb = require('./config/database')

//path to mainRoutes
  const mainRoutes = require("./routes/mainRoutes")

  //path to passport
    require("./config/passport")

//use env file
  require("dotenv").config({path: './config/.env'})

const PORT = process.env.PORT || 6868
//call mongodb to connect
    connectToDb()

const apps = express()

  //sessions in db
apps.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.MONGO_URI}),
  })
); 

//express middleware
   //use ejs as view engine
     apps.set("view engine", "ejs")

   //Static folder
   apps.use(express.static('public'))

   //Body parsing
    apps.use(express.urlencoded({extended: true}))
    apps.use(express.json())

 //use morgan in dev mode
  if (process.env.NODE_ENV === "development") {
     apps.use(morgan('dev'))
  }

  //use forms for put/delete
   apps.use(methodOverride("_method"))
   
  // passport config
  apps.use(passport.initialize());
  apps.use(passport.session()); 


  //use flash for error messages etc
    apps.use(flash())


  //use routes
   apps.use('/', mainRoutes)

apps.listen(process.env.PORT,() =>{
    console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})