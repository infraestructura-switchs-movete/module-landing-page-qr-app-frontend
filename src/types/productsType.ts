export interface ProductType {
  productId: number;
  arqProductId: string;
  name: string;
  price: number;
  categoryId: string;
  category: string;
  image?: string;
  quantity: number;
}

export interface CartItem {
  product: ProductType;
  quantity: number;
  
}