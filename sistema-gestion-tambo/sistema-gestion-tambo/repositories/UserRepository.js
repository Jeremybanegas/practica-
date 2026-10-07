const path = require('path');
const BaseJsonRepository = require('./BaseJsonRepository');

class UserRepository extends BaseJsonRepository {
    constructor() {
        super(path.join(__dirname, '..', 'data', 'users.json'), []);
    }

    async findByUsername(username) {
        const users = await this.findAll();
        return users.find(user => user.username.toLowerCase() === username.toLowerCase()) || null;
    }
}

module.exports = UserRepository;
