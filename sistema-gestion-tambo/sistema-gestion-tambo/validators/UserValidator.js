const SecurityManager = require('../utils/security');

class UserValidator {
    static validateRegistration(payload = {}) {
        const username = SecurityManager.sanitizeText(payload.username);
        const password = typeof payload.password === 'string' ? payload.password : '';

        if (!/^[A-Za-z0-9._-]{4,30}$/.test(username)) {
            throw Object.assign(
                new Error('El usuario debe tener entre 4 y 30 caracteres y solo usar letras, números, punto, guion o guion bajo'),
                { statusCode: 400 }
            );
        }

        if (password.length < 8 || password.length > 72 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
            throw Object.assign(
                new Error('La contraseña debe tener 8 a 72 caracteres, con mayúscula, minúscula y número'),
                { statusCode: 400 }
            );
        }

        return { username, password };
    }

    static validateLogin(payload = {}) {
        const username = SecurityManager.sanitizeText(payload.username);
        const password = typeof payload.password === 'string' ? payload.password : '';

        if (!/^[A-Za-z0-9._-]{4,30}$/.test(username) || password.length < 1 || password.length > 72) {
            throw Object.assign(new Error('Usuario o contraseña incorrectos'), { statusCode: 401 });
        }

        return { username, password };
    }
}

module.exports = UserValidator;
