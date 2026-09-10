import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Store, Eye, EyeOff } from 'lucide-react';
import logo from '../../assets/logo.svg';

export function Register() {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Konfirmasi kata sandi tidak cocok.');
    }

    if (formData.password.length < 6) {
      return setError('Kata sandi minimal 6 karakter.');
    }

    setLoading(true);

    try {
      const { error: signUpError } = await signUp(formData.email, formData.password, formData.name);

      if (signUpError) throw signUpError;

      setSuccess('Registrasi berhasil! Menunggu persetujuan Super Admin sebelum dapat login.');
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo Pasiragung" className="h-16 w-auto" />
        </div>
        <h2 className="text-2xl font-display font-bold text-center text-text mb-2">
          Daftar Admin Baru
        </h2>

      </div>

      <div className="mt-8 sm:mx-auto w-full sm:max-w-sm">
        <div className="bg-background rounded-md py-8 px-6 shadow sm:rounded-md sm:px-10 border border-border">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-sm text-sm font-semibold">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-sm text-sm font-semibold">
              {success}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-text mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-border rounded-sm text-xs placeholder-text-muted focus:outline-none  transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">
                Alamat Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-border rounded-sm text-xs placeholder-text-muted focus:outline-none  transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-border rounded-sm text-xs placeholder-text-muted focus:outline-none  transition-colors pr-10"
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
              <label className="block text-xs font-semibold text-text mb-1">
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-border rounded-sm text-xs placeholder-text-muted focus:outline-none  transition-colors pr-10"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !!success}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-sm text-sm font-semibold text-on-primary bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-opacity disabled:opacity-50"
              >
                {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <Link to="/" className="w-full flex justify-center py-2 px-4 border border-border rounded-sm text-sm font-semibold text-text bg-surface hover:bg-gray-100 transition-colors">
              Kembali ke Beranda
            </Link>
            <p className="mt-4 text-center text-sm font-body text-text-muted">
              Sudah punya akun?{' '}
              <Link to="/login" className="font-semibold text-primary hover:text-primary/80">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
