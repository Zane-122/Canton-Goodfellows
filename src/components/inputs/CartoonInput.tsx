import React from 'react';

interface CartoonInputProps {
  color?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

const CartoonInput: React.FC<CartoonInputProps> = ({ 
  color = '#F5F5F5', 
  placeholder = 'Enter text...',
  value,
  onChange 
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        backgroundColor: color,
        border: '3px solid #000',
        borderRadius: '8px',
        padding: '10px 15px',
        fontSize: '16px',
        fontFamily: '"Coolvetica Rg", sans-serif',
        fontWeight: 'normal',
        outline: 'none',
        boxShadow: '4px 4px 0 #000',
        transition: 'all 0.2s ease',
        width: '250px'
      }}
    />
  );
};

export default CartoonInput; 