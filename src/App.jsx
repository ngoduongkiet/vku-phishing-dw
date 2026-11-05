import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import URLScanner from './components/URLScanner';
import OLAPDashboard from './components/OLAPDashboard';
import OLAPCube from './components/OLAPCube';
import AILab from './components/AILab';
import StarSchemaView from './components/StarSchemaView';
import AuditModal from './components/AuditModal';
import { ShieldCheck, Database, Award, ExternalLink } from 'lucide-react';
import Lenis from 'lenis';

export default function App() {
  const [activeTab, setActiveTab] = useState('scanner');
  const [auditTarget, setAuditTarget] = useState(null);

  // Khởi tạo Lenis Smooth Momentum Scrolling (Lướt cuộn mượt mà có quán tính chuẩn Apple / Linear)
  useEffect(() => {
    let lenis;
    let rafId;
    try {
      lenis = new Lenis({
        duration: 0.9,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
      });

      function raf(time) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }

      rafId = requestAnimationFrame(raf);
    } catch (e) {
      console.warn('Lenis smooth scroll initialization:', e);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
    };
  }, []);

  // Lưu trữ số bản ghi mới nạp qua ETL vào localStorage để web luôn tự tăng
  const [extraRows, setExtraRows] = useState(() => {
    try {
      const saved = localStorage.getItem('vku_phishing_extra_rows');
      return saved ? parseInt(saved, 10) : 0;
    } catch (e) {
      return 0;
    }
  });

  const handleAddRow = () => {
    setExtraRows(prev => {
      const next = prev + 1;
      try {
        localStorage.setItem('vku_phishing_extra_rows', next.toString());
      } catch (e) {}
      return next;
    });
  };

  const handleResetRows = () => {
    setExtraRows(0);
    try {
      localStorage.removeItem('vku_phishing_extra_rows');
    } catch (e) {}
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalWarehouseRows = 235795 + extraRows;

  return (
    <div className="min-h-screen bg-[#06080F] bg-cyber-grid text-slate-100 flex flex-col relative selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Dynamic Ambient Background Lights (Hardware accelerated, no layout shifts) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] radial-glow-cyan pointer-events-none -z-0"></div>
      <div className="absolute top-[650px] right-0 w-[500px] h-[500px] radial-glow-indigo pointer-events-none -z-0"></div>

      {/* Top Navbar với số dòng tự tăng theo thời gian thực */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        totalRows={totalWarehouseRows}
        extraRows={extraRows}
        onResetRows={handleResetRows}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 relative z-10">
        {activeTab === 'scanner' && (
          <URLScanner 
            onOpenAudit={(res) => setAuditTarget(res)} 
            onRecordAdded={handleAddRow}
            onResetRows={handleResetRows}
            totalRows={totalWarehouseRows}
            extraRows={extraRows}
          />
        )}
        {activeTab === 'dashboard' && <OLAPDashboard totalRows={totalWarehouseRows} />}
        {activeTab === 'cube' && <OLAPCube />}
        {activeTab === 'lab' && <AILab />}
        {activeTab === 'schema' && <StarSchemaView />}
      </main>

      {/* Certificate / Audit Modal */}
      {auditTarget && (
        <AuditModal 
          result={auditTarget} 
          onClose={() => setAuditTarget(null)} 
        />
      )}

      {/* Footer Pro Max */}
      <footer className="border-t border-white/[0.08] bg-[#05070D]/95 py-7 text-xs text-slate-400 font-mono relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="h-6 w-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="font-extrabold text-slate-200">AEGIS PHISHMATRIX PLATFORM</span>
              <span className="text-slate-500 ml-2">• TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN VÀ TRUYỀN THÔNG VIỆT - HÀN (VKU)</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-slate-500">
            <div>
              Mô hình: <span className="text-cyan-400 font-bold">Star Schema ({totalWarehouseRows.toLocaleString()} URLs)</span>
            </div>
            <span>•</span>
            <div>
              AI: <span className="text-emerald-400 font-bold">Random Forest (99.99%)</span>
            </div>
            <span>•</span>
            <div className="text-amber-400 font-bold">
              2 Fact Measures (59.4% Impact)
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
