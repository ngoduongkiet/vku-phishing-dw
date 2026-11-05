import React, { useState } from 'react';
import { Layers, Database, Key, Table2, ArrowRight, Sparkles, Shield, Cpu, Lock, Globe, DollarSign } from 'lucide-react';
import { STAR_SCHEMA_TABLES } from '../data/sampleData';

export default function StarSchemaView() {
  const [selectedTable, setSelectedTable] = useState(STAR_SCHEMA_TABLES[0]);

  return (
    <div className="space-y-6">

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full">
              KIMBALL DIMENSIONAL MODELING
            </span>
            <span className="text-xs text-slate-500 font-mono">STAR SCHEMA LOGICAL ARCHITECTURE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            Kiến Trúc Mô Hình Ngôi Sao (Star Schema)
          </h1>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-xl">
          <Layers className="h-4 w-4" />
          <span>1 Fact Trung Tâm • 5 Chiều Không Gian</span>
        </div>
      </div>

      {/* Visual Interactive Diagram Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-7 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
              Sơ Đồ Tương Tác Các Bảng Trong Kho Dữ Liệu
            </h2>
            <p className="text-xs text-slate-400">
              Nhấp vào từng bảng để khám phá khóa chính, khóa ngoại và các thuộc tính tương ứng
            </p>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-lg">
            Chuẩn Kimball Fact Constellation / Star
          </span>
        </div>

        {/* Visual Star Layout Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {STAR_SCHEMA_TABLES.map((t, idx) => {
            const isSelected = selectedTable.name === t.name;
            const isFact = t.type.includes('FACT');
            return (
              <button
                key={idx}
                onClick={() => setSelectedTable(t)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative group ${
                  isSelected
                    ? isFact
                      ? 'bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-indigo-500/20 border-cyan-500 text-white shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-500/30'
                      : 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                    : 'bg-slate-950/70 border-white/[0.08] text-slate-400 hover:border-white/20 hover:text-white'
                }`}
              >
                {isSelected && (
                  <span className={`absolute top-2 right-2 h-1.5 w-1.5 rounded-full ${isFact ? 'bg-cyan-400' : 'bg-emerald-400'}`}></span>
                )}
                <div className={`text-[9px] font-mono font-bold uppercase tracking-wider ${
                  isFact ? 'text-cyan-400' : 'text-emerald-400'
                }`}>
                  {t.type}
                </div>
                <div className="text-xs font-extrabold text-white mt-1 truncate font-mono">
                  {t.name}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                  {t.grain || 'Dimension table'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table Details Viewer */}
      <div className="glass-panel rounded-2xl p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                selectedTable.type.includes('FACT')
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}>
                {selectedTable.type}
              </span>
              <span className="text-xs text-slate-500 font-mono">dbo.{selectedTable.name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1 font-mono tracking-tight">
              dbo.{selectedTable.name}
            </h2>
          </div>
          <div className="text-xs text-slate-400 font-mono bg-slate-950/60 px-3.5 py-2 rounded-xl border border-white/[0.06]">
            <span className="text-slate-500">Hạt dữ liệu (Grain):</span> <span className="text-slate-200 font-bold">{selectedTable.grain}</span>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed font-sans">
          {selectedTable.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* Keys & Structure */}
          <div className="bg-slate-950/70 border border-white/[0.08] p-5 rounded-2xl space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2 font-mono">
              <Key className="h-4 w-4 text-amber-400" />
              <span>Khóa Chính & Khóa Ngoại (Primary / Foreign Keys):</span>
            </h3>

            <div className="text-xs font-mono space-y-2">
              <div className="p-3 bg-slate-900/70 rounded-xl border border-white/[0.06] flex items-center justify-between">
                <span className="text-amber-400 font-bold text-[11px]">PRIMARY KEY:</span>
                <span className="text-white font-bold">{selectedTable.pk}</span>
              </div>

              {selectedTable.fk && selectedTable.fk.map((fk, idx) => (
                <div key={idx} className="p-3 bg-slate-900/50 rounded-xl border border-white/[0.05] flex items-center space-x-2 text-slate-300">
                  <ArrowRight className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
                  <span className="truncate">{fk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Measures or Attributes */}
          <div className="bg-slate-950/70 border border-white/[0.08] p-5 rounded-2xl space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2 font-mono">
              <Table2 className="h-4 w-4 text-emerald-400" />
              <span>{selectedTable.measures ? 'Các Thước Đo Định Lượng (Fact Measures):' : 'Các Thuộc Tính Chiều (Dimension Attributes):'}</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {(selectedTable.measures || selectedTable.attributes || []).map((attr, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-slate-900/80 border border-white/[0.08] rounded-xl text-xs font-mono font-medium text-slate-200 hover:border-cyan-500/40 transition-colors"
                >
                  {attr}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
