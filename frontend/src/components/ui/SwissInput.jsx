import { forwardRef } from 'react';

export const SwissInput = forwardRef(({
  label,
  id,
  error,
  hint,
  className = '',
  boxStyle = false,
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="label-swiss">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`${boxStyle ? 'input-swiss-box' : 'input-swiss'} ${error ? 'border-swiss-accent' : ''} ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs font-bold text-swiss-accent uppercase tracking-wide mt-1">
          ↑ {error}
        </span>
      )}
      {hint && !error && (
        <span className="text-xs text-swiss-black/50 mt-1">{hint}</span>
      )}
    </div>
  );
});

SwissInput.displayName = 'SwissInput';

export const SwissTextarea = forwardRef(({
  label,
  id,
  error,
  rows = 4,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="label-swiss">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        className={`input-swiss-box resize-none ${error ? 'border-swiss-accent' : ''} ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs font-bold text-swiss-accent uppercase tracking-wide mt-1">
          ↑ {error}
        </span>
      )}
    </div>
  );
});

SwissTextarea.displayName = 'SwissTextarea';

export const SwissSelect = forwardRef(({
  label,
  id,
  options = [],
  error,
  placeholder,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="label-swiss">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={`input-swiss-box appearance-none ${error ? 'border-swiss-accent' : ''} ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && (
        <span className="text-xs font-bold text-swiss-accent uppercase tracking-wide mt-1">
          ↑ {error}
        </span>
      )}
    </div>
  );
});

SwissSelect.displayName = 'SwissSelect';
