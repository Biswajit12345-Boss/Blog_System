import { useState, useEffect } from 'react';
import { getBlogs, getFeaturedBlogs, getTrendingBlogs } from '../services/api';

export const useBlogs = (params = {}) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchBlogs = async (p = params) => {
    try {
      setLoading(true);
      const { data } = await getBlogs(p);
      setBlogs(data.data);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, [JSON.stringify(params)]);

  return { blogs, loading, error, totalPages, currentPage, refetch: fetchBlogs };
};

export const useFeaturedBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedBlogs().then(({ data }) => { setBlogs(data.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return { blogs, loading };
};

export const useTrendingBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrendingBlogs().then(({ data }) => { setBlogs(data.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return { blogs, loading };
};
