const UserService  = require('../services/UserService');

class UserController {
    async getUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching users', error: error.message });
        }
    }

    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await UserService.getUserById(id);
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching user', error: error.message });
        }
    }

    async getUserByUsername(req, res) {
        try {
            const { username } = req.params;
            const user = await UserService.getUserByUsername(username);
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching user', error: error.message });
        }
    }
}

module.exports = new UserController();