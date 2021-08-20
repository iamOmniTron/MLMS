const Agent = require("../models").Agent;
const Product = require("../models").Product;

module.exports = {
    register: async(req,res)=>{
        try {
            const {dataValues} = await Agent.create({UserId:req.session.user.id});
            // console.log(dataValues);

            req.session.user.agent = {
                id:dataValues.id,
                isAgent:true
            }
            req.flash("success","You are now an agent!");
            console.log(req.session.user)
            res.redirect("/agent/dashboard");
        } catch (error) {
            throw new Error(error.message)
        }
    },
    agentDashboard: async(req,res)=>{
        try {
            // console.log(req.session.user)
            if(!req.session.user.agent.isAgent){
                return res.redirect("/");
            }
            res.render("pages/userDashboard",{
                itemCount:0,
            })
        } catch (error) {
            throw new Error(error.message)
        }
    },
    addProduct: async(req,res)=>{
        try {
            const file = req.file;
            const imgUrl = file.path.replace(/\\/g, "/").substring(7);
            const {name,description,price} = req.body;
            
            const {dataValues} = await Product.create({name,description,price,AgentId:req.session.user.agent.id,imageUrl:imgUrl});
            if(!dataValues){
              req.flash("error","could not store product");
              return res.redirect(req.originalUrl);
            }
            req.flash("success","product uploaded successfully");
            if(req.session.user.isAdmin){
                return res.redirect("/admin/dashboard")
            }
            res.redirect("/agent/dashboard");
          } catch (error) {
            throw new Error(error.message)
          }
    },
    
}