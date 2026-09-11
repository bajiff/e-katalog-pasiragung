import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useTableQuery } from '../../hooks/useTableQuery';
import {
  DataTable,
  TableToolbar,
  Pagination,
  SelectAllCheckbox,
  BulkActionBar
} from '../../components/table';
import { ConfirmModal, ExportMenu } from '../../components/shared';
import { CheckCircle, XCircle, Trash2, MoreVertical, Edit, Key, X } from 'lucide-react';
import { exportToExcel, exportToCSV, exportToPDF } from '../../utils/exportUtils';

const sortOptions = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'oldest', label: 'Terlama' },
  { value: 'name_asc', label: 'Nama A-Z' },
  { value: 'name_desc', label: 'Nama Z-A' },
  { value: 'number', label: 'Nomor Urut' },
];

export function UsersPage() {
  const {
    search, setSearch, sort, setSort, page, setPage, pageSize, setPageSize,
    selectedIds, setSelectedIds, statusFilter, setStatusFilter, fetchData
  } = useTableQuery('profiles', {
    defaultSort: 'newest',
    searchColumn: 'name'
  });

  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false });
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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

  const openModal = (item) => {
    setEditItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditItem(null);
    setIsModalOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');

    requestConfirm({
      title: 'Konfirmasi Edit User',
      message: 'Apakah Anda yakin ingin menyimpan perubahan nama user ini?',
      confirmText: 'Ya, Simpan',
      onConfirm: async () => {
        try {
          setIsSaving(true);
          const { error } = await supabase.from('profiles').update({ name }).eq('id', editItem.id);
          if (error) throw error;

          closeModal();
          loadData();
        } catch (err) {
          console.error("Gagal update user:", err);
          alert(`Gagal menyimpan data: ${err.message || 'Terjadi kesalahan sistem'}`);
        } finally {
          setIsSaving(false);
        }
      }
    });
  };

  const handleResetPassword = (item) => {
    requestConfirm({
      title: 'Konfirmasi Reset Password',
      message: `Apakah Anda yakin ingin mereset password akun ${item.email}? Sistem akan mengirimkan email pemulihan password ke alamat tersebut.`,
      confirmText: 'Ya, Reset Password',
      onConfirm: async () => {
        try {
          // 1. Send password reset email
          const { error: resetError } = await supabase.auth.resetPasswordForEmail(item.email, {
            redirectTo: `${window.location.origin}/admin/change-password`,
          });
          if (resetError) throw resetError;

          // 2. Set must_change_password to true in public.profiles
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ must_change_password: true })
            .eq('id', item.id);
          if (updateError) throw updateError;

          alert(`Email reset password berhasil dikirim ke ${item.email}`);
          loadData();
        } catch (err) {
          console.error("Gagal reset password:", err);
          alert(`Gagal mereset password: ${err.message || 'Terjadi kesalahan sistem'}`);
        }
      }
    });
  };

  const loadData = async () => {
    setLoading(true);
    const { data: result, count } = await fetchData();
    setData(result || []);
    setTotalItems(count || 0);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [search, sort, page, pageSize, statusFilter, fetchData]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(data.filter(d => d.role !== 'super_admin').map(item => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDelete = (item) => {
    if (item.role === 'super_admin') {
      alert('Tidak dapat menghapus super_admin.');
      return;
    }

    requestConfirm({
      title: 'Hapus User',
      message: 'Apakah Anda yakin ingin menghapus user ini?',
      confirmText: 'Ya, Hapus',
      isDestructive: true,
      onConfirm: async () => {
        const { error } = await supabase.from('profiles').delete().eq('id', item.id);
        if (error) {
          console.error("Gagal menghapus user:", error);
          alert(`Gagal menghapus user: ${error.message || 'Terjadi kesalahan sistem'}`);
          return;
        }
        setSelectedIds(selectedIds.filter(i => i !== item.id));
        loadData();
      }
    });
  };

  const handleBulkDelete = () => {
    const itemsToDelete = data.filter(d => selectedIds.includes(d.id));
    const invalidItems = itemsToDelete.filter(d => d.role === 'super_admin');

    if (invalidItems.length > 0) {
      alert('Terdapat super_admin yang tidak bisa dihapus.');
      return;
    }

    requestConfirm({
      title: 'Hapus Banyak User',
      message: `Yakin menghapus ${selectedIds.length} user?`,
      confirmText: 'Ya, Hapus Semua',
      isDestructive: true,
      onConfirm: async () => {
        try {
          const { error } = await supabase.from('profiles').delete().in('id', selectedIds);
          if (error) throw error;
          setSelectedIds([]);
          loadData();
        } catch (err) {
          console.error("Gagal menghapus banyak pengguna:", err);
          alert(`Gagal menghapus pengguna: ${err.message || 'Terjadi kesalahan sistem'}`);
        }
      }
    });
  };

  const exportColumns = [
    { header: 'ID', accessor: (row) => row.id },
    { header: 'Nama', accessor: (row) => row.name },
    { header: 'Email', accessor: (row) => row.email || '-' },
    { header: 'Role', accessor: (row) => row.role?.replace('_', ' ') },
    { header: 'Status', accessor: (row) => row.status },
  ];

  const handleExport = async (type) => {
    try {
      setExporting(true);
      const { data, error } = await fetchData({ exportMode: true });
      if (error) throw error;

      const filename = `Data_Pengguna_${new Date().toISOString().split('T')[0]}`;
      if (type === 'excel') exportToExcel(data, exportColumns, filename);
      else if (type === 'csv') exportToCSV(data, exportColumns, filename);
      else if (type === 'pdf') exportToPDF(data, exportColumns, filename, 'Laporan Data Pengguna');
    } catch (err) {
      console.error(err);
      alert('Gagal mengekspor data.');
    } finally {
      setExporting(false);
    }
  };

  const updateStatus = (id, status) => {
    const isApprove = status === 'approved';
    requestConfirm({
      title: isApprove ? 'Setujui User' : 'Tolak User',
      message: `Apakah Anda yakin ingin ${isApprove ? 'menyetujui' : 'menolak'} user ini?`,
      confirmText: isApprove ? 'Ya, Setujui' : 'Ya, Tolak',
      isDestructive: !isApprove,
      onConfirm: async () => {
        try {
          const { data, error } = await supabase.functions.invoke('manage-user', {
            body: { targetUserId: id, action: status === 'approved' ? 'approve' : 'reject' }
          });

          if (error) throw error;
          if (data?.error) throw new Error(data.error);

          loadData();
        } catch (err) {
          console.error("Gagal mengubah status:", err);
          alert(`Gagal mengubah status user: ${err.message || 'Terjadi kesalahan sistem'}`);
        }
      }
    });
  };

  const isAllSelected = data.length > 0 && selectedIds.length === data.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < data.length;

  const columns = [
    <SelectAllCheckbox
      isAllSelected={isAllSelected}
      isIndeterminate={isIndeterminate}
      onChange={handleSelectAll}
    />,
    'No',
    'Nama',
    'Email',
    'Role',
    'Status',
    'Aksi'
  ];

  const renderRow = (item, idx) => {
    const isSuperAdmin = item.role === 'super_admin';

    return (
      <tr key={item.id} className="hover:bg-surface/50 transition-colors">
        <td className="px-2 py-1.5">
          <input
            type="checkbox"
            checked={selectedIds.includes(item.id)}
            onChange={() => handleSelectOne(item.id)}
            disabled={isSuperAdmin}
            className="w-3.5 h-3.5 accent-primary cursor-pointer disabled:opacity-50"
          />
        </td>
        <td className="px-2 py-1.5 text-xs text-text-muted">{(page - 1) * (pageSize === 'all' ? totalItems : pageSize) + idx + 1}</td>
        <td className="px-2 py-1.5 text-xs font-semibold text-text max-w-50 truncate">{item.name}</td>
        <td className="px-2 py-1.5 text-xs text-text-muted max-w-50 truncate">{item.email || '-'}</td>
        <td className="px-2 py-1.5 text-xs capitalize text-text-muted">{item.role?.replace('_', ' ')}</td>
        <td className="px-2 py-1.5 text-xs">
          <span className={`px-2 py-1 rounded-sm font-semibold ${item.status === 'approved' ? 'bg-green-100 text-green-700' :
            item.status === 'rejected' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
            {item.status}
          </span>
        </td>
        <td className="px-2 py-1.5">
          {!isSuperAdmin && (
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === item.id ? null : item.id); }}
                className="p-1.5 text-text-muted hover:bg-surface rounded-sm transition-colors flex items-center gap-1 text-xs font-semibold"
              >
                Aksi <MoreVertical className="w-3.5 h-3.5" />
              </button>

              {openDropdownId === item.id && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-background border border-border rounded-sm shadow-md z-50 py-1" onClick={e => e.stopPropagation()}>
                  <button onClick={() => { setOpenDropdownId(null); openModal(item); }} className="w-full text-left px-3 py-1.5 text-xs text-text hover:bg-surface flex items-center gap-2">
                    <Edit className="w-3.5 h-3.5 text-blue-600" /> Edit
                  </button>
                  {item.status !== 'approved' && (
                    <button onClick={() => { setOpenDropdownId(null); updateStatus(item.id, 'approved'); }} className="w-full text-left px-3 py-1.5 text-xs text-text hover:bg-surface flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-green-600" /> Approve
                    </button>
                  )}
                  {item.status !== 'rejected' && (
                    <button onClick={() => { setOpenDropdownId(null); updateStatus(item.id, 'rejected'); }} className="w-full text-left px-3 py-1.5 text-xs text-text hover:bg-surface flex items-center gap-2">
                      <XCircle className="w-3.5 h-3.5 text-orange-600" /> Reject
                    </button>
                  )}
                  <button onClick={() => { setOpenDropdownId(null); handleResetPassword(item); }} className="w-full text-left px-3 py-1.5 text-xs text-text hover:bg-surface flex items-center gap-2">
                    <Key className="w-3.5 h-3.5 text-purple-600" /> Reset Password
                  </button>
                  <div className="h-px bg-border my-1"></div>
                  <button onClick={() => { setOpenDropdownId(null); handleDelete(item); }} className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2">
                    <Trash2 className="w-3.5 h-3.5" /> Hapus User
                  </button>
                </div>
              )}
            </div>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-text">Manajemen Pengguna</h1>
          <p className="text-sm font-body text-text-muted">Persetujuan admin baru oleh Super Admin.</p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">
          <ExportMenu onExport={handleExport} loading={exporting} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-border rounded-sm px-3 py-2 text-xs bg-background outline-none min-w-37.5 w-full sm:w-auto"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-background border border-border rounded-md p-4">
        <TableToolbar
          search={search} setSearch={setSearch}
          sort={sort} setSort={setSort} sortOptions={sortOptions}
          pageSize={pageSize} setPageSize={setPageSize}
        />

        <BulkActionBar selectedCount={selectedIds.length} onDelete={handleBulkDelete} />

        <DataTable columns={columns} data={data} renderRow={renderRow} loading={loading} />

        <Pagination page={page} setPage={setPage} totalItems={totalItems} pageSize={pageSize} />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-text/50 p-4">
          <div className="bg-background rounded-md w-full max-w-md shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-display font-bold text-text">Edit Pengguna</h2>
              <button onClick={closeModal} className="text-text-muted hover:text-text">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text mb-1">Nama Lengkap</label>
                <input required defaultValue={editItem?.name} name="name" type="text" className="w-full px-3 py-2 border rounded-sm text-xs outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text mb-1">Email (Hanya Baca)</label>
                <input disabled defaultValue={editItem?.email} type="email" className="w-full px-3 py-2 border border-border rounded-sm text-xs bg-surface text-text-muted outline-none cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text mb-1">Role (Hanya Baca)</label>
                <input disabled defaultValue={editItem?.role?.replace('_', ' ')} type="text" className="w-full px-3 py-2 border border-border rounded-sm text-xs bg-surface text-text-muted outline-none capitalize cursor-not-allowed" />
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-xs font-semibold text-text bg-surface border border-border rounded-sm hover:bg-gray-200 transition-colors">Batal</button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 text-xs font-semibold text-on-primary bg-primary rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                  {isSaving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
