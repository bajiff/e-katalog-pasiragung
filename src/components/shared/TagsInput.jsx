import React, { useState } from 'react';
import { X } from 'lucide-react';

export function TagsInput({ name, defaultValue = [], placeholder = 'Ketik lalu tekan Enter' }) {
  let initialTags = [];
  if (Array.isArray(defaultValue)) {
    initialTags = defaultValue;
  } else if (typeof defaultValue === 'string') {
    try {
      const parsed = JSON.parse(defaultValue);
      if (Array.isArray(parsed)) initialTags = parsed;
    } catch (e) { }
  }

  const [tags, setTags] = useState(initialTags);
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Mencegah submit form
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="w-full">
      <input type="hidden" name={name} value={JSON.stringify(tags)} />

      <div className="flex flex-wrap gap-2 mb-2 min-h-6">
        {tags.map((tag, idx) => (
          <div key={idx} className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-sm text-xs font-semibold border border-primary/20">
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-primary hover:text-red-600 transition-colors focus:outline-none"
              title="Hapus"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {tags.length === 0 && <span className="text-xs text-text-muted italic self-center">Belum ada data</span>}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-border rounded-sm text-xs outline-none focus:border-primary transition-colors"
        />
        <button
          type="button"
          onClick={() => {
            const newTag = inputValue.trim();
            if (newTag && !tags.includes(newTag)) {
              setTags([...tags, newTag]);
            }
            setInputValue('');
          }}
          disabled={!inputValue.trim()}
          className="px-3 py-2 bg-primary text-on-primary rounded-sm text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity whitespace-nowrap"
        >
          Tambah
        </button>
      </div>
    </div>
  );
}
