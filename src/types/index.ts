import { CompanyType } from "./companyType";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  displayName: string;
}

export interface RestaurantConfig extends CompanyType {
  name: string;
  logo: string | null;
  primaryColor: string;
  whatsappNumber: string;
}