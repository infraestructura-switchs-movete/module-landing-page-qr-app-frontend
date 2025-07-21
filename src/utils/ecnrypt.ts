import CryptoJS from 'crypto-js';

// Función para convertir Base64URL a Base64
const fromBase64URL = (base64url: string): string => {
  let base64 = base64url
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  // Agregar padding si es necesario
  while (base64.length % 4) {
    base64 += '=';
  }
  
  return base64;
};

export const decryptPhoneNumber = (encryptedData: string): string => {
  const secretKey = import.meta.env.VITE_ENCRYPT_TOKEN;
 
  if (!secretKey) {
    throw new Error("VITE_ENCRYPT_TOKEN is undefined. Verifica tu archivo .env");
  }
  
  try {
    console.log('Token alfanumérico recibido:', encryptedData);
    
    // Separar IV y texto encriptado (usando punto en lugar de dos puntos)
    const parts = encryptedData.split('.');
    
    if (parts.length !== 2) {
      throw new Error(`Formato inválido: se esperan 2 partes separadas por '.', se encontraron ${parts.length}`);
    }
    
    const [ivBase64URL, encryptedBase64URL] = parts;
    
    // Convertir de Base64URL a Base64 normal
    const ivBase64 = fromBase64URL(ivBase64URL);
    const encryptedBase64 = fromBase64URL(encryptedBase64URL);
    
    console.log('IV Base64:', ivBase64);
    console.log('Encrypted Base64:', encryptedBase64);
    
    // Convertir IV de base64 a WordArray
    const iv = CryptoJS.enc.Base64.parse(ivBase64);
   
    // Generar la clave de la misma manera que en el backend
    const key = CryptoJS.SHA256(secretKey).toString(CryptoJS.enc.Base64).substring(0, 32);
    const keyWordArray = CryptoJS.enc.Utf8.parse(key);
   
    // Desencriptar
    const decrypted = CryptoJS.AES.decrypt(encryptedBase64, keyWordArray, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
   
    // Convertir a string
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
   
    if (!decryptedString) {
      throw new Error("Error al desencriptar: resultado vacío");
    }
    
    console.log('Teléfono desencriptado:', decryptedString);
    return decryptedString;
  } catch (error) {
    console.error("Error desencriptando:", error);
    let errorMessage = "Error desconocido";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(`Error al desencriptar el número de teléfono: ${errorMessage}`);
  }
};