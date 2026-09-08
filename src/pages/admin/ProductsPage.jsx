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
  { value: 'highest', label: 'Harga Tertinggi' },
  { value: 'lowest', label: 'Harga Terendah' },
  { value: 'name_asc', label: 'Nama A-Z' },
  { value: 'name_desc', label: 'Nama Z-A' },
];

export function ProductsPage() {
  const {
    search, setSearch, sort, setSort, page, setPage, pageSize, setPageSize,
    selectedIds, setSelectedIds, fetchData
  } = useTableQuery('products', {
    defaultSort: 'newest',
    searchColumn: 'name',
    selectQuery: '*, categories(name), owners(name)'
  });

  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [owners, setOwners] = useState([]);

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

  const loadDropdowns = async () => {
    const { data: cats } = await supabase.from('categories').select('id, name');
    const { data: owns } = await supabase.from('owners').select('id, name');
    setCategories(cats || []);
    setOwners(owns || []);
  };

  useEffect(() => {
    loadData();
  }, [search, sort, page, pageSize, fetchData]);

  useEffect(() => {
    loadDropdowns();
  }, []);

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

  const handleDelete = (id, imagePath) => {
    requestConfirm({
      title: 'Hapus Produk',
      message: 'Apakah Anda yakin ingin menghapus produk ini?',
      confirmText: 'Ya, Hapus',
      isDestructive: true,
      onConfirm: async () => {
        try {
          if (imagePath) {
            await deleteImage(imagePath, 'product-images');
          }
          const { error } = await supabase.from('products').delete().eq('id', id);
          if (error) throw error;
          
          setSelectedIds(selectedIds.filter(i => i !== id));
          loadData();
        } catch (err) {
          console.error("Gagal menghapus produk:", err);
          alert(`Gagal menghapus produk: ${err.message || 'Terjadi kesalahan sistem'}`);
        }
      }
    });
  };

  const handleBulkDelete = () => {
    requestConfirm({
      title: 'Hapus Banyak Produk',
      message: `Yakin menghapus ${selectedIds.length} produk?`,
      confirmText: 'Ya, Hapus Semua',
      isDestructive: true,
      onConfirm: async () => {
        try {
          const itemsToDelete = data.filter(d => selectedIds.includes(d.id) && d.image_path);
          for (const item of itemsToDelete) {
            await deleteImage(item.image_path, 'product-images');
          }
          const { error } = await supabase.from('products').delete().in('id', selectedIds);
          if (error) throw error;

          setSelectedIds([]);
          loadData();
        } catch (err) {
          console.error("Gagal menghapus banyak produk:", err);
          alert(`Gagal menghapus produk: ${err.message || 'Terjadi kesalahan sistem'}`);
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
    const category_id = formData.get('category_id');
    const owner_id = formData.get('owner_id');
    const price = formData.get('price');
    const stock = formData.get('stock');
    const description = formData.get('description');
    const file = formData.get('image');

    requestConfirm({
      title: editItem ? 'Konfirmasi Update' : 'Konfirmasi Tambah',
      message: editItem ? 'Apakah Anda yakin ingin mengupdate data produk ini?' : 'Apakah Anda yakin ingin menambahkan produk ini?',
      confirmText: editItem ? 'Ya, Update' : 'Ya, Tambahkan',
      onConfirm: async () => {
        try {
          setIsSaving(true);
          let image_path = editItem?.image_path;

          if (file && file.size > 0) {
            if (editItem?.image_path) {
              await deleteImage(editItem.image_path, 'product-images');
            }
            image_path = await uploadImage(file, 'product-images');
          }

          const payload = {
            name,
            category_id: category_id || null,
            owner_id: owner_id || null,
            price: Number(price),
            stock: Number(stock),
            description,
            image_path
          };

          if (!editItem) {
            payload.production_system = 'ready_stock';
            payload.capacity = 1;
            payload.unit = 'pcs';
          }

          let resError = null;

          if (editItem) {
            const { error } = await supabase.from('products').update(payload).eq('id', editItem.id);
            resError = error;
          } else {
            const { error } = await supabase.from('products').insert([payload]);
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
    'Gambar',
    'Nama Produk',
    'Kategori',
    'Owner',
    'Harga',
    'Stok',
    'Aksi'
  ];

  const renderRow = (item, idx) => (
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
        {item.image_path ? (
          <img src={item.image_path} alt={item.name} className="w-10 h-10 object-cover rounded-sm border border-border" />
        ) : (
          <div className="w-10 h-10 bg-surface rounded-sm border border-border flex items-center justify-center text-xs text-text-muted">No Img</div>
        )}
      </td>
      <td className="px-3 py-2 text-xs font-semibold text-text">{item.name}</td>
      <td className="px-3 py-2 text-xs text-text-muted">{item.categories?.name || '-'}</td>
      <td className="px-3 py-2 text-xs text-text-muted">{item.owners?.name || '-'}</td>
      <td className="px-3 py-2 text-xs font-semibold text-text">Rp {item.price?.toLocaleString('id-ID')}</td>
      <td className="px-3 py-2 text-xs text-text-muted">{item.stock}</td>
      <td className="px-3 py-2">
        <div className="flex items-center gap-2">
          <button onClick={() => openModal(item)} className="p-1.5 text-primary hover:bg-primary/10 rounded-sm transition-colors">
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => handleDelete(item.id, item.image_path)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-sm transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-text">Manajemen Produk</h1>
          <p className="text-sm font-body text-text-muted">Daftar dan kelola produk UMKM.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-sm text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Tambah Produk
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
              <h2 className="text-lg font-display font-bold text-text">{editItem ? 'Edit Produk' : 'Tambah Produk'}</h2>
              <button onClick={closeModal} className="text-text-muted hover:text-text">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text mb-1">Nama Produk</label>
                <input required defaultValue={editItem?.name} name="name" type="text" className="w-full px-3 py-2 border border-border rounded-sm text-xs  outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text mb-1">Kategori</label>
                  <select name="category_id" defaultValue={editItem?.category_id || ''} className="w-full px-3 py-2 border border-border rounded-sm text-xs  outline-none">
                    <option value="">Pilih Kategori</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text mb-1">Owner</label>
                  <select name="owner_id" defaultValue={editItem?.owner_id || ''} className="w-full px-3 py-2 border border-border rounded-sm text-xs  outline-none">
                    <option value="">Pilih Owner</option>
                    {owners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text mb-1">Harga (Rp)</label>
                  <input required defaultValue={editItem?.price} name="price" type="number" min="0" className="w-full px-3 py-2 border border-border rounded-sm text-xs  outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text mb-1">Stok</label>
                  <input required defaultValue={editItem?.stock} name="stock" type="number" min="0" className="w-full px-3 py-2 border border-border rounded-sm text-xs  outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text mb-1">Deskripsi</label>
                <textarea name="description" defaultValue={editItem?.description} rows="3" className="w-full px-3 py-2 border border-border rounded-sm text-xs  outline-none"></textarea>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text mb-1">Gambar Produk {editItem?.image_path && '(Kosongkan jika tidak diubah)'}</label>
                <input name="image" type="file" accept="image/jpeg, image/png, image/webp" className="w-full px-3 py-2 border border-border rounded-sm text-xs text-text-muted  outline-none" />
                {editItem?.image_path && (
                  <div className="mt-2">
                    <img src={editItem.image_path} alt="Preview" className="h-16 w-16 object-cover rounded-sm border border-border" />
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
