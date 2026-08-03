import React from 'react';

interface FieldShellProps {
  id: string;
  label: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const FieldShell: React.FC<FieldShellProps> = ({ id, label, hint, error, children, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    <label htmlFor={id} className="block text-xs font-medium tracking-[var(--tracking-label)] text-[var(--color-text-secondary)]">
      {label}
    </label>
    {children}
    {hint && !error ? <p id={`${id}-hint`} className="text-xs leading-relaxed text-[var(--color-text-muted)]">{hint}</p> : null}
    {error ? <p id={`${id}-error`} role="alert" className="text-xs leading-relaxed text-[var(--color-danger-text)]">{error}</p> : null}
  </div>
);

export interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'> {
  id: string;
  label: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  containerClassName?: string;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ id, label, hint, error, containerClassName, className = '', 'aria-describedby': describedBy, ...props }, ref) => {
    const messageId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
    return (
      <FieldShell id={id} label={label} hint={hint} error={error} className={containerClassName}>
        <input
          ref={ref}
          id={id}
          className={`lamie-control ${className}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={[describedBy, messageId].filter(Boolean).join(' ') || undefined}
          {...props}
        />
      </FieldShell>
    );
  },
);

TextField.displayName = 'TextField';

export interface TextAreaFieldProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  id: string;
  label: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  containerClassName?: string;
}

export const TextAreaField = React.forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ id, label, hint, error, containerClassName, className = '', 'aria-describedby': describedBy, ...props }, ref) => {
    const messageId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
    return (
      <FieldShell id={id} label={label} hint={hint} error={error} className={containerClassName}>
        <textarea
          ref={ref}
          id={id}
          className={`lamie-control resize-y ${className}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={[describedBy, messageId].filter(Boolean).join(' ') || undefined}
          {...props}
        />
      </FieldShell>
    );
  },
);

TextAreaField.displayName = 'TextAreaField';

export const BareInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => <input ref={ref} className={`lamie-control ${className}`} {...props} />,
);

BareInput.displayName = 'BareInput';
