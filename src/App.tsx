import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { ProductCard } from "./components/ProductCard";
import { Cart } from "./components/Cart";
//import { OrderSummary } from "./components/OrderSummary";
import { AdminPanel } from "./components/AdminPanel";
import { useLocalStorage } from "./hooks/useLocalStorage";
import {  Category } from "./types";
import { getProductsByCompany } from "./Api/productsApi";
import { ProductType, CartItem, ProductsResponse } from "./types/productsType";
import { CompanyType } from "./types/companyType";
import { useCompany } from "./hooks/useCompany";

function App() {
  const [allProducts, setAllProducts] = useState<ProductsResponse>(); // Mantén ProductType[] en el estado
  const [products, setProducts] = useState<ProductType[]>([]); // Mantén ProductType[] en el estado
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
    "restaurant-cart",
    []
  );
const { company } = useCompany();
const [config, setConfig] = useLocalStorage<CompanyType>(
  "restaurant-config",
  {
    companyId: 1,
    nameCompany: "GMA",
    logoUrl: null,
    primaryColor: "#475569",
    numberWhatsapp: 123456789,
    longitude: "",
    latitude: "",
    baseValue: 100,
    additionalValue: 50,
  }
);

useEffect(() => {
  if (company) {
    setConfig({
      ...company,
      primaryColor: "#475569"
    });
  }
}, []);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const cartItemsCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const addToCart = (product: ProductType) => {
    setCartItems((prev) => {
      const existingItem = prev.find(
        (item) => item.product.productId === product.productId
      );
      if (existingItem) {
        return prev.map((item) =>
          item.product.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product.productId !== productId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const categoryOptions = [
    { value: "all", label: "Todos" },
    { value: "bebidas", label: "Bebidas" },
    { value: "comidasRapidas", label: "Comidas rápidas" },
    { value: "asados", label: "Asados" },
    { value: "adiciones", label: "Adiciones" },
  ];

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

  const deleteProduct = (productId: string) => {
    setProducts((prev) =>
      prev.filter((product) => product.productId !== productId)
    );

    setCartItems((prev) =>
      prev.filter((item) => item.product.productId !== productId)
    );
  };

  const addCategory = (categoryData: Omit<Category, "id">) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const editCategory = (id: string, categoryData: Omit<Category, "id">) => {
    const oldCategory = categories.find((cat) => cat.id === id);
    if (oldCategory) {
      setProducts((prev) =>
        prev.map((product) =>
          product.category === oldCategory.name
            ? { ...product, category: categoryData.name }
            : product
        )
      );
    }

    setCategories((prev) =>
      prev.map((category) =>
        category.id === id ? { ...categoryData, id } : category
      )
    );
  };

  const deleteCategory = (id: string) => {
    const categoryToDelete = categories.find((cat) => cat.id === id);
    if (categoryToDelete) {
      setProducts((prev) =>
        prev.filter((product) => product.category !== categoryToDelete.name)
      );
      // Remove from cart if exists
      setCartItems((prev) =>
        prev.filter((item) => item.product.category !== categoryToDelete.name)
      );
    }

    setCategories((prev) => prev.filter((category) => category.id !== id));

    if (activeCategory === categoryToDelete?.name) {
      setActiveCategory("all");
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData: ProductsResponse = await getProductsByCompany();

        setAllProducts(productsData);

        // Combinamos todos los productos en un solo array para allProducts
        const allProductsArray = Object.values(productsData).flat();

        // Por defecto mostramos todos los productos
        setProducts(allProductsArray);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const filterProducts = (category: string) => {
    if (!allProducts) {
      // Si allProducts es undefined, no hacemos nada o inicializamos con array vacío
      setProducts([]);
      return;
    }

    if (category === "all") {
      // Combinar todos los productos de todas las categorías
      const allProductsArray = Object.values(allProducts).flat();
      setProducts(allProductsArray);
    } else {
      // category podría ser 'bebidas', 'asados', etc.
      const categoryKey = category as keyof ProductsResponse;

      if (allProducts[categoryKey]) {
        // Mostrar solo los productos de esa categoría
        setProducts([...allProducts[categoryKey]]);
      } else {
        // Si la categoría no existe, mostrar vacío
        setProducts([]);
      }
    }
  };

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
        {/* Contenedor sticky para las categorías */}
        <div className="sticky top-16 z-40 bg-white py-2 mb-6">
          {" "}
          {/* top-16 debe ser la altura de tu header */}
          <div className="flex justify-start">
            <div className="bg-white rounded-lg p-1 shadow-sm w-full max-w-xs">
              <select
                value={activeCategory}
                onChange={(e) => {
                  setActiveCategory(e.target.value);
                  filterProducts(e.target.value);
                }}
                className={`px-6 py-2 rounded-md font-medium focus:outline-none appearance-none w-full text-white`}
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='white' viewBox='0 0 24 24' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                  backgroundSize: "1em",
                  paddingRight: "2.5rem",
                  backgroundColor: config.primaryColor,
                }}
              >
                {categoryOptions.map((category) => (
                  <option
                    key={category.value}
                    value={category.value}
                    className="px-4 py-2"
                  >
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {products.map((product) => (
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
