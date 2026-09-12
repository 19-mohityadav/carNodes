import React, { useState } from 'react';
import { Bot, Send, Sparkles, Award, TrendingDown, ShieldCheck, ArrowRight, RefreshCw, CheckCircle2, User } from 'lucide-react';
import { AI_PRESET_PROMPTS } from '../data/vehicles';

export default function AiAssistantSection({ onOpenMarketplace, onOpenVerifyModal }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I am carNodes AI Agent. I analyze vehicle history, real-time market data, and Algorand smart contracts to help you buy with 100% confidence. Ask me anything about vehicle trust, valuation, or escrow protection!",
      carDetails: {
        model: "2022 Toyota Camry XSE / Audi R8 V10",
        vin: "1FA6P8CF0H51092831",
        trustScore: 94,
        dealRating: "Great Value (5.3% Below Market)",
        riskLevel: "Low Risk (0 Accidents Logged)"
      }
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (textToSend) => {
    const prompt = textToSend || inputValue;
    if (!prompt.trim()) return;

    // Append user message
    const newMessages = [...messages, { sender: 'user', text: prompt }];
    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response synthesis
    setTimeout(() => {
      let aiReply = "";
      let carMeta = null;

      if (prompt.toLowerCase().includes('price') || prompt.toLowerCase().includes('camry') || prompt.toLowerCase().includes('r8')) {
        aiReply = "Based on our AI price engine analyzing 4,200+ recent comparable sales and local dealer listings, $48,500 is 5.3% below fair market value ($51,200 avg). With a 94/100 Trust Score and clean title, this represents a Great Value deal.";
        carMeta = {
          model: "2022 Toyota Camry XSE / Audi R8 V10",
          vin: "1FA6P8CF0H51092831",
          trustScore: 94,
          dealRating: "Great Value (5.3% Below Market)",
          riskLevel: "Low Risk (0 Lien Records)"
        };
      } else if (prompt.toLowerCase().includes('vin') || prompt.toLowerCase().includes('risk') || prompt.toLowerCase().includes('1fa6p')) {
        aiReply = "Deep risk scan complete for VIN 1FA6P8CF0H51092831: 0 accident reports, 0 flood/fire damage flags, 1-owner verified by San Francisco RTO. Title is clean and unencumbered.";
        carMeta = {
          model: "Audi R8 / Camry #CN-48291",
          vin: "1FA6P8CF0H51092831",
          trustScore: 94,
          dealRating: "Passed All 14 Point Oracles",
          riskLevel: "Zero Fraud Detected"
        };
      } else if (prompt.toLowerCase().includes('escrow') || prompt.toLowerCase().includes('algorand') || prompt.toLowerCase().includes('protect')) {
        aiReply = "carNodes Escrow uses an automated Algorand Smart Contract (ASA #89410294). Your funds remain locked in escrow and are only released to the seller after DMV title token transfer is signed and verified by you.";
        carMeta = {
          model: "Algorand ASA Smart Contract",
          vin: "State Lock Protocol v2.4",
          trustScore: 100,
          dealRating: "Sub-4 Second Finality",
          riskLevel: "Non-Custodial Escrow"
        };
      } else {
        aiReply = `I've processed your query: "${prompt}". My AI model cross-referenced Algorand on-chain records, IPFS passport logs, and RTO node signatures. All vehicle metrics indicate verified integrity.`;
        carMeta = {
          model: "carNodes AI Intelligence Engine",
          vin: "CN-AI-MODEL-v4",
          trustScore: 96,
          dealRating: "Verified Output",
          riskLevel: "High Confidence (99.1%)"
        };
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiReply, carDetails: carMeta }]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <section id="ai-assistant" className="py-20 bg-[#FFFFFF] border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#2B2521] text-white text-xs font-mono mb-4">
            <Bot className="w-4 h-4 text-[#FF3B30]" />
            <span className="font-bold uppercase tracking-wider">AUTONOMOUS AI MARKETPLACE AGENT</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#111111] font-heading">
            Your AI Agent for Smarter Vehicle Decisions
          </h2>

          <p className="mt-4 text-base text-[#6E6259]">
            Ask real-time questions about vehicle trust scores, fair pricing analytics, title history, and smart contract escrow protection.
          </p>
        </div>

        {/* INTERACTIVE CHAT MOCKUP CONTAINER */}
        <div className="max-w-4xl mx-auto bg-[#FDFBF7] rounded-3xl border border-zinc-200 shadow-2xl overflow-hidden">

          {/* Chat Window Header Bar */}
          <div className="bg-[#2B2521] text-white p-4 px-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#FF3B30] flex items-center justify-center text-white font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-heading font-bold uppercase tracking-wider">
                  carNodes Copilot AI
                </h3>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>Online • Connected to Algorand Oracles</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setMessages([messages[0]])}
              className="text-xs font-mono text-zinc-400 hover:text-white flex items-center space-x-1 px-2.5 py-1 rounded bg-white/10"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Chat</span>
            </button>
          </div>

          {/* Preset Prompts Chips */}
          <div className="p-4 bg-zinc-100/80 border-b border-zinc-200 flex flex-wrap gap-2">
            <span className="text-xs font-mono text-[#6E6259] font-bold self-center mr-1">Suggested:</span>
            {AI_PRESET_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="text-xs font-sans bg-white hover:bg-[#FF3B30] hover:text-white text-[#2B2521] px-3 py-1.5 rounded-full border border-zinc-300 transition-colors shadow-2xs font-medium cursor-pointer"
              >
                "{prompt}"
              </button>
            ))}
          </div>

          {/* Messages Scroll Area */}
          <div className="p-6 space-y-6 max-h-[480px] overflow-y-auto bg-white/50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-lg bg-[#2B2521] text-white flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-[#FF3B30]" />
                  </div>
                )}

                <div className={`max-w-xl space-y-3 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>

                  {/* Bubble */}
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user'
                      ? 'bg-[#2B2521] text-white rounded-tr-xs font-medium'
                      : 'bg-white border border-zinc-200 text-[#111111] shadow-xs rounded-tl-xs'
                    }`}>
                    {msg.text}
                  </div>

                  {/* AI Metadata & Action Card */}
                  {msg.sender === 'ai' && msg.carDetails && (
                    <div className="bg-[#FDFBF7] p-4 rounded-xl border border-zinc-200 space-y-3 text-xs">

                      <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                        <span className="font-heading font-bold text-[#111111]">{msg.carDetails.model}</span>
                        <span className="font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                          Trust {msg.carDetails.trustScore}/100
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                        <div>
                          <span className="text-[#6E6259]">Deal Rating:</span>
                          <span className="block font-bold text-[#FF3B30]">{msg.carDetails.dealRating}</span>
                        </div>
                        <div>
                          <span className="text-[#6E6259]">Risk Assessment:</span>
                          <span className="block font-bold text-emerald-700">{msg.carDetails.riskLevel}</span>
                        </div>
                      </div>

                      {/* Action Triggers */}
                      <div className="pt-2 flex flex-wrap gap-2">
                        <button
                          onClick={onOpenMarketplace}
                          className="px-3 py-1.5 rounded-lg bg-[#2B2521] hover:bg-[#FF3B30] text-white font-mono text-[11px] font-bold uppercase transition-colors"
                        >
                          View Vehicle Listing →
                        </button>
                        <button
                          onClick={onOpenVerifyModal}
                          className="px-3 py-1.5 rounded-lg bg-zinc-200 hover:bg-zinc-300 text-[#111111] font-mono text-[11px] font-bold uppercase transition-colors"
                        >
                          Inspect Passport
                        </button>
                      </div>

                    </div>
                  )}

                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-[#FF3B30] text-white flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-2 text-xs font-mono text-[#6E6259] bg-white p-3 rounded-xl border border-zinc-200 w-fit">
                <Bot className="w-4 h-4 text-[#FF3B30] animate-spin" />
                <span>carNodes AI is synthesizing real-time telemetry...</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 bg-white border-t border-zinc-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about vehicle trust, price fairness, or Algorand escrow..."
                className="flex-1 px-4 py-3 rounded-xl border border-zinc-300 focus:border-[#FF3B30] focus:outline-none text-sm text-[#111111] font-sans"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="px-5 py-3 rounded-xl bg-[#2B2521] hover:bg-[#FF3B30] disabled:opacity-50 text-white transition-all flex items-center space-x-1.5 font-bold text-xs uppercase"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}