import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Package, Grid, Users, UserCog, User, LogOut, Menu, X } from 'lucide-react';
import { ConfirmModal } from '../shared';
import logo from '../../assets/logo.svg';

export function AdminLayout() {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);

  const handleLogout = async () => {
    setIsLogoutModalOpen(false);
    await signOut();
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Produk', icon: Package },
    { path: '/admin/categories', label: 'Kategori', icon: Grid },
    { path: '/admin/owners', label: 'Pemilik Usaha', icon: Users },
  ];

  if (profile?.role === 'super_admin') {
    menuItems.push({ path: '/admin/users', label: 'Manajemen Pengguna', icon: UserCog });
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-surface">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-background border-r border-border">
        <div className="p-4 border-b border-border flex items-center justify-center">
          <img src={logo} alt="Logo Pasiragung" className="h-12 w-auto max-w-full" />
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-body transition-colors ${isActive ? 'bg-primary text-on-primary' : 'text-text hover:bg-surface'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <Link
            to="/admin/profile"
            className={`flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-body transition-colors mb-2 ${location.pathname === '/admin/profile' ? 'bg-primary text-on-primary' : 'text-text hover:bg-surface'
              }`}
          >
            <User className="w-4 h-4" />
            Profil
          </Link>
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center w-full gap-3 px-3 py-2 rounded-sm text-sm font-body text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-text/50 md:hidden" onClick={toggleSidebar}>
          <aside
            className="flex flex-col w-64 h-full bg-background border-r border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <img src={logo} alt="Logo Pasiragung" className="h-10 w-auto" />
              <button onClick={toggleSidebar} className="text-text-muted hover:text-text">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={toggleSidebar}
                    className={`flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-body transition-colors ${isActive ? 'bg-primary text-on-primary' : 'text-text hover:bg-surface'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-border">
              <Link
                to="/admin/profile"
                onClick={toggleSidebar}
                className={`flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-body transition-colors mb-2 ${location.pathname === '/admin/profile' ? 'bg-primary text-on-primary' : 'text-text hover:bg-surface'
                  }`}
              >
                <User className="w-4 h-4" />
                Profil
              </Link>
              <button
                onClick={() => {
                  toggleSidebar();
                  setIsLogoutModalOpen(true);
                }}
                className="flex items-center w-full gap-3 px-3 py-2 rounded-sm text-sm font-body text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between px-4 py-3 bg-background border-b border-border shadow-sm z-10">
          <div className="flex items-center gap-3">
            <button onClick={toggleSidebar} className="md:hidden text-text-muted hover:text-text">
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-body font-semibold hidden sm:block truncate">
              {menuItems.find(i => location.pathname === i.path || (i.path !== '/admin/dashboard' && location.pathname.startsWith(i.path)))?.label || (location.pathname === '/admin/profile' ? 'Profil' : 'Dashboard')}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-body font-semibold text-text">{profile?.name || 'User'}</p>
              <p className="text-xs font-body text-text-muted capitalize">{profile?.role?.replace('_', ' ')}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center overflow-hidden">
              {profile?.avatar ? (
                <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-text-muted" />
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-surface">
          <Outlet />
        </div>
      </main>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin keluar dari sesi ini?"
        confirmText="Ya, Logout"
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
        isDestructive={true}
      />
    </div>
  );
}
