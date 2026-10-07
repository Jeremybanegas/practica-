const path = require('path');
const BaseJsonRepository = require('./BaseJsonRepository');

const initialProducts = [
    {
        id: '1',
        name: 'Empanada de Carne',
        price: 4.50,
        image: 'https://images.pexels.com/photos/6535195/pexels-photo-6535195.jpeg?auto=compress&cs=tinysrgb&w=800',
        createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
        id: '2',
        name: 'Gaseosa Coca Cola 500ml',
        price: 3.00,
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop',
        createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
        id: '3',
        name: 'Snacks Papas Lays',
        price: 2.50,
        image: 'https://www.seekpng.com/png/detail/62-624161_lays-potato-chips-lays-potato-chips-png.png',
        createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
        id: '4',
        name: 'Agua Mineral 600ml',
        price: 2.00,
        image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&auto=format&fit=crop',
        createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
        id: '5',
        name: 'Cerveza en Lata',
        price: 4.50,
        image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&auto=format&fit=crop',
        createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
        id: '6',
        name: 'Galletas de Chocolate',
        price: 1.50,
        image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&auto=format&fit=crop',
        createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
        id: '7',
        name: 'Barra de Chocolate',
        price: 2.00,
        image: 'https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&cs=tinysrgb&w=800',
        createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
        id: '8',
        name: 'Sándwich Mixto',
        price: 5.00,
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop',
        createdAt: '2026-01-01T00:00:00.000Z'
    }
];

class ProductRepository extends BaseJsonRepository {
    constructor() {
        super(path.join(__dirname, '..', 'data', 'products.json'), initialProducts);
    }
}

module.exports = ProductRepository;
