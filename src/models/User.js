'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // User can belong to many chats
      User.belongsToMany(models.Chat, { 
        through: 'UserChats',
        foreignKey: 'userId'
      });
      
      // User can belong to many groups
      User.belongsToMany(models.Group, { 
        through: 'GroupMembers',
        foreignKey: 'userId'
      });
      
      // User can create groups
      User.hasMany(models.Group, { 
        as: 'createdGroups',
        foreignKey: 'creatorId'
      });
      
      // User can send messages
      User.hasMany(models.Message, { 
        as: 'sentMessages',
        foreignKey: 'senderId'
      });
      
      // User can upload files
      User.hasMany(models.File, {
        as: 'uploadedFiles',
        foreignKey: 'senderId'
      });
    }

    // Method to compare password
    async comparePassword(candidatePassword) {
      return await bcrypt.compare(candidatePassword, this.password);
    }
  }

  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 30]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('online', 'offline', 'away'),
      defaultValue: 'offline'
    },
    lastActive: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });
  
  return User;
};