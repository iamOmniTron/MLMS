'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
 const Sale = sequelize.define("Sale",{
   id:{
     type:DataTypes.INTEGER,
     autoIncrement:true,
     allowNull:false,
     primaryKey:true
   },
   total:{
     type:DataTypes.INTEGER
   }
 },{
   freezeTableName:true
 })
 Sale.associate = (models)=>{
  Sale.belongsTo(models.User,{foreignKey:{
    name:"buyer",
    allowNull:false
  }});
  Sale.belongsToMany(models.Product,{through:"SaleItem"});
 }
  return Sale;
};