import { useState } from 'react';
import { MOCK_VEHICLES } from '../mock/vehicles';
import { SectionLabel, SwissHeading } from '../components/ui/SectionLabel';
import { SwissButton } from '../components/ui/SwissButton';
import { SwissInput } from '../components/ui/SwissInput';
import { RiskScore } from '../components/vehicle/RiskScore';
import { Send, Bot, User, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

const INITIAL_MESSAGES = [
  {
    role: 'system',
    text: 'carNodes Neural Audit Engine v2.4 initialized. Connected to Sepolia on-chain events and IPFS document cluster.',
  },
  {
    role: 'assistant',
    text: 'Hello. I am the carNodes Automated Verification Auditor. I analyze cryptographic provenance, service logs, and IPFS documentation to detect title fraud, odometer tampering, and undisclosed damage. How can I assist with your vehicle assessment today?',
  },
];

const PRESET_QUESTIONS = [
  'Verify odometer consistency across all service logs',
  'Check for insurance claims or structural accident reports',
  'Is there any active RTO hypothecation or bank loan lien?',
  'Assess price fair-market valuation vs market index',
];

export default function AIAnalysis() {
  const [selectedVehicleId, setSelectedVehicleId] = useState('1');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const vehicle = MOCK_VEHICLES.find(v => String(v.id) === selectedVehicleId) || MOCK_VEHICLES[0];

  const handleSend = (textToSend) => {
    const q = textToSend || inputMessage;
    if (!q.trim()) return;

    const newMsgs = [...messages, { role: 'user', text: q }];
    setMessages(newMsgs);
    setInputMessage('');
    setAnalyzing(true);

    // Simulated LLM answer generator based on query keywords and vehicle
    setTimeout(() => {
      let reply = '';
      const queryLower = q.toLowerCase();

      if (queryLower.includes('odometer') || queryLower.includes('mileage')) {
        reply = `Audit complete for ${vehicle.make} ${vehicle.model} (${vehicle.registrationNo}): Odometer progression is linear and verified across 3 authorized service records. Recorded mileage: ${Number(vehicle.odometer).toLocaleString()} km. Probability of mechanical rollback: < 1.2% (Low Risk).`;
      } else if (queryLower.includes('accident') || queryLower.includes('damage') || queryLower.includes('insurance')) {
        reply = `Cross-referencing Parivahan national database and insurance CIDs: Zero total-loss or severe accidental repair claims filed. Frame alignment and paint depth report in CID QmInspection789 indicates factory original condition.`;
      } else if (queryLower.includes('lien') || queryLower.includes('loan') || queryLower.includes('hypothecation')) {
        reply = `Smart title verification: No registered financial encumbrance. The vehicle title is unencumbered and eligible for immediate cryptographic transfer via smart contract.`;
      } else if (queryLower.includes('price') || queryLower.includes('valuation')) {
        reply = `Market evaluation: Based on ${vehicle.year} manufacturing date, ${vehicle.odometer} km mileage, and historical Sepolia settlements, estimated fair market value is between ₹8,20,000 and ₹8,75,000. Asking price is in alignment with benchmark.`;
      } else {
        reply = `Analysis for ${vehicle.year} ${vehicle.make} ${vehicle.model}: Cryptographic hash matches physical VIN stamped on chassis. All 3 IPFS documents verified with valid authority signatures. Overall audit confidence: 98.4%.`;
      }

      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
      setAnalyzing(false);
    }, 1000);
  };

  return (
    <div className="bg-swiss-white min-h-screen">
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="border-b-2 border-swiss-black pb-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <SectionLabel number="10" label="DEEP NEURAL AUDIT & FRAUD DETECTION" className="mb-2" />
            <SwissHeading level={1} className="text-4xl sm:text-5xl">
              AI Risk <span className="text-swiss-accent">Analysis</span>
            </SwissHeading>
            <p className="mt-2 text-sm text-swiss-black/70 font-medium">
              Multi-modal document inspection and cryptographic fraud scoring engine.
            </p>
          </div>

          {/* Vehicle Selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-swiss-black/60">Select Vehicle:</span>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="border-2 border-swiss-black bg-swiss-muted px-3 py-2 font-mono text-xs font-bold text-swiss-black outline-none focus:border-swiss-accent"
            >
              {MOCK_VEHICLES.map(v => (
                <option key={v.id} value={v.id}>
                  {v.registrationNo} — {v.make} {v.model}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2-Column Layout: Chat Left, Risk Radar Right */}
        <div className="grid grid-cols-1 lg:grid-cols-7-5 gap-8">
          {/* Left Column: Chat Terminal */}
          <div className="border-2 border-swiss-black flex flex-col h-[650px] bg-swiss-white">
            {/* Terminal Top Bar */}
            <div className="p-4 border-b-2 border-swiss-black bg-swiss-black text-swiss-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest">
                <Bot className="w-4 h-4 text-swiss-accent" />
                <span>Neural Assistant • {vehicle.registrationNo}</span>
              </div>
              <span className="text-[10px] font-mono text-swiss-white/60">STATUS: ONLINE</span>
            </div>

            {/* Message Stream */}
            <div className="flex-1 p-6 overflow-y-auto divide-y-2 divide-swiss-black/10 space-y-4">
              {messages.map((m, idx) => (
                <div key={idx} className="pt-4 first:pt-0">
                  {m.role === 'system' ? (
                    <div className="font-mono text-[11px] text-swiss-black/50 bg-swiss-muted p-2 border border-swiss-black/15">
                      &gt; {m.text}
                    </div>
                  ) : m.role === 'assistant' ? (
                    <div className="flex gap-3">
                      <div className="w-7 h-7 bg-swiss-black text-swiss-white flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-swiss-accent" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-swiss-black/50 mb-1">
                          Auditor AI
                        </div>
                        <p className="text-xs text-swiss-black leading-relaxed font-sans">
                          {m.text}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3 bg-swiss-muted p-3 border border-swiss-black/10">
                      <div className="w-7 h-7 bg-swiss-accent text-swiss-white flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-swiss-accent mb-1">
                          Inquiry
                        </div>
                        <p className="text-xs font-bold text-swiss-black leading-relaxed font-sans">
                          {m.text}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {analyzing && (
                <div className="font-mono text-xs text-swiss-accent animate-pulse p-2">
                  &gt; Computing neural inference and checking IPFS ledger...
                </div>
              )}
            </div>

            {/* Preset Query Chips */}
            <div className="p-3 border-t-2 border-swiss-black bg-swiss-muted flex flex-wrap gap-1.5">
              {PRESET_QUESTIONS.map((pq, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(pq)}
                  className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-swiss-white border border-swiss-black hover:bg-swiss-black hover:text-swiss-white transition-colors"
                >
                  {pq}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-4 border-t-2 border-swiss-black bg-swiss-white flex gap-2"
            >
              <input
                type="text"
                placeholder="Ask anything regarding title provenance, document anomalies, or pricing..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-swiss-black font-sans text-xs outline-none focus:border-swiss-accent"
              />
              <SwissButton type="submit" variant="primary" size="sm" disabled={analyzing || !inputMessage.trim()}>
                <Send className="w-3.5 h-3.5" />
              </SwissButton>
            </form>
          </div>

          {/* Right Column: Risk Factor Matrix */}
          <div className="flex flex-col gap-6">
            <div className="border-4 border-swiss-black p-8 bg-swiss-white">
              <SectionLabel number="01" label="OVERALL COMPOSITE RISK" className="mb-4" />
              <RiskScore score={vehicle.riskScore} />
            </div>

            {/* Factor Breakdown */}
            <div className="border-2 border-swiss-black p-6 bg-swiss-white">
              <SectionLabel number="02" label="AUDIT FACTOR BREAKDOWN" className="mb-4" />

              <div className="flex flex-col gap-4">
                <div className="border-2 border-swiss-black p-4 bg-swiss-muted">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase text-swiss-black">Odometer Integrity</span>
                    <span className="font-mono text-xs font-bold text-swiss-black">100% CLEAR</span>
                  </div>
                  <div className="w-full h-2 bg-swiss-white border border-swiss-black">
                    <div className="h-full bg-swiss-black w-[98%]" />
                  </div>
                </div>

                <div className="border-2 border-swiss-black p-4 bg-swiss-muted">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase text-swiss-black">Encumbrance & Liens</span>
                    <span className="font-mono text-xs font-bold text-swiss-black">UNENCUMBERED</span>
                  </div>
                  <div className="w-full h-2 bg-swiss-white border border-swiss-black">
                    <div className="h-full bg-swiss-black w-full" />
                  </div>
                </div>

                <div className="border-2 border-swiss-black p-4 bg-swiss-muted">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase text-swiss-black">Document Hash Consistency</span>
                    <span className="font-mono text-xs font-bold text-swiss-black">3/3 MATCHED</span>
                  </div>
                  <div className="w-full h-2 bg-swiss-white border border-swiss-black">
                    <div className="h-full bg-swiss-black w-full" />
                  </div>
                </div>

                <div className="border-2 border-swiss-black p-4 bg-swiss-muted">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase text-swiss-black">Ownership Velocity</span>
                    <span className="font-mono text-xs font-bold text-swiss-black">STABLE (1.4 YRS/OWNER)</span>
                  </div>
                  <div className="w-full h-2 bg-swiss-white border border-swiss-black">
                    <div className="h-full bg-swiss-black w-[85%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
