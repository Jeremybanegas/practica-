const ProductRepository = require('../repositories/ProductRepository');
const ProductService = require('../services/ProductService');

const productService = new ProductService(new ProductRepository());

const getProducts = async (req, res, next) => {
    try {
        const products = await productService.getAll();
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

const registerProduct = async (req, res, next) => {
    try {
        const product = await productService.create(req.body);
        res.status(201).json({ message: 'Producto creado correctamente', data: product });
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const product = await productService.update(req.params.id, req.body);
        res.status(200).json({ message: 'Producto actualizado correctamente', data: product });
    } catch (error) {
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        await productService.delete(req.params.id);
        res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        next(error);
    }
};

module.exports = { registerProduct, getProducts, updateProduct, deleteProduct };
