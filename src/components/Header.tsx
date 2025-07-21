import React from "react";
import { ShoppingCart, Settings, Menu, X } from "lucide-react";
import { CompanyType } from "../types/companyType";

interface HeaderProps {
  config: CompanyType;
  cartItemsCount: number;
  onCartToggle: () => void;
  onAdminToggle: () => void;
  isCartOpen: boolean;
  isAdminOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  cartItemsCount,
  onCartToggle,
  onAdminToggle,
  isCartOpen,
  isAdminOpen,
}) => {
  console.log("Config in Header:", config);
  return (
    <header
      className="sticky top-0 z-50 text-white shadow-lg"
      style={{ backgroundColor: config.primaryColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            {config.logoUrl ? (
              <img
                src={config.logoUrl}
                alt={config.nameCompany}
                className="h-8 w-8 object-contain"
              />
            ) : (
              <div className="h-8 w-8 bg-white bg-opacity-20 rounded flex items-center justify-center">
                <span className="text-sm font-bold"></span>
              </div>
            )}
            <h1 className="text-xl font-bold">{config.nameCompany}</h1>
          </div>

          <nav className="hidden md:flex items-center space-x-8 flex-1 ml-12">
            <a href="#" className="hover:text-gray-300 transition-colors">
              INICIO
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              MENÚ
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              CONTÁCTANOS
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={onCartToggle}
              className="relative p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            <button
              onClick={onAdminToggle}
              className={`p-2 rounded-lg transition-colors ${
                isAdminOpen
                  ? "bg-white bg-opacity-20"
                  : "hover:bg-white hover:bg-opacity-10"
              }`}
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
