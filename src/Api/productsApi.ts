import type { ProductsResponse } from '../types/productsType';
import {BASE_URL_API} from '../constants/index';

const URL: string = `${BASE_URL_API}/product`;


export async function getProductsByCompany(): Promise<ProductsResponse> {  
  const response = await fetch(`${URL}/getProductByCompany/238`); 

  if (!response.ok) {
    throw new Error('Error fetching products');
  }

  const data: ProductsResponse = await response.json();  
  return data;
}


