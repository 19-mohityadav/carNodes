import { FileText, ExternalLink } from 'lucide-react';
import { formatDate, shortCID } from '../../utils/format';

const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';

export function EvidenceGrid({ evidence = [] }) {
  if (!evidence.length) {
    return (
      <div className="py-12 border-2 border-swiss-black text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-swiss-black/40">
          No Evidence Records
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-l-2 border-t-2 border-swiss-black">
      {evidence.map((item, i) => (
        <a
          key={i}
          href={`${IPFS_GATEWAY}${item.cid}`}
          target="_blank"
          rel="noopener noreferrer"
          className="border-r-2 border-b-2 border-swiss-black p-6 flex flex-col gap-3 bg-swiss-white hover:bg-swiss-black hover:text-swiss-white transition-all duration-200 group"
        >
          {/* Icon + Type */}
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 border-2 border-swiss-black group-hover:border-swiss-white/30 flex items-center justify-center bg-swiss-muted group-hover:bg-swiss-white/10">
              <FileText className="w-5 h-5" />
            </div>
            <ExternalLink className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Evidence type */}
          <div>
            <div className="font-black text-sm uppercase tracking-tight mb-1">
              {item.type}
            </div>
            <div className="font-mono text-xs text-swiss-black/50 group-hover:text-swiss-white/50">
              {shortCID(item.cid)}
            </div>
          </div>

          {/* Date */}
          <div className="text-xs font-medium text-swiss-black/40 group-hover:text-swiss-white/40 mt-auto">
            Added {formatDate(item.addedAt)}
          </div>
        </a>
      ))}
    </div>
  );
}
