import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token'); localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
    }
    return Promise.reject(err);
  }
);

// Blogs
export const getBlogs = (params) => api.get('/blog', { params });
export const getFeaturedBlogs = () => api.get('/blog/featured');
export const getTrendingBlogs = () => api.get('/blog/trending');
export const getSingleBlog = (id) => api.get(`/blog/${id}`);
export const createBlog = (data) => api.post('/blog', data);
export const updateBlog = (id, data) => api.put(`/blog/${id}`, data);
export const deleteBlog = (id) => api.delete(`/blog/${id}`);
export const likeBlog = (id) => api.put(`/blog/${id}/like`);
export const addComment = (id, comment) => api.post(`/blog/${id}/comment`, { comment });
export const deleteComment = (blogId, cId) => api.delete(`/blog/${blogId}/comment/${cId}`);
export const incrementViews = (id) => api.put(`/blog/${id}/view`);
export const toggleBookmark = (id) => api.put(`/blog/${id}/bookmark`);
export const getMyBlogs = () => api.get('/blog/my/posts');
export const getMyBookmarks = () => api.get('/blog/my/bookmarks');
export const getRelatedBlogs = (id) => api.get(`/blog/${id}/related`);
export const getBlogsByUser = (userId) => api.get(`/blog/user/${userId}`);

// Auth
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const getMe = () => api.get('/auth/me');
export const updateProfile = (data) => api.put('/auth/profile', data);
export const getAllUsers = () => api.get('/auth/allusers');

// Contact
export const sendContact = (data) => api.post('/contact', data);

export default api;
