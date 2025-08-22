export interface ProductType {
  id: string;
  arqid: string;
  productName: string;
  price: number;
  categoryId: string;
  category?: string;
  image?: string;
  quantity: number;
  description?: string;
}

export interface CartItem {
  product: ProductType;
  quantity: number;
  comment: string;
  
  
}

export type SearchParams = {
  companyId: number;           
  name?: string;              
  category?: string; 
  signal?: AbortSignal;           
};

export type ProductsResponse = Record<string, ProductType[]>;

export interface ApiResponse {
  categories: { categoryName: string; products: ProductType[] }[];
}

export type BackendProductDto = {
  id: number | string;
  productName?: string; 
  name?: string;        
  price?: number | string;
  description?: string | null;
  status?: string | null;
  image?: string | null;      
  imgProduct?: string | null; 
  categoryId?: number | string | null;
};


export interface ApiResponseRaw {
  categories: { categoryName: string; products: BackendProductDto[] }[];
}


export type SortParams = {
  companyId: number;
  sort: 'ASC' | 'DESC';
  category?: string;
  name?: string;          
  signal?: AbortSignal;
};
