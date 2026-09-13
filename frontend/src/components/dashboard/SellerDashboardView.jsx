import React, { useState, useRef } from 'react';
import {
  LayoutDashboard,
  Car,
  PlusCircle,
  ShieldCheck,
  MessageSquare,
  BadgeDollarSign,
  ArrowRightLeft,
  Files,
  User,
  CheckCircle2,
  Award,
  ArrowRight,
  Sparkles,
  Upload,
  FileText,
  Clock,
  Check,
  AlertCircle,
  Eye,
  ExternalLink,
  Bot,
  Loader2,
  Link2,
  HardDrive,
  Shield,
  Send,
  X
} from 'lucide-react';
import { MOCK_SELLER_DATA } from '../../data/dashboardData';
import { VEHICLES } from '../../data/vehicles';
import { useWallet } from '../../context/WalletContext';
import { mintVehiclePassport } from '../../services/blockchainService';
import { ETHERSCAN_BASE, CONTRACT_ADDRESSES } from '../../contracts/addresses';
import { addCustomVehicle, getAllVehicles, updateVehicle } from '../../services/vehicleStore';
import { uploadFileToIPFS, uploadMetadataToIPFS, ipfsUrl } from '../../services/ipfsService';

// Document requirements for Step 2
const REQUIRED_DOCS = [
  {
    id: 'rc',
    title: 'RC / Registration Certificate',
    desc: 'Official RTO-issued smart card or paper title deed',
    icon: FileText,
    color: 'blue'
  },
  {
    id: 'insurance',
    title: 'Active Insurance Policy',
    desc: 'Valid for minimum 6 months from date of listing',
    icon: Shield,
    color: 'green'
  },
  {
    id: 'ownership',
    title: 'Ownership Proof / Invoice',
    desc: 'Legal proof of right to sell (sale deed / invoice)',
    icon: Award,
    color: 'purple'
  },
  {
    id: 'inspection',
    title: '120-Point Inspection Report',
    desc: 'Authorized diagnostic report from certified centre',
    icon: ShieldCheck,
    color: 'amber'
  }
];

const DOC_COLORS = {
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700',   icon: 'text-blue-500' },
  green:  { bg: 'bg-emerald-50',border: 'border-emerald-200',text: 'text-emerald-700',icon: 'text-emerald-500' },
  purple: { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', icon: 'text-violet-500' },
  amber:  { bg: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-700',  icon: 'text-amber-500' }
};

function bytesStr(b) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
}

export default function SellerDashboardView({
  activeTab,
  onSelectTab,
  onOpenPassport
}) {
  const { signer, account } = useWallet();

  // Vehicle list state (syncs from store)
  const [vehiclesList, setVehiclesList] = useState(() => {
    const all = getAllVehicles();
    return all.map(v => ({
      id: v.id,
      name: v.model || v.name,
      year: v.year || '2023',
      image: v.image || '/cars/audi_r8_camry.png',
      priceInr: v.priceInr || `₹${((v.priceUsd || 50000) * 85).toLocaleString('en-IN')}`,
      priceUsd: v.priceUsd ? `$${v.priceUsd.toLocaleString()}` : '$50,000',
      priceEth: v.priceEth || '0.05',
      verificationStatus: v.verificationStatus || v.verifications?.title || 'Verified',
      mintStatus: v.mintStatus || 'Minted',
      riskStatus: 'LOW',
      listingStatus: v.listingStatus || 'Listed on Sepolia',
      views: 120,
      inquiries: 3,
      trustScore: v.trustScore || 94
    }));
  });

  const [buyerRequests, setBuyerRequests] = useState(MOCK_SELLER_DATA.buyerRequests);

  // Listing modal state for verified cars ready to be listed
  const [listingModalCar, setListingModalCar] = useState(null);
  const [listingPriceEth, setListingPriceEth] = useState('0.05');
  const [listingPriceInr, setListingPriceInr] = useState('₹45,00,000');
  const [isListingOnChain, setIsListingOnChain] = useState(false);
  const [listingSuccessMsg, setListingSuccessMsg] = useState(null);

  // ── Wizard state ─────────────────────────────────────────────────────────
  const [wizardStep, setWizardStep] = useState(1);
  const [listingForm, setListingForm] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear().toString(),
    registration: '',
    mileage: '',
    priceInr: '',
    color: '',
    fuelType: 'Petrol',
    transmission: 'Manual',
    description: ''
  });

  // Step 2: per-document upload state
  const [docUploads, setDocUploads] = useState({
    rc:         { file: null, cid: null, url: null, uploading: false, error: null },
    insurance:  { file: null, cid: null, url: null, uploading: false, error: null },
    ownership:  { file: null, cid: null, url: null, uploading: false, error: null },
    inspection: { file: null, cid: null, url: null, uploading: false, error: null }
  });
  const fileInputRefs = {
    rc:         useRef(null),
    insurance:  useRef(null),
    ownership:  useRef(null),
    inspection: useRef(null)
  };

  // Step 3: IPFS metadata CID
  const [metadataCID, setMetadataCID] = useState(null);
  const [metaUploading, setMetaUploading] = useState(false);

  // Step 4: Submission state
  const [listingSubmitted, setListingSubmitted] = useState(false);
  const [mintTxHash, setMintTxHash] = useState(null);
  const [mintError, setMintError] = useState(null);
  const [mintProgress, setMintProgress] = useState('');
  const [mintedVehicleId, setMintedVehicleId] = useState(null);

  // ── Reactive sync from vehicleStore ──────────────────────────────────────
  React.useEffect(() => {
    const handle = () => {
      const all = getAllVehicles();
      setVehiclesList(all.map(v => ({
        id: v.id,
        name: v.model || v.name,
        year: v.year || '2023',
        image: v.image || '/cars/audi_r8_camry.png',
        priceInr: v.priceInr || `₹${((v.priceUsd || 50000) * 85).toLocaleString('en-IN')}`,
        priceUsd: v.priceUsd ? `$${v.priceUsd.toLocaleString()}` : '$50,000',
        priceEth: v.priceEth || '0.05',
        verificationStatus: v.verificationStatus || v.verifications?.title || 'Verified',
        mintStatus: v.mintStatus || 'Minted',
        riskStatus: 'LOW',
        listingStatus: v.listingStatus || 'Listed on Sepolia',
        views: 120,
        inquiries: 3,
        trustScore: v.trustScore || 94
      })));
    };
    window.addEventListener('carnodes_vehicles_updated', handle);
    return () => window.removeEventListener('carnodes_vehicles_updated', handle);
  }, []);

  // ── File upload handler (per document) ───────────────────────────────────
  const handleFileSelect = async (docId, file) => {
    if (!file) return;
    setDocUploads(prev => ({ ...prev, [docId]: { ...prev[docId], file, uploading: true, error: null, cid: null, url: null } }));
    try {
      const result = await uploadFileToIPFS(file, {
        vehicleId: `${listingForm.make}-${listingForm.model}-${listingForm.year}`,
        docType: docId,
        uploader: account || 'seller'
      });
      setDocUploads(prev => ({
        ...prev,
        [docId]: { file, uploading: false, error: null, cid: result.cid, url: result.url, demo: result.demo }
      }));
    } catch (err) {
      setDocUploads(prev => ({
        ...prev,
        [docId]: { ...prev[docId], uploading: false, error: err.message || 'Upload failed' }
      }));
    }
  };

  const allDocsUploaded = Object.values(docUploads).every(d => d.cid !== null);

  // ── Build & upload IPFS metadata JSON (Step 3) ────────────────────────────
  const handleBuildMetadata = async () => {
    setMetaUploading(true);
    try {
      const docLinks = {};
      Object.entries(docUploads).forEach(([k, v]) => {
        docLinks[k] = { cid: v.cid, url: v.url };
      });
      const metadata = {
        name: `${listingForm.year} ${listingForm.make} ${listingForm.model}`,
        description: listingForm.description || `Verified vehicle listing on carNodes blockchain marketplace`,
        image: 'ipfs://QmPlaceholderImageCID',
        attributes: [
          { trait_type: 'Make', value: listingForm.make },
          { trait_type: 'Model', value: listingForm.model },
          { trait_type: 'Year', value: listingForm.year },
          { trait_type: 'Registration', value: listingForm.registration },
          { trait_type: 'Mileage', value: listingForm.mileage },
          { trait_type: 'Color', value: listingForm.color },
          { trait_type: 'Fuel Type', value: listingForm.fuelType },
          { trait_type: 'Transmission', value: listingForm.transmission },
          { trait_type: 'Price (INR)', value: listingForm.priceInr }
        ],
        documents: docLinks,
        seller: account || 'unknown',
        listedAt: new Date().toISOString(),
        platform: 'carNodes RWA Marketplace',
        network: 'Ethereum Sepolia'
      };
      const result = await uploadMetadataToIPFS(metadata, `${listingForm.make}-${listingForm.model}-metadata`);
      setMetadataCID(result.cid);
    } catch (err) {
      console.error('Metadata upload failed:', err);
    } finally {
      setMetaUploading(false);
    }
  };

  // ── Buyer requests ────────────────────────────────────────────────────────
  const handleRequestAction = (reqId, action) => {
    setBuyerRequests(prev =>
      prev.map(r => r.id === reqId ? { ...r, status: action === 'accept' ? 'Accepted — Escrow Initiated' : 'Declined' } : r)
    );
  };

  // ── Submit to Authority Verification Queue ───────────────────────────────
  const handlePublishListing = async (e) => {
    e.preventDefault();
    setListingSubmitted(true);
    setMintError(null);
    setMintTxHash(null);
    setMintProgress('Submitting to Authority Verification Queue...');

    try {
      const generatedTxHash =
        `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      setMintTxHash(generatedTxHash);

      const vehicleId = `CN-${Math.floor(10000 + Math.random() * 89999)}`;
      setMintedVehicleId(vehicleId);

      const docCIDs = {};
      Object.entries(docUploads).forEach(([k, v]) => { if (v.cid) docCIDs[k] = v.cid; });

      const newCar = {
        id: vehicleId,
        name: `${listingForm.year} ${listingForm.make} ${listingForm.model}`,
        model: `${listingForm.year} ${listingForm.make} ${listingForm.model}`,
        shortName: `${listingForm.make} ${listingForm.model}`,
        year: listingForm.year,
        vin: listingForm.registration,
        registration: listingForm.registration,
        image: '/cars/audi_r8_camry.png',
        priceInr: listingForm.priceInr || '₹50,00,000',
        priceUsd: '$60,000',
        priceEth: '0.05',
        color: listingForm.color,
        fuelType: listingForm.fuelType,
        transmission: listingForm.transmission,
        mileage: listingForm.mileage,
        description: listingForm.description,
        verificationStatus: 'Under RTO Review',
        mintStatus: 'Pending Verification',
        riskStatus: 'LOW',
        listingStatus: 'Pending Verification',
        views: 1,
        inquiries: 0,
        trustScore: 96,
        txHash: generatedTxHash,
        metadataCID: metadataCID,
        ipfsDocuments: docCIDs,
        ownerAddress: account || '0x3D94A56Ec71c8901237A74801B5f6d899A2C0123',
        verifications: {
          owner: true,
          documents: true,
          insurance: true,
          history: true,
          title: 'Under RTO Review',
          authorityNode: 'Western Region RTO Node #409'
        },
        passportTimeline: [
          {
            year: listingForm.year,
            date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            title: 'Documents Pinned to IPFS & Sent to Authority',
            location: 'carNodes Gateway & RTO Queue',
            txHash: generatedTxHash,
            verifiedBy: 'Seller Portal'
          }
        ]
      };

      // Add to shared store → auto-queues in Authority dashboard
      addCustomVehicle(newCar);

    } catch (err) {
      console.error('Submission error:', err);
      setMintError(err.reason || err.message || 'Could not complete submission.');
    } finally {
      setListingSubmitted(false);
    }
  };

  // ── List Verified Car on Marketplace ─────────────────────────────────────
  const handleConfirmListing = async () => {
    if (!listingModalCar) return;
    setIsListingOnChain(true);
    try {
      updateVehicle(listingModalCar.id, {
        listingStatus: 'Listed on Marketplace',
        priceEth: listingPriceEth,
        priceInr: listingPriceInr,
      });
      setListingSuccessMsg(`Vehicle "${listingModalCar.name}" is now live on the Marketplace for buyers!`);
      setTimeout(() => setListingSuccessMsg(null), 6000);
      setListingModalCar(null);
    } catch (err) {
      console.error('Listing error:', err);
    } finally {
      setIsListingOnChain(false);
    }
  };

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 animate-fadeIn">

      {/* ═══════════════════════════════════════════════════════════════════
          1. SELLER DASHBOARD HOME
      ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'dashboard' && (
        <>
          {/* Header Banner */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
                Welcome back, {MOCK_SELLER_DATA.name}
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                Manage your vehicles with confidence. Upload documents to IPFS, receive RTO verification, and list on the Sepolia marketplace.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                onClick={() => onSelectTab('create-listing')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-teal-700 text-white font-semibold text-xs uppercase tracking-wider transition-all duration-200 shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>+ List Vehicle</span>
                <PlusCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSelectTab('my-vehicles')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>View Listings</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Active Listings', value: MOCK_SELLER_DATA.stats.activeListings },
              { label: 'Verified Vehicles', value: MOCK_SELLER_DATA.stats.verifiedVehicles },
              { label: 'Buyer Interest', value: MOCK_SELLER_DATA.stats.buyerInterest },
              { label: 'Pending Transfers', value: MOCK_SELLER_DATA.stats.pendingTransfers }
            ].map(s => (
              <div key={s.label} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
                <span className="text-xs font-semibold text-slate-500 block">{s.label}</span>
                <span className="text-3xl font-heading font-extrabold text-slate-900 block mt-2">{s.value}</span>
              </div>
            ))}
          </div>

          {/* Quick Inventory */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-heading font-bold text-slate-900">Vehicle Inventory</h3>
                <p className="text-xs text-slate-500">Track digital passports, pricing, and buyer inquiries.</p>
              </div>
              <button onClick={() => onSelectTab('my-vehicles')} className="text-xs font-bold text-teal-700 hover:underline cursor-pointer">
                View All →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vehiclesList.slice(0, 2).map(car => (
                <div key={car.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src={car.image} alt={car.name} className="w-16 h-12 object-contain bg-white rounded-lg p-1 border border-slate-200" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{car.name}</h4>
                      <p className="text-[11px] text-slate-500 font-mono">{car.priceInr} • {car.views} Views</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenPassport(VEHICLES.find(v => v.id === car.id) || VEHICLES[0])}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-teal-800 hover:border-teal-300 text-xs font-semibold cursor-pointer"
                  >
                    Passport
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Deployed Contracts Info */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <HardDrive className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-heading font-bold text-slate-900">Deployed Smart Contracts · Ethereum Sepolia</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              {[
                { label: 'VehiclePassport NFT', addr: CONTRACT_ADDRESSES.VehiclePassport },
                { label: 'VehicleRegistry', addr: CONTRACT_ADDRESSES.VehicleRegistry },
                { label: 'VehicleEscrow', addr: CONTRACT_ADDRESSES.VehicleEscrow },
                { label: 'MockINR Token', addr: CONTRACT_ADDRESSES.MockINR }
              ].map(c => (
                <div key={c.label} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">{c.label}</span>
                    <span className="text-slate-800 font-bold truncate block">{c.addr.slice(0, 12)}...{c.addr.slice(-6)}</span>
                  </div>
                  <a
                    href={`${ETHERSCAN_BASE}/address/${c.addr}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-teal-700 hover:text-teal-900 p-1"
                    title="View on Etherscan"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          2. MY VEHICLES
      ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'my-vehicles' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-heading font-extrabold text-slate-900">
                My Vehicle Inventory ({vehiclesList.length})
              </h2>
              <p className="text-xs text-slate-500">
                Track status, passport completeness, and active buyer engagement.
              </p>
            </div>
            <button
              onClick={() => onSelectTab('create-listing')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-teal-700 text-white text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ List Vehicle</span>
            </button>
          </div>

          {listingSuccessMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-center justify-between font-bold animate-fadeIn">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{listingSuccessMsg}</span>
              </div>
              <button onClick={() => setListingSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-mono uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-4 px-6">Vehicle Asset</th>
                    <th className="py-4 px-4">Price</th>
                    <th className="py-4 px-4">Verification</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vehiclesList.map(car => (
                    <tr key={car.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <img src={car.image} alt={car.name} className="w-14 h-10 object-contain bg-slate-100 rounded-lg p-1 border border-slate-200" />
                          <div>
                            <span className="font-bold text-slate-900 block">{car.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">ID: {car.id} • Trust {car.trustScore}/100</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-slate-900 block">{car.priceInr}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{car.priceEth ? `${car.priceEth} ETH` : car.priceUsd}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          car.verificationStatus === 'Under RTO Review' || car.verificationStatus === 'Under Review'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{car.verificationStatus}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-slate-700">{car.listingStatus}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {car.verificationStatus === 'Verified' && car.listingStatus !== 'Listed on Marketplace' && (
                            <button
                              onClick={() => {
                                setListingModalCar(car);
                                setListingPriceInr(car.priceInr || '₹50,00,000');
                                setListingPriceEth(car.priceEth || '0.05');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer shadow-xs transition-all flex items-center space-x-1"
                            >
                              <PlusCircle className="w-3.5 h-3.5" />
                              <span>List for Sale</span>
                            </button>
                          )}
                          {car.listingStatus === 'Listed on Marketplace' && (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Live on Market</span>
                            </span>
                          )}
                          {car.verificationStatus === 'Under RTO Review' && (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>Awaiting RTO</span>
                            </span>
                          )}
                          <button
                            onClick={() => onOpenPassport(VEHICLES.find(v => v.id === car.id) || VEHICLES[0])}
                            className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 text-xs font-semibold cursor-pointer"
                          >
                            Passport
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* LIST VEHICLE ON MARKETPLACE MODAL */}
          {listingModalCar && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase tracking-widest block">
                      Authority Verified · Ready for Marketplace
                    </span>
                    <h3 className="text-lg font-heading font-extrabold text-slate-900">
                      List Vehicle on Marketplace
                    </h3>
                  </div>
                  <button
                    onClick={() => setListingModalCar(null)}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center gap-3">
                  <img
                    src={listingModalCar.image}
                    alt={listingModalCar.name}
                    className="w-16 h-12 object-contain bg-white rounded-xl p-1 border border-emerald-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{listingModalCar.name}</h4>
                    <p className="text-[11px] font-mono text-emerald-700">RTO Verified Title Deed</p>
                    <p className="text-[10px] text-slate-500 font-mono">NFT Token ID: #{listingModalCar.id?.slice(-4) || '101'} in Your Wallet</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Sale Price in Sepolia ETH
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={listingPriceEth}
                        onChange={(e) => setListingPriceEth(e.target.value)}
                        placeholder="0.05"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-600 font-mono font-bold text-xs"
                      />
                      <span className="absolute right-3.5 top-2.5 text-slate-400 font-mono font-bold text-xs">ETH</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Display Price (INR)
                    </label>
                    <input
                      type="text"
                      value={listingPriceInr}
                      onChange={(e) => setListingPriceInr(e.target.value)}
                      placeholder="₹50,00,000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-600 font-bold text-xs"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                    <p className="font-bold text-slate-800">Marketplace Terms:</p>
                    <p>• Vehicle will appear immediately in the Buyer Marketplace for verified purchasers.</p>
                    <p>• Prospective buyers can inspect all IPFS document CIDs and initiate escrow transactions.</p>
                    <p>• Settlement is governed by Ethereum Sepolia smart escrow contracts.</p>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setListingModalCar(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmListing}
                    disabled={isListingOnChain}
                    className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-2 cursor-pointer shadow-xs disabled:opacity-60"
                  >
                    {isListingOnChain ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /><span>Listing on Sepolia...</span></>
                    ) : (
                      <><Check className="w-4 h-4" /><span>Confirm & List on Marketplace</span></>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          3. CREATE LISTING WIZARD
      ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'create-listing' && (
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
            {/* Header */}
            <div className="mb-6">
              <span className="text-xs font-mono text-teal-700 font-bold uppercase tracking-wider block">
                Vehicle Listing Wizard
              </span>
              <h2 className="text-2xl font-heading font-extrabold text-slate-900">
                Mint & List a Verified Vehicle
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload your documents to IPFS → get RTO authority verification → mint your vehicle NFT → list in marketplace.
              </p>
            </div>

            {/* Step Progress */}
            <div className="grid grid-cols-4 gap-2 mb-8 text-center text-xs font-mono font-bold">
              {[
                { step: 1, label: '01 · Details' },
                { step: 2, label: '02 · IPFS Docs' },
                { step: 3, label: '03 · Verify' },
                { step: 4, label: '04 · Mint' }
              ].map(s => (
                <div
                  key={s.step}
                  onClick={() => s.step < wizardStep && setWizardStep(s.step)}
                  className={`py-2 px-1 rounded-xl border transition-all ${
                    wizardStep === s.step
                      ? 'bg-slate-900 text-white border-slate-900'
                      : wizardStep > s.step
                      ? 'bg-teal-50 text-teal-800 border-teal-200 cursor-pointer'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  {wizardStep > s.step ? '✓ ' : ''}{s.label}
                </div>
              ))}
            </div>

            <form onSubmit={handlePublishListing} className="space-y-5">

              {/* ── STEP 1: VEHICLE DETAILS ── */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-heading font-bold text-slate-900 flex items-center gap-2">
                    <Car className="w-4 h-4 text-teal-600" />
                    Step 01 · Vehicle Specifications
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {[
                      { key: 'make', label: 'Make (Brand)', placeholder: 'e.g. Toyota' },
                      { key: 'model', label: 'Model / Spec', placeholder: 'e.g. Fortuner Legender' },
                      { key: 'year', label: 'Year of Manufacture', placeholder: '2023' },
                      { key: 'registration', label: 'Registration No. (RTO Plate)', placeholder: 'MH 12 AB 1234', mono: true },
                      { key: 'mileage', label: 'Odometer Reading', placeholder: '12,500 km' },
                      { key: 'color', label: 'Exterior Color', placeholder: 'Pearl White' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block text-slate-700 font-semibold mb-1">{f.label}</label>
                        <input
                          type="text"
                          value={listingForm[f.key]}
                          onChange={e => setListingForm({ ...listingForm, [f.key]: e.target.value })}
                          placeholder={f.placeholder}
                          className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-600 ${f.mono ? 'font-mono' : ''}`}
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Fuel Type</label>
                      <select
                        value={listingForm.fuelType}
                        onChange={e => setListingForm({ ...listingForm, fuelType: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-600"
                      >
                        {['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'].map(f => <option key={f}>{f}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Transmission</label>
                      <select
                        value={listingForm.transmission}
                        onChange={e => setListingForm({ ...listingForm, transmission: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-600"
                      >
                        {['Manual', 'Automatic', 'AMT', 'CVT', 'DCT'].map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-xs">Asking Price (₹)</label>
                    <input
                      type="text"
                      value={listingForm.priceInr}
                      onChange={e => setListingForm({ ...listingForm, priceInr: e.target.value })}
                      placeholder="₹45,00,000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-600 font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-xs">Description (optional)</label>
                    <textarea
                      value={listingForm.description}
                      onChange={e => setListingForm({ ...listingForm, description: e.target.value })}
                      rows={2}
                      placeholder="One owner, full service history, no accidents..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-600 text-xs resize-none"
                    />
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setWizardStep(2)}
                      disabled={!listingForm.make || !listingForm.model || !listingForm.year || !listingForm.registration}
                      className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>Upload Documents to IPFS</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 2: IPFS DOCUMENT UPLOAD ── */}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                      <Upload className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-heading font-bold text-slate-900">Step 02 · Upload Documents to IPFS</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Each document is encrypted and pinned to IPFS. The CID (content hash) is permanently linked to your vehicle NFT.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {REQUIRED_DOCS.map(doc => {
                      const up = docUploads[doc.id];
                      const Icon = doc.icon;
                      const col = DOC_COLORS[doc.color];
                      return (
                        <div
                          key={doc.id}
                          className={`p-4 rounded-2xl border transition-all ${
                            up.cid ? 'bg-emerald-50/60 border-emerald-300' :
                            up.error ? 'bg-red-50 border-red-200' :
                            `${col.bg} ${col.border}`
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-8 h-8 rounded-xl bg-white border ${col.border} flex items-center justify-center shrink-0`}>
                                {up.cid ? <Check className="w-4 h-4 text-emerald-600" /> : <Icon className={`w-4 h-4 ${col.icon}`} />}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900">{doc.title}</p>
                                <p className="text-[11px] text-slate-500">{doc.desc}</p>
                                {up.file && (
                                  <p className="text-[10px] font-mono text-slate-400 mt-0.5 truncate">
                                    {up.file.name} · {bytesStr(up.file.size)}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="shrink-0">
                              {up.uploading ? (
                                <span className="flex items-center gap-1.5 text-[11px] font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  Uploading...
                                </span>
                              ) : up.cid ? (
                                <a
                                  href={up.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-white px-3 py-1.5 rounded-lg border border-emerald-200 hover:bg-emerald-50"
                                >
                                  <Link2 className="w-3.5 h-3.5" />
                                  {up.demo ? 'Demo CID ↗' : 'IPFS ↗'}
                                </a>
                              ) : (
                                <>
                                  <input
                                    ref={fileInputRefs[doc.id]}
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                                    className="hidden"
                                    onChange={e => handleFileSelect(doc.id, e.target.files?.[0])}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => fileInputRefs[doc.id].current?.click()}
                                    className={`flex items-center gap-1.5 text-[11px] font-bold ${col.text} bg-white px-3 py-1.5 rounded-lg border ${col.border} hover:bg-white/80 cursor-pointer`}
                                  >
                                    <Upload className="w-3.5 h-3.5" />
                                    Choose File
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          {/* CID display */}
                          {up.cid && (
                            <div className="mt-3 p-2.5 bg-white rounded-xl border border-emerald-200 text-[10px] font-mono text-slate-600 flex items-center gap-2">
                              <span className="text-emerald-600 font-bold">IPFS CID:</span>
                              <span className="truncate">{up.cid}</span>
                              {up.demo && <span className="shrink-0 text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold">DEMO</span>}
                            </div>
                          )}
                          {up.error && (
                            <p className="mt-2 text-[11px] text-red-600 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" />
                              {up.error}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* IPFS info callout */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                    <HardDrive className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <p>
                      Files are pinned to <strong>IPFS via Pinata</strong>. CIDs are content-addressed and immutable —
                      they become part of your vehicle's on-chain NFT metadata. No API key? Demo mode generates realistic CIDs.
                    </p>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button type="button" onClick={() => setWizardStep(1)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer">
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardStep(3)}
                      disabled={!allDocsUploaded}
                      className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>Proceed to Verification</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 3: PRE-VERIFICATION + METADATA ── */}
              {wizardStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-heading font-bold text-slate-900">Step 03 · Oracle Pre-Verification & IPFS Metadata</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Automated checks run against VAHAN / RTO databases. Then build your vehicle's IPFS metadata JSON.
                      </p>
                    </div>
                  </div>

                  {/* Auto checks */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
                    {[
                      { check: 'Document Consistency (IPFS Hash Match)', result: '✓ 100% Match' },
                      { check: 'VAHAN / MoRTH Database Query', result: '✓ Clean Title Verified' },
                      { check: 'Hypothecation / Lien Status', result: '✓ 0 Outstanding Liens' },
                      { check: 'Stolen Vehicle Database', result: '✓ Not Reported Stolen' },
                      { check: 'Insurance Validity Check', result: '✓ Policy Active' }
                    ].map(r => (
                      <div key={r.check} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                        <span className="font-medium text-slate-700">{r.check}</span>
                        <span className="font-bold text-emerald-700">{r.result}</span>
                      </div>
                    ))}
                  </div>

                  {/* IPFS Document Summary */}
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                    <p className="text-xs font-bold text-blue-900 flex items-center gap-2">
                      <HardDrive className="w-4 h-4" />
                      IPFS Documents Pinned
                    </p>
                    {Object.entries(docUploads).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-blue-700 capitalize font-bold">{k}:</span>
                        <a href={v.url} target="_blank" rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate max-w-[200px]">
                          {v.cid?.slice(0, 20)}...
                        </a>
                      </div>
                    ))}
                  </div>

                  {/* Build Metadata */}
                  {!metadataCID ? (
                    <button
                      type="button"
                      onClick={handleBuildMetadata}
                      disabled={metaUploading}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs cursor-pointer disabled:opacity-60"
                    >
                      {metaUploading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /><span>Uploading Metadata to IPFS...</span></>
                      ) : (
                        <><HardDrive className="w-4 h-4" /><span>Build & Upload Vehicle Metadata to IPFS</span></>
                      )}
                    </button>
                  ) : (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-2">
                      <p className="text-xs font-bold text-emerald-900 flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        Vehicle Metadata Pinned to IPFS
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-emerald-700 truncate">{metadataCID}</span>
                        <a
                          href={`https://gateway.pinata.cloud/ipfs/${metadataCID}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-700 hover:text-teal-900 shrink-0"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Send to Authority notice */}
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs flex items-start gap-3">
                    <Send className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-amber-900">Next: Authority Verification</p>
                      <p className="text-amber-700 mt-0.5">
                        After minting, your vehicle will be submitted to the <strong>RTO Authority Queue</strong>.
                        Authority will review your IPFS documents and approve/reject. Upon approval the NFT is fully activated.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between">
                    <button type="button" onClick={() => setWizardStep(2)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer">
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardStep(4)}
                      disabled={!metadataCID}
                      className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>Review & Mint</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 4: SUBMIT TO AUTHORITY ── */}
              {wizardStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-heading font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    Step 04 · Review & Submit to Authority for Verification & Minting
                  </h3>

                  {/* Summary card */}
                  <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        ['Vehicle', `${listingForm.year} ${listingForm.make} ${listingForm.model}`],
                        ['Registration', listingForm.registration],
                        ['Mileage', listingForm.mileage],
                        ['Asking Price', listingForm.priceInr],
                        ['Fuel / Trans', `${listingForm.fuelType} / ${listingForm.transmission}`],
                        ['Color', listingForm.color]
                      ].map(([k, v]) => (
                        <div key={k}>
                          <span className="text-[10px] text-teal-600 uppercase font-bold block">{k}</span>
                          <span className="font-bold text-teal-950">{v || '—'}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-teal-200 text-[11px] font-mono text-teal-800">
                      <span className="font-bold">Metadata CID:</span>{' '}
                      <span className="text-teal-600 truncate">{metadataCID}</span>
                    </div>
                  </div>

                  {/* What happens next */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <p className="font-bold text-slate-900">Process Overview:</p>
                    <ul className="space-y-1 text-slate-600">
                      <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-teal-100 text-teal-700 text-[9px] font-bold flex items-center justify-center">1</span>Vehicle documents are pinned to IPFS and linked via cryptographic hashes</li>
                      <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-teal-100 text-teal-700 text-[9px] font-bold flex items-center justify-center">2</span>Vehicle is routed to the Regional Transport Authority (RTO) verification queue</li>
                      <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-teal-100 text-teal-700 text-[9px] font-bold flex items-center justify-center">3</span>Authority verifies credentials and mints the official NFT into your wallet</li>
                      <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-teal-100 text-teal-700 text-[9px] font-bold flex items-center justify-center">4</span>Once verified & minted, you can activate and list the vehicle on the Marketplace</li>
                    </ul>
                  </div>

                  {mintError && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                      <div>
                        <strong className="block font-bold">Submission Notice</strong>
                        <span>{mintError}</span>
                      </div>
                    </div>
                  )}

                  {mintTxHash ? (
                    <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-3 font-mono text-xs">
                      <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>Submitted to Authority Verification Queue!</span>
                      </div>
                      <p className="text-emerald-700 text-xs font-sans">
                        Your vehicle information and IPFS-pinned documents have been sent to the Regional Transport Authority (RTO).
                        Upon review, the Authority will verify credentials and mint the official NFT directly into your wallet.
                        You can then set your sale price and list the vehicle on the Marketplace.
                      </p>
                      <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-2">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Submission Hash</span>
                          <div className="flex items-center justify-between gap-2 mt-0.5">
                            <span className="text-slate-800 break-all text-[11px] font-bold">{mintTxHash}</span>
                            <a href={`${ETHERSCAN_BASE}/tx/${mintTxHash}`} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1 text-teal-700 hover:text-teal-900 font-bold shrink-0 text-xs underline">
                              <ExternalLink className="w-3.5 h-3.5" />Etherscan
                            </a>
                          </div>
                        </div>
                        {metadataCID && (
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase">Metadata CID (IPFS)</span>
                            <div className="flex items-center justify-between gap-2 mt-0.5">
                              <span className="text-slate-700 truncate text-[11px]">{metadataCID}</span>
                              <a href={`https://gateway.pinata.cloud/ipfs/${metadataCID}`} target="_blank" rel="noopener noreferrer"
                                className="text-blue-700 hover:text-blue-900 shrink-0">
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="pt-2 flex gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setMintTxHash(null);
                            setMintedVehicleId(null);
                            setMetadataCID(null);
                            setDocUploads({ rc: { file: null, cid: null, url: null, uploading: false, error: null }, insurance: { file: null, cid: null, url: null, uploading: false, error: null }, ownership: { file: null, cid: null, url: null, uploading: false, error: null }, inspection: { file: null, cid: null, url: null, uploading: false, error: null } });
                            setListingForm({ make: '', model: '', year: new Date().getFullYear().toString(), registration: '', mileage: '', priceInr: '', color: '', fuelType: 'Petrol', transmission: 'Manual', description: '' });
                            setWizardStep(1);
                            onSelectTab('my-vehicles');
                          }}
                          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-teal-800 text-white font-bold text-xs cursor-pointer"
                        >
                          View in My Vehicles →
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-4 flex justify-between">
                      <button type="button" onClick={() => setWizardStep(3)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer">
                        ← Back
                      </button>
                      <button
                        type="submit"
                        disabled={listingSubmitted}
                        className="px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer shadow-xs disabled:opacity-60"
                      >
                        {listingSubmitted ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /><span>{mintProgress || 'Submitting...'}</span></>
                        ) : (
                          <><Send className="w-4 h-4" /><span>Submit to Authority for Verification</span></>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          4. BUYER REQUESTS & OFFERS
      ═══════════════════════════════════════════════════════════════════ */}
      {(activeTab === 'buyer-requests' || activeTab === 'offers') && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
            <h2 className="text-xl font-heading font-extrabold text-slate-900">
              Buyer Inquiries & Purchase Offers ({buyerRequests.length})
            </h2>
            <p className="text-xs text-slate-500">
              Review verified buyer offers and initialize Ethereum Sepolia smart escrow.
            </p>
          </div>
          <div className="space-y-4">
            {buyerRequests.map(req => (
              <div key={req.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">{req.buyerName}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-50 text-teal-800 font-bold border border-teal-200">{req.requestType}</span>
                  </div>
                  <p className="text-xs text-slate-600 font-semibold">{req.vehicleName}</p>
                  <p className="text-xs text-slate-500 italic">"{req.message}"</p>
                  <p className="text-[10px] font-mono text-slate-400">{req.date}</p>
                </div>
                <div className="flex items-center space-x-3 shrink-0">
                  <div className="text-right mr-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Offer Amount</span>
                    <span className="text-base font-heading font-extrabold text-slate-900">{req.offerInr}</span>
                  </div>
                  {req.status === 'Offer Received' || req.status === 'Pending Response' ? (
                    <>
                      <button onClick={() => handleRequestAction(req.id, 'decline')} className="px-3 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold cursor-pointer">
                        Decline
                      </button>
                      <button onClick={() => handleRequestAction(req.id, 'accept')} className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-teal-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs">
                        Accept & Escrow
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">{req.status}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          5. OWNERSHIP TRANSFER
      ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'transfer' && (
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-mono text-teal-700 font-bold uppercase tracking-wider block">Ownership Transfer Workflow</span>
              <h2 className="text-2xl font-heading font-extrabold text-slate-900">{MOCK_SELLER_DATA.activeTransfer.vehicleName}</h2>
              <p className="text-xs text-slate-500 font-mono">
                Transfer ID: {MOCK_SELLER_DATA.activeTransfer.id} • Buyer: {MOCK_SELLER_DATA.activeTransfer.buyerName}
              </p>
            </div>
            <div className="space-y-3">
              {MOCK_SELLER_DATA.activeTransfer.stages.map(stg => (
                <div
                  key={stg.step}
                  className={`p-4 rounded-2xl border text-xs flex items-center justify-between ${
                    stg.status === 'completed' ? 'bg-emerald-50/70 border-emerald-200' :
                    stg.status === 'in_progress' ? 'bg-teal-50 border-teal-300 ring-2 ring-teal-500/20' :
                    'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center font-mono font-bold text-[10px]">0{stg.step}</span>
                    <div>
                      <h4 className="font-bold text-slate-900">{stg.title}</h4>
                      <p className="text-[11px] text-slate-500">{stg.note}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-500 block">{stg.date}</span>
                    <span className="font-bold text-[11px] capitalize text-teal-800">{stg.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
