import React from 'react';
import { X, Printer, ShieldCheck, ShieldAlert, Award, QrCode } from 'lucide-react';

export default function AuditModal({ result, onClose }) {
  if (!result) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="linear-card border-white/15 rounded-xl max-w-2xl w-full p-6 sm:p-7 relative shadow-2xl text-slate-100 bg-[#0E1017]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Certificate Header */}
        <div className="text-center pb-5 border-b border-white/[0.08]">
          <div className="text-[10px] uppercase tracking-widest text-slate-400 font-mono font-semibold">
            VIETNAM - KOREA UNIVERSITY OF INFORMATION AND COMMUNICATION TECHNOLOGY (VKU)
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1 tracking-tight">
            URL SECURITY AUDIT & PHISHING RISK CERTIFICATE
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Audit ID: CERT-VKU-{Math.floor(100000 + Math.random() * 900000)} • Timestamp: {new Date().toLocaleString('vi-VN')}
          </p>
        </div>

        {/* Target URL Box */}
        <div className="my-4 p-3.5 bg-[#08090C] rounded-lg border border-white/10 font-mono text-xs">
          <span className="text-slate-500 block mb-1 text-[10px] uppercase">INSPECTED TARGET URL:</span>
          <div className="text-sm font-semibold text-white break-all">{result.url}</div>
        </div>

        {/* Verdict Badge */}
        <div className={`p-4 rounded-lg border text-center transition-all ${
          result.isLegitimate
            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400'
            : 'bg-red-950/20 border-red-500/30 text-red-400'
        }`}>
          <div className="text-[10px] font-bold uppercase tracking-wider font-mono">OFFICIAL MODEL VERDICT:</div>
          <div className="text-xl sm:text-2xl font-bold mt-1">
            {result.isLegitimate ? 'AUTHENTIC / LEGITIMATE DOMAIN' : 'MALICIOUS PHISHING THREAT'}
          </div>
          <div className="text-xs mt-1.5 font-mono text-slate-300">
            Model Confidence: <b className="text-white font-semibold">{result.confidence}%</b> • Warehouse Label: <b>{result.isLegitimate ? 'Label 1 (Safe)' : 'Label 0 (Threat)'}</b>
          </div>
        </div>

        {/* Star Schema Evidence Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-4 text-xs font-mono">
          <div className="p-3 bg-[#08090C] rounded border border-white/5">
            <span className="text-slate-500 block text-[10px]">FACT 1 (SIMILARITY):</span>
            <span className="text-sm font-bold text-white">{result.fact1_similarity.toFixed(1)} / 100</span>
          </div>

          <div className="p-3 bg-[#08090C] rounded border border-white/5">
            <span className="text-slate-500 block text-[10px]">FACT 2 (BACKLINKS):</span>
            <span className="text-sm font-bold text-white">{result.fact2_externalRef.toFixed(1)} links</span>
          </div>

          <div className="p-3 bg-[#08090C] rounded border border-white/5">
            <span className="text-slate-500 block text-[10px]">DIM 1 (PROTOCOL):</span>
            <span className={`text-sm font-bold ${result.isHttps ? 'text-emerald-400' : 'text-slate-400'}`}>
              {result.protocol} {result.isHttps ? '(SSL Encrypted)' : '(Plain)'}
            </span>
          </div>

          <div className="p-3 bg-[#08090C] rounded border border-white/5">
            <span className="text-slate-500 block text-[10px]">DIM 2 (TLD):</span>
            <span className="text-sm font-bold text-slate-200">{result.tld}</span>
          </div>

          <div className="p-3 bg-[#08090C] rounded border border-white/5">
            <span className="text-slate-500 block text-[10px]">DIM 3 (FINANCIAL):</span>
            <span className="text-sm font-bold text-amber-400 truncate block">{result.financialCategory}</span>
          </div>

          <div className="p-3 bg-[#08090C] rounded border border-white/5">
            <span className="text-slate-500 block text-[10px]">DIM 4 (FORMS):</span>
            <span className={`text-sm font-bold ${result.hasPasswordField ? 'text-red-400' : 'text-slate-400'}`}>
              {result.hasPasswordField ? 'Password Form' : 'Clean'}
            </span>
          </div>
        </div>

        {/* Footer & Buttons */}
        <div className="pt-3.5 border-t border-white/[0.08] flex items-center justify-between">
          <div className="text-[11px] text-slate-500 font-mono">
            Phishing_DW • Data Warehouse & Data Mining Course
          </div>
          
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-white text-slate-950 hover:bg-slate-200 font-semibold rounded-md text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print PDF</span>
            <kbd className="bg-black/10 text-slate-900 border-black/20">⌘P</kbd>
          </button>
        </div>

      </div>
    </div>
  );
}
