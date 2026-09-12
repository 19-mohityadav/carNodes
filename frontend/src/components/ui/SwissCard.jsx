export function SwissCard({
  children,
  className = '',
  hover = true,
  muted = false,
  padding = 'p-8',
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={[
        'border-2 border-swiss-black transition-all duration-200',
        muted ? 'bg-swiss-muted' : 'bg-swiss-white',
        hover ? 'hover:bg-swiss-black hover:text-swiss-white cursor-pointer group' : '',
        padding,
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}

export function SwissCardAccent({
  children,
  className = '',
  padding = 'p-8',
}) {
  return (
    <div
      className={[
        'border-2 border-swiss-black bg-swiss-white transition-all duration-200',
        'hover:bg-swiss-accent hover:border-swiss-accent hover:text-swiss-white group',
        padding,
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
