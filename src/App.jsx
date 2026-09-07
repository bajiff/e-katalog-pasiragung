// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute, SuperAdminRoute } from './routes'
import { AdminLayout, PublicLayout } from './components/layout'
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
        {/* Rute Publik (dengan Layout) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/owner/:id" element={<OwnerProfile />} />
        </Route>

        {/* Rute Auth (Tanpa Layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rute Admin & Super Admin (dengan Layout) */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="owners" element={<OwnersPage />} />
          <Route path="profile" element={<ProfilePage />} />

          {/* Khusus Super Admin */}
          <Route path="users" element={<SuperAdminRoute><UsersPage /></SuperAdminRoute>} />
        </Route>

        {/* Fallback 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App