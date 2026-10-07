const UserRepository = require('../repositories/UserRepository');
const UserService = require('../services/UserService');
const sessionManager = require('../utils/sessionManager');
const {
    setAdminCookie,
    clearAdminCookie,
    getSessionToken
} = require('../middleware/auth');

const userService = new UserService(new UserRepository());

const getAuthStatus = async (req, res, next) => {
    try {
        const hasAdmins = await userService.hasAdmins();
        res.status(200).json({
            authenticated: Boolean(req.admin),
            setupRequired: !hasAdmins,
            user: req.admin || null
        });
    } catch (error) {
        next(error);
    }
};

const setupAdmin = async (req, res, next) => {
    try {
        const admin = await userService.registerFirstAdmin(req.body);
        res.status(201).json({
            message: 'Administrador creado. Ahora inicia sesión.',
            data: admin
        });
    } catch (error) {
        next(error);
    }
};

const loginAdmin = async (req, res, next) => {
    try {
        const admin = await userService.login(req.body);
        const token = sessionManager.create(admin);
        setAdminCookie(res, token);

        res.status(200).json({
            message: 'Inicio de sesión correcto',
            user: admin
        });
    } catch (error) {
        next(error);
    }
};

const logoutAdmin = async (req, res) => {
    const token = getSessionToken(req);
    sessionManager.destroy(token);
    clearAdminCookie(res);
    res.status(200).json({ message: 'Sesión cerrada correctamente' });
};

module.exports = {
    getAuthStatus,
    setupAdmin,
    loginAdmin,
    logoutAdmin
};
