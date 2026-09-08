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
import { ConfirmModal } from '../../components/shared';
import { Edit, Trash2, Plus, X } from 'lucide-react';
import { uploadImage, deleteImage } from '../../lib/storage';

const sortOptions = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'oldest', label: 'Terlama' },
  { value: 'name_asc', label: 'Nama A-Z' },
  { value: 'name_desc', label: 'Nama Z-A' },
  { value: 'number', label: 'Nomor Urut' },
];

export function OwnersPage() {
  const {
    search, setSearch, sort, setSort, page, setPage, pageSize, setPageSize,
    selectedIds, setSelectedIds, fetchData
  } = useTableQuery('owners', {
    defaultSort: 'newest',
    searchColumn: 'name',
    selectQuery: '*, products(count)'
  });

  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
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
  }, [search, sort, page, pageSize, fetchData]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(data.map(item => item.id));
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
    const productsCount = item.products?.[0]?.count || 0;
    if (productsCount > 0) {
      alert(`Tidak dapat menghapus owner ini karena masih memiliki ${productsCount} produk terkait.`);
      return;
    }

    requestConfirm({
      title: 'Hapus Owner',
      message: 'Apakah Anda yakin ingin menghapus owner ini?',
      confirmText: 'Ya, Hapus',
      isDestructive: true,
      onConfirm: async () => {
        try {
          if (item.image) {
            await deleteImage(item.image, 'owner-images');
          }
          const { error } = await supabase.from('owners').delete().eq('id', item.id);
          if (error) throw error;
          
          setSelectedIds(selectedIds.filter(i => i !== item.id));
          loadData();
        } catch (err) {
          console.error("Gagal menghapus owner:", err);
          alert(`Gagal menghapus owner: ${err.message || 'Terjadi kesalahan sistem'}`);
        }
      }
    });
  };

  const handleBulkDelete = () => {
    const itemsToDelete = data.filter(d => selectedIds.includes(d.id));
    const invalidItems = itemsToDelete.filter(d => (d.products?.[0]?.count || 0) > 0);

    if (invalidItems.length > 0) {
      alert(`Terdapat ${invalidItems.length} owner yang tidak bisa dihapus karena masih memiliki produk terkait.`);
      return;
    }

    requestConfirm({
      title: 'Hapus Banyak Owner',
      message: `Yakin menghapus ${selectedIds.length} owner?`,
      confirmText: 'Ya, Hapus Semua',
      isDestructive: true,
      onConfirm: async () => {
        try {
          for (const item of itemsToDelete) {
            if (item.image) await deleteImage(item.image, 'owner-images');
          }
          const { error } = await supabase.from('owners').delete().in('id', selectedIds);
          if (error) throw error;
          
          setSelectedIds([]);
          loadData();
        } catch (err) {
          console.error("Gagal menghapus banyak owner:", err);
          alert(`Gagal menghapus owner: ${err.message || 'Terjadi kesalahan sistem'}`);
        }
      }
    });
  };

  const openModal = (item = null) => {
    setEditItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditItem(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const file = formData.get('image');

    requestConfirm({
      title: editItem ? 'Konfirmasi Update' : 'Konfirmasi Tambah',
      message: editItem ? 'Apakah Anda yakin ingin mengupdate data owner ini?' : 'Apakah Anda yakin ingin menambahkan owner ini?',
      confirmText: editItem ? 'Ya, Update' : 'Ya, Tambahkan',
      onConfirm: async () => {
        try {
          setIsSaving(true);
          let image_path = editItem?.image;

          if (file && file.size > 0) {
            if (editItem?.image) {
              await deleteImage(editItem.image, 'owner-images');
            }
            image_path = await uploadImage(file, 'owner-images');
          }

          const payload = { name, image: image_path };
          let resError = null;

          if (editItem) {
            const { error } = await supabase.from('owners').update(payload).eq('id', editItem.id);
            resError = error;
          } else {
            const { error } = await supabase.from('owners').insert([payload]);
            resError = error;
          }

          if (resError) throw resError;

          closeModal();
          loadData();
        } catch (err) {
          console.error("Operasi gagal:", err);
          alert(`Gagal menyimpan data: ${err.message || 'Terjadi kesalahan sistem'}`);
        } finally {
          setIsSaving(false);
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
    'Foto',
    'Nama Pemilik',
    'Jumlah Produk',
    'Aksi'
  ];

  const renderRow = (item, idx) => {
    const productsCount = item.products?.[0]?.count || 0;
    const canDelete = productsCount === 0;

    return (
      <tr key={item.id} className="hover:bg-surface/50 transition-colors">
        <td className="px-3 py-2">
          <input
            type="checkbox"
            checked={selectedIds.includes(item.id)}
            onChange={() => handleSelectOne(item.id)}
            className="w-3.5 h-3.5 accent-primary cursor-pointer"
          />
        </td>
        <td className="px-3 py-2 text-xs text-text-muted">{(page - 1) * (pageSize === 'all' ? totalItems : pageSize) + idx + 1}</td>
        <td className="px-3 py-2">
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-sm border border-border" />
          ) : (
            <div className="w-10 h-10 bg-surface rounded-sm border border-border flex items-center justify-center text-xs text-text-muted">No Img</div>
          )}
        </td>
        <td className="px-3 py-2 text-xs font-semibold text-text">{item.name}</td>
        <td className="px-3 py-2 text-xs text-text-muted">{productsCount}</td>
        <td className="px-3 py-2">
          <div className="flex items-center gap-2">
            <button onClick={() => openModal(item)} className="p-1.5 text-primary hover:bg-primary/10 rounded-sm transition-colors">
              <Edit className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDelete(item)}
              disabled={!canDelete}
              title={!canDelete ? "Owner ini masih memiliki produk" : ""}
              className={`p-1.5 rounded-sm transition-colors ${canDelete ? 'text-red-600 hover:bg-red-50' : 'text-gray-400 cursor-not-allowed'}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-text">Manajemen Pemilik Usaha</h1>
          <p className="text-sm font-body text-text-muted">Daftar pemilik UMKM di Desa Pasiragung.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-sm text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Tambah Owner
        </button>
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
          <div className="bg-background rounded-md w-full max-w-lg shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-display font-bold text-text">{editItem ? 'Edit Owner' : 'Tambah Owner'}</h2>
              <button onClick={closeModal} className="text-text-muted hover:text-text">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text mb-1">Nama Pemilik</label>
                <input required defaultValue={editItem?.name} name="name" type="text" className="w-full px-3 py-2 border border-border rounded-sm text-xs  outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text mb-1">Foto Owner {editItem?.image && '(Kosongkan jika tidak diubah)'}</label>
                <input name="image" type="file" accept="image/jpeg, image/png, image/webp" className="w-full px-3 py-2 border border-border rounded-sm text-xs text-text-muted  outline-none" />
                {editItem?.image && (
                  <div className="mt-2">
                    <img src={editItem.image} alt="Preview" className="h-16 w-16 object-cover rounded-sm border border-border" />
                  </div>
                )}
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-border">
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
