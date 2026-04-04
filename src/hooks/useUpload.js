import { useState, useCallback } from 'react';
import { uploadProfilePhoto } from '../firebase/storage';

export const useUpload = () => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const upload = useCallback(async (userId, file) => {
    setUploading(true);
    setProgress(0);
    setError(null);
    try {
      const url = await uploadProfilePhoto(userId, file, setProgress);
      return url;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  return { upload, progress, uploading, error };
};
