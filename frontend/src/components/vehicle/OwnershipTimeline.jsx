import { ExternalLink, ArrowRight } from 'lucide-react';
import { shortAddress, formatDateTime, etherscanTx } from '../../utils/format';
import { MonoData } from '../ui/SectionLabel';

export function OwnershipTimeline({ history = [] }) {
  if (!history.length) {
    return (
      <div className="py-12 border-2 border-swiss-black text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-swiss-black/40">
          No Ownership History Found
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {history.map((event, i) => (
        <div key={i} className="flex gap-6 group">
          {/* Timeline line */}
          <div className="flex flex-col items-center">
            <div className={`w-4 h-4 border-2 flex-shrink-0 mt-1 transition-colors duration-150 ${
              i === 0 ? 'bg-swiss-black border-swiss-black' : 'bg-swiss-white border-swiss-black group-hover:bg-swiss-accent group-hover:border-swiss-accent'
            }`} />
            {i < history.length - 1 && (
              <div className="w-0.5 flex-1 bg-swiss-black/20 mt-1 min-h-12" />
            )}
          </div>

          {/* Event content */}
          <div className={`pb-10 flex-1 ${i === history.length - 1 ? 'pb-0' : ''}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-black text-sm uppercase tracking-tight mb-1">
                  {event.event || 'Ownership Transfer'}
                </div>
                {event.from && event.from !== '0x0000000000000000000000000000000000000000' && (
                  <div className="flex items-center gap-2 text-xs text-swiss-black/60 mb-1">
                    <MonoData>{shortAddress(event.from)}</MonoData>
                    <ArrowRight className="w-3 h-3" />
                    <MonoData>{shortAddress(event.to)}</MonoData>
                  </div>
                )}
                {event.from === '0x0000000000000000000000000000000000000000' && (
                  <div className="text-xs text-swiss-black/60 mb-1">
                    Original Registration → <MonoData>{shortAddress(event.to)}</MonoData>
                  </div>
                )}
                <div className="text-xs font-medium text-swiss-black/40">
                  {formatDateTime(event.timestamp)}
                </div>
              </div>
              {event.txHash && (
                <a
                  href={etherscanTx(event.txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-swiss-black hover:text-swiss-accent transition-colors duration-150 flex-shrink-0"
                >
                  Etherscan
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
