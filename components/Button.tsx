import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className = '', ...props }) => {
  const baseStyles = "px-8 py-4 rounded-full text-lg transition-all duration-300 ease-out transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-serif tracking-wide";
  
  const variants = {
    primary: "bg-stone-800 text-stone-50 shadow-lg hover:bg-stone-700 hover:shadow-xl",
    secondary: "bg-white text-stone-600 border border-stone-200 shadow-sm hover:bg-stone-50 hover:border-stone-300",
    ghost: "bg-transparent text-stone-500 hover:text-stone-700 underline-offset-4 hover:underline"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};