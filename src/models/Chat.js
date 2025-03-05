'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate(models) {
      // Chat can have many messages
      Chat.hasMany(models.Message, {
        foreignKey: 'chatId'
      });
      
      // Chat can belong to many users
      Chat.belongsToMany(models.User, {
        through: 'UserChats',
        foreignKey: 'chatId'
      });
      
      // Chat can have one group (for group chats)
      Chat.hasOne(models.Group, {
        foreignKey: 'chatId'
      });
    }
  }

  Chat.init({
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM('one-to-one', 'group'),
      allowNull: false,
      defaultValue: 'one-to-one'
    },
    lastMessageAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Chat',
  });
  
  return Chat;
};