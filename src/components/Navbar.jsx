import React from 'react';
import { Shield, Database, Cpu, Activity, BarChart2, Layers, Box, Terminal, ShieldCheck } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, totalRows = 235795, extraRows = 0, onResetRows }) {
  const tabs = [
    { id: 'scanner', label: '1. AI Quét URL & 2 Fact Cốt Lõi', icon: ShieldCheck },
    { id: 'dashboard', label: '2. Dashboard Trực Quan OLAP', icon: BarChart2 },
    { id: 'cube', label: '3. Khối Lập Phương OLAP (Cube)', icon: Box },
    { id: 'lab', label: '4. Thẩm Định Mô Hình AI & Fact', icon: Cpu },
    { id: 'schema', label: '5. Kiến Trúc Star Schema', icon: Layers },
  ];

  return (
    <header className="border-b border-white/[0.08] bg-[#0A0B0E]/95 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between h-15">
          
          {/* Brand Logo & Product Title */}
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-[#141720] border border-white/10 flex items-center justify-center text-slate-200">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white tracking-tight text-sm sm:text-base">
                  PHISHING SENTINEL
                </span>
                <span className="text-[10px] uppercase font-mono font-medium px-1.5 py-0.2 bg-white/[0.06] text-slate-400 border border-white/10 rounded">
                  VKU DW PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Nền tảng Kho Dữ Liệu & Học Máy Phân Tích URL Độc Hại • MSSQL 2019
              </p>
            </div>
          </div>

          {/* Right Status Indicators (Linear Style) */}
          <div className="flex items-center space-x-2.5 text-xs">
            
            {/* Live Database Metric */}
            <div className="flex items-center space-x-2 px-3 py-1 bg-[#12141C] border border-white/[0.08] rounded-md font-mono text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="text-slate-400">SQL Server DW:</span>
              <span className="font-semibold text-emerald-400">
                {totalRows.toLocaleString('vi-VN')} Rows
              </span>

              {extraRows > 0 && (
                <div className="flex items-center space-x-1 pl-1 border-l border-white/10">
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/15 px-1 rounded animate-pulse">
                    +{extraRows}
                  </span>
                  {onResetRows && (
                    <button 
                      onClick={onResetRows}
                      title="Đặt lại số dòng gốc (235.795)"
                      className="text-slate-500 hover:text-red-400 text-[10px] px-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* AI Model Badge */}
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 bg-[#12141C] border border-white/[0.08] rounded-md font-mono text-slate-400 text-xs">
              <Cpu className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-slate-400">Mô hình AI:</span>
              <span className="text-cyan-400 font-semibold">Random Forest 99.99%</span>
            </div>

            {/* Star Schema Kimball Badge */}
            <div className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 bg-[#12141C] border border-white/[0.08] rounded-md font-mono text-slate-400 text-xs">
              <Layers className="h-3 w-3 text-amber-400" />
              <span>Kimball 5-Star</span>
            </div>

          </div>

        </div>

        {/* Tab Navigation Menu (Linear Minimalist Segmented Tabs) */}
        <div className="flex space-x-1 overflow-x-auto py-2 border-t border-white/[0.06] no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-white/[0.08] text-white border border-white/[0.12] shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-slate-200' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
