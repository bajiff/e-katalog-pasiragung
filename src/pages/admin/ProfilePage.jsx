import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { uploadImage, deleteImage } from '../../lib/storage';
import { ConfirmModal } from '../../components/shared';
import { User } from 'lucide-react';

export function ProfilePage() {
  const { profile, user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isPassSaving, setIsPassSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false });

  const requestConfirm = (options) => {
    setConfirmModal({
      ...options,
      isOpen: true,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        if (options.onConfirm) await options.onConfirm();
      }
    });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const file = formData.get('avatar');

    requestConfirm({
      title: 'Perbarui Profil',
      message: 'Apakah Anda yakin ingin memperbarui profil Anda?',
      confirmText: 'Ya, Perbarui',
      onConfirm: async () => {
        setIsSaving(true);
        setMessage({ text: '', type: '' });

        try {
          let avatar = profile?.avatar;

          if (file && file.size > 0) {
            if (profile?.avatar) {
              await deleteImage(profile.avatar, 'owner-images');
            }
            avatar = await uploadImage(file, 'owner-images');
          }

          const { error } = await supabase.from('profiles').update({ name, avatar }).eq('id', profile.id);

          if (error) throw error;

          setMessage({ text: 'Profil berhasil diperbarui. Refresh halaman untuk melihat perubahan pada topbar.', type: 'success' });
        } catch (error) {
          setMessage({ text: error.message, type: 'error' });
        } finally {
          setIsSaving(false);
        }
      }
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newPassword = formData.get('new_password');
    const confirmPassword = formData.get('confirm_password');
    const formTarget = e.target;

    if (newPassword !== confirmPassword) {
      setMessage({ text: 'Konfirmasi password tidak cocok.', type: 'error' });
      return;
    }

    requestConfirm({
      title: 'Ubah Kata Sandi',
      message: 'Apakah Anda yakin ingin mengubah kata sandi Anda?',
      confirmText: 'Ya, Ubah Kata Sandi',
      onConfirm: async () => {
        setIsPassSaving(true);
        setMessage({ text: '', type: '' });

        try {
          const { error } = await supabase.auth.updateUser({ password: newPassword });

          if (error) throw error;

          setMessage({ text: 'Password berhasil diperbarui.', type: 'success' });
          formTarget.reset();
        } catch (error) {
          setMessage({ text: error.message, type: 'error' });
        } finally {
          setIsPassSaving(false);
        }
      }
    });
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-text">Profil Admin</h1>
        <p className="text-sm font-body text-text-muted">Kelola informasi profil dan kata sandi Anda.</p>
      </div>

      {message.text && (
        <div className={`mb-6 px-4 py-3 rounded-sm text-sm font-semibold border ${message.type === 'success' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'
          }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Update Profile Form */}
        <div className="bg-background border border-border rounded-md p-6">
          <h2 className="text-lg font-display font-bold text-text mb-4">Informasi Dasar</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center overflow-hidden">
                {profile?.avatar ? (
                  <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-text-muted" />
                )}
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-text mb-1">Ganti Avatar</label>
                <input name="avatar" type="file" accept="image/jpeg, image/png, image/webp" className="w-full text-xs text-text-muted outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">Nama Lengkap</label>
              <input required defaultValue={profile?.name} name="name" type="text" className="w-full px-3 py-2 border border-border rounded-sm text-xs outline-none" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">Email (Hanya Baca)</label>
              <input disabled defaultValue={user?.email} type="email" className="w-full px-3 py-2 border border-border rounded-sm text-xs bg-surface text-text-muted outline-none cursor-not-allowed" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">Role (Hanya Baca)</label>
              <input disabled defaultValue={profile?.role?.replace('_', ' ')} type="text" className="w-full px-3 py-2 border border-border rounded-sm text-xs bg-surface text-text-muted outline-none capitalize cursor-not-allowed" />
            </div>

            <button type="submit" disabled={isSaving} className="w-full py-2 mt-2 text-xs font-semibold text-on-primary bg-primary rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50">
              {isSaving ? 'Menyimpan...' : 'Simpan Profil'}
            </button>
          </form>
        </div>

        {/* Update Password Form */}
        <div className="bg-background border border-border rounded-md p-6">
          <h2 className="text-lg font-display font-bold text-text mb-4">Ubah Kata Sandi</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text mb-1">Kata Sandi Baru</label>
              <input required name="new_password" type="password" minLength={6} className="w-full px-3 py-2 border border-border rounded-sm text-xs  outline-none" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1">Konfirmasi Kata Sandi Baru</label>
              <input required name="confirm_password" type="password" minLength={6} className="w-full px-3 py-2 border border-border rounded-sm text-xs  outline-none" />
            </div>

            <button type="submit" disabled={isPassSaving} className="w-full py-2 mt-2 text-xs font-semibold text-text bg-surface border border-border rounded-sm hover:bg-gray-200 transition-colors disabled:opacity-50">
              {isPassSaving ? 'Menyimpan...' : 'Perbarui Kata Sandi'}
            </button>
          </form>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        isDestructive={confirmModal.isDestructive}
      />
    </div>
  );
}
