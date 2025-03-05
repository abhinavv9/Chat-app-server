'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      // Group belongs to many users (members)
      Group.belongsToMany(models.User, {
        through: 'GroupMembers',
        foreignKey: 'groupId'
      });
      
      // Group belongs to a creator
      Group.belongsTo(models.User, {
        as: 'creator',
        foreignKey: 'creatorId'
      });
      
      // Group belongs to a chat
      Group.belongsTo(models.Chat, {
        foreignKey: 'chatId'
      });
    }
  }

  Group.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    chatId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  
  return Group;
};