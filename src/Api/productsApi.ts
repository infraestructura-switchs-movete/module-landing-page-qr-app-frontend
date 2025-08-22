import {BASE_URL_API} from '../constants/index';
import { ApiResponse,SearchParams,ProductType,SortParams} from '../types/productsType';
import { toProductType } from "../utils/category";


const URL: string = `${BASE_URL_API}/product`;
//const URL: string = `http://localhost:8080/api/back-whatsapp-qr-app/product`;


export const getProductsByCompany = async (token: string): Promise<ApiResponse> => {
  
  if (!token) {
    throw new Error("Token de autenticación no proporcionado");
  }

  const res = await fetch(`${URL}/getProductByCompany/238`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
   console.log("🚀 Datos completos de la API:", token);
   console.log("window.location.search:", window.location.search);
  console.log("window.location.hash:", window.location.hash);

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Acceso no autorizado. Token inválido o expirado.");
    }
    throw new Error(`Error en la solicitud: ${res.status} ${res.statusText}`);
  }

  return res.json();
};

export const searchProducts = async ({
  companyId, name, category, signal,
}: SearchParams): Promise<ProductType[]> => {
  const qs = new URLSearchParams();
  qs.set('companyId', String(companyId));
  if (name && name.trim() !== '') qs.set('name', name.trim());
  if (category && category.trim() !== '') qs.set('category', category.trim());

  const res = await fetch(`${URL}/search?${qs.toString()}`, { signal });
  if (!res.ok) throw new Error('Error en búsqueda');

  const data = await res.json();
  return (Array.isArray(data) ? data : []).map(toProductType);
};

export const getProductsSorted = async ({ companyId, sort, category, name, signal }: SortParams): Promise<ProductType[]> => {
  const qs = new URLSearchParams();
  qs.set('companyId', String(companyId));
  qs.set('sort', sort);
  if (category && category.trim() !== '') qs.set('category', category.trim());
  if (name && name.trim() !== '') qs.set('name', name.trim());

  const path = name && name.trim() !== '' ? 'by-price' : 'by-price';

  const res = await fetch(`${URL}/${path}?${qs.toString()}`, { signal });
  if (!res.ok) throw new Error('Error al ordenar por precio');

  const data = await res.json();
  return (Array.isArray(data) ? data : []).map(toProductType);
}