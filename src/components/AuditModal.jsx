import React from 'react';
import { X, Printer, ShieldCheck, ShieldAlert, Award, QrCode } from 'lucide-react';

export default function AuditModal({ result, onClose }) {
  if (!result) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl animate-fade-in text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Certificate Header */}
        <div className="text-center pb-6 border-b border-slate-800">
          <div className="inline-flex p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-400 mb-3">
            <Award className="h-8 w-8" />
          </div>
          <div className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">
            TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN VÀ TRUYỀN THÔNG VIỆT - HÀN (VKU)
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            PHIẾU KIỂM ĐỊNH AN TOÀN URL & TÍNH NGUY CƠ PHISHING
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Mã định danh: CERT-VKU-{Math.floor(100000 + Math.random() * 900000)} • Thời gian: {new Date().toLocaleString('vi-VN')}
          </p>
        </div>

        {/* Target URL Box */}
        <div className="my-5 p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs">
          <span className="text-slate-500 block mb-1">ĐỐI TƯỢNG ĐƯỢC KIỂM ĐỊNH:</span>
          <div className="text-sm font-bold text-white break-all">{result.url}</div>
        </div>

        {/* Verdict Badge */}
        <div className={`p-5 rounded-xl border text-center ${
          result.isLegitimate
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
            : 'bg-red-950/40 border-red-500/40 text-red-300'
        }`}>
          <div className="text-xs font-bold uppercase tracking-wider">KẾT QUẢ PHÂN TÍCH CHÍNH THỨC:</div>
          <div className="text-2xl font-black mt-1">
            {result.isLegitimate ? '✅ AN TOÀN (LEGITIMATE)' : '🚨 CẢNH BÁO: WEBSITE LỪA ĐẢO (PHISHING)'}
          </div>
          <div className="text-xs mt-1 font-mono">
            Độ tin cậy thuật toán: <b>{result.confidence}%</b> • Nhãn kho dữ liệu: <b>{result.isLegitimate ? 'Label 1' : 'Label 0'}</b>
          </div>
        </div>

        {/* Star Schema Evidence Grid - ĐẦY ĐỦ 2 FACT & 5 DIMENSION */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-5 text-xs font-mono">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">FACT 1 (SIMILARITY):</span>
            <span className="text-base font-bold text-white">{result.fact1_similarity.toFixed(1)} / 100</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">FACT 2 (EXTERNAL REFS):</span>
            <span className="text-base font-bold text-white">{result.fact2_externalRef.toFixed(1)} links</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">DIM 1 (BẢO MẬT SSL):</span>
            <span className={`text-sm font-bold ${result.isHttps ? 'text-emerald-400' : 'text-red-400'}`}>
              {result.protocol} {result.isHttps ? '(Mã hóa)' : '(Trần)'}
            </span>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">DIM 2 (TÊN MIỀN TLD):</span>
            <span className="text-sm font-bold text-blue-400">{result.tld}</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">DIM 3 (TÀI CHÍNH):</span>
            <span className="text-sm font-bold text-amber-400 truncate block">{result.financialCategory}</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">DIM 4 (NỘI DUNG WEB):</span>
            <span className={`text-sm font-bold ${result.hasPasswordField ? 'text-red-400' : 'text-slate-300'}`}>
              {result.hasPasswordField ? 'Có Form Password' : 'Không có Form lạ'}
            </span>
          </div>
        </div>

        {/* Footer & Buttons */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 font-mono">
            Hệ thống Kho Dữ Liệu Phishing_DW • Học viện VKU
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>In Phiếu Kiểm Định</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
