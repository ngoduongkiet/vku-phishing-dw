import React from 'react';
import { X, Printer, ShieldCheck, ShieldAlert, Award, QrCode, Sparkles } from 'lucide-react';

export default function AuditModal({ result, onClose }) {
  if (!result) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel border-white/[0.12] rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl text-slate-100 bg-[#0A0D18]/95 glow-cyan">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Certificate Header */}
        <div className="text-center pb-6 border-b border-white/[0.08]">
          <div className="inline-flex p-3 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 rounded-2xl border border-cyan-500/30 text-cyan-400 mb-3 shadow-lg shadow-cyan-500/10">
            <Award className="h-8 w-8" />
          </div>
          <div className="text-[10px] uppercase tracking-widest text-cyan-400 font-mono font-bold">
            TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN VÀ TRUYỀN THÔNG VIỆT - HÀN (VKU)
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5 tracking-tight">
            PHIẾU KIỂM ĐỊNH AN TOÀN URL & TÍNH NGUY CƠ PHISHING
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Mã định danh: CERT-VKU-{Math.floor(100000 + Math.random() * 900000)} • Thời gian: {new Date().toLocaleString('vi-VN')}
          </p>
        </div>

        {/* Target URL Box */}
        <div className="my-5 p-4 bg-slate-950/80 rounded-2xl border border-white/[0.08] font-mono text-xs">
          <span className="text-slate-500 block mb-1 text-[10px] tracking-wider uppercase">ĐỐI TƯỢNG ĐƯỢC KIỂM ĐỊNH:</span>
          <div className="text-sm font-bold text-white break-all">{result.url}</div>
        </div>

        {/* Verdict Badge */}
        <div className={`p-5 rounded-2xl border text-center transition-all ${
          result.isLegitimate
            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300 glow-emerald'
            : 'bg-red-950/30 border-red-500/40 text-red-300 glow-crimson'
        }`}>
          <div className="text-xs font-bold uppercase tracking-wider font-mono">KẾT QUẢ PHÂN TÍCH CHÍNH THỨC:</div>
          <div className="text-2xl sm:text-3xl font-black mt-1">
            {result.isLegitimate ? '✅ AN TOÀN (LEGITIMATE)' : '🚨 CẢNH BÁO: WEBSITE LỪA ĐẢO (PHISHING)'}
          </div>
          <div className="text-xs mt-2 font-mono text-slate-300">
            Độ tin cậy thuật toán: <b className="text-white font-bold">{result.confidence}%</b> • Nhãn kho dữ liệu: <b>{result.isLegitimate ? 'Label 1' : 'Label 0'}</b>
          </div>
        </div>

        {/* Star Schema Evidence Grid - ĐẦY ĐỦ 2 FACT & 5 DIMENSION */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-5 text-xs font-mono">
          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-white/[0.06]">
            <span className="text-slate-500 block text-[10px]">FACT 1 (SIMILARITY):</span>
            <span className="text-base font-bold text-white">{result.fact1_similarity.toFixed(1)} / 100</span>
          </div>

          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-white/[0.06]">
            <span className="text-slate-500 block text-[10px]">FACT 2 (EXTERNAL REFS):</span>
            <span className="text-base font-bold text-white">{result.fact2_externalRef.toFixed(1)} links</span>
          </div>

          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-white/[0.06]">
            <span className="text-slate-500 block text-[10px]">DIM 1 (BẢO MẬT SSL):</span>
            <span className={`text-sm font-bold ${result.isHttps ? 'text-emerald-400' : 'text-red-400'}`}>
              {result.protocol} {result.isHttps ? '(Mã hóa)' : '(Trần)'}
            </span>
          </div>

          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-white/[0.06]">
            <span className="text-slate-500 block text-[10px]">DIM 2 (TÊN MIỀN TLD):</span>
            <span className="text-sm font-bold text-cyan-400">{result.tld}</span>
          </div>

          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-white/[0.06]">
            <span className="text-slate-500 block text-[10px]">DIM 3 (TÀI CHÍNH):</span>
            <span className="text-sm font-bold text-amber-400 truncate block">{result.financialCategory}</span>
          </div>

          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-white/[0.06]">
            <span className="text-slate-500 block text-[10px]">DIM 4 (NỘI DUNG WEB):</span>
            <span className={`text-sm font-bold ${result.hasPasswordField ? 'text-red-400' : 'text-slate-300'}`}>
              {result.hasPasswordField ? 'Có Form Password' : 'Không có Form lạ'}
            </span>
          </div>
        </div>

        {/* Footer & Buttons */}
        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
          <div className="text-[11px] text-slate-500 font-mono">
            Hệ thống Kho Dữ Liệu Phishing_DW • Học viện VKU
          </div>
          
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <Printer className="h-4 w-4" />
            <span>In Chứng Nhận PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
}
