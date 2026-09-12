import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SectionLabel, SwissHeading } from '../components/ui/SectionLabel';
import { SwissInput, SwissSelect, SwissTextarea } from '../components/ui/SwissInput';
import { SwissButton } from '../components/ui/SwissButton';
import { useWallet } from '../context/WalletContext';
import { ArrowRight, Check, UploadCloud, ShieldCheck } from 'lucide-react';

const FUEL_OPTIONS = [
  { value: 'Petrol', label: 'Petrol' },
  { value: 'Diesel', label: 'Diesel' },
  { value: 'Electric', label: 'Electric (EV)' },
  { value: 'Hybrid', label: 'Hybrid' },
  { value: 'CNG', label: 'CNG' },
];

const TRANSMISSION_OPTIONS = [
  { value: 'Manual', label: 'Manual' },
  { value: 'Automatic', label: 'Automatic (CVT/AT/DCT)' },
];

export default function CreateListing() {
  const navigate = useNavigate();
  const { account, isConnected } = useWallet();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    vin: '',
    make: '',
    model: '',
    year: '2023',
    registrationNo: '',
    fuelType: 'Petrol',
    transmission: 'Manual',
    color: '',
    odometer: '',
    price: '',
    location: '',
    description: '',
    rcDocName: 'rc_certificate.pdf',
    insuranceDocName: 'insurance_policy.pdf',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // TODO: Replace with POST /api/vehicles or direct smart contract call
    // await vehicleRegistry.registerVehicle(...)
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
    }, 1200);
  };

  const STEPS = [
    { num: 1, label: '01. IDENTIFIERS' },
    { num: 2, label: '02. VALUATION' },
    { num: 3, label: '03. EVIDENCE' },
    { num: 4, label: '04. ON-CHAIN MINT' },
  ];

  return (
    <div className="bg-swiss-white min-h-screen">
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="border-b-2 border-swiss-black pb-8 mb-8">
          <SectionLabel number="05" label="DECENTRALIZED VEHICLE REGISTRATION" className="mb-2" />
          <SwissHeading level={1} className="text-4xl sm:text-5xl">
            Create Vehicle <span className="text-swiss-accent">Passport</span>
          </SwissHeading>
          <p className="mt-3 text-sm text-swiss-black/70 font-medium max-w-2xl">
            Tokenize your automobile on Ethereum Sepolia. Generate an immutable cryptographic record of ownership, verification, and service history.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-2 border-swiss-black mb-10 divide-x-2 divide-y md:divide-y-0 divide-swiss-black bg-swiss-muted">
          {STEPS.map(s => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => !success && setStep(s.num)}
                className={`p-4 text-left transition-colors duration-150 ${
                  isCurrent
                    ? 'bg-swiss-black text-swiss-white'
                    : isCompleted
                    ? 'bg-swiss-white text-swiss-black'
                    : 'bg-swiss-muted text-swiss-black/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black tracking-widest">{s.label}</span>
                  {isCompleted && <Check className="w-4 h-4 text-swiss-accent" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Success State */}
        {success ? (
          <div className="border-4 border-swiss-black p-10 bg-swiss-white text-center max-w-2xl mx-auto my-8">
            <div className="w-16 h-16 bg-swiss-black text-swiss-white flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8 text-swiss-accent" />
            </div>
            <SectionLabel number="01" label="REGISTRATION COMPLETE" className="justify-center mb-2" />
            <SwissHeading level={2} className="text-3xl mb-4">Passport Submitted for Authority Review</SwissHeading>
            <p className="text-sm text-swiss-black/70 mb-8 max-w-md mx-auto">
              Your vehicle data has been submitted and anchored to IPFS. The Regional Transport Authority has received your verification request.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SwissButton variant="primary" onClick={() => navigate('/marketplace')}>
                View in Marketplace
              </SwissButton>
              <SwissButton variant="secondary" onClick={() => navigate('/authority')}>
                View Authority Queue
              </SwissButton>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            {/* Step 1: Vehicle Identifiers */}
            {step === 1 && (
              <div className="border-2 border-swiss-black p-8 bg-swiss-white flex flex-col gap-6">
                <SectionLabel number="01" label="VEHICLE IDENTIFICATION DATA" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <SwissInput
                    id="vin"
                    label="Chassis Number / VIN (17 Characters)"
                    placeholder="e.g. MA3FJEF1S00135201"
                    value={formData.vin}
                    onChange={handleChange}
                    required
                    boxStyle
                  />
                  <SwissInput
                    id="registrationNo"
                    label="Official Registration Number"
                    placeholder="e.g. KA 01 AB 1234"
                    value={formData.registrationNo}
                    onChange={handleChange}
                    required
                    boxStyle
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <SwissInput
                    id="make"
                    label="Manufacturer / Make"
                    placeholder="e.g. Maruti Suzuki, Tata"
                    value={formData.make}
                    onChange={handleChange}
                    required
                    boxStyle
                  />
                  <SwissInput
                    id="model"
                    label="Model & Variant"
                    placeholder="e.g. Swift VXI, Nexon EV"
                    value={formData.model}
                    onChange={handleChange}
                    required
                    boxStyle
                  />
                  <SwissInput
                    id="year"
                    type="number"
                    label="Manufacturing Year"
                    placeholder="2023"
                    value={formData.year}
                    onChange={handleChange}
                    required
                    boxStyle
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <SwissSelect
                    id="fuelType"
                    label="Fuel Type"
                    options={FUEL_OPTIONS}
                    value={formData.fuelType}
                    onChange={handleChange}
                  />
                  <SwissSelect
                    id="transmission"
                    label="Transmission"
                    options={TRANSMISSION_OPTIONS}
                    value={formData.transmission}
                    onChange={handleChange}
                  />
                  <SwissInput
                    id="color"
                    label="Exterior Color"
                    placeholder="e.g. Arctic White"
                    value={formData.color}
                    onChange={handleChange}
                    required
                    boxStyle
                  />
                </div>

                <SwissInput
                  id="odometer"
                  type="number"
                  label="Current Odometer Reading (KM)"
                  placeholder="e.g. 32000"
                  value={formData.odometer}
                  onChange={handleChange}
                  required
                  boxStyle
                />

                <div className="pt-4 flex justify-end">
                  <SwissButton type="button" variant="primary" onClick={() => setStep(2)}>
                    Next: Valuation & Details <ArrowRight className="inline w-4 h-4 ml-2" />
                  </SwissButton>
                </div>
              </div>
            )}

            {/* Step 2: Pricing & Details */}
            {step === 2 && (
              <div className="border-2 border-swiss-black p-8 bg-swiss-white flex flex-col gap-6">
                <SectionLabel number="02" label="VALUATION & MARKETPLACE LISTING" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <SwissInput
                    id="price"
                    type="number"
                    label="Asking Price (in MockINR / ₹)"
                    placeholder="e.g. 850000"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    boxStyle
                    hint="Amount that will be locked into escrow smart contract upon purchase."
                  />
                  <SwissInput
                    id="location"
                    label="City & State"
                    placeholder="e.g. Bangalore, Karnataka"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    boxStyle
                  />
                </div>

                <SwissTextarea
                  id="description"
                  label="Vehicle Condition & History Description"
                  placeholder="Provide honest details regarding mechanical condition, service history, and warranties."
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                />

                <div className="pt-4 flex justify-between">
                  <SwissButton type="button" variant="secondary" onClick={() => setStep(1)}>
                    Back
                  </SwissButton>
                  <SwissButton type="button" variant="primary" onClick={() => setStep(3)}>
                    Next: Evidence Upload <ArrowRight className="inline w-4 h-4 ml-2" />
                  </SwissButton>
                </div>
              </div>
            )}

            {/* Step 3: Evidence Documents */}
            {step === 3 && (
              <div className="border-2 border-swiss-black p-8 bg-swiss-white flex flex-col gap-6">
                <SectionLabel number="03" label="CRYPTOGRAPHIC EVIDENCE ARCHIVE" />
                <p className="text-xs text-swiss-black/70">
                  Upload official documentation. Files are cryptographically hashed and uploaded to IPFS. The hashes are pinned directly into the vehicle's on-chain NFT passport.
                </p>

                <div className="border-2 border-dashed border-swiss-black p-8 text-center bg-swiss-muted hover:bg-swiss-white transition-colors">
                  <UploadCloud className="w-10 h-10 mx-auto mb-3 text-swiss-black/60" />
                  <div className="text-sm font-black uppercase tracking-widest text-swiss-black mb-1">
                    Registration Certificate (RC) & Insurance PDF
                  </div>
                  <div className="text-xs text-swiss-black/50 font-mono mb-4">
                    PDF, PNG or JPG up to 10MB
                  </div>
                  <div className="inline-block px-4 py-2 border-2 border-swiss-black bg-swiss-white text-xs font-bold uppercase tracking-wider">
                    {formData.rcDocName} (IPFS Hash Generated)
                  </div>
                </div>

                <div className="p-4 border-2 border-swiss-black bg-swiss-muted font-mono text-xs">
                  <div className="text-swiss-black/50 text-[10px] uppercase mb-1">Simulated IPFS Hash Preview</div>
                  <div className="font-bold text-swiss-accent break-all">
                    QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <SwissButton type="button" variant="secondary" onClick={() => setStep(2)}>
                    Back
                  </SwissButton>
                  <SwissButton type="button" variant="primary" onClick={() => setStep(4)}>
                    Next: Review & Mint <ArrowRight className="inline w-4 h-4 ml-2" />
                  </SwissButton>
                </div>
              </div>
            )}

            {/* Step 4: Review & Mint */}
            {step === 4 && (
              <div className="border-2 border-swiss-black p-8 bg-swiss-white flex flex-col gap-6">
                <SectionLabel number="04" label="PRE-MINT VERIFICATION SUMMARY" />

                <div className="border-2 border-swiss-black p-6 bg-swiss-muted font-mono text-xs divide-y divide-swiss-black/20">
                  <div className="pb-3 flex justify-between">
                    <span className="text-swiss-black/60 uppercase">Vehicle:</span>
                    <span className="font-bold text-swiss-black font-sans uppercase">
                      {formData.year} {formData.make || 'Maruti'} {formData.model || 'Swift'}
                    </span>
                  </div>
                  <div className="py-3 flex justify-between">
                    <span className="text-swiss-black/60 uppercase">Chassis (VIN):</span>
                    <span className="font-bold text-swiss-black">{formData.vin || 'MA3FJEF1S00135201'}</span>
                  </div>
                  <div className="py-3 flex justify-between">
                    <span className="text-swiss-black/60 uppercase">Registration:</span>
                    <span className="font-bold text-swiss-black">{formData.registrationNo || 'KA 01 AB 1234'}</span>
                  </div>
                  <div className="py-3 flex justify-between">
                    <span className="text-swiss-black/60 uppercase">Price:</span>
                    <span className="font-bold text-swiss-accent font-sans">
                      ₹ {Number(formData.price || 850000).toLocaleString()}
                    </span>
                  </div>
                  <div className="pt-3 flex justify-between">
                    <span className="text-swiss-black/60 uppercase">Owner Wallet:</span>
                    <span className="font-bold text-swiss-black">
                      {account ? `${account.slice(0, 8)}...${account.slice(-6)}` : '0x742d...5e2f1'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <SwissButton type="button" variant="secondary" onClick={() => setStep(3)}>
                    Back
                  </SwissButton>
                  <SwissButton type="submit" variant="accent" loading={submitting}>
                    Anchor & Mint NFT Passport
                  </SwissButton>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
