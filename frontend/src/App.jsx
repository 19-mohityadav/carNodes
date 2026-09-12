import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import { RoleProvider } from './context/RoleContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Marketplace from './pages/Marketplace';
import VehicleDetail from './pages/VehicleDetail';
import Passport from './pages/Passport';
import CreateListing from './pages/CreateListing';
import Purchase from './pages/Purchase';
import Escrow from './pages/Escrow';
import OwnershipTransfer from './pages/OwnershipTransfer';
import AuthorityDashboard from './pages/AuthorityDashboard';
import AIAnalysis from './pages/AIAnalysis';
import TxHistory from './pages/TxHistory';
import ConnectWallet from './pages/ConnectWallet';

export default function App() {
  return (
    <BrowserRouter>
      <WalletProvider>
        <RoleProvider>
          <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Home Landing Page with Hero */}
                <Route path="/" element={<Home />} />

                {/* Authentication Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* 02. Marketplace Browse & Search */}
                <Route path="/marketplace" element={<Marketplace />} />

                {/* 03. Vehicle Detail & Tabbed Specs */}
                <Route path="/vehicle/:id" element={<VehicleDetail />} />

                {/* 04. Printable Digital Passport & Seal */}
                <Route path="/passport/:id" element={<Passport />} />

                {/* 05. Create Listing / Tokenize Vehicle */}
                <Route path="/create-listing" element={<CreateListing />} />

                {/* 06. Purchase & Escrow Allowance Flow */}
                <Route path="/purchase/:id" element={<Purchase />} />

                {/* 07. Escrow State Machine & Vault */}
                <Route path="/escrow" element={<Escrow />} />
                <Route path="/escrow/:id" element={<Escrow />} />

                {/* 08. Ownership Transfer RTO Audit */}
                <Route path="/ownership-transfer" element={<OwnershipTransfer />} />
                <Route path="/ownership-transfer/:id" element={<OwnershipTransfer />} />

                {/* 09. Authority Dashboard & Verification Queue */}
                <Route path="/authority" element={<AuthorityDashboard />} />

                {/* 10. AI Risk Analysis & Neural Assistant */}
                <Route path="/ai-analysis" element={<AIAnalysis />} />

                {/* 11. Transaction History on Sepolia */}
                <Route path="/tx-history" element={<TxHistory />} />

                {/* 12. Full-Screen Connect Wallet Modal */}
                <Route path="/connect" element={<ConnectWallet />} />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </RoleProvider>
      </WalletProvider>
    </BrowserRouter>
  );
}
