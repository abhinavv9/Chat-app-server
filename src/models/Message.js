'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      // Message belongs to a sender
      Message.belongsTo(models.User, {
        as: 'sender',
        foreignKey: 'senderId'
      });
      
      // Message belongs to a chat
      Message.belongsTo(models.Chat, {
        foreignKey: 'chatId'
      });
      
      // Message can have a file attachment
      Message.belongsTo(models.File, {
        foreignKey: 'fileId',
        as: 'attachment'
      });
    }
  }

  Message.init({
    content: {
      type: DataTypes.TEXT,
      allowNull: true // Allow null for file-only messages
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    chatId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fileId: {
      type: DataTypes.INTEGER,
      allowNull: true // Reference to File model when message contains attachment
    },
    messageType: {
      type: DataTypes.ENUM('text', 'file', 'text_with_file'),
      allowNull: false,
      defaultValue: 'text'
    },
    readBy: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: []
    }
  }, {
    sequelize,
    modelName: 'Message',
  });
  
  return Message;
};