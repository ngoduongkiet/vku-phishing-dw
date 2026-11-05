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

  // Lenis Smooth Momentum Scrolling (Buttery smooth physics)
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

  // Live warehouse rows increment in localStorage
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
    <div className="min-h-screen bg-[#0A0B0E] text-slate-100 flex flex-col relative selection:bg-white selection:text-slate-950">
      
      {/* Top Navbar */}
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

      {/* Linear Style Minimalist Footer */}
      <footer className="border-t border-white/[0.08] bg-[#0A0B0E] py-6 text-xs text-slate-400 font-mono relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="h-5 w-5 rounded bg-[#161822] border border-white/10 flex items-center justify-center text-slate-300">
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
            </div>
            <div>
              <span className="font-semibold text-slate-200">PHISHING SENTINEL</span>
              <span className="text-slate-500 ml-2">• VIETNAM - KOREA UNIVERSITY (VKU)</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-[11px] text-slate-500">
            <div>
              Model: <span className="text-slate-300 font-medium">Star Schema ({totalWarehouseRows.toLocaleString()} rows)</span>
            </div>
            <span>•</span>
            <div>
              Engine: <span className="text-emerald-400 font-medium">Random Forest 99.99%</span>
            </div>
            <span>•</span>
            <div className="text-slate-300 font-medium">
              2 Core Facts (59.4% Weight)
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
