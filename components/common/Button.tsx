
import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', isLoading = false, className = '', disabled, type, ...props }) => {
  const baseStyles = "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] font-body font-medium transition-[color,background-color,border-color,box-shadow,transform] duration-[var(--duration-fast)] ease-[var(--ease-standard)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] active:translate-y-px disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55";
  const variants = {
    primary: "border border-[var(--color-action-primary)] bg-[var(--color-action-primary)] text-[var(--color-text-on-strong)] shadow-[var(--shadow-xs)] hover:border-[var(--color-action-primary-hover)] hover:bg-[var(--color-action-primary-hover)]",
    outline: "border border-[var(--color-border-strong)] bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-action-primary)] hover:text-[var(--color-text-on-strong)]",
    text: "border border-transparent bg-transparent text-[var(--color-text-primary)] underline decoration-1 underline-offset-4 hover:text-[var(--color-text-accent)]"
  };
  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base"
  };
  return (
    <button type={type} className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`} disabled={disabled || isLoading} aria-busy={isLoading || undefined} {...props}>
      {isLoading ? <span aria-hidden="true" className="h-4 w-4 animate-pulse rounded-full bg-current opacity-45" /> : null}
      <span>{children}</span>
    </button>
  );
};
