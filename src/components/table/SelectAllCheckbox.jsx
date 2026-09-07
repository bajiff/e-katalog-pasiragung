import React from 'react';

export function SelectAllCheckbox({ isAllSelected, isIndeterminate, onChange }) {
  const checkboxRef = React.useRef();

  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  return (
    <input 
      type="checkbox"
      ref={checkboxRef}
      checked={isAllSelected}
      onChange={onChange}
      className="w-3.5 h-3.5 accent-primary cursor-pointer"
    />
  );
}
