import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Login Admin</h2>
        <p className="text-gray-500 text-center mb-6">Form login sedang dalam proses integrasi.</p>
        <div className="text-center">
          <Link to="/" className="text-blue-600 hover:underline text-sm">&larr; Kembali ke Beranda</Link>
        </div>
      </div>
    </div>
  )
}

export default Login
