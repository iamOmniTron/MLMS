const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path")
const Product = require("../models").Product;

const {dashboard} = require("../controllers/admin")
const {signup,login,profile,logout} = require("../controllers/auth");
const {register,agentDashboard,addProduct} = require("../controllers/agent");
const {viewProducts,viewProduct,viewCart, addToCart,removeFromCart,checkout} = require("../controllers/user");
const {ensureAuth,ensureLoggedIn,isAdmin,isAgent} = require("../middlewares");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/images/uploads")
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  })
   
  const upload = multer({ storage: storage })

router.get("/signup",ensureLoggedIn,(req,res)=>{
    res.render("pages/signup")
})

router.post("/signup",ensureLoggedIn,signup);

router.get("/login",ensureLoggedIn,(req,res)=>{
    res.render("pages/login")
})

router.post("/login",ensureLoggedIn,login);

router.get("/profile",ensureAuth,profile);

router.get("/logout",logout);

router.get("/",ensureAuth,async(req,res)=>{
    const products = await Product.findAll({raw:true})
    res.render("pages/index",{
        itemCount:req.session.user.cart.length,
        products
    })
})

router.get("/admin/dashboard",ensureAuth,dashboard);

router.get("/agent/register",ensureAuth,register);

router.get("/agent/product/add",ensureAuth,(req,res)=>{
    res.render("pages/addProduct",{
        itemCount:req.session.user.cart.length
    })
})

router.post("/agent/product/add",ensureAuth,upload.single("image"),addProduct)

router.get("/agent/dashboard",ensureAuth,agentDashboard)

router.get("/products",ensureAuth,viewProducts);

router.get("/product/:productId",ensureAuth,viewProduct);

router.get("/cart",ensureAuth,viewCart)

router.post("/cart/add/:productId",ensureAuth,addToCart);

router.post("/cart/remove/:productId",ensureAuth,removeFromCart);

router.get("/checkout",ensureAuth,checkout);


module.exports = router;