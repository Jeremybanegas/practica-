const sessionManager = require('../utils/sessionManager');

const COOKIE_NAME = 'tambo_admin_session';

function parseCookies(header = '') {
    return header.split(';').reduce((cookies, item) => {
        const separator = item.indexOf('=');
        if (separator === -1) return cookies;
        const key = item.slice(0, separator).trim();
        const value = item.slice(separator + 1).trim();
        if (key) cookies[key] = decodeURIComponent(value);
        return cookies;
    }, {});
}

function getSessionToken(req) {
    const cookies = parseCookies(req.headers.cookie || '');
    return cookies[COOKIE_NAME] || '';
}

function attachAdmin(req, res, next) {
    const token = getSessionToken(req);
    const session = sessionManager.get(token);
    req.admin = session ? session.user : null;
    req.sessionToken = session ? token : '';
    next();
}

function requireAdmin(req, res, next) {
    const token = getSessionToken(req);
    const session = sessionManager.get(token);

    if (!session) {
        return res.status(401).json({ message: 'Debes iniciar sesión como administrador' });
    }

    req.admin = session.user;
    req.sessionToken = token;
    next();
}

function setAdminCookie(res, token) {
    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: sessionManager.ttlMs
    });
}

function clearAdminCookie(res) {
    res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        path: '/'
    });
}

module.exports = {
    attachAdmin,
    requireAdmin,
    setAdminCookie,
    clearAdminCookie,
    getSessionToken
};
