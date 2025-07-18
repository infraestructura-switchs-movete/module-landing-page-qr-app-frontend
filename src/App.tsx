import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { OrderSummary } from './components/OrderSummary';
import { AdminPanel } from './components/AdminPanel';
import { useLocalStorage } from './hooks/useLocalStorage';
import { RestaurantConfig, Category } from './types';
import { getProductsByCompany } from './Api/productsApi';
import { ProductType, CartItem } from './types/productsType';


function App() {
  const [products, setProducts] = useState<ProductType[]>([]); // Mantén ProductType[] en el estado
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('restaurant-cart', []);
  const [config, setConfig] = useLocalStorage<RestaurantConfig>('restaurant-config', {
    name: 'GMA',
    logo: null,
    primaryColor: '#475569',
    whatsappNumber: ''
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);


  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product: ProductType) => {
  setCartItems(prev => {
    const existingItem = prev.find(item => item.product.productId === product.productId);
    if (existingItem) {
      return prev.map(item =>
        item.product.productId === product.productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      return [...prev, { product, quantity: 1 }];
    }
  });
};


  const updateQuantity = (productId: number , quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.product.productId === productId
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.product.productId !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  /*const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const editProduct = (id: string, productData: Omit<Product, 'id'>) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === id ? { ...productData, id } : product
      )
    );
  };
  */

  const deleteProduct = (productId: number) => {
    setProducts(prev => prev.filter(product => product.productId !== productId));
    // Remove from cart if exists
    setCartItems(prev => prev.filter(item => item.product.productId !== productId));
  };

  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString()
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const editCategory = (id: string, categoryData: Omit<Category, 'id'>) => {
    const oldCategory = categories.find(cat => cat.id === id);
    if (oldCategory) {
      // Update products that use this category
      setProducts(prev =>
        prev.map(product =>
          product.category === oldCategory.name
            ? { ...product, category: categoryData.name }
            : product
        )
      );
    }
    
    setCategories(prev =>
      prev.map(category =>
        category.id === id ? { ...categoryData, id } : category
      )
    );
  };

  const deleteCategory = (id: string) => {
    const categoryToDelete = categories.find(cat => cat.id === id);
    if (categoryToDelete) {
      // Remove products that use this category
      setProducts(prev => prev.filter(product => product.category !== categoryToDelete.name));
      // Remove from cart if exists
      setCartItems(prev => prev.filter(item => item.product.category !== categoryToDelete.name));
    }
    
    setCategories(prev => prev.filter(category => category.id !== id));
    
    // Reset active category if it was deleted
    if (activeCategory === categoryToDelete?.name) {
      setActiveCategory('all');
    }
  };

  // Fetch productos cuando el componente se monte
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Obtén los productos desde la API
        const productData: ProductType[] = await getProductsByCompany();
        
        // Convierte los productos de tipo ProductType a ProductType (manteniendo la estructura completa)
        const formattedProducts: ProductType[] = productData.map((product) => ({
          productId: product.productId,    // Asegúrate de mantener todas las propiedades de ProductType
          arqProductId: product.arqProductId, // Asegúrate de mantener estas propiedades
          name: product.name,
          price: product.price,
          categoryId: product.categoryId, // Asegúrate de mantener estas propiedades
          category: product.category,
          quantity: product.quantity, // Asegúrate de mantener estas propiedades
        }));

        // Actualiza el estado con los productos formateados
        setProducts(formattedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []); // Solo se ejecuta una vez al montar el componente

  // Filtrar productos según la categoría seleccionada
  const filteredProducts = products.filter((product) =>
    activeCategory === 'all' || product.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        config={config}
        cartItemsCount={cartItemsCount}
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
        onAdminToggle={() => setIsAdminOpen(!isAdminOpen)}
        isCartOpen={isCartOpen}
        isAdminOpen={isAdminOpen}
        
      />
      <Cart
        isOpen={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        //onRemoveFromCart={removeFromCart}
        onClearCart={clearCart}
        //config={config}
        onRemoveItem={removeFromCart}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-start mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${activeCategory === 'all' ? 'text-white' : 'text-gray-600 hover:text-gray-900'}`}
              style={{ backgroundColor: activeCategory === 'all' ? config.primaryColor : 'transparent' }}
            >
              Todos
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.name)}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${activeCategory === category.name ? 'text-white' : 'text-gray-600 hover:text-gray-900'}`}
                style={{ backgroundColor: activeCategory === category.name ? config.primaryColor : 'transparent' }}
              >
                {category.displayName}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.productId}
              product={product}
              onAddToCart={addToCart}
              primaryColor={config.primaryColor}
            />
          ))}
        </div>
        
       
      
      </main>
      
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        categories={categories}
        //onAddProduct={addProduct}
       // onEditProduct={editProduct}
        //onDeleteProduct={deleteProduct}
        onAddCategory={addCategory}
        onEditCategory={editCategory}
        onDeleteCategory={deleteCategory}
        config={config}
        onUpdateConfig={setConfig}
      />
    </div>
  );
}

export default App;
