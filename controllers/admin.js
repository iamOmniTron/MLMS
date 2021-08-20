const User = require("../models").User;
const Agent = require("../models").Agent;

module.exports = {
    dashboard: async(req,res)=>{
        try {
            res.render("pages/dashboard",{
                itemCount:0
            });
        } catch (error) {
            throw new Error(error.message)
        }
    },
    registerAgent:async(req,res)=>{
        try{
            const user = await User.findOne({where:{id:req.params.userId},raw:true});
            const result = await Agent.findOrCreate({
                where: { UserId: req.params.userId },
                defaults: {
                  UserId: req.params.userId
                }
              });
              res.redirect(req.originalUrl)
        }catch(error){
            throw new Error(error.message)
        }
    }
}