import api from './api';

export const getStats = async () => {
  const [authStats, blogStats] = await Promise.all([
    api.get('/auth/stats'),
    api.get('/blog/admin/stats').catch(() => ({ data: {} })),
  ]);
  return { ...authStats.data, blogStats: blogStats.data };
};

export const getAdminBlogs = (params) => api.get('/blog/admin/all', { params });
export const approveBlog = (id) => api.put(`/blog/${id}/approve`);
export const updateUserRole = (id, data) => api.put(`/auth/users/${id}/role`, data);
export const deleteUser = (id) => api.delete(`/auth/users/${id}`);
