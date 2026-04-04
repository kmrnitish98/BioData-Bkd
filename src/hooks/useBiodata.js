import { useState, useCallback } from 'react';
import {
  createBiodata,
  getBiodataById,
  getUserBiodatas,
  getPublicBiodatas,
  updateBiodata,
  deleteBiodata,
} from '../firebase/firestore';

export const useBiodata = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const create = useCallback(async (userId, data) => {
    setLoading(true);
    setError(null);
    try {
      const id = await createBiodata(userId, data);
      return id;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBiodataById(id);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByUser = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserBiodatas(userId);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPublic = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPublicBiodatas();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      await updateBiodata(id, data);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteBiodata(id);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, create, fetchById, fetchByUser, fetchPublic, update, remove };
};
