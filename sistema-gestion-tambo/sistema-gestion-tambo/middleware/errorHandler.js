const notFoundApi = (req, res, next) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ message: 'Ruta de API no encontrada' });
    }
    next();
};

const errorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;

    if (statusCode >= 500) {
        console.error('Error interno:', error.message);
    }

    res.status(statusCode).json({
        message: statusCode >= 500 ? 'Error interno del servidor' : error.message
    });
};

module.exports = { notFoundApi, errorHandler };
