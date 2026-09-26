import React from 'react';
import { Exam } from '../types';
import { FileText, QrCode, ArrowRight } from 'lucide-react';

interface MinimalHomeViewProps {
  exams: Exam[];
  onNavigateToExams: () => void;
  onOpenQuickScan: () => void;
}

export const MinimalHomeView: React.FC<MinimalHomeViewProps> = ({
  exams,
  onNavigateToExams,
  onOpenQuickScan,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto py-10 px-4 space-y-6 bg-white animate-fadeIn">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="font-heading font-extrabold text-3xl text-slate-900 tracking-tight">
          หน้าหลัก
        </h1>
      </div>

      {/* 2 Main Minimal Items Listed Vertically - สะอาด มินิมัล ไม่มีคำอธิบายยาวๆ */}
      <div className="space-y-4">
        {/* Item 1: ชุดข้อสอบ (Exams) */}
        <div
          onClick={onNavigateToExams}
          className="group p-5 sm:p-6 bg-white border border-slate-200 hover:border-indigo-400 rounded-3xl transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center transition-colors shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-400">01.</span>
                <h2 className="font-heading font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                  ชุดข้อสอบ
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  {exams.length} รายการ
                </span>
              </div>
            </div>
          </div>

          <div className="w-10 h-10 rounded-full border border-slate-200 group-hover:border-indigo-600 group-hover:bg-indigo-50 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0">
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Item 2: สแกนคิวอาร์โค้ด / สแกนตรวจข้อสอบ (QR & OMR Scanner) */}
        <div
          onClick={onOpenQuickScan}
          className="group p-5 sm:p-6 bg-white border border-slate-200 hover:border-emerald-400 rounded-3xl transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-emerald-50 group-hover:bg-emerald-600 text-emerald-600 group-hover:text-white flex items-center justify-center transition-colors shrink-0">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-400">02.</span>
                <h2 className="font-heading font-bold text-lg text-slate-900 group-hover:text-emerald-600 transition-colors">
                  สแกนคิวอาร์โค้ด
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  OMR Scanner
                </span>
              </div>
            </div>
          </div>

          <div className="w-10 h-10 rounded-full border border-slate-200 group-hover:border-emerald-600 group-hover:bg-emerald-50 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0">
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
