import { useState, useCallback } from 'react';
import { apiUploadPhoto } from '../api/client';

export const useUpload = () => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const upload = useCallback(async (file) => {
    setUploading(true);
    setProgress(0);
    setError(null);
    try {
      const result = await apiUploadPhoto(file, setProgress);
      // result = { photoURL, photoPublicId }
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  return { upload, progress, uploading, error };
};
