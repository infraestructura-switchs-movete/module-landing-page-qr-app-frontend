import type { ProductsResponse, ProductType } from '../types/productsType';


export async function getProductsByCompany(): Promise<ProductsResponse> {  // Cambié 'Product[]' por 'ProductType[]'
  const response = await fetch('https://arqmv-module-back-whatsapp-qr-app-backend.onrender.com/api/back-whatsapp-qr-app/product/getProductByCompany/238'); // Agregué 'http://'

  if (!response.ok) {
    throw new Error('Error fetching products');
  }

  const data: ProductsResponse = await response.json();  // Cambié 'Productype[]' por 'ProductType[]'
  return data;
}
