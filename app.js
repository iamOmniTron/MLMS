const dotenv =require("dotenv")
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: __dirname + "/.env" });
}
const express = require("express");
const ejsLayout = require("express-ejs-layouts");
const {sequelize} = require("./models");
const flash = require("connect-flash");
const path = require("path");
const favicon = require("serve-favicon")
const session = require("express-session");
const sequelizeStore = require("connect-session-sequelize")(session.Store);
const app = express();

const router = require("./routers");
(async ()=>{
console.log("\n Connecting To Database...");
await sequelize.authenticate();
console.log("\ Connection established");
// await sequelize.sync({force:true});
await sequelize.sync();
console.log("\Database Synchronized");
}
)();
app.use(favicon(__dirname + "/public/images/favicon.ico"));
// app.use(ejsLayout);
app.set('view engine', 'ejs');
app.use(express.static("./public"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: false,
        store: new sequelizeStore({
          db:sequelize
        }),
        cookie: { httpOnly: true, maxAge: 43200000, secure: false },
  }))
  app.use(flash());
  app.use("*",(req,res,next)=>{
    console.log(req.session.user);
    next()
  })
app.use("/",router)


app.use((err,req,res,next)=>{
    if(err){
        res.status(500).send(err.message);
    }
})

module.exports = app;