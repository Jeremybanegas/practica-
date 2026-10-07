const BaseEntity = require('./BaseEntity');

class User extends BaseEntity {
    #username;
    #passwordHash;

    constructor({ id, username, passwordHash, createdAt }) {
        super(id, createdAt);
        this.#username = username;
        this.#passwordHash = passwordHash;
    }

    get username() {
        return this.#username;
    }

    get passwordHash() {
        return this.#passwordHash;
    }

    toPersistence() {
        return {
            ...this.getBaseData(),
            username: this.#username,
            passwordHash: this.#passwordHash
        };
    }

    toSafeJSON() {
        return {
            ...this.getBaseData(),
            username: this.#username
        };
    }
}

module.exports = User;
