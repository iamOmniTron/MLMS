'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
 const User = sequelize.define("User",{
   id:{
     type:DataTypes.INTEGER,
     autoIncrement:true,
     allowNull:false,
     primaryKey:true
   },
   name:{
     type:DataTypes.STRING  
   },
   email:{
     type:DataTypes.STRING
   },
   password:{
     type:DataTypes.STRING
   }
 },{
   freezeTableName:true
 })

 User.associate = (models)=>{
  User.hasOne(models.Agent,{foreignKey:{
    allowNull:false
  }});
 }
  return User;
};