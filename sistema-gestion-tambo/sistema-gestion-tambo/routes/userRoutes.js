const express = require('express');
const {
    getAuthStatus,
    setupAdmin,
    loginAdmin,
    logoutAdmin
} = require('../controllers/userController');
const { attachAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/auth/status', attachAdmin, getAuthStatus);
router.post('/auth/setup', setupAdmin);
router.post('/auth/login', loginAdmin);
router.post('/auth/logout', logoutAdmin);

module.exports = router;
