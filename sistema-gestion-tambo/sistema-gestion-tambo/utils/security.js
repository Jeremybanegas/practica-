const bcrypt = require('bcryptjs');

class SecurityManager {
    static sanitizeText(value) {
        if (typeof value !== 'string') return '';

        return value
            .replace(/[<>"'`;]/g, '')
            .replace(/[\u0000-\u001F\u007F]/g, '')
            .trim();
    }

    static sanitizeUrl(value) {
        if (!value) return '';
        const clean = this.sanitizeText(value);

        try {
            const parsed = new URL(clean);
            if (!['http:', 'https:'].includes(parsed.protocol)) {
                throw new Error('Protocolo no permitido');
            }
            return parsed.toString();
        } catch {
            throw Object.assign(new Error('La URL de imagen no es válida'), { statusCode: 400 });
        }
    }

    static async hashPassword(plainPassword) {
        const rounds = Number(process.env.BCRYPT_ROUNDS || 12);
        return bcrypt.hash(plainPassword, rounds);
    }

    static async comparePassword(plainPassword, hash) {
        return bcrypt.compare(plainPassword, hash);
    }
}

module.exports = SecurityManager;
