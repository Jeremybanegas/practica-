class IdValidator {
    static validate(value) {
        const id = String(value ?? '').trim();

        // Acepta los IDs numéricos iniciales y UUID generados por el sistema.
        if (!/^[A-Za-z0-9-]{1,64}$/.test(id)) {
            throw Object.assign(new Error('Identificador de producto no válido'), { statusCode: 400 });
        }

        return id;
    }
}

module.exports = IdValidator;
