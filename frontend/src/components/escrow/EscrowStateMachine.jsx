import { escrowStateLabel, ESCROW_STATES } from '../../utils/format';
import { Check } from 'lucide-react';

const STATE_SEQUENCE = [0, 1, 2, 3, 4, 5];

export function EscrowStateMachine({ currentState }) {
  const current = Number(currentState);

  return (
    <div className="flex flex-col gap-0">
      {STATE_SEQUENCE.map((stateNum, i) => {
        const isPast    = stateNum < current;
        const isCurrent = stateNum === current;
        const isFuture  = stateNum > current;

        return (
          <div key={stateNum} className="flex gap-4">
            {/* Dot + connector */}
            <div className="flex flex-col items-center flex-shrink-0 w-8">
              <div className={`w-6 h-6 border-2 flex items-center justify-center transition-colors duration-200 ${
                isPast    ? 'bg-swiss-black border-swiss-black text-swiss-white' :
                isCurrent ? 'bg-swiss-accent border-swiss-accent text-swiss-white' :
                            'bg-swiss-white border-swiss-black text-swiss-black/20'
              }`}>
                {isPast ? <Check className="w-3 h-3" strokeWidth={3} /> : null}
                {isCurrent ? <div className="w-2 h-2 bg-swiss-white" /> : null}
              </div>
              {i < STATE_SEQUENCE.length - 1 && (
                <div className={`w-0.5 flex-1 my-1 min-h-8 ${isPast ? 'bg-swiss-black' : 'bg-swiss-black/20'}`} />
              )}
            </div>

            {/* Label */}
            <div className={`pb-8 pt-0.5 ${i === STATE_SEQUENCE.length - 1 ? 'pb-0' : ''}`}>
              <div className={`text-sm font-black uppercase tracking-tight ${
                isCurrent ? 'text-swiss-accent' :
                isPast    ? 'text-swiss-black' :
                            'text-swiss-black/30'
              }`}>
                {ESCROW_STATES[stateNum]}
              </div>
              {isCurrent && (
                <div className="text-xs text-swiss-black/50 mt-1">Current state</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
