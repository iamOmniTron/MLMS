module.exports = {
    ensureAuth: (req,res,next)=>{
      if(!req.session.user){
        req.flash("error","you need to sign in first");
        return res.redirect("/login")
      }
      next();
    },
    ensureLoggedIn:(req,res,next)=>{
      if(req.session.user){
      req.flash("error","you need to logout first");
      if(req.session.user.role == "farmer"){
        return res.redirect("/dashboard");
      }
      res.redirect("/")
      }
      next();
    },
    isAdmin : (req,res,next)=>{
      if(!req.session.user.isAdmin){
        req.flash("error","unauthorized");
        return res.redirect("/");
      }
      next();
    },
    isAgent: (req,res,next)=>{
        if(!req.session.user.agent.isAgent || !req.session.user.isAdmin){
            return res.redirect("/")
        }
        next();
    }
  }
  