import React from 'react';
import { Shield, Database, Cpu, Activity, BarChart2, Layers, Box } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'scanner', label: '1. AI Quét URL Thời Gian Thực', icon: Shield },
    { id: 'dashboard', label: '2. Dashboard Trực Quan OLAP', icon: BarChart2 },
    { id: 'cube', label: '3. Khối Lập Phương OLAP (Cube)', icon: Box },
    { id: 'lab', label: '4. Thẩm Định Mô Hình AI & Fact', icon: Cpu },
    { id: 'schema', label: '5. Kiến Trúc Star Schema', icon: Layers },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Project Title */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 p-0.5 shadow-lg shadow-blue-500/20">
              <div className="h-full w-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Shield className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-white tracking-wider text-base">PHISHING SENTINEL</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">VKU DW</span>
              </div>
              <p className="text-xs text-slate-400">Kho Dữ Liệu & Học Máy Phân Tích URL Độc Hại</p>
            </div>
          </div>

          {/* Warehouse Live Status Badges */}
          <div className="hidden md:flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-400">SQL Server DW:</span>
              <span className="font-mono font-semibold text-emerald-400">235,795 Rows</span>
            </div>

            <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
              <Cpu className="h-3.5 w-3.5 text-blue-400" />
              <span className="text-slate-400">Mô hình AI:</span>
              <span className="font-mono font-semibold text-blue-400">Random Forest 99.99%</span>
            </div>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 overflow-x-auto py-2 border-t border-slate-800/60 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 border border-blue-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
