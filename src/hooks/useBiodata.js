import { useState, useCallback } from 'react';
import {
  apiGetPublicBiodatas,
  apiGetBiodataById,
  apiGetPrivateBiodata,
  apiGetMyBiodatas,
  apiCreateBiodata,
  apiUpdateBiodata,
  apiDeleteBiodata,
} from '../api/client';

export const useBiodata = () => {
  // Counter-based loading: stays true until ALL in-flight operations finish
  const [loadingCount, setLoadingCount] = useState(0);
  const [error, setError] = useState(null);

  const startLoading = () => setLoadingCount((c) => c + 1);
  const stopLoading = () => setLoadingCount((c) => c - 1);

  const create = useCallback(async (data) => {
    startLoading();
    setError(null);
    try {
      const biodata = await apiCreateBiodata(data);
      return biodata._id;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      stopLoading();
    }
  }, []);

  const fetchById = useCallback(async (id) => {
    startLoading();
    setError(null);
    try {
      return await apiGetBiodataById(id);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      stopLoading();
    }
  }, []);

  const fetchPrivateById = useCallback(async (id) => {
    startLoading();
    setError(null);
    try {
      return await apiGetPrivateBiodata(id);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      stopLoading();
    }
  }, []);

  const fetchByUser = useCallback(async () => {
    startLoading();
    setError(null);
    try {
      return await apiGetMyBiodatas();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      stopLoading();
    }
  }, []);

  const fetchPublic = useCallback(async () => {
    startLoading();
    setError(null);
    try {
      return await apiGetPublicBiodatas();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      stopLoading();
    }
  }, []);

  const update = useCallback(async (id, data) => {
    startLoading();
    setError(null);
    try {
      return await apiUpdateBiodata(id, data);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      stopLoading();
    }
  }, []);

  const remove = useCallback(async (id) => {
    startLoading();
    setError(null);
    try {
      await apiDeleteBiodata(id);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      stopLoading();
    }
  }, []);

  return {
    loading: loadingCount > 0,
    error,
    create,
    fetchById,
    fetchPrivateById,
    fetchByUser,
    fetchPublic,
    update,
    remove,
  };
};
