const express = require('express');
const path = require('path');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const { notFoundApi, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.disable('x-powered-by');

// Cabeceras defensivas alineadas con buenas prácticas OWASP.
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; img-src 'self' https://images.unsplash.com https://images.pexels.com https://www.seekpng.com https://placehold.co data:; style-src 'self'; script-src 'self'; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"
    );
    next();
});

app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: false, limit: '20kb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/products', productRoutes);
app.use('/api', userRoutes);

app.use(notFoundApi);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor de Tambo+ disponible en http://localhost:${PORT}`);
});
