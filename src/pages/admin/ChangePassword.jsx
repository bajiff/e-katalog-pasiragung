import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import logo from '../../assets/logo.svg';

export function ChangePassword() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  // Tandai apakah sesi ini berasal dari link recovery email
  const [isRecoverySession, setIsRecoverySession] = useState(false);

  useEffect(() => {
    // Tambahan A: Listener untuk event PASSWORD_RECOVERY dari Supabase
    // Diperlukan agar halaman ini tahu sesi masuk dari link email, bukan login biasa.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoverySession(true);
      }
    });

    // Jika user sudah login dan must_change_password = true, halaman ini memang valid untuk diakses
    if (user && profile?.must_change_password) {
      setIsRecoverySession(true);
    }

    return () => subscription.unsubscribe();
  }, [user, profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password harus minimal 6 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setLoading(true);

    try {
      // 1. Update password di Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      // 2. Set must_change_password = false di profiles
      if (user?.id) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ must_change_password: false })
          .eq('id', user.id);

        if (profileError) {
          console.error('Gagal update must_change_password:', profileError);
          // Tidak fatal — password sudah berhasil diubah, lanjutkan
        }
      }

      setSuccess(true);

      // 3. Redirect ke dashboard setelah 2 detik
      setTimeout(() => {
        navigate('/admin/dashboard', { replace: true });
      }, 2000);

    } catch (err) {
      console.error('Gagal mengganti password:', err);
      setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
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
        <div className="flex flex-col items-center gap-2 mb-2">
          <ShieldCheck className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-display font-bold text-center text-text">
            Buat Password Baru
          </h2>
          <p className="text-sm text-center text-text-muted font-body">
            Password lama Anda telah direset oleh Super Admin. Silakan buat password baru untuk melanjutkan.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto w-full sm:max-w-sm">
        <div className="bg-background py-8 px-6 shadow rounded-md border border-border">

          {success ? (
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-semibold text-green-700">Password berhasil diperbarui!</p>
              <p className="text-xs text-text-muted">Anda akan diarahkan ke dashboard...</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-sm text-sm font-semibold">
                  {error}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="new_password" className="block text-xs font-semibold text-text mb-1">
                    Password Baru
                  </label>
                  <div className="relative">
                    <input
                      id="new_password"
                      type={showNew ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border  rounded-sm text-xs focus:outline-none focus:border-primary transition-colors pr-10"
                      placeholder="Minimal 6 karakter"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text"
                    >
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm_password" className="block text-xs font-semibold text-text mb-1">
                    Konfirmasi Password Baru
                  </label>
                  <div className="relative">
                    <input
                      id="confirm_password"
                      type={showConfirm ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border  rounded-sm text-xs focus:outline-none focus:border-primary transition-colors pr-10"
                      placeholder="Ulangi password baru"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-sm text-sm font-semibold text-on-primary bg-primary hover:opacity-90 focus:outline-none transition-opacity disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
