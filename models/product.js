'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
 const Product = sequelize.define("Product",{
   id:{
     type:DataTypes.INTEGER,
     autoIncrement:true,
     allowNull:false,
     primaryKey:true
   },
   name:{
     type:DataTypes.STRING  
   },
   price:{
     type:DataTypes.INTEGER
   },
   imageUrl:{
     type:DataTypes.STRING
   },
   description:{
     type:DataTypes.STRING
   }
 },{
   freezeTableName:true
 })

 Product.associate = (models)=>{
  Product.belongsTo(models.Agent,{
    foreignKey:{
      allowNull:false
    }
  });
  Product.belongsToMany(models.Sale,{through:"SaleItem"})
 }
  return Product;
};