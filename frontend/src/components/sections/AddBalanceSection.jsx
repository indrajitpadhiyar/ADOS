import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  ArrowLeft,
  Check,
  CreditCard,
  QrCode,
  Building,
  ShieldCheck,
  Sparkles,
  Zap,
  TrendingUp,
  Receipt,
  Download,
  CheckCircle2,
  Lock,
  ArrowRight,
  Info,
  Clock,
} from "lucide-react";

export default function AddBalanceSection() {
  const navigate = useNavigate();

  // Current balance loaded from localStorage
  const [currentBalance, setCurrentBalance] = useState(() => {
    try {
      const stored = localStorage.getItem("ados_user_balance");
      return stored ? parseFloat(stored) : 0;
    } catch {
      return 0;
    }
  });

  // Selected Amount presets
  const presets = [
    {
      amount: 2000,
      label: "Starter",
      badge: null,
      desc: "Ideal for A/B creative testing",
      bonus: 0,
    },
    {
      amount: 5000,
      label: "Campaign Launch",
      badge: null,
      desc: "Multi-platform test runs",
      bonus: 0,
    },
    {
      amount: 10000,
      label: "Growth Pack",
      badge: "Most Popular",
      desc: "Full AI audience discovery & bids",
      bonus: 0,
    },
    {
      amount: 25000,
      label: "Scale Tier",
      badge: "+₹500 Bonus",
      desc: "+2% promotional media credit",
      bonus: 500,
    },
    {
      amount: 50000,
      label: "Enterprise Line",
      badge: "+₹2,500 Bonus",
      desc: "+5% promotional media credit",
      bonus: 2500,
    },
    {
      amount: 100000,
      label: "High Volume",
      badge: "+₹8,000 Bonus",
      desc: "+8% promotional media credit",
      bonus: 8000,
    },
  ];

  const [selectedPreset, setSelectedPreset] = useState(10000);
  const [customAmount, setCustomAmount] = useState("10000");
  const [isCustom, setIsCustom] = useState(false);

  // Payment methods
  const [paymentMethod, setPaymentMethod] = useState("upi"); // "upi" | "card" | "netbanking" | "wire"
  const [selectedBank, setSelectedBank] = useState("HDFC");
  const [upiId, setUpiId] = useState("");
  const [applyGst, setApplyGst] = useState(true);
  const [gstin, setGstin] = useState("27AADCB2230M1ZT");

  // Checkout modal / simulation state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionData, setTransactionData] = useState(null);

  // Sync balance if external changes occur
  useEffect(() => {
    const handleSync = () => {
      try {
        const stored = localStorage.getItem("ados_user_balance");
        if (stored) setCurrentBalance(parseFloat(stored));
      } catch {}
    };
    window.addEventListener("balance_updated", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("balance_updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const handleSelectPreset = (amt) => {
    setSelectedPreset(amt);
    setCustomAmount(amt.toString());
    setIsCustom(false);
  };

  const handleCustomAmountChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setCustomAmount(val);
    setIsCustom(true);
    setSelectedPreset(Number(val));
  };

  const rechargeAmount = Math.max(0, Number(customAmount) || 0);
  const currentPresetObj = presets.find((p) => p.amount === rechargeAmount);
  const bonusCredit = currentPresetObj ? currentPresetObj.bonus : 0;
  const gstAmount = applyGst ? Math.round(rechargeAmount * 0.18) : 0;
  const totalPayable = rechargeAmount + gstAmount;

  const handleInitiatePayment = () => {
    if (rechargeAmount < 500) {
      alert("Minimum recharge amount is ₹500");
      return;
    }

    setIsProcessing(true);
    setProcessingStep(1);

    // Step 1: Gateway connection
    setTimeout(() => {
      setProcessingStep(2);
    }, 1200);

    // Step 2: 3D Secure Verification
    setTimeout(() => {
      setProcessingStep(3);
    }, 2400);

    // Step 3: Success & balance credited
    setTimeout(() => {
      const addedTotal = rechargeAmount + bonusCredit;
      const updatedBalance = currentBalance + addedTotal;
      localStorage.setItem("ados_user_balance", updatedBalance.toString());
      window.dispatchEvent(new Event("balance_updated"));
      setCurrentBalance(updatedBalance);

      const txnId = `TXN-ADOS-${Math.floor(100000 + Math.random() * 900000)}`;
      setTransactionData({
        txnId,
        amount: rechargeAmount,
        bonus: bonusCredit,
        totalCredited: addedTotal,
        gst: gstAmount,
        totalPaid: totalPayable,
        date: new Date().toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        method: paymentMethod.toUpperCase(),
      });

      setIsProcessing(false);
      setIsSuccess(true);
    }, 3600);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. Header with Breadcrumb Back link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors mb-2 cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shadow-xs">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#111113] tracking-tight">
                Add Ad Account Balance
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Top up your media spend wallet for multi-network autonomous campaign bidding.
              </p>
            </div>
          </div>
        </div>

        {/* Live Balance Pill */}
        <div className="flex items-center gap-3 self-start sm:self-auto bg-white border border-slate-200/80 p-2.5 px-4 rounded-2xl shadow-2xs">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 leading-none">
              Current Available Balance
            </div>
            <div className="text-lg font-black text-[#111113] leading-tight mt-0.5">
              ₹{currentBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL / OVERLAY */}
      <AnimatePresence>
        {isSuccess && transactionData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Payment Successful
                </span>
                <h2 className="text-2xl font-black text-[#111113] mt-3">
                  ₹{transactionData.totalCredited.toLocaleString("en-IN")} Added to Balance
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Your funds are now active and ready for automated ad bids.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs space-y-2.5 text-left">
                <div className="flex justify-between text-slate-500">
                  <span>Transaction ID:</span>
                  <span className="font-mono font-bold text-slate-800">{transactionData.txnId}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Payment Method:</span>
                  <span className="font-bold text-slate-800">{transactionData.method}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Timestamp:</span>
                  <span className="text-slate-800 font-medium">{transactionData.date}</span>
                </div>
                <div className="border-t border-slate-200/80 my-2" />
                <div className="flex justify-between text-slate-500">
                  <span>Base Recharge:</span>
                  <span className="font-bold text-slate-800">
                    ₹{transactionData.amount.toLocaleString("en-IN")}
                  </span>
                </div>
                {transactionData.bonus > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Promotional Bonus Credit:</span>
                    <span>+₹{transactionData.bonus.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>GST (18% ITC Claimable):</span>
                  <span className="text-slate-800 font-medium">
                    ₹{transactionData.gst.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-[#111113] pt-1 border-t border-slate-200">
                  <span>Total Debited:</span>
                  <span>₹{transactionData.totalPaid.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-emerald-700 pt-1">
                  <span>Updated New Wallet Balance:</span>
                  <span>₹{currentBalance.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => navigate("/manage-ads")}
                  className="py-3 px-4 rounded-xl bg-[#111113] hover:bg-black text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  Manage Ads
                </button>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setTransactionData(null);
                  }}
                  className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                >
                  Add More Balance
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PROCESSING MODAL SIMULATION */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto relative">
                <Lock className="w-7 h-7" />
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
              </div>

              <div>
                <h3 className="text-lg font-black text-[#111113]">
                  {processingStep === 1 && "Connecting to Secure Gateway..."}
                  {processingStep === 2 && "Verifying 3D Secure Token..."}
                  {processingStep === 3 && "Finalizing & Crediting Wallet..."}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Please do not refresh or close this window.
                </p>
              </div>

              <div className="space-y-2 text-xs text-left bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  {processingStep >= 1 ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-400" />
                  )}
                  <span>256-Bit SSL Encrypted Connection</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  {processingStep >= 2 ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-400" />
                  )}
                  <span>RBI Compliant Tokenization</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  {processingStep >= 3 ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-400" />
                  )}
                  <span>Instant Multi-Network Pacing Sync</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid: Left Selection, Right Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: AMOUNT SELECTION & PAYMENT METHOD */}
        <div className="lg:col-span-8 space-y-8">
          {/* STEP 1: SELECT AMOUNT */}
          <section className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#ff4a22]">
                  Step 1
                </span>
                <h2 className="text-lg font-black text-[#111113]">
                  Select Recharge Amount
                </h2>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                Min. ₹500
              </span>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {presets.map((preset) => {
                const isSelected = !isCustom && selectedPreset === preset.amount;
                return (
                  <button
                    key={preset.amount}
                    onClick={() => handleSelectPreset(preset.amount)}
                    className={`relative p-4 rounded-2xl border text-left transition-all cursor-pointer group flex flex-col justify-between h-32 ${
                      isSelected
                        ? "bg-emerald-50/80 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20"
                        : "bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/60"
                    }`}
                  >
                    {preset.badge && (
                      <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#111113] text-white shadow-xs">
                        {preset.badge}
                      </span>
                    )}

                    <div>
                      <div className="text-[11px] font-bold text-slate-400">
                        {preset.label}
                      </div>
                      <div className="text-xl font-black text-[#111113] mt-0.5">
                        ₹{preset.amount.toLocaleString("en-IN")}
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-500 leading-tight">
                      {preset.desc}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Amount Input */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Or Enter Custom Amount (INR):
              </label>
              <div className="relative max-w-md">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-extrabold text-base">
                  ₹
                </span>
                <input
                  type="text"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  placeholder="e.g. 15000"
                  className="w-full pl-9 pr-4 py-3 rounded-2xl border border-slate-200 bg-white font-extrabold text-[#111113] text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                />
              </div>
              {rechargeAmount > 0 && rechargeAmount < 500 && (
                <p className="text-xs text-red-500 font-semibold mt-1.5">
                  Amount must be at least ₹500.
                </p>
              )}
            </div>
          </section>

          {/* STEP 2: PAYMENT METHOD */}
          <section className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#ff4a22]">
                Step 2
              </span>
              <h2 className="text-lg font-black text-[#111113]">
                Choose Payment Method
              </h2>
            </div>

            {/* Method Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: "upi", label: "Instant UPI", icon: QrCode, sub: "GPay, PhonePe" },
                { id: "card", label: "Cards", icon: CreditCard, sub: "Visa, MC, Amex" },
                { id: "netbanking", label: "NetBanking", icon: Building, sub: "Top Banks" },
                { id: "wire", label: "Bank Wire", icon: Receipt, sub: "NEFT / RTGS" },
              ].map((m) => {
                const isSelected = paymentMethod === m.id;
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                      isSelected
                        ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                        : "bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? "text-emerald-400" : "text-slate-500"}`} />
                    <span className="text-xs font-bold leading-tight">{m.label}</span>
                    <span className={`text-[10px] ${isSelected ? "text-slate-300" : "text-slate-400"}`}>
                      {m.sub}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Method Specific Details */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70">
              {paymentMethod === "upi" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Scan QR with any UPI App</span>
                    <span className="text-emerald-600 font-bold text-[11px]">Instant 0s sync</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Simulated Dynamic QR Code */}
                    <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col items-center">
                      <div className="w-32 h-32 bg-slate-900 rounded-xl flex items-center justify-center p-2 text-white relative">
                        <QrCode className="w-24 h-24 text-white" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white p-1 rounded-md text-[8px] font-black text-slate-900 shadow">
                            ADOS
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 mt-2">
                        adospay@hdfcbank
                      </span>
                    </div>

                    <div className="flex-1 space-y-3 w-full">
                      <label className="block text-xs font-bold text-slate-700">
                        Or enter UPI VPA / ID:
                      </label>
                      <input
                        type="text"
                        placeholder="yourname@okhdfcbank"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {["GPay", "PhonePe", "Paytm", "CRED", "BHIM"].map((app) => (
                          <span
                            key={app}
                            className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600"
                          >
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "card" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Credit or Debit Card</span>
                    <span className="text-slate-400 text-[11px]">Domestic & International</span>
                  </div>
                  <div className="space-y-2.5">
                    {/* Saved Card Option */}
                    <div className="p-3 bg-white rounded-xl border border-emerald-500/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-6 bg-slate-900 text-white rounded flex items-center justify-center text-[10px] font-black">
                          VISA
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            Corporate Visa ending in •••• 4242
                          </div>
                          <div className="text-[10px] text-slate-400">Expires 09/28</div>
                        </div>
                      </div>
                      <input
                        type="password"
                        placeholder="CVV"
                        maxLength="3"
                        className="w-16 px-2 py-1 text-center rounded-lg border border-slate-200 text-xs font-bold"
                      />
                    </div>

                    <button
                      type="button"
                      className="text-xs text-[#ff4a22] font-bold hover:underline cursor-pointer"
                    >
                      + Use a different card
                    </button>
                  </div>
                </div>
              )}

              {paymentMethod === "netbanking" && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-800">
                    Select Your Bank
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["HDFC", "ICICI", "SBI", "Axis", "Kotak", "IndusInd", "Yes Bank"].map((b) => (
                      <button
                        key={b}
                        onClick={() => setSelectedBank(b)}
                        className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          selectedBank === b
                            ? "bg-white border-emerald-500 text-emerald-800 shadow-2xs"
                            : "bg-white/80 border-slate-200 text-slate-600 hover:bg-white"
                        }`}
                      >
                        {b} Bank
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {paymentMethod === "wire" && (
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="font-bold text-slate-900">
                    Direct Corporate Wire (RTGS / NEFT)
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    For enterprise payments over ₹1,00,000. Balance is credited upon receipt confirmation (typically within 15-30 minutes during banking hours).
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-[11px] space-y-1">
                    <div>A/C Name: ADOS TECH PRIVATE LIMITED</div>
                    <div>A/C No: 50200084920194</div>
                    <div>IFSC: HDFC0000240</div>
                  </div>
                </div>
              )}
            </div>

            {/* GST Tax Invoice Toggle */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={applyGst}
                  onChange={(e) => setApplyGst(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs font-bold text-slate-800">
                  Claim 18% GST Input Tax Credit (ITC for registered business)
                </span>
              </label>

              {applyGst && (
                <div className="pl-6">
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    placeholder="Enter 15-character GSTIN"
                    className="max-w-xs px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Tax invoice with your GSTIN will be automatically emailed upon payment.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: STICKY ORDER SUMMARY */}
        <div className="lg:col-span-4 sticky top-28 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-extrabold text-sm text-[#111113]">
                Order Summary
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                0% Gateway Fee
              </span>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Media Recharge:</span>
                <span className="font-bold text-slate-900">
                  ₹{rechargeAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>

              {bonusCredit > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Bonus Ad Credits:
                  </span>
                  <span>+₹{bonusCredit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>GST (18%):</span>
                <span className="font-medium text-slate-800">
                  ₹{gstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Payment Processing Fee:</span>
                <span className="text-emerald-600 font-bold">₹0.00 (Waived)</span>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                <div>
                  <div className="text-sm font-extrabold text-[#111113]">Total Payable</div>
                  <div className="text-[10px] text-slate-400">Includes all applicable taxes</div>
                </div>
                <div className="text-2xl font-black text-[#111113]">
                  ₹{totalPayable.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* Estimated Reach Impact Card */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-teal-50/50 border border-emerald-200/60 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-900 font-extrabold">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Estimated Campaign Impact</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Will unlock approximately{" "}
                <span className="font-extrabold">
                  {(rechargeAmount * 18).toLocaleString("en-IN")} - {(rechargeAmount * 24).toLocaleString("en-IN")}
                </span>{" "}
                targeted ad impressions across connected ad channels.
              </p>
            </div>

            {/* Proceed Button */}
            <button
              onClick={handleInitiatePayment}
              disabled={rechargeAmount < 500}
              className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-98 ${
                rechargeAmount >= 500
                  ? "bg-[#111113] hover:bg-black text-white hover:shadow-lg"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <Zap className="w-4 h-4 text-[#ff4a22]" />
              <span>Proceed to Add ₹{totalPayable.toLocaleString("en-IN")}</span>
            </button>

            {/* Security Badges */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-4 text-[10px] font-semibold text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                256-Bit SSL
              </span>
              <span>•</span>
              <span>PCI-DSS Level 1</span>
              <span>•</span>
              <span>RBI Authorized</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
