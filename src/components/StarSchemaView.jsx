import React, { useState } from 'react';
import { Layers, Database, Key, Table2, ArrowRight } from 'lucide-react';
import { STAR_SCHEMA_TABLES } from '../data/sampleData';

export default function StarSchemaView() {
  const [selectedTable, setSelectedTable] = useState(STAR_SCHEMA_TABLES[0]);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Sơ Đồ Mô Hình Ngôi Sao (Star Schema Logical Architecture)
            </h1>
            <p className="text-xs text-slate-400">
              Thiết kế theo chuẩn Kimball gồm 1 Bảng Fact trung tâm (2 tầng Fact) và 5 Chiều không gian (Dimensions)
            </p>
          </div>
        </div>

        {/* Visual Star Layout Picker */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
          {STAR_SCHEMA_TABLES.map((t, idx) => {
            const isSelected = selectedTable.name === t.name;
            const isFact = t.type.includes('FACT');
            return (
              <button
                key={idx}
                onClick={() => setSelectedTable(t)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? isFact
                      ? 'bg-blue-600/30 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-emerald-600/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                  isFact ? 'text-blue-400' : 'text-emerald-400'
                }`}>
                  {t.type}
                </div>
                <div className="text-xs font-extrabold text-white mt-1 truncate">
                  {t.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table Details Viewer */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
              selectedTable.type.includes('FACT')
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}>
              {selectedTable.type}
            </span>
            <h2 className="text-xl font-black text-white mt-2 font-mono">
              dbo.{selectedTable.name}
            </h2>
          </div>
          <div className="text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Grain:</span> {selectedTable.grain}
          </div>
        </div>

        <p className="text-sm text-slate-300 mt-4 leading-relaxed">
          {selectedTable.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          
          {/* Keys & Structure */}
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Key className="h-3.5 w-3.5 text-amber-400" />
              <span>Khóa Chính & Khóa Ngoại (Primary / Foreign Keys):</span>
            </h3>

            <div className="text-xs font-mono space-y-1.5">
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-amber-400 font-bold">PRIMARY KEY:</span> <span className="text-white">{selectedTable.pk}</span>
              </div>

              {selectedTable.fk && selectedTable.fk.map((fk, idx) => (
                <div key={idx} className="p-2 bg-slate-900/80 rounded border border-slate-800/80 flex items-center space-x-1.5 text-slate-300">
                  <ArrowRight className="h-3 w-3 text-blue-400" />
                  <span>{fk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Measures or Attributes */}
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Table2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>{selectedTable.measures ? 'Các Thước Đo Định Lượng (Measures):' : 'Các Thuộc Tính Chiều (Dimension Attributes):'}</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {(selectedTable.measures || selectedTable.attributes || []).map((attr, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-md text-xs font-mono font-medium text-slate-200"
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
