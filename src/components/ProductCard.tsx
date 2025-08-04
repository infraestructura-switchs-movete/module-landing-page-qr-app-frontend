import React from "react";
import { Plus } from "lucide-react";
import { ProductType } from "../types/productsType";

interface ProductCardProps {
  product: ProductType;
  onAddToCart: (product: ProductType) => void;
  primaryColor: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  primaryColor,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    onAddToCart(product);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full relative">
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </div>

      <div className="p-4 flex flex-col flex-grow justify-between">
        <h3 className="font-semibold text-lg text-gray-900 mb-2">
          {product.name}
        </h3>

        <div className="flex flex-col justify-between sm:flex-row items-start sm:items-center mt-auto">
          <span className="text-xl font-bold text-gray-900 mb-2 sm:mb-0">
            {formatPrice(product.price)}
          </span>

          <button
            onClick={handleAddToCart}
            className="text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors flex items-center space-x-2"
            style={{ backgroundColor: primaryColor }}
          >
            <Plus className="h-4 w-4" />
            <span>Agregar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
