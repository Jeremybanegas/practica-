const { randomUUID } = require('crypto');

class BaseEntity {
    #id;
    #createdAt;

    constructor(id = randomUUID(), createdAt = new Date().toISOString()) {
        this.#id = String(id);
        this.#createdAt = createdAt;
    }

    get id() {
        return this.#id;
    }

    get createdAt() {
        return this.#createdAt;
    }

    getBaseData() {
        return {
            id: this.#id,
            createdAt: this.#createdAt
        };
    }
}

module.exports = BaseEntity;
