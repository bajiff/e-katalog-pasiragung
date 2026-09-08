import React from 'react';

export const ConfirmModal = ({ 
  isOpen, 
  title, 
  message, 
  confirmText = "Ya, Lanjutkan", 
  cancelText = "Batal", 
  onConfirm, 
  onCancel,
  isDestructive = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative bg-surface rounded-md shadow-lg border border-border w-full max-w-sm p-6 overflow-hidden z-10 animate-fade-in-up">
        <h3 className="font-display font-bold text-lg text-text mb-2">
          {title}
        </h3>
        <p className="font-body text-sm text-text-muted mb-6 leading-relaxed">
          {message}
        </p>
        
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-text bg-background border border-border rounded-sm hover:bg-gray-100 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-semibold text-on-primary rounded-sm transition-opacity ${
              isDestructive ? 'bg-red-600 hover:opacity-90' : 'bg-primary hover:opacity-90'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
