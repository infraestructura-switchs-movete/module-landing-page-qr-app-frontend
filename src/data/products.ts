import { Product } from '../types';

export const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Papas a la Francesa Medianas',
    description: 'Nuestras deliciosas papas a la francesa acompañadas con nuestra famosa Salsa Pretto',
    price: 12000,
    category: 'food',
    image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 2,
    name: 'Sándwich de Carne Desmechada',
    description: 'Sándwich de carne desmechada con ingredientes frescos',
    price: 18900,
    category: 'food',
    image: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 3,
    name: 'Aros de Cebolla Medianos',
    description: 'Pan de perro, salchicha, mostaza, ketchup, cebolla picada',
    price: 8000,
    category: 'food',
    image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 4,
    name: 'Sándwich Jamón y Queso',
    description: 'Sándwich en pan artesanal relleno con jamón y queso, salsa mayonesa',
    price: 16900,
    category: 'food',
    image: 'https://images.pexels.com/photos/1603901/pexels-photo-1603901.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 5,
    name: 'Café Espresso 400ML',
    description: 'Café espresso de alta calidad servido en taza de 400ML',
    price: 5500,
    category: 'drink',
    image: 'https://images.pexels.com/photos/302896/pexels-photo-302896.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 6,
    name: 'Infusión de Frutas 220ML',
    description: 'Infusión de frutas con trozos de frutas deshidratadas (piña, uchiva, mango, fresa, papaya, manzana)',
    price: 7900,
    category: 'drink',
    image: 'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];