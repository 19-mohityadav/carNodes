/**
 * PageWrapper — applies the Swiss noise texture background globally
 * and constrains content width
 */
export function PageWrapper({ children, className = '', fullWidth = false }) {
  return (
    <main className={`flex-1 swiss-noise ${className}`}>
      {fullWidth ? children : (
        <div className="max-w-screen-xl mx-auto px-6">
          {children}
        </div>
      )}
    </main>
  );
}

/**
 * PageSection — a section with standard vertical padding
 */
export function PageSection({ children, className = '', muted = false, fullWidth = false }) {
  return (
    <section className={`${muted ? 'bg-swiss-muted' : ''} ${className}`}>
      {fullWidth ? children : (
        <div className="max-w-screen-xl mx-auto px-6 py-16">
          {children}
        </div>
      )}
    </section>
  );
}

/**
 * SplitSection — asymmetric 2-column layout
 * ratio: '8-4' | '7-5' | '5-7' | '4-8'
 */
export function SplitSection({ left, right, ratio = '8-4', gap = 'gap-0', className = '' }) {
  const gridClass = {
    '8-4': 'md:grid-cols-8-4',
    '7-5': 'md:grid-cols-7-5',
    '5-7': 'md:grid-cols-5-7',
    '4-8': 'md:grid-cols-4-8',
  }[ratio] || 'md:grid-cols-8-4';

  return (
    <div className={`grid grid-cols-1 ${gridClass} ${gap} ${className}`}>
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}
