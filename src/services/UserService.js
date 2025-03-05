const { User } = require("../models");

class UserService {
  async getUserById(userId) {
    return await User.findByPk(userId);
  }

  async getAllUsers() {
    return await User.findAll();
  }

  async getUserByUsername(username) {
    return await User.findOne({ where: { username } });
  }

  async createUser(userData) {
    return await User.create(userData);
  }

  async updateUser(userId, userData) {
    const user = await User.findByPk(userId);
    if (user) {
      return await user.update(userData);
    }
    throw new Error("User not found");
  }

  async deleteUser(userId) {
    const user = await User.findByPk(userId);
    if (user) {
      await user.destroy();
      return true;
    }
    throw new Error("User not found");
  }
}

module.exports = new UserService();
