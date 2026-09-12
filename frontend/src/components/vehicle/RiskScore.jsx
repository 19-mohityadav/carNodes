import { riskLabel } from '../../utils/format';

export function RiskScore({ score, compact = false }) {
  const { label, color } = riskLabel(score);
  const pct = Math.min(100, Math.max(0, Number(score)));

  // Color fill: green→yellow→red based on score
  const fillColor =
    pct <= 20 ? 'bg-swiss-black' :
    pct <= 50 ? 'bg-swiss-black' :
    'bg-swiss-accent';

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex-1 risk-bar">
          <div
            className={`risk-fill ${fillColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={`text-xs font-black uppercase tracking-widest ${color}`}>
          {label}
        </span>
        <span className="text-xs font-mono font-bold text-swiss-black/50">
          {pct}/100
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-swiss-black/50">
          Risk Score
        </span>
        <span className={`text-xs font-black uppercase tracking-widest ${color}`}>
          {label}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1 h-3 bg-swiss-muted border-2 border-swiss-black overflow-hidden">
          <div
            className={`h-full ${fillColor} transition-all duration-700`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="font-mono font-black text-2xl tracking-tight w-14 text-right">
          {pct}<span className="text-sm font-normal text-swiss-black/40">/100</span>
        </span>
      </div>
      <div className="text-sm text-swiss-black/60">
        {pct <= 20
          ? 'Low risk — vehicle documentation is consistent and clean.'
          : pct <= 50
          ? 'Moderate risk — some discrepancies detected. Review evidence.'
          : 'High risk — significant inconsistencies found. Verify carefully.'}
      </div>
    </div>
  );
}
