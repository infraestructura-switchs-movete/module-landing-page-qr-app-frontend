import React from 'react';
import { decryptPhoneNumber } from '../utils/ecnrypt.ts';

export const useDecryptPhone = (encryptedPhone: string | null) => {
  const [decryptedPhone, setDecryptedPhone] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!encryptedPhone) {
      setDecryptedPhone('');
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const decrypted = decryptPhoneNumber(encryptedPhone);
      setDecryptedPhone(decrypted);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      setDecryptedPhone('');
      console.error("Error desencriptando:", err);
    } finally {
      setLoading(false);
    }
  }, [encryptedPhone]);

  return { 
    decryptedPhone, 
    loading, 
    error 
  };
};