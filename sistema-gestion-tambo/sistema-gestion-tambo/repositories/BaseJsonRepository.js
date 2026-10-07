const fs = require('fs/promises');
const path = require('path');

class BaseJsonRepository {
    constructor(filePath, initialData = []) {
        this.filePath = filePath;
        this.initialData = initialData;
    }

    async ensureStorage() {
        await fs.mkdir(path.dirname(this.filePath), { recursive: true });
        try {
            await fs.access(this.filePath);
        } catch {
            await fs.writeFile(this.filePath, JSON.stringify(this.initialData, null, 2), 'utf8');
        }
    }

    async findAll() {
        await this.ensureStorage();
        const raw = await fs.readFile(this.filePath, 'utf8');
        return raw.trim() ? JSON.parse(raw) : [];
    }

    async writeAll(items) {
        await this.ensureStorage();
        await fs.writeFile(this.filePath, JSON.stringify(items, null, 2), 'utf8');
    }

    async findById(id) {
        const items = await this.findAll();
        return items.find(item => String(item.id) === String(id)) || null;
    }

    async create(item) {
        const items = await this.findAll();
        items.push(item);
        await this.writeAll(items);
        return item;
    }

    async update(id, updatedItem) {
        const items = await this.findAll();
        const index = items.findIndex(item => String(item.id) === String(id));
        if (index === -1) return null;
        items[index] = updatedItem;
        await this.writeAll(items);
        return updatedItem;
    }

    async delete(id) {
        const items = await this.findAll();
        const index = items.findIndex(item => String(item.id) === String(id));
        if (index === -1) return false;
        items.splice(index, 1);
        await this.writeAll(items);
        return true;
    }
}

module.exports = BaseJsonRepository;
