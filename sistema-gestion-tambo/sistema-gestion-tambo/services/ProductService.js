const Product = require('../models/Product');
const ProductValidator = require('../validators/ProductValidator');
const IdValidator = require('../validators/IdValidator');

class ProductService {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }

    async getAll() {
        return this.productRepository.findAll();
    }

    async create(payload) {
        const cleanData = ProductValidator.validate(payload);
        const product = new Product(cleanData);
        return this.productRepository.create(product.toJSON());
    }

    async update(id, payload) {
        const cleanId = IdValidator.validate(id);
        const existing = await this.productRepository.findById(cleanId);
        if (!existing) {
            throw Object.assign(new Error('Producto no encontrado'), { statusCode: 404 });
        }

        const cleanData = ProductValidator.validate(payload);
        const product = new Product(existing);
        product.update(cleanData);
        return this.productRepository.update(cleanId, product.toJSON());
    }

    async delete(id) {
        const cleanId = IdValidator.validate(id);
        const deleted = await this.productRepository.delete(cleanId);
        if (!deleted) {
            throw Object.assign(new Error('Producto no encontrado'), { statusCode: 404 });
        }
        return true;
    }
}

module.exports = ProductService;
