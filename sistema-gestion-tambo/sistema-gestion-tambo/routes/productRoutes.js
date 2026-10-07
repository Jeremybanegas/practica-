const express = require('express');
const {
    registerProduct,
    getProducts,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// El catálogo es público.
router.get('/', getProducts);

// El inventario solo puede modificarse con una sesión de administrador válida.
router.post('/', requireAdmin, registerProduct);
router.put('/:id', requireAdmin, updateProduct);
router.delete('/:id', requireAdmin, deleteProduct);

module.exports = router;
