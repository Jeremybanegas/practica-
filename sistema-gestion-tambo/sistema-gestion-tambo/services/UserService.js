const User = require('../models/User');
const UserValidator = require('../validators/UserValidator');
const SecurityManager = require('../utils/security');

class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async hasAdmins() {
        const users = await this.userRepository.findAll();
        return users.length > 0;
    }

    async registerFirstAdmin(payload) {
        const users = await this.userRepository.findAll();
        if (users.length > 0) {
            throw Object.assign(new Error('Ya existe un administrador. Inicia sesión.'), { statusCode: 403 });
        }

        const { username, password } = UserValidator.validateRegistration(payload);
        const passwordHash = await SecurityManager.hashPassword(password);
        const user = new User({ username, passwordHash });

        await this.userRepository.create(user.toPersistence());
        return user.toSafeJSON();
    }

    async login(payload) {
        const { username, password } = UserValidator.validateLogin(payload);
        const storedUser = await this.userRepository.findByUsername(username);

        if (!storedUser) {
            throw Object.assign(new Error('Usuario o contraseña incorrectos'), { statusCode: 401 });
        }

        const validPassword = await SecurityManager.comparePassword(password, storedUser.passwordHash);
        if (!validPassword) {
            throw Object.assign(new Error('Usuario o contraseña incorrectos'), { statusCode: 401 });
        }

        const user = new User(storedUser);
        return user.toSafeJSON();
    }
}

module.exports = UserService;
