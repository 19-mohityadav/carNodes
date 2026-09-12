import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary:   'btn-swiss-primary',
  secondary: 'btn-swiss-secondary',
  accent:    'btn-swiss-accent',
  ghost:     'bg-transparent text-swiss-black font-bold uppercase tracking-widest text-sm px-8 py-4 border-2 border-transparent hover:border-swiss-black transition-all duration-150 cursor-pointer',
  danger:    'bg-swiss-accent text-swiss-white font-bold uppercase tracking-widest text-sm px-8 py-4 border-2 border-swiss-accent hover:bg-swiss-black hover:border-swiss-black transition-all duration-150 cursor-pointer',
};

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: '',  // default from variant
  lg: 'px-12 py-5 text-base',
  full: 'w-full px-8 py-4 text-sm',
};

export const SwissButton = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  as: Component = 'button',
  ...props
}, ref) => {
  const base = variants[variant] || variants.primary;
  const sizeClass = size !== 'md' ? sizes[size] : '';
  const isDisabled = disabled || loading;

  return (
    <Component
      ref={ref}
      className={`${base} ${sizeClass} ${isDisabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''} ${className}`}
      disabled={Component === 'button' ? isDisabled : undefined}
      aria-disabled={isDisabled}
      {...props}
    >
      {loading && <Loader2 className="inline w-4 h-4 mr-2 animate-spin" />}
      {children}
    </Component>
  );
});

SwissButton.displayName = 'SwissButton';
