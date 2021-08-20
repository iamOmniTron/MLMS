'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
 const Agent = sequelize.define("Agent",{
   id:{
     type:DataTypes.INTEGER,
     autoIncrement:true,
     allowNull:false,
     primaryKey:true
   }
 },{
   freezeTableName:true
 })

 Agent.associate = (models)=>{
  Agent.belongsTo(models.User,{foreignKey:{
    name:"UserId",
  allowNull:false
  }});
  Agent.hasOne(models.Product);
 }
  return Agent;
};