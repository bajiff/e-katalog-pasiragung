import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, X } from 'lucide-react';

export function ImageUpload({ 
  name, 
  defaultValue, 
  maxSizeMB = 2, 
  label = "Pilih atau Tarik Gambar",
  helperText,
  variant = "default" // "default" or "avatar"
}) {
  const [preview, setPreview] = useState(defaultValue || null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setPreview(defaultValue || null);
  }, [defaultValue]);

  const handleFile = (file) => {
    setError('');
    
    if (!file) {
      setPreview(defaultValue || null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Hanya format gambar yang diperbolehkan (JPG, PNG, WEBP).');
      if (inputRef.current) inputRef.current.value = '';
      setPreview(defaultValue || null);
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Ukuran file terlalu besar. Maksimal ${maxSizeMB} MB.`);
      if (inputRef.current) inputRef.current.value = '';
      setPreview(defaultValue || null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (inputRef.current) {
        // DataTransfer object to assign files to the hidden input
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        inputRef.current.files = dataTransfer.files;
      }
      handleFile(file);
    }
  };

  const clearImage = () => {
    setPreview(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <div 
        className={`relative border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
          isDragging ? 'border-primary bg-primary/5' : 
          error ? 'border-red-400 bg-red-50' : 
          'border-border hover:border-primary/50 hover:bg-surface'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input 
          ref={inputRef}
          type="file" 
          name={name}
          accept="image/jpeg, image/png, image/webp"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        
        {preview ? (
          <div className={`relative group mx-auto ${variant === 'avatar' ? 'w-24 h-24 rounded-full' : 'w-32 h-32 rounded-md'}`} onClick={(e) => e.stopPropagation()}>
            <img src={preview} alt="Preview" className={`w-full h-full object-cover border border-border shadow-sm ${variant === 'avatar' ? 'rounded-full' : 'rounded-md'}`} />
            <div className={`absolute inset-0 bg-text/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${variant === 'avatar' ? 'rounded-full' : 'rounded-md'}`}>
              <button 
                type="button"
                onClick={clearImage}
                className="p-1 bg-background text-red-600 rounded-full hover:scale-110 transition-transform"
                title="Hapus gambar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-text">{label}</p>
            <p className="text-xs text-text-muted">
              {helperText || `Maksimal ukuran file ${maxSizeMB} MB. Format JPG, PNG, WEBP.`}
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-2 text-xs font-semibold text-red-600 flex items-center gap-1">
          <X className="w-3 h-3" /> {error}
        </div>
      )}
    </div>
  );
}
