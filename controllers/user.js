const Product = require("../models").Product;
const {sequelize} = require("../models");
const {QueryTypes} = require("sequelize");
const Sale = require("../models").Sale;


module.exports = {
    viewProducts : async(req,res)=>{
        try {
            const products = await Product.findAll({raw:true});

            res.render("pages/products",{
                itemCount:req.session.user.cart.length,
                products
            })
        } catch (error) {
            throw new Error(error.message)
        }
    },
    viewProduct: async(req,res)=>{
        try {
            const productId = req.params.productId;
            const product = await Product.findOne({where:{id:productId}});

            res.render("pages/product",{
                itemCount:req.session.user.cart.length,
                product
            })
        } catch (error) {
            throw new Error(error.message)
        }
    },
    addToCart: async(req,res)=>{
        try{
      const productId = req.params.productId;
      if(!req.session.user.cart || req.session.user.cart == "undefined"){
        req.session.cart = [];
      }
      if(req.session.user.cart.includes(productId)){
        return res.redirect("/")
      }
      req.session.user.cart.push(productId);
      req.flash("success","added to cart");
      res.redirect("/");
    } catch (error) {
      throw new Error(error.message)
    }
    },
    viewCart: async(req,res)=>{
        try {
    const cartItems = req.session.user.cart;
    const products = await Product.findAll({where:{id:cartItems},raw:true});
    const total = await Product.sum('price',{where:{id:cartItems}});
    res.render("pages/cart",{
      error:req.flash('error'),
      success:req.flash("success"),
      products,
      itemCount:cartItems.length,
      total,
      user:req.session.user,
      isEmpty:(total <= 0) || !total?true:false
    });
        } catch (error) {
            throw new Error(error.message)
        }
    },
    removeFromCart : async(req,res)=>{
        try {
            const productId = req.params.productId;
            if(!req.session.user.cart.includes(productId)){
              return res.redirect("/")
            }
            req.session.user.cart = req.session.user.cart.filter((itemId)=>itemId !==productId);
            req.flash("success","removed item from cart");
            res.redirect("/");
          } catch (error) {
            throw new Error(error.message)
          }
        },
        checkout:async(req,res)=>{
            try {
                const userId = req.session.user.id;
                const cartItems = req.session.user.cart;
                const products = await Product.findAll({where:{id:cartItems}})
                const total = await Product.sum("price",{where:{id:cartItems}});
                //  const T = await Transaction.create({UserId:userId,total:total});
                //  const transaction = await T.addProducts(products);
                //  console.log(transaction)
                //  if(!transaction){
                //    req.flash("error","cannot process order at the moment");
                //    return res.redirect("/cart")
                //  }
                const sale = await Sale.create({total,buyer:userId});
                console.log(sale);
                req.session.user.cart = [];
                req.flash("success","your orders will be delivered soon...")
                res.redirect("/");
            } catch (error) {
                throw new Error(error.message)
            }
        }
}