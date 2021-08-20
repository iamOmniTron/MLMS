const Bcrypt = require("bcrypt");
const {
  testEmail
} = require("../libs/helper");
const User = require("../models").User;
const Agent = require("../models").Agent;

module.exports = {

    signup: async(req,res,next)=>{
      try {
        const {name,email,password,confirmPassword} = req.body;
        if(!name || !email || !password  || !confirmPassword){
          req.flash("error","all fields are required for signup");
          return res.redirect(req.originalUrl)
        };
        if(!testEmail(email)){
          req.flash("error","a valid email address is required");
          return res.redirect(req.originalUrl);
        }
        let user = await User.findOne({where:{email}});
        if(user){
          req.flash('error',"user already exists, proceed to login");
          return res.redirect(req.originalUrl)
        }
        if(password !== confirmPassword){
          req.flash("error","password mismatch");
          return res.redirect(req.originalUrl)
        }
        const hashedPassword = await Bcrypt.hash(password,10);
        const {dataValues} = await User.create({name,email,password:hashedPassword})
        user = dataValues;
        console.log(user)
        if(!user){
          req.flash("error",`unable to register ${role}`);
          return res.redirect(req.originalUrl)
        }
        
        req.session.user = {
          id:user.id,
          name:user.name,
          email:user.email,
          isAdmin: email =="admin@paywise.com"?true:false
        }
        req.flash("success","signup successfull");
        req.session.user.cart = [];
        if(req.session.user.isAdmin){
            return res.redirect("/admin/dashboard")
        }
        req.session.user.cart = [];
        res.redirect("/");
      } catch (error) {
        req.flash("error",error.message)
        throw new Error(error.message)
      }
    },
    login: async (req,res,next)=>{
      try {
        const {email,password} = req.body;
        if(!email||!password){
          req.flash("error","email and password are required");
          return res.redirect(req.originalUrl);
        }
        if(!testEmail(email)){
          req.flash("error","invalid email address");
          return res.redirect(req.originalUrl)
        }
        const {dataValues} = await User.findOne({where:{email}});
        if(!dataValues){
          req.flash("error","user does not exist");
          return res.redirect(req.originalUrl)
        }
        const isPassMatch = await Bcrypt.compare(password,dataValues.password);
        if(!isPassMatch){
          req.flash("error","invalid password");
          return res.redirect(req.originalUrl);
        }
        const user = dataValues;
        const isAgent = await Agent.findOne({where:{UserId:dataValues.id}});
        if(isAgent){
          req.session.user = {
            id:user.id,
            name:user.name,
            email:user.email,
            isAdmin: email =="admin.paywise.com"?true:false,
            agent: {
              id:isAgent.id,
              isAgent:true
            }
          }
          return res.redirect("/agent/dashboard");
        }
        req.session.user = {
            id:user.id,
            name:user.name,
            email:user.email,
            isAdmin: email =="admin.paywise.com"?true:false
          }
        req.flash("success",`welcome ${dataValues.name}`);
        if(req.session.user.isAdmin){
            return res.redirect("/admin/dashboard")
        }
        req.session.user.cart = [];
        res.redirect('/');
      } catch (error) {
        throw new Error(error.message)
      }
    },
    profile:async(req,res,next)=>{
      try {
        const user = req.session.user;
        const userData = await User.findOne({where:{id:req.session.user.id},raw:true})
        console.log(userData)
        res.render("pages/profile",{
          itemCount:req.session.user.cart.length,
          error:req.flash("error"),
          success:req.flash("success"),
          user:user,
        });
      } catch (error) {
        throw new Error(error.message)
      }
    },
    logout: async (req,res,next)=>{
      try {
        req.flash("success","logged out successfully");
        req.session.destroy();
        res.redirect("/login");
      } catch (error) {
        throw new Error(error.message)
      }
    }
}
