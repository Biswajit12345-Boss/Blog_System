import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './route/ProtectedRoute';
import PublicRoute from './route/PublicRoute';

import Home from './pages/public/Home';
import BlogsPage from './pages/public/BlogsPage';
import SingleBlog from './pages/public/SingleBlog';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import About from './pages/public/About';
import ContactUs from './pages/public/ContactUs';
import SearchPage from './pages/public/SearchPage';

import Dashboard from './pages/user/Dashboard';
import Profile from './pages/user/Profile';
import WriteBlog from './pages/user/WriteBlog';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminBlog from './pages/admin/AdminBlog';
import AdminContact from './pages/admin/AdminContact';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="blogs" element={<BlogsPage />} />
        <Route path="blog/:id" element={<SingleBlog />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<ContactUs />} />
        <Route path="search" element={<SearchPage />} />

        <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="register" element={<PublicRoute><Register /></PublicRoute>} />

        <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="write" element={<ProtectedRoute><WriteBlog /></ProtectedRoute>} />
        <Route path="edit/:id" element={<ProtectedRoute><WriteBlog /></ProtectedRoute>} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="blogs" element={<AdminBlog />} />
        <Route path="contact" element={<AdminContact />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
export default App;
