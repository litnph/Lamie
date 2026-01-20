
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'text';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "px-8 py-3 rounded-full transition-all duration-500 ease-out font-body tracking-wider text-sm flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-mocha-800 text-cream-100 hover:bg-mocha-900 shadow-sm hover:shadow-lg",
    outline: "border border-mocha-800 text-mocha-800 hover:bg-mocha-800 hover:text-cream-100",
    text: "text-mocha-800 hover:text-mocha-500 underline decoration-1 underline-offset-4"
  };
  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
