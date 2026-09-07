import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export function Login() {
  const { signIn, profile } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: signInError } = await signIn(email, password);

      if (signInError) throw signInError;

      // Note: We need to check profile status after login
      // Since fetchProfile takes a tiny bit of time, we could check the user data if needed,
      // but usually the protected route handles the redirect if not approved.
      // We can also let the ProtectedRoute redirect them back here or handle it here explicitly.
      // The context will update 'profile' asynchronously. Let's redirect to admin dashboard,
      // the ProtectedRoute will boot them back if not approved.

      navigate('/admin/dashboard');
    } catch (err) {
      if (err.message.includes('Invalid login credentials')) {
        setError('Email atau kata sandi salah, atau akun Anda belum disetujui.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <img src="/src/assets/logo.svg" alt="Logo Pasiragung" className="h-16 w-auto" />
        </div>
        <h2 className="text-2xl font-display font-bold text-center text-text mb-2">Masuk ke Admin</h2>
        <p className="mt-2 text-center text-sm font-body text-text-muted">
          Atau{' '}
          <Link to="/register" className="font-semibold text-primary hover:text-primary/80">
            daftar sebagai admin baru
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-background py-8 px-4 shadow sm:rounded-md sm:px-10 border border-border">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-sm text-sm font-semibold">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-text mb-1">
                Alamat Email
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-border rounded-sm text-xs placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">
                Kata Sandi
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-border rounded-sm text-xs placeholder-text-muted focus:outline-none focus:border-primary transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-sm text-sm font-semibold text-on-primary bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-opacity disabled:opacity-50"
              >
                {loading ? 'Masuk...' : 'Masuk'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <Link to="/" className="w-full flex justify-center py-2 px-4 border border-border rounded-sm text-sm font-semibold text-text bg-surface hover:bg-gray-100 transition-colors">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
