import React from 'react';

interface CartoonInputProps {
  color?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  type?: string;
  disabled?: boolean;
}

const CartoonInput: React.FC<CartoonInputProps> = ({ 
  color = '#F5F5F5', 
  placeholder = 'Enter text...',
  value,
  onChange,
  className,
  type = 'text',
  disabled = false
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      style={{
        backgroundColor: color,
        border: '3px solid #000',
        borderRadius: '8px',
        padding: '10px 15px',
        fontSize: '16px',
        fontFamily: '"TT Trick New", serif',
        fontWeight: 'normal',
        outline: 'none',
        boxShadow: '4px 4px 0 #000',
        transition: 'all 0.2s ease',
        width: '250px',
        textAlign: 'center',
        opacity: disabled ? 0.7 : 1,
        cursor: disabled ? 'not-allowed' : 'text'
      }}
    />
  );
};

export default CartoonInput; 