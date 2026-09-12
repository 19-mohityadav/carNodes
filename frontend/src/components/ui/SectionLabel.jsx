/**
 * Numbered section label — e.g. "01. SYSTEM"
 * The number is in Swiss Red; the label is uppercase black.
 */
export function SectionLabel({ number, label, className = '' }) {
  return (
    <div className={`flex items-center gap-2 section-label ${className}`}>
      <span className="text-swiss-accent">{String(number).padStart(2, '0')}.</span>
      <span className="text-swiss-black">{label}</span>
    </div>
  );
}

/**
 * Large structural heading with optional red accent line
 */
export function SwissHeading({ children, level = 1, accent = false, className = '' }) {
  const Tag = `h${Math.min(Math.max(level, 1), 6)}`;
  return (
    <Tag className={`font-black uppercase leading-none tracking-tighter ${className}`}>
      {accent && <span className="text-swiss-accent">/ </span>}
      {children}
    </Tag>
  );
}

/**
 * Structural divider with optional label
 */
export function SwissDivider({ label, className = '' }) {
  if (!label) {
    return <hr className={`swiss-divider ${className}`} />;
  }
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <hr className="flex-1 border-t-2 border-swiss-black" />
      <span className="text-xs font-bold uppercase tracking-widest text-swiss-black whitespace-nowrap">
        {label}
      </span>
      <hr className="flex-1 border-t-2 border-swiss-black" />
    </div>
  );
}

/**
 * Monospaced data display for blockchain addresses, hashes etc.
 */
export function MonoData({ children, className = '' }) {
  return (
    <span className={`font-mono text-sm break-all ${className}`}>{children}</span>
  );
}
