import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function SuperAdminRoute({ children }) {
    const { profile, loading } = useAuth()
    if (loading) return <p>Loading...</p>
    if (profile?.role !== 'super_admin') return <Navigate to="/admin/products" replace />
    return children
}