import React, { useState } from 'react';
import { X, Plus, Edit, Trash2, Upload } from 'lucide-react';
import { Product, RestaurantConfig, Category } from '../types';
import { ProductType } from '../types/productsType';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductType[];
  categories: Category[];
  //onAddProduct: (product: Omit<Product, 'id'>) => void;
  //onEditProduct: (id: string, product: Omit<Product, 'id'>) => void;
  //onDeleteProduct: (id: string) => void;
  onAddCategory: (category: Omit<Category, 'id'>) => void;
  onEditCategory: (id: string, category: Omit<Category, 'id'>) => void;
  onDeleteCategory: (id: string) => void;
  config: RestaurantConfig;
  onUpdateConfig: (config: RestaurantConfig) => void;
}
 
export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  products,
  categories,
  //onAddProduct,
  //onEditProduct,
  //onDeleteProduct,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  config,
  onUpdateConfig
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'config'>('products');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: 0,
    category: categories[0]?.name || 'food',
    image: ''
  });
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    displayName: ''
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  /*const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onEditProduct(editingProduct.id, productForm);
      setEditingProduct(null);
    } else {
      onAddProduct(productForm);
    }
    setProductForm({ name: '', description: '', price: 0, category: categories[0]?.name || 'food', image: '' });
    setShowProductForm(false);
  };*/

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      onEditCategory(editingCategory.id, categoryForm);
      setEditingCategory(null);
    } else {
      onAddCategory(categoryForm);
    }
    setCategoryForm({ name: '', displayName: '' });
    setShowCategoryForm(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image
    });
    setShowProductForm(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      displayName: category.displayName
    });
    setShowCategoryForm(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'logo') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (type === 'product') {
          setProductForm(prev => ({ ...prev, image: result }));
        } else {
          onUpdateConfig({ ...config, logo: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const colorOptions = [
    '#ef4444', '#10b981', '#8b5cf6', '#f97316', 
    '#3b82f6', '#ec4899', '#475569'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute inset-4 bg-white rounded-lg shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Panel de Administración</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'products' 
                ? 'border-b-2 border-slate-700 text-slate-700' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Gestión de Productos
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'categories' 
                ? 'border-b-2 border-slate-700 text-slate-700' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Gestión de Categorías
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'config' 
                ? 'border-b-2 border-slate-700 text-slate-700' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Configuración
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Productos</h3>
                <button
                  onClick={() => setShowProductForm(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Agregar Producto</span>
                </button>
              </div>
              
              {showProductForm && (
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h4 className="text-lg font-semibold mb-4">
                    {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                  </h4>
                  
                 
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre del Producto
                        </label>
                        <input
                          type="text"
                          required
                          value={productForm.name}
                          onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                          placeholder="Ej: Hamburguesa Clásica"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Precio (COP)
                        </label>
                        <input
                          type="number"
                          required
                          value={productForm.price}
                          onChange={(e) => setProductForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categoría
                      </label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.name}>
                            {category.displayName}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Imagen
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'product')}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                      {productForm.image && (
                        <img src={productForm.image} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded" />
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción
                      </label>
                      <textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                        placeholder="Describe tu producto..."
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        {editingProduct ? 'Actualizar Producto' : 'Guardar Producto'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowProductForm(false);
                          setEditingProduct(null);
                          setProductForm({ name: '', description: '', price: 0, category: categories[0]?.name || 'food', image: '' });
                        }}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div key={product.productId} className="bg-white border rounded-lg overflow-hidden">
                    <img
                     // src={product.image}
                      alt={product.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-semibold">{product.name}</h4>
                     
                      <p className="font-bold text-lg">{formatPrice(product.price)}</p>
                      <p className="text-xs text-gray-500 mb-2">
                        Categoría: {categories.find(cat => cat.name === product.category)?.displayName || product.category}
                      </p>
                      
                      <div className="flex space-x-2 mt-3">
                        <button
                          //onClick={() => handleEditProduct(product)}
                          className="flex-1 bg-blue-600 text-white py-1 px-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Edit className="h-3 w-3" />
                          <span>Editar</span>
                        </button>
                        <button
                          //onClick={() => onDeleteProduct(product.productId)}
                          className="flex-1 bg-red-600 text-white py-1 px-2 rounded text-sm hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Categorías</h3>
                <button
                  onClick={() => setShowCategoryForm(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Agregar Categoría</span>
                </button>
              </div>

              {showCategoryForm && (
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h4 className="text-lg font-semibold mb-4">
                    {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                  </h4>
                  
                  <form onSubmit={handleCategorySubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre Interno (sin espacios)
                        </label>
                        <input
                          type="text"
                          required
                          value={categoryForm.name}
                          onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                          placeholder="Ej: postres"
                        />
                        <p className="text-xs text-gray-500 mt-1">Se usará internamente para identificar la categoría</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre para Mostrar
                        </label>
                        <input
                          type="text"
                          required
                          value={categoryForm.displayName}
                          onChange={(e) => setCategoryForm(prev => ({ ...prev, displayName: e.target.value }))}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                          placeholder="Ej: Postres"
                        />
                        <p className="text-xs text-gray-500 mt-1">Este nombre aparecerá en los botones del menú</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        {editingCategory ? 'Actualizar Categoría' : 'Guardar Categoría'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCategoryForm(false);
                          setEditingCategory(null);
                          setCategoryForm({ name: '', displayName: '' });
                        }}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div key={category.id} className="bg-white border rounded-lg p-4">
                    <h4 className="font-semibold text-lg">{category.displayName}</h4>
                    <p className="text-sm text-gray-600 mb-2">ID: {category.name}</p>
                    <p className="text-xs text-gray-500 mb-4">
                      Productos: {products.filter(p => p.category === category.name).length}
                    </p>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                      >
                        <Edit className="h-3 w-3" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`¿Estás seguro de eliminar la categoría "${category.displayName}"? Esto también eliminará todos los productos de esta categoría.`)) {
                            onDeleteCategory(category.id);
                          }
                        }}
                        className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'config' && (
            <div>
              <h3 className="text-lg font-semibold mb-6">Configuración del Restaurante</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Restaurante
                  </label>
                  <input
                    type="text"
                    value={config.name}
                    onChange={(e) => onUpdateConfig({ ...config, name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo del Restaurante
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'logo')}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Peso máximo 10MB</p>
                  {config.logo && (
                    <img src={config.logo} alt="Logo preview" className="mt-2 w-16 h-16 object-contain border rounded" />
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Color Principal del Tema
                  </label>
                  <div className="flex space-x-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        onClick={() => onUpdateConfig({ ...config, primaryColor: color })}
                        className={`w-8 h-8 rounded-full border-2 ${
                          config.primaryColor === color ? 'border-gray-800' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Color actual: {config.primaryColor}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de WhatsApp (opcional)
                  </label>
                  <input
                    type="text"
                    value={config.whatsappNumber}
                    onChange={(e) => onUpdateConfig({ ...config, whatsappNumber: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    placeholder="Ej: +573001234567"
                  />
                  <p className="text-xs text-gray-500 mt-1">Incluye el código de país. Los pedidos se enviarán a este número.</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Vista Previa</h4>
                  <div 
                    className="flex items-center space-x-3 p-3 rounded text-white"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    {config.logo ? (
                      <img src={config.logo} alt={config.name} className="h-8 w-8 object-contain" />
                    ) : (
                      <div className="h-8 w-8 bg-white bg-opacity-20 rounded flex items-center justify-center">
                        <span className="text-sm font-bold">{config.name.charAt(0)}</span>
                      </div>
                    )}
                    <span className="font-bold">{config.name}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};