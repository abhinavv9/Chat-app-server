'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    static associate(models) {
      // File belongs to a sender
      File.belongsTo(models.User, {
        as: 'sender',
        foreignKey: 'senderId'
      });
      
      // File can be associated with many messages
      File.hasMany(models.Message, {
        foreignKey: 'fileId'
      });
    }
  }

  File.init({
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    originalName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'File',
  });
  
  return File;
};