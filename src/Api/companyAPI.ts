import axios from 'axios';
import { CompanyType } from '../types/companyType';


const URL = 'https://arqmv-module-back-whatsapp-qr-app-backend.onrender.com/company';

export const createCompany = async (data: FormData) => {
  try {
    const response = await axios.post(`${URL}/create`, data, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });
    
    console.log('Respuesta de la API:', response.data);

  } catch (error) {
    console.error('Error al enviar los datos:', error);
  }
};

export const getCompany = async () => {
  try {
    const response = await axios.get(`${URL}/get-company`);
    console.log('Respuesta de la API:', response.data);
    return response.data.length > 0 ? response.data[0] : null; 
  } catch (error) {
    console.error('Error al obtener los datos de la compañía:', error);
  }
};

export const deleteCompany = async (companyId: number) => {
  try {
    const response = await axios.delete(`${URL}/delete/${companyId}`);
    if (response.status === 200) { // Verifica que la respuesta sea exitosa
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error al eliminar la compañía:', error);
    throw error;
  }
};