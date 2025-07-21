export interface ProductType {
  productId: string;
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

export interface ProductsResponse{
  bebidas:ProductType[];
  comidasRapidas:ProductType[];
  asados:ProductType[];
  adiciones:ProductType[];
}