const { randomBytes } = require('crypto');

class SessionManager {
    constructor({ ttlMs = 2 * 60 * 60 * 1000 } = {}) {
        this.ttlMs = ttlMs;
        this.sessions = new Map();
    }

    create(user) {
        this.cleanup();
        const token = randomBytes(32).toString('hex');
        this.sessions.set(token, {
            user: {
                id: String(user.id),
                username: user.username
            },
            expiresAt: Date.now() + this.ttlMs
        });
        return token;
    }

    get(token) {
        if (!token) return null;
        const session = this.sessions.get(token);
        if (!session) return null;

        if (session.expiresAt <= Date.now()) {
            this.sessions.delete(token);
            return null;
        }

        return session;
    }

    destroy(token) {
        if (token) this.sessions.delete(token);
    }

    cleanup() {
        const now = Date.now();
        for (const [token, session] of this.sessions.entries()) {
            if (session.expiresAt <= now) this.sessions.delete(token);
        }
    }
}

module.exports = new SessionManager();
