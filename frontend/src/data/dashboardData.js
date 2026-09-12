// Comprehensive mock dataset for Buyer, Seller, and Authority/RTO Dashboards

export const MOCK_BUYER_DATA = {
  name: "Arjun Mehta",
  email: "arjun.m@carnodes.io",
  phone: "+91 98765 43210",
  avatar: "AM",
  walletAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  network: "Ethereum Sepolia",
  stats: {
    verifiedViewed: 12,
    savedVehicles: 5,
    activeTransactions: 1,
    trustStatus: "Verified"
  },
  savedVehicleIds: ["CN-48291", "CN-77310", "CN-10294"],
  comparisons: [
    {
      id: "CMP-01",
      title: "Performance Coupé Comparison",
      date: "10 Sep 2026",
      vehicleIds: ["CN-48291", "CN-10294"]
    }
  ],
  activePurchase: {
    id: "TX-BUY-8921",
    vehicleId: "CN-48291",
    vehicleName: "2022 Toyota Camry XSE / Audi R8 V10",
    priceInr: "₹42,50,000",
    priceUsd: "$48,500",
    sellerName: "Vikram Singhania",
    currentStage: 3, // 1: Vehicle Selected, 2: Verification, 3: Secure Transaction, 4: Ownership Transfer
    stages: [
      { id: 1, title: "Vehicle Selected", status: "completed", date: "09 Sep 2026, 11:30 AM", detail: "Vehicle reserved with initial cryptographic intent" },
      { id: 2, title: "Verification", status: "completed", date: "10 Sep 2026, 02:15 PM", detail: "100% DMV Title & Inspection verified on-chain" },
      { id: 3, title: "Secure Transaction", status: "in_progress", date: "12 Sep 2026, Active", detail: "Funds locked in Sepolia Smart Escrow Contract" },
      { id: 4, title: "Ownership Transfer", status: "pending", date: "Pending RTO Signature", detail: "Awaiting final biometric & digital key release" }
    ],
    escrowAddress: "0x89Fa...31Bc (Sepolia)",
    depositAmount: "₹42,50,000"
  },
  transactionsHistory: [
    {
      id: "TX-77102",
      date: "15 Aug 2026",
      vehicle: "2023 Audi TT RS Coupé",
      type: "Escrow Deposit",
      amount: "₹54,00,000",
      status: "Completed",
      txHash: "0x3f4a...92b1",
      blockchain: "Ethereum Sepolia"
    },
    {
      id: "TX-66201",
      date: "28 Jul 2026",
      vehicle: "Digital Passport Verification Fee",
      type: "Oracle Fee",
      amount: "₹1,500",
      status: "Completed",
      txHash: "0x11b2...88aa",
      blockchain: "Ethereum Sepolia"
    }
  ]
};

export const MOCK_SELLER_DATA = {
  name: "Vikram Singhania",
  company: "Apex Luxury Motocorp",
  email: "vikram@apexluxury.in",
  phone: "+91 98201 55432",
  avatar: "VS",
  walletAddress: "0x3D94A56Ec71c8901237A74801B5f6d899A2C0123",
  network: "Ethereum Sepolia",
  stats: {
    activeListings: 4,
    verifiedVehicles: 3,
    buyerInterest: 18,
    pendingTransfers: 1
  },
  vehicles: [
    {
      id: "CN-48291",
      name: "2022 Toyota Camry XSE / Audi R8 V10",
      year: "2022",
      image: "/cars/audi_r8_camry.png",
      priceInr: "₹42,50,000",
      priceUsd: "$48,500",
      verificationStatus: "Verified",
      riskStatus: "LOW",
      listingStatus: "Listed",
      views: 1420,
      inquiries: 8,
      trustScore: 94
    },
    {
      id: "CN-10294",
      name: "2023 Audi TT RS Coupé",
      year: "2023",
      image: "/cars/audi_tt.png",
      priceInr: "₹54,00,000",
      priceUsd: "$62,900",
      verificationStatus: "Verified",
      riskStatus: "LOW",
      listingStatus: "Listed",
      views: 980,
      inquiries: 5,
      trustScore: 98
    },
    {
      id: "CN-77310",
      name: "2024 Audi RS e-tron GT",
      year: "2024",
      image: "/cars/rs_line.png",
      priceInr: "₹1,02,00,000",
      priceUsd: "$118,000",
      verificationStatus: "Verified",
      riskStatus: "LOW",
      listingStatus: "Under Offer",
      views: 2410,
      inquiries: 12,
      trustScore: 96
    },
    {
      id: "CN-50091",
      name: "2023 Ford Mustang Shelby GT500",
      year: "2023",
      image: "/cars/shelby_gt500.png",
      priceInr: "₹81,00,000",
      priceUsd: "$94,500",
      verificationStatus: "Under Review",
      riskStatus: "LOW",
      listingStatus: "Draft Review",
      views: 310,
      inquiries: 1,
      trustScore: 92
    }
  ],
  buyerRequests: [
    {
      id: "REQ-901",
      buyerName: "Arjun Mehta",
      vehicleId: "CN-48291",
      vehicleName: "2022 Toyota Camry XSE / Audi R8 V10",
      requestType: "Purchase Offer & Verification",
      offerInr: "₹42,00,000",
      offerUsd: "$48,000",
      date: "12 Sep 2026, 10:15 AM",
      status: "Offer Received",
      message: "Ready to deposit in escrow upon confirmation of clean title history."
    },
    {
      id: "REQ-902",
      buyerName: "Devendra Kulkarni",
      vehicleId: "CN-77310",
      vehicleName: "2024 Audi RS e-tron GT",
      requestType: "Inspection Booking",
      offerInr: "₹1,00,00,000",
      offerUsd: "$116,000",
      date: "11 Sep 2026, 04:40 PM",
      status: "In Negotiation",
      message: "Requested live battery telemetry audit from EV diagnostic node."
    },
    {
      id: "REQ-903",
      buyerName: "Pooja Sharma",
      vehicleId: "CN-10294",
      vehicleName: "2023 Audi TT RS Coupé",
      requestType: "Direct Offer",
      offerInr: "₹52,50,000",
      offerUsd: "$61,000",
      date: "09 Sep 2026, 01:20 PM",
      status: "Pending Response",
      message: "Can complete transfer this week with instant Sepolia Escrow."
    }
  ],
  activeTransfer: {
    id: "TRF-SEL-004",
    vehicleName: "2022 Toyota Camry XSE / Audi R8 V10",
    vehicleId: "CN-48291",
    buyerName: "Arjun Mehta",
    stages: [
      { step: 1, title: "Buyer Confirmed", status: "completed", date: "09 Sep 2026", note: "Buyer approved offer price ₹42,50,000" },
      { step: 2, title: "Vehicle Verified", status: "completed", date: "10 Sep 2026", note: "RTO inspection pass stamped" },
      { step: 3, title: "Transaction Secured", status: "completed", date: "11 Sep 2026", note: "Funds locked in Ethereum Smart Escrow" },
      { step: 4, title: "Authority Approval", status: "in_progress", date: "12 Sep 2026", note: "Awaiting RTO Digital Signature" },
      { step: 5, title: "Ownership Updated", status: "pending", date: "Estimated Today", note: "NFT Title token re-minting to buyer wallet" }
    ]
  },
  aiPricingAssistant: {
    vehicleId: "CN-48291",
    suggestedPriceInr: "₹42,80,000",
    suggestedPriceUsd: "$48,900",
    marketRange: "₹41,50,000 – ₹44,20,000",
    confidence: "High (99.1%)",
    reasoning: "Based on 32 recent pan-India verified transactions of similar spec, mileage under 25k mi, and 100% clean accident record on IPFS.",
    listingDescription: "Flawless condition 2022 Toyota Camry XSE / Audi R8 Coupé with 100% RTO verified title, active insurance, and complete service records anchored to Ethereum Sepolia."
  }
};

export const MOCK_AUTHORITY_DATA = {
  name: "Inspector R. Deshmukh",
  title: "Regional Transport Office (RTO) - MH02 Node",
  jurisdiction: "Western Region - Node #409",
  badgeId: "RTO-IND-MH02-8812",
  walletAddress: "0x892a0142C8B56819aF12D71C74801B5f6d899A2C",
  network: "Ethereum Sepolia (Authority Oracle)",
  stats: {
    pendingVerifications: 24,
    approvedToday: 18,
    transferRequests: 7,
    riskAlerts: 3
  },
  verificationQueue: [
    {
      id: "VQ-1092",
      vehicleId: "CN-48291",
      vehicleName: "1969 Dodge Charger R/T / 2022 Camry XSE",
      vin: "1FA6P8CF0H51092831",
      registrationNo: "MH 02 ER 4829",
      ownerName: "Vikram Singhania",
      ownerType: "Certified Dealer",
      verificationType: "Vehicle + Documents",
      submittedDate: "Today, 09:15 AM",
      risk: "LOW",
      riskScore: 94,
      status: "Pending",
      documentsCount: 6,
      checklist: {
        identityMatch: "verified",
        registrationDoc: "verified",
        ownershipProof: "verified",
        insurance: "verified",
        inspection: "verified",
        financeStatus: "pending"
      }
    },
    {
      id: "VQ-1093",
      vehicleId: "CN-10294",
      vehicleName: "2023 Audi TT RS Coupé",
      vin: "TRUZZZ8J4CA019284",
      registrationNo: "DL 01 AB 1029",
      ownerName: "Sanjay Verma",
      ownerType: "Individual Seller",
      verificationType: "Title Re-verification",
      submittedDate: "Today, 10:45 AM",
      risk: "LOW",
      riskScore: 98,
      status: "Under Review",
      documentsCount: 5,
      checklist: {
        identityMatch: "verified",
        registrationDoc: "verified",
        ownershipProof: "verified",
        insurance: "verified",
        inspection: "verified",
        financeStatus: "verified"
      }
    },
    {
      id: "VQ-1094",
      vehicleId: "CN-77310",
      vehicleName: "2024 Audi RS e-tron GT",
      vin: "WAUZZZF88NA003921",
      registrationNo: "MH 04 CZ 7731",
      ownerName: "Ananya Deshpande",
      ownerType: "Individual Seller",
      verificationType: "EV Battery & Telemetry Registry",
      submittedDate: "Yesterday, 04:30 PM",
      risk: "LOW",
      riskScore: 96,
      status: "Verified",
      documentsCount: 7,
      checklist: {
        identityMatch: "verified",
        registrationDoc: "verified",
        ownershipProof: "verified",
        insurance: "verified",
        inspection: "verified",
        financeStatus: "verified"
      }
    },
    {
      id: "VQ-1095",
      vehicleId: "CN-50091",
      vehicleName: "2023 Ford Mustang Shelby GT500",
      vin: "1FA6P8SJ4L5502910",
      registrationNo: "KA 05 MN 5009",
      ownerName: "Rohan Kapoor",
      ownerType: "Individual Seller",
      verificationType: "Chassis & Engine Number Match",
      submittedDate: "Yesterday, 02:10 PM",
      risk: "LOW",
      riskScore: 92,
      status: "Pending",
      documentsCount: 5,
      checklist: {
        identityMatch: "verified",
        registrationDoc: "verified",
        ownershipProof: "verified",
        insurance: "verified",
        inspection: "pending",
        financeStatus: "pending"
      }
    },
    {
      id: "VQ-1096",
      vehicleId: "CN-99214",
      vehicleName: "2021 BMW M4 Competition",
      vin: "WBA43AZ08MCH88219",
      registrationNo: "MH 12 QP 9921",
      ownerName: "Karan Malhotra",
      ownerType: "Individual Seller",
      verificationType: "Chassis Alteration Audit",
      submittedDate: "10 Sep 2026",
      risk: "MEDIUM",
      riskScore: 68,
      status: "Rejected",
      documentsCount: 4,
      checklist: {
        identityMatch: "verified",
        registrationDoc: "verified",
        ownershipProof: "mismatch",
        insurance: "verified",
        inspection: "mismatch",
        financeStatus: "pending"
      }
    }
  ],
  transferRequests: [
    {
      id: "OTR-401",
      vehicleId: "CN-48291",
      vehicleName: "1969 Dodge Charger R/T / 2022 Camry XSE",
      vin: "1FA6P8CF0H51092831",
      currentOwner: "Vikram Singhania (Seller)",
      newOwner: "Arjun Mehta (Buyer)",
      transactionStatus: "Escrow Verified",
      documentsStatus: "Complete",
      status: "Awaiting Authority Approval",
      date: "12 Sep 2026",
      escrowAmount: "₹42,50,000",
      taxPaidStatus: "Paid (Receipt #RTO-TX-9901)"
    },
    {
      id: "OTR-402",
      vehicleId: "CN-77310",
      vehicleName: "2024 Audi RS e-tron GT",
      vin: "WAUZZZF88NA003921",
      currentOwner: "Ananya Deshpande",
      newOwner: "Devendra Kulkarni",
      transactionStatus: "Escrow Verified",
      documentsStatus: "Complete",
      status: "Awaiting Authority Approval",
      date: "11 Sep 2026",
      escrowAmount: "₹1,02,00,000",
      taxPaidStatus: "Paid (Receipt #RTO-TX-8842)"
    }
  ],
  riskAlerts: [
    {
      id: "ALT-01",
      vehicle: "2021 BMW M4 Competition (MH 12 QP 9921)",
      vehicleId: "CN-99214",
      issue: "Document mismatch detected in chassis serial engraving scan vs VAHAN database.",
      severity: "High",
      date: "12 Sep 2026, 08:30 AM",
      action: "Requires Physical Inspection"
    },
    {
      id: "ALT-02",
      vehicle: "2023 Mercedes AMG C63 (DL 03 XY 8810)",
      vehicleId: "CN-33109",
      issue: "Ownership information requires review due to unreleased hypothecation lien.",
      severity: "Medium",
      date: "11 Sep 2026, 03:15 PM",
      action: "Bank NOC Required"
    },
    {
      id: "ALT-03",
      vehicle: "2020 Porsche 911 Carrera (MH 01 AB 7741)",
      vehicleId: "CN-22019",
      issue: "Insurance policy renewal timestamp pending live national insurer sync.",
      severity: "Low",
      date: "10 Sep 2026, 11:20 AM",
      action: "Poll IIB Oracle"
    }
  ],
  auditTrail: [
    {
      id: "AUD-891",
      date: "12 Sep 2026, 11:15 AM",
      action: "Vehicle Verified",
      vehicle: "2024 Audi RS e-tron GT (#CN-77310)",
      operator: "Inspector R. Deshmukh (MH02)",
      blockchain: "Ethereum Sepolia",
      txHash: "0x9c8b31a2...7a6f99b1",
      status: "Recorded On-Chain"
    },
    {
      id: "AUD-890",
      date: "12 Sep 2026, 10:45 AM",
      action: "Document Approved",
      vehicle: "2023 Audi TT RS Coupé (#CN-10294)",
      operator: "Inspector R. Deshmukh (MH02)",
      blockchain: "Ethereum Sepolia",
      txHash: "0x11b24901...99a0ef42",
      status: "Recorded On-Chain"
    },
    {
      id: "AUD-889",
      date: "11 Sep 2026, 05:20 PM",
      action: "Ownership Transfer Initiated",
      vehicle: "2022 Toyota Camry XSE / Audi R8 (#CN-48291)",
      operator: "Sepolia Escrow Protocol Oracle",
      blockchain: "Ethereum Sepolia",
      txHash: "0x7f4a8812...92b1cc34",
      status: "Recorded On-Chain"
    },
    {
      id: "AUD-888",
      date: "11 Sep 2026, 02:00 PM",
      action: "Hypothecation Clearance Stamped",
      vehicle: "2023 Ford Mustang Shelby GT500 (#CN-50091)",
      operator: "Banking Node Gateway #10",
      blockchain: "Ethereum Sepolia",
      txHash: "0x3c914028...81a07712",
      status: "Recorded On-Chain"
    }
  ]
};
