'use strict';

const state = {
    products: [],
    cart: [],
    auth: {
        authenticated: false,
        setupRequired: false,
        user: null
    }
};

const elements = {
    storeCatalog: document.getElementById('store-catalog'),
    adminList: document.getElementById('admin-list'),
    catalogStatus: document.getElementById('catalog-status'),
    adminStateText: document.getElementById('admin-state-text'),
    setupPanel: document.getElementById('setup-panel'),
    setupForm: document.getElementById('setup-form'),
    setupUser: document.getElementById('setup-user'),
    setupPass: document.getElementById('setup-pass'),
    setupButton: document.getElementById('btn-setup'),
    loginPanel: document.getElementById('login-panel'),
    loginForm: document.getElementById('login-form'),
    loginUser: document.getElementById('login-user'),
    loginPass: document.getElementById('login-pass'),
    loginButton: document.getElementById('btn-login'),
    adminDashboard: document.getElementById('admin-dashboard'),
    sessionUser: document.getElementById('session-user'),
    logoutButton: document.getElementById('btn-logout'),
    productForm: document.getElementById('product-form'),
    productId: document.getElementById('prod-id'),
    productName: document.getElementById('prod-name'),
    productPrice: document.getElementById('prod-price'),
    productImage: document.getElementById('prod-image'),
    saveButton: document.getElementById('btn-save'),
    cancelEditButton: document.getElementById('btn-cancel-edit'),
    cartPanel: document.getElementById('cart-panel'),
    cartOverlay: document.getElementById('cart-overlay'),
    cartButton: document.getElementById('cart-button'),
    closeCartButton: document.getElementById('close-cart'),
    checkoutButton: document.getElementById('checkout-button'),
    cartItems: document.getElementById('cart-items-container'),
    cartBadge: document.getElementById('cart-badge'),
    cartTotal: document.getElementById('cart-total-price'),
    toast: document.getElementById('toast')
};

function showToast(message, type = 'success') {
    elements.toast.textContent = message;
    elements.toast.className = `toast show ${type}`;
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3200);
}

async function fetchJson(url, options = {}) {
    try {
        const response = await fetch(url, {
            credentials: 'same-origin',
            ...options
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const error = new Error(data.message || `Error HTTP ${response.status}`);
            error.status = response.status;
            throw error;
        }

        return data;
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error('No se pudo conectar con el servidor. Verifica que Node.js esté ejecutándose.');
        }
        throw error;
    }
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(section => {
        section.classList.toggle('active', section.id === tabId);
    });

    document.querySelectorAll('[data-tab]').forEach(button => {
        button.classList.toggle('active', button.dataset.tab === tabId);
    });
}

function setLoading(isLoading) {
    elements.catalogStatus.textContent = isLoading ? 'Cargando productos…' : '';
    elements.saveButton.disabled = isLoading;
}

function createProductCard(product) {
    const card = document.createElement('article');
    card.className = 'product-card';

    const image = document.createElement('img');
    image.src = product.image || 'https://placehold.co/600x400?text=Sin+Imagen';
    image.alt = product.name;
    image.loading = 'lazy';
    image.addEventListener('error', () => {
        image.src = 'https://placehold.co/600x400?text=Imagen+no+disponible';
    }, { once: true });

    const info = document.createElement('div');
    info.className = 'product-info';

    const title = document.createElement('h2');
    title.textContent = product.name;

    const price = document.createElement('p');
    price.className = 'price';
    price.textContent = `S/ ${Number(product.price).toFixed(2)}`;

    const buyButton = document.createElement('button');
    buyButton.type = 'button';
    buyButton.className = 'btn-buy';
    buyButton.textContent = 'Agregar al carrito';
    buyButton.addEventListener('click', () => addToCart(product));

    info.append(title, price, buyButton);
    card.append(image, info);
    return card;
}

function createAdminRow(product) {
    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.textContent = product.name;

    const priceCell = document.createElement('td');
    priceCell.className = 'admin-price';
    priceCell.textContent = `S/ ${Number(product.price).toFixed(2)}`;

    const actionCell = document.createElement('td');
    actionCell.className = 'table-actions';

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'edit-btn';
    editButton.textContent = 'Editar';
    editButton.addEventListener('click', () => startEdit(product));

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = 'Eliminar';
    deleteButton.addEventListener('click', () => deleteProduct(product.id));

    actionCell.append(editButton, deleteButton);
    row.append(nameCell, priceCell, actionCell);
    return row;
}

function renderStoreProducts() {
    elements.storeCatalog.replaceChildren();

    if (state.products.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'empty-state';
        empty.textContent = 'No hay productos registrados.';
        elements.storeCatalog.append(empty);
        return;
    }

    state.products.forEach(product => {
        elements.storeCatalog.append(createProductCard(product));
    });
}

function renderAdminProducts() {
    elements.adminList.replaceChildren();
    if (!state.auth.authenticated) return;

    if (state.products.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 3;
        cell.className = 'empty-state';
        cell.textContent = 'No hay productos registrados.';
        row.append(cell);
        elements.adminList.append(row);
        return;
    }

    state.products.forEach(product => {
        elements.adminList.append(createAdminRow(product));
    });
}

async function loadProducts() {
    setLoading(true);
    try {
        state.products = await fetchJson('/api/products');
        renderStoreProducts();
        renderAdminProducts();
    } catch (error) {
        showToast(error.message, 'error');
        elements.catalogStatus.textContent = 'No se pudieron cargar los productos.';
    } finally {
        setLoading(false);
    }
}

function applyAuthUI() {
    const { authenticated, setupRequired, user } = state.auth;

    elements.setupPanel.classList.toggle('hidden', !setupRequired);
    elements.loginPanel.classList.toggle('hidden', setupRequired || authenticated);
    elements.adminDashboard.classList.toggle('hidden', !authenticated);

    if (setupRequired) {
        elements.adminStateText.textContent = 'Primera ejecución: crea la cuenta administradora.';
    } else if (authenticated) {
        elements.adminStateText.textContent = 'Panel protegido mediante sesión de administrador.';
        elements.sessionUser.textContent = user?.username || 'Administrador';
    } else {
        elements.adminStateText.textContent = 'Inicia sesión para gestionar el inventario.';
    }

    renderAdminProducts();
}

async function refreshAuthStatus() {
    try {
        state.auth = await fetchJson('/api/auth/status');
        applyAuthUI();
    } catch (error) {
        state.auth = { authenticated: false, setupRequired: false, user: null };
        applyAuthUI();
        showToast(error.message, 'error');
    }
}

function validateSetupForm() {
    document.getElementById('setup-user-error').textContent = '';
    document.getElementById('setup-pass-error').textContent = '';

    const username = elements.setupUser.value.trim();
    const password = elements.setupPass.value;
    let valid = true;

    if (!/^[A-Za-z0-9._-]{4,30}$/.test(username)) {
        document.getElementById('setup-user-error').textContent = 'Usa entre 4 y 30 caracteres válidos.';
        valid = false;
    }

    if (password.length < 8 || password.length > 72 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
        document.getElementById('setup-pass-error').textContent = 'Usa 8+ caracteres, mayúscula, minúscula y número.';
        valid = false;
    }

    return valid;
}

async function setupAdmin(event) {
    event.preventDefault();
    if (!validateSetupForm()) return;

    const username = elements.setupUser.value.trim();
    elements.setupButton.disabled = true;
    elements.setupButton.textContent = 'Protegiendo contraseña…';

    try {
        const result = await fetchJson('/api/auth/setup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                password: elements.setupPass.value
            })
        });

        showToast(result.message || 'Administrador creado');
        elements.setupForm.reset();
        elements.loginUser.value = username;
        await refreshAuthStatus();
        elements.loginPass.focus();
    } catch (error) {
        showToast(error.message, 'error');
        await refreshAuthStatus();
    } finally {
        elements.setupButton.disabled = false;
        elements.setupButton.textContent = 'Crear administrador';
    }
}

function validateLoginForm() {
    document.getElementById('login-user-error').textContent = '';
    document.getElementById('login-pass-error').textContent = '';

    const username = elements.loginUser.value.trim();
    const password = elements.loginPass.value;
    let valid = true;

    if (username.length < 4) {
        document.getElementById('login-user-error').textContent = 'Ingresa tu usuario.';
        valid = false;
    }

    if (!password) {
        document.getElementById('login-pass-error').textContent = 'Ingresa tu contraseña.';
        valid = false;
    }

    return valid;
}

async function loginAdmin(event) {
    event.preventDefault();
    if (!validateLoginForm()) return;

    elements.loginButton.disabled = true;
    elements.loginButton.textContent = 'Verificando…';

    try {
        const result = await fetchJson('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: elements.loginUser.value,
                password: elements.loginPass.value
            })
        });

        showToast(result.message || 'Inicio de sesión correcto');
        elements.loginForm.reset();
        await refreshAuthStatus();
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        elements.loginButton.disabled = false;
        elements.loginButton.textContent = 'Ingresar al panel';
    }
}

async function logoutAdmin() {
    elements.logoutButton.disabled = true;
    try {
        const result = await fetchJson('/api/auth/logout', { method: 'POST' });
        showToast(result.message || 'Sesión cerrada', 'info');
        resetProductForm();
        await refreshAuthStatus();
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        elements.logoutButton.disabled = false;
    }
}

async function handleProtectedError(error) {
    if (error.status === 401) {
        showToast('Tu sesión no está activa. Inicia sesión nuevamente.', 'error');
        await refreshAuthStatus();
        return true;
    }
    return false;
}

function validateProductForm() {
    clearProductErrors();

    const name = elements.productName.value.trim();
    const price = Number(elements.productPrice.value);
    const image = elements.productImage.value.trim();
    let valid = true;

    if (name.length < 2 || name.length > 80) {
        document.getElementById('name-error').textContent = 'Ingresa un nombre de 2 a 80 caracteres.';
        valid = false;
    }

    if (!Number.isFinite(price) || price <= 0 || price > 10000) {
        document.getElementById('price-error').textContent = 'El precio debe ser mayor a 0 y máximo 10000.';
        valid = false;
    }

    if (image) {
        try {
            const url = new URL(image);
            if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
        } catch {
            document.getElementById('image-error').textContent = 'Ingresa una URL http/https válida.';
            valid = false;
        }
    }

    return valid;
}

function clearProductErrors() {
    ['name-error', 'price-error', 'image-error'].forEach(id => {
        document.getElementById(id).textContent = '';
    });
}

function resetProductForm() {
    elements.productForm.reset();
    elements.productId.value = '';
    elements.saveButton.textContent = 'Guardar producto';
    elements.cancelEditButton.classList.add('hidden');
    clearProductErrors();
}

function startEdit(product) {
    if (!state.auth.authenticated) return;
    elements.productId.value = product.id;
    elements.productName.value = product.name;
    elements.productPrice.value = product.price;
    elements.productImage.value = product.image || '';
    elements.saveButton.textContent = 'Actualizar producto';
    elements.cancelEditButton.classList.remove('hidden');
    elements.productName.focus();
    elements.productForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function saveProduct(event) {
    event.preventDefault();
    if (!state.auth.authenticated) {
        showToast('Debes iniciar sesión como administrador.', 'error');
        return;
    }
    if (!validateProductForm()) return;

    const id = elements.productId.value;
    const payload = {
        name: elements.productName.value,
        price: elements.productPrice.value,
        image: elements.productImage.value
    };

    const url = id ? `/api/products/${encodeURIComponent(id)}` : '/api/products';
    const method = id ? 'PUT' : 'POST';

    elements.saveButton.disabled = true;
    elements.saveButton.textContent = id ? 'Actualizando…' : 'Guardando…';

    try {
        const result = await fetchJson(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        showToast(result.message || 'Operación realizada correctamente');
        resetProductForm();
        await loadProducts();
    } catch (error) {
        if (!(await handleProtectedError(error))) showToast(error.message, 'error');
    } finally {
        elements.saveButton.disabled = false;
        if (elements.productId.value) {
            elements.saveButton.textContent = 'Actualizar producto';
        }
    }
}

async function deleteProduct(id) {
    if (!state.auth.authenticated) return;

    const product = state.products.find(item => String(item.id) === String(id));
    const confirmed = window.confirm(`¿Eliminar "${product?.name || 'este producto'}" definitivamente?`);
    if (!confirmed) return;

    try {
        const result = await fetchJson(`/api/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
        showToast(result.message || 'Producto eliminado');
        await loadProducts();
    } catch (error) {
        if (!(await handleProtectedError(error))) showToast(error.message, 'error');
    }
}

function addToCart(product) {
    state.cart.push({ id: product.id, name: product.name, price: Number(product.price) });
    renderCart();
    showToast(`${product.name} agregado al carrito`, 'info');
}

function removeFromCart(index) {
    state.cart.splice(index, 1);
    renderCart();
}

function renderCart() {
    elements.cartItems.replaceChildren();
    elements.cartBadge.textContent = String(state.cart.length);
    elements.cartBadge.classList.toggle('visible', state.cart.length > 0);

    if (state.cart.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'empty-cart';
        empty.textContent = 'Tu carrito está vacío.';
        elements.cartItems.append(empty);
        elements.cartTotal.textContent = 'S/ 0.00';
        return;
    }

    let total = 0;
    state.cart.forEach((item, index) => {
        total += item.price;
        const row = document.createElement('div');
        row.className = 'cart-item';

        const info = document.createElement('div');
        const name = document.createElement('span');
        name.className = 'cart-item-name';
        name.textContent = item.name;
        const price = document.createElement('span');
        price.className = 'cart-item-price';
        price.textContent = `S/ ${item.price.toFixed(2)}`;
        info.append(name, price);

        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.className = 'remove-cart-item';
        removeButton.textContent = 'Quitar';
        removeButton.addEventListener('click', () => removeFromCart(index));

        row.append(info, removeButton);
        elements.cartItems.append(row);
    });

    elements.cartTotal.textContent = `S/ ${total.toFixed(2)}`;
}

function openCart() {
    elements.cartPanel.classList.add('open');
    elements.cartPanel.setAttribute('aria-hidden', 'false');
    elements.cartOverlay.hidden = false;
}

function closeCart() {
    elements.cartPanel.classList.remove('open');
    elements.cartPanel.setAttribute('aria-hidden', 'true');
    elements.cartOverlay.hidden = true;
}

function checkout() {
    if (state.cart.length === 0) {
        showToast('No hay productos en el carrito.', 'error');
        return;
    }

    state.cart = [];
    renderCart();
    closeCart();
    showToast('¡Compra simulada realizada con éxito!');
}

document.querySelectorAll('[data-tab]').forEach(button => {
    button.addEventListener('click', async () => {
        switchTab(button.dataset.tab);
        if (button.dataset.tab === 'admin') await refreshAuthStatus();
    });
});

elements.setupForm.addEventListener('submit', setupAdmin);
elements.loginForm.addEventListener('submit', loginAdmin);
elements.logoutButton.addEventListener('click', logoutAdmin);
elements.productForm.addEventListener('submit', saveProduct);
elements.cancelEditButton.addEventListener('click', resetProductForm);
elements.cartButton.addEventListener('click', openCart);
elements.closeCartButton.addEventListener('click', closeCart);
elements.cartOverlay.addEventListener('click', closeCart);
elements.checkoutButton.addEventListener('click', checkout);

document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeCart();
});

renderCart();
loadProducts();
refreshAuthStatus();
