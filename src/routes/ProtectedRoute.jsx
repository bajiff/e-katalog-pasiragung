import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ children }) {
    const { user, profile, loading } = useAuth()
    if (loading) return <p>Loading...</p>
    if (!user || profile?.status !== 'approved') return <Navigate to="/login" replace />
    return children
}