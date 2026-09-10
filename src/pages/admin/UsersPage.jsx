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
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';
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
        const { error } = await supabase.from('profiles').update({ status }).eq('id', id);
        if (error) {
          console.error("Gagal mengubah status:", error);
          alert(`Gagal mengubah status user: ${error.message || 'Terjadi kesalahan sistem'}`);
          return;
        }
        loadData();
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
            <div className="flex items-center gap-2">
              {item.status !== 'approved' && (
                <button
                  onClick={() => updateStatus(item.id, 'approved')}
                  title="Approve"
                  className="p-1.5 text-green-600 hover:bg-green-50 rounded-sm transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                </button>
              )}
              {item.status !== 'rejected' && (
                <button
                  onClick={() => updateStatus(item.id, 'rejected')}
                  title="Reject"
                  className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-sm transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => handleDelete(item)}
                title="Hapus User"
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-sm transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
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
