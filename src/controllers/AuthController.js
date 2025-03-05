const AuthService = require('../services/AuthService');
const { generateToken } = require('../utils/jwt');


class AuthController {
    async register(req, res) {
        try {
            const { username, password, email } = req.body;
            const user = await AuthService.register(username, password, email);
            const token = generateToken(user.id);
            res.status(201).json({ user, token });
        } catch (error) {
            console.log(error)
            res.status(400).json({ message: error.message });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const { user, token } = await AuthService.login(username, password);
            res.status(200).json({ user, token });
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }
}

module.exports = new AuthController();