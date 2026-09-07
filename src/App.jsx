import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute, SuperAdminRoute } from './routes'
import {
  Home,
  ProductDetail,
  OwnerProfile,
  Login,
  Register,
  DashboardPage,
  ProductsPage,
  CategoriesPage,
  OwnersPage,
  ProfilePage,
  UsersPage,
} from './pages'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Publik */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/owner/:id" element={<OwnerProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rute Admin & Super Admin */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
        <Route path="/admin/owners" element={<ProtectedRoute><OwnersPage /></ProtectedRoute>} />
        <Route path="/admin/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        {/* Khusus Super Admin */}
        <Route path="/admin/users" element={<SuperAdminRoute><UsersPage /></SuperAdminRoute>} />

        {/* Fallback 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App