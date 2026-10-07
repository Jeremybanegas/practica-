const SecurityManager = require('../utils/security');

class ProductValidator {
    static validate(payload = {}) {
        const name = SecurityManager.sanitizeText(payload.name);
        const price = Number(payload.price);
        const image = payload.image ? SecurityManager.sanitizeUrl(payload.image) : '';

        if (name.length < 2 || name.length > 80) {
            throw Object.assign(new Error('El nombre debe tener entre 2 y 80 caracteres'), { statusCode: 400 });
        }

        if (!Number.isFinite(price) || price <= 0 || price > 10000) {
            throw Object.assign(new Error('El precio debe ser un número mayor a 0 y menor o igual a 10000'), { statusCode: 400 });
        }

        return {
            name,
            price: Number(price.toFixed(2)),
            image
        };
    }
}

module.exports = ProductValidator;
