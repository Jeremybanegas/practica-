const BaseEntity = require('./BaseEntity');

class Product extends BaseEntity {
    #name;
    #price;
    #image;

    constructor({ id, name, price, image, createdAt }) {
        super(id, createdAt);
        this.#name = name;
        this.#price = Number(price);
        this.#image = image || 'https://placehold.co/600x400?text=Sin+Imagen';
    }

    get name() {
        return this.#name;
    }

    get price() {
        return this.#price;
    }

    get image() {
        return this.#image;
    }

    update({ name, price, image }) {
        this.#name = name;
        this.#price = Number(price);
        this.#image = image || this.#image;
    }

    toJSON() {
        return {
            ...this.getBaseData(),
            name: this.#name,
            price: this.#price,
            image: this.#image
        };
    }
}

module.exports = Product;
