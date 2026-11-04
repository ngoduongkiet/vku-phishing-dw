import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import URLScanner from './components/URLScanner';
import OLAPDashboard from './components/OLAPDashboard';
import OLAPCube from './components/OLAPCube';
import AILab from './components/AILab';
import StarSchemaView from './components/StarSchemaView';
import AuditModal from './components/AuditModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('scanner');
  const [auditTarget, setAuditTarget] = useState(null);

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

  const totalWarehouseRows = 235795 + extraRows;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Navbar với số dòng tự tăng theo thời gian thực */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        totalRows={totalWarehouseRows}
        extraRows={extraRows}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'scanner' && (
          <URLScanner 
            onOpenAudit={(res) => setAuditTarget(res)} 
            onRecordAdded={handleAddRow}
            totalRows={totalWarehouseRows}
            extraRows={extraRows}
          />
        )}
        {activeTab === 'dashboard' && <OLAPDashboard totalRows={totalWarehouseRows} />}
        {activeTab === 'cube' && <OLAPCube />}
        {activeTab === 'lab' && <AILab />}
        {activeTab === 'schema' && <StarSchemaView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            ĐỒ ÁN KHO DỮ LIỆU & KHAI PHÁ DỮ LIỆU • TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN VÀ TRUYỀN THÔNG VIỆT - HÀN (VKU)
          </div>
          <div className="text-slate-400">
            Mô hình: <span className="text-blue-400">Star Schema (235,795 URLs)</span> • AI: <span className="text-emerald-400">Random Forest (99.99%)</span>
          </div>
        </div>
      </footer>

      {/* Modal Phiếu Kiểm Định */}
      {auditTarget && (
        <AuditModal result={auditTarget} onClose={() => setAuditTarget(null)} />
      )}
    </div>
  );
}
