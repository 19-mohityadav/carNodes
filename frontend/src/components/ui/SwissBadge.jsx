import { CheckCircle2, Clock, XCircle, AlertTriangle, Shield } from 'lucide-react';

const BADGE_CONFIG = {
  verified: {
    label: 'VERIFIED',
    className: 'badge-verified',
    Icon: Shield,
  },
  pending: {
    label: 'PENDING',
    className: 'badge-pending',
    Icon: Clock,
  },
  rejected: {
    label: 'REJECTED',
    className: 'badge-rejected',
    Icon: XCircle,
  },
  authority: {
    label: 'AUTHORITY',
    className: 'badge-verified',
    Icon: CheckCircle2,
  },
  warning: {
    label: 'WARNING',
    className: 'inline-flex items-center gap-1.5 px-3 py-1 bg-swiss-accent text-swiss-white text-xs font-bold uppercase tracking-widest',
    Icon: AlertTriangle,
  },
};

export function SwissBadge({ type = 'pending', label, className = '' }) {
  const config = BADGE_CONFIG[type] || BADGE_CONFIG.pending;
  const Icon = config.Icon;
  const displayLabel = label || config.label;

  return (
    <span className={`${config.className} ${className}`}>
      <Icon className="w-3 h-3" strokeWidth={2.5} />
      {displayLabel}
    </span>
  );
}

/** Inline dot indicator for simple status labeling */
export function StatusDot({ active, label }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
      <span className={`w-2 h-2 ${active ? 'bg-swiss-black' : 'bg-swiss-muted border border-swiss-black'}`} />
      {label}
    </span>
  );
}
