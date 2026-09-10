import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useTableQuery } from '../../hooks/useTableQuery';
import {
  DataTable,
  TableToolbar,
  Pagination,
  SelectAllCheckbox,
  BulkActionBar
} from '../../components/table';
import { ConfirmModal, TagsInput, ImageUpload, ExportMenu } from '../../components/shared';
import { Edit, Trash2, Plus, X } from 'lucide-react';
import { uploadImage, deleteImage } from '../../lib/storage';
import { exportToExcel, exportToCSV, exportToPDF } from '../../utils/exportUtils';

const sortOptions = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'oldest', label: 'Terlama' },
  { value: 'highest', label: 'Harga Tertinggi' },
  { value: 'lowest', label: 'Harga Terendah' },
  { value: 'name_asc', label: 'Nama A-Z' },
  { value: 'name_desc', label: 'Nama Z-A' },
];

export function ProductsPage() {
  const { user } = useAuth();
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
  const [exporting, setExporting] = useState(false);

  const [categories, setCategories] = useState([]);
  const [owners, setOwners] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false });

  // State for real-time validation feedback
  const [nibLength, setNibLength] = useState(0);
  const [halalLength, setHalalLength] = useState(0);
  const [nameLength, setNameLength] = useState(0);
  const [descLength, setDescLength] = useState(0);

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

  const exportColumns = [
    { header: 'ID', accessor: (row) => row.id },
    { header: 'Nama Produk', accessor: (row) => row.name },
    { header: 'Kategori', accessor: (row) => row.categories?.name || '-' },
    { header: 'Owner', accessor: (row) => row.owners?.name || '-' },
    { header: 'Harga (Rp)', accessor: (row) => row.price },
    { header: 'Stok', accessor: (row) => row.stock },
  ];

  const handleExport = async (type) => {
    try {
      setExporting(true);
      const { data, error } = await fetchData({ exportMode: true });
      if (error) throw error;

      const filename = `Data_Produk_${new Date().toISOString().split('T')[0]}`;
      if (type === 'excel') exportToExcel(data, exportColumns, filename);
      else if (type === 'csv') exportToCSV(data, exportColumns, filename);
      else if (type === 'pdf') exportToPDF(data, exportColumns, filename, 'Laporan Data Produk');
    } catch (err) {
      console.error(err);
      alert('Gagal mengekspor data.');
    } finally {
      setExporting(false);
    }
  };

  const openModal = (item = null) => {
    setEditItem(item);
    setNibLength(item?.nib?.length || 0);
    setHalalLength(item?.halal_certificate?.length || 0);
    setNameLength(item?.name?.length || 0);
    setDescLength(item?.description?.length || 0);
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
    // New fields processing
    let nib = formData.get('nib') || null;
    if (nib && nib.length !== 13) {
      requestConfirm({
        title: 'Validasi Gagal',
        message: 'NIB harus terdiri dari tepat 13 digit angka.',
        confirmText: 'Mengerti',
        hideCancel: true,
        onConfirm: () => {}
      });
      return;
    }

    let halal_certificate = formData.get('halal_certificate') || null;
    if (halal_certificate && halal_certificate.length !== 17) {
      requestConfirm({
        title: 'Validasi Gagal',
        message: 'Sertifikat Halal harus terdiri dari tepat 17 digit angka.',
        confirmText: 'Mengerti',
        hideCancel: true,
        onConfirm: () => {}
      });
      return;
    }

    let flavor_variants = null;
    try {
      const parsed = JSON.parse(formData.get('flavor_variants') || '[]');
      if (Array.isArray(parsed) && parsed.length > 0) flavor_variants = parsed;
    } catch (e) { }

    let compositions = null;
    try {
      const parsed = JSON.parse(formData.get('compositions') || '[]');
      if (Array.isArray(parsed) && parsed.length > 0) compositions = parsed;
    } catch (e) { }

    const capacity = formData.get('capacity');
    const unit = formData.get('unit');

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
            price: Number(price.replace(/\D/g, '')),
            stock: Number(stock),
            description,
            // contact_phone TIDAK dikirim ke products karena kolom tidak ada
            nib,
            halal_certificate,
            flavor_variants,
            compositions,
            capacity: capacity ? parseInt(capacity, 10) : null,
            unit: unit || null,
            image_path
          };

          let resError = null;

          if (editItem) {
            const { error } = await supabase.from('products').update(payload).eq('id', editItem.id);
            resError = error;
          } else {
            payload.created_by = user?.id; // Append created_by specifically for new inserts
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
      <td className="px-2 py-1.5">
        <input
          type="checkbox"
          checked={selectedIds.includes(item.id)}
          onChange={() => handleSelectOne(item.id)}
          className="w-3.5 h-3.5 accent-primary cursor-pointer"
        />
      </td>
      <td className="px-2 py-1.5 text-xs text-text-muted">{(page - 1) * (pageSize === 'all' ? totalItems : pageSize) + idx + 1}</td>
      <td className="px-2 py-1.5">
        {item.image_path ? (
          <img src={item.image_path} alt={item.name} className="w-10 h-10 object-cover rounded-sm border border-border" />
        ) : (
          <div className="w-10 h-10 bg-surface rounded-sm border border-border flex items-center justify-center text-xs text-text-muted">No Img</div>
        )}
      </td>
      <td className="px-2 py-1.5 text-xs font-semibold text-text max-w-50 truncate">{item.name}</td>
      <td className="px-2 py-1.5 text-xs text-text-muted max-w-37.5 truncate">{item.categories?.name || '-'}</td>
      <td className="px-2 py-1.5 text-xs text-text-muted max-w-37.5 truncate">{item.owners?.name || '-'}</td>
      <td className="px-2 py-1.5 text-xs font-semibold text-text">Rp {item.price?.toLocaleString('id-ID')}</td>
      <td className="px-2 py-1.5 text-xs text-text-muted">{item.stock}</td>
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-text">Manajemen Produk</h1>
          <p className="text-sm font-body text-text-muted">Daftar dan kelola produk UMKM.</p>
        </div>
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">
          <ExportMenu onExport={handleExport} loading={exporting} />
          <button
            onClick={() => openModal()}
            className="flex items-center justify-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-sm text-xs font-semibold hover:opacity-90 transition-opacity w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Tambah Produk
          </button>
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
                <input
                  required
                  defaultValue={editItem?.name}
                  name="name"
                  type="text"
                  maxLength={255}
                  onChange={(e) => setNameLength(e.target.value.length)}
                  className="w-full px-3 py-2 border  rounded-sm text-xs outline-none focus:border-primary transition-colors"
                />
                <div className="flex justify-end mt-1">
                  <span className={`text-[10px] font-medium ${nameLength >= 255 ? 'text-red-500' : 'text-text-muted'}`}>{nameLength} / 255</span>
                </div>
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
                  <input
                    required
                    defaultValue={editItem?.price?.toLocaleString('id-ID') || ''}
                    name="price"
                    type="text"
                    inputMode="numeric"
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      e.target.value = val ? parseInt(val, 10).toLocaleString('id-ID') : '';
                    }}
                    className="w-full px-3 py-2 border rounded-sm text-xs outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text mb-1">Stok</label>
                  <input required defaultValue={editItem?.stock} name="stock" type="number" min="0" className="w-full px-3 py-2 border border-border rounded-sm text-xs  outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text mb-1">Kapasitas</label>
                  <input required defaultValue={editItem?.capacity} name="capacity" type="number" min="1" className="w-full px-3 py-2 border border-border rounded-sm text-xs outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text mb-1">Satuan</label>
                  <select name="unit" defaultValue={editItem?.unit || 'pcs'} className="w-full px-3 py-2 border border-border rounded-sm text-xs outline-none">
                    <option value="pcs">pcs</option>
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="buah">buah</option>
                    <option value="butir">butir</option>
                    <option value="ml">ml</option>
                    <option value="liter">liter</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text mb-1">Varian Rasa</label>
                <TagsInput name="flavor_variants" defaultValue={editItem?.flavor_variants} placeholder="Ketik varian rasa lalu tekan Enter" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text mb-1">Komposisi</label>
                <TagsInput name="compositions" defaultValue={editItem?.compositions} placeholder="Ketik bahan/komposisi lalu tekan Enter" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text mb-1">NIB (Opsional)</label>
                  <input
                    defaultValue={editItem?.nib}
                    name="nib"
                    type="text"
                    inputMode="numeric"
                    maxLength={13}
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/\D/g, '');
                      setNibLength(e.target.value.length);
                    }}
                    placeholder="13 Digit Angka"
                    className="w-full px-3 py-2 border  rounded-sm text-xs outline-none focus:border-primary transition-colors"
                  />
                  <div className="text-[10px] mt-1 min-h-3.5 font-medium">
                    {nibLength > 0 && nibLength < 13 && <span className="text-red-500">Belum 13 digit</span>}
                    {nibLength === 13 && <span className="text-green-500">✓ NIB sudah valid</span>}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text mb-1">Sertifikat Halal (Opsional)</label>
                  <input
                    defaultValue={editItem?.halal_certificate}
                    name="halal_certificate"
                    type="text"
                    inputMode="numeric"
                    maxLength={17}
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/\D/g, '');
                      setHalalLength(e.target.value.length);
                    }}
                    placeholder="17 Digit Angka"
                    className="w-full px-3 py-2 border  rounded-sm text-xs outline-none focus:border-primary transition-colors"
                  />
                  <div className="text-[10px] mt-1 min-h-3.5 font-medium">
                    {halalLength > 0 && halalLength < 17 && <span className="text-red-500">Belum 17 digit</span>}
                    {halalLength === 17 && <span className="text-green-500">✓ Sertifikat Halal sudah valid</span>}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text mb-1">Deskripsi</label>
                <textarea
                  name="description"
                  defaultValue={editItem?.description}
                  rows="3"
                  maxLength={3000}
                  onChange={(e) => setDescLength(e.target.value.length)}
                  className="w-full px-3 py-2 border  rounded-sm text-xs outline-none focus:border-primary transition-colors"
                ></textarea>
                <div className="flex justify-end mt-1">
                  <span className={`text-[10px] font-medium ${descLength >= 3000 ? 'text-red-500' : 'text-text-muted'}`}>{descLength} / 3000</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text mb-2">Gambar Produk</label>
                <ImageUpload
                  name="image"
                  defaultValue={editItem?.image_path}
                  label="Tarik atau Pilih Gambar Produk"
                  helperText="Maksimal 2 MB (JPG, PNG, WEBP)"
                />
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
