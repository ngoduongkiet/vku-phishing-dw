import React from 'react';
import { Shield, Database, Cpu, Activity, BarChart2, Layers, Box, Sparkles, Terminal, ShieldCheck } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, totalRows = 235795, extraRows = 0, onResetRows }) {
  const tabs = [
    { id: 'scanner', label: '1. AI Quét URL & 2 Fact Cốt Lõi', icon: ShieldCheck },
    { id: 'dashboard', label: '2. Dashboard Trực Quan OLAP', icon: BarChart2 },
    { id: 'cube', label: '3. Khối Lập Phương OLAP (Cube)', icon: Box },
    { id: 'lab', label: '4. Thẩm Định Mô Hình AI & Fact', icon: Cpu },
    { id: 'schema', label: '5. Kiến Trúc Star Schema', icon: Layers },
  ];

  return (
    <header className="border-b border-white/[0.08] bg-[#06080F]/85 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo & Professional Name */}
          <div className="flex items-center space-x-3.5">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative h-11 w-11 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-center shadow-xl">
                <ShieldCheck className="h-6 w-6 text-cyan-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 tracking-wider text-lg">
                  AEGIS PHISHMATRIX
                </span>
                <span className="text-[9px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full shadow-sm shadow-cyan-500/20">
                  VKU DW PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Autonomous Data Warehouse & Cyber Threat Intelligence Platform
              </p>
            </div>
          </div>

          {/* Warehouse Live Status Badges */}
          <div className="hidden lg:flex items-center space-x-3 text-xs">
            
            {/* Live Database Metric Badge */}
            <div className="flex items-center space-x-2.5 bg-slate-900/80 border border-white/[0.08] px-3.5 py-1.5 rounded-xl shadow-inner backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
              </span>
              <span className="text-slate-400 font-medium">CSDL Kho SQL Server:</span>
              <span className="font-mono font-extrabold text-emerald-400 transition-all duration-300 text-xs">
                {totalRows.toLocaleString()} Rows
              </span>

              {extraRows > 0 && (
                <div className="flex items-center space-x-1 pl-1 border-l border-slate-800">
                  <span className="text-[10px] text-emerald-300 font-mono font-bold bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30 animate-pulse">
                    +{extraRows}
                  </span>
                  {onResetRows && (
                    <button 
                      onClick={onResetRows}
                      title="Đặt lại số dòng gốc (235,795)"
                      className="text-slate-500 hover:text-red-400 text-[10px] px-1 hover:bg-slate-800 rounded transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* AI Model Badge */}
            <div className="flex items-center space-x-2 bg-slate-900/80 border border-white/[0.08] px-3.5 py-1.5 rounded-xl shadow-inner backdrop-blur-md">
              <Cpu className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-slate-400 font-medium">Random Forest:</span>
              <span className="font-mono font-bold text-cyan-400">99.99% Acc</span>
            </div>

            {/* Star Schema Badge */}
            <div className="flex items-center space-x-1.5 bg-slate-900/80 border border-white/[0.08] px-3 py-1.5 rounded-xl text-slate-400 text-[11px] font-mono">
              <Layers className="h-3 w-3 text-amber-400" />
              <span>Kimball 5-Star</span>
            </div>

          </div>

        </div>

        {/* Tab Navigation Menu (Segmented Control Style) */}
        <div className="flex space-x-1.5 overflow-x-auto py-2.5 border-t border-white/[0.06] no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 border border-cyan-500/50 text-cyan-300 shadow-md shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
