import { Shield, Clock, XCircle } from 'lucide-react';

export function VerificationBadge({ verified, verifier, large = false }) {
  if (large) {
    return (
      <div className={`flex items-center gap-4 p-6 border-2 ${verified ? 'border-swiss-black bg-swiss-black text-swiss-white' : 'border-swiss-black bg-swiss-muted text-swiss-black'}`}>
        <div className={`w-12 h-12 flex items-center justify-center flex-shrink-0 ${verified ? 'bg-swiss-white/10' : 'bg-swiss-black/5'}`}>
          {verified
            ? <Shield className="w-6 h-6" />
            : <Clock className="w-6 h-6" />
          }
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">
            Verification Status
          </div>
          <div className="text-lg font-black uppercase tracking-tight">
            {verified ? 'Authority Verified' : 'Pending Verification'}
          </div>
          {verified && verifier && (
            <div className="text-xs font-mono mt-1 opacity-60">
              Verifier: {verifier}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-widest border-2 ${
      verified
        ? 'bg-swiss-black text-swiss-white border-swiss-black'
        : 'bg-swiss-muted text-swiss-black border-swiss-black'
    }`}>
      {verified ? <Shield className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
      {verified ? 'Verified' : 'Pending'}
    </span>
  );
}
