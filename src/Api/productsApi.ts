import type { ProductType } from '../types/productsType';


export async function getProductsByCompany(): Promise<ProductType[]> {  // Cambié 'Product[]' por 'ProductType[]'
  const response = await fetch(' https://arqmv-module-back-whatsapp-qr-app-backend.onrender.com/product/getProductByCompany/238'); // Agregué 'http://'

  if (!response.ok) {
    throw new Error('Error fetching products');
  }

  const data: ProductType[] = await response.json();  // Cambié 'Productype[]' por 'ProductType[]'
  return data;
}
