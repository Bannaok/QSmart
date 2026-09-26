import React, { useState, useEffect } from 'react';
import { d1SyncService } from '../services/d1SyncService';
import { storageService } from '../services/storageService';
import { useToast } from '../services/toastContext';
import {
  Cloud,
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  RefreshCw,
  Terminal,
  ExternalLink,
  Download,
  FileCode,
} from 'lucide-react';

export const CloudflareD1Tab: React.FC = () => {
  const { success, info, error } = useToast();
  const [isChecking, setIsChecking] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [d1Status, setD1Status] = useState<{ isAvailable: boolean; message: string }>({
    isAvailable: false,
    message: 'กำลังตรวจสอบสถานะการเชื่อมต่อ...',
  });

  const checkStatus = async () => {
    setIsChecking(true);
    const res = await d1SyncService.checkConnection();
    setD1Status(res);
    setIsChecking(false);
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleSyncWithD1 = async () => {
    setIsSyncing(true);
    const res = await storageService.syncWithD1();
    if (res.success) {
      success('ซิงค์ข้อมูลสำเร็จ', res.message);
    } else {
      info('สถานะการซิงค์', res.message);
    }
    setIsSyncing(false);
    checkStatus();
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    success('คัดลอกสำเร็จ', `คัดลอก ${label} ไปยังคลิปบอร์ดแล้ว`);
  };

  const allDeployCommands = `# 1. ติดตั้ง Cloudflare Wrangler CLI
npm install -g wrangler

# 2. เข้าสู่ระบบบัญชี Cloudflare ของคุณ
npx wrangler login

# 3. สร้างฐานข้อมูล Cloudflare D1
npx wrangler d1 create omr_d1

# (นำ database_id ที่ได้จากคำสั่งข้างต้น ไปใส่ในไฟล์ wrangler.toml ตรง database_id)

# 4. รัน SQL Schema เพื่อสร้างตารางทั้งหมดใน D1
npx wrangler d1 execute omr_d1 --file=./schema.sql --remote

# 5. สั่ง Build และ Deploy ขึ้น Cloudflare Pages ทันที
npm run build
npx wrangler pages deploy dist --project-name=examscan-omr`;

  const handleExportBackup = () => {
    const backupData = {
      settings: storageService.getSettings(),
      users: storageService.getUsers(),
      exams: storageService.getExams(),
      scanResults: storageService.getScanResults(),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ExamScan_OMR_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    success('ส่งออกข้อมูลสำเร็จ', 'ดาวน์โหลดไฟล์สำรองข้อมูล JSON เรียบร้อยแล้ว');
  };

  return (
    <div className="space-y-6 animate-fadeIn text-slate-800">
      {/* 1. Connection Status Card */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-md border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl shrink-0">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-heading font-bold text-base sm:text-lg">
                  Cloudflare D1 & Pages Deployment
                </h4>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    d1Status.isAvailable
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {d1Status.isAvailable ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>เชื่อมต่อ Cloudflare D1 ออนไลน์</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                      <span>โหมดออฟไลน์ / พรีวิว (LocalStorage)</span>
                    </>
                  )}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                {d1Status.message}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={checkStatus}
              disabled={isChecking}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
              <span>ตรวจสถานะ</span>
            </button>

            <button
              onClick={handleSyncWithD1}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isSyncing ? 'กำลังซิงค์...' : 'ซิงค์ข้อมูลกับ D1'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Step-by-Step Deployment Guide */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm sm:text-base text-slate-900">
                ขั้นตอนการ Deploy ขึ้น Cloudflare Pages + D1
              </h4>
              <p className="text-xs text-slate-500">
                โครงสร้างระบบถูกจัดเตรียมไฟล์พร้อมใช้งานแล้ว (wrangler.toml, schema.sql, functions/api)
              </p>
            </div>
          </div>

          <button
            onClick={() => copyToClipboard(allDeployCommands, 'คำสั่ง Deploy ทั้งหมด')}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>คัดลอกคำสั่งทั้งหมด</span>
          </button>
        </div>

        {/* Command Box */}
        <div className="bg-slate-950 text-slate-200 rounded-xl p-4 font-mono text-xs overflow-x-auto relative group">
          <pre className="whitespace-pre">{allDeployCommands}</pre>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">1</span>
            <span>ฟรี ไม่มีค่าใช้จ่าย (Cloudflare D1 Free Tier)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">2</span>
            <span>ทำงานแบบ Serverless Edge ทั่วโลก</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">3</span>
            <span>รองรับตาราง Exams, Results, Users, Settings</span>
          </div>
        </div>
      </div>

      {/* 3. Configuration Files & Backup */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Schema SQL */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-600" />
              <h5 className="font-heading font-bold text-sm text-slate-800">
                ไฟล์ Database Schema (schema.sql)
              </h5>
            </div>
            <button
              onClick={() => {
                const sql = `-- Cloudflare D1 Database Schema
CREATE TABLE IF NOT EXISTS settings (id TEXT PRIMARY KEY, app_name TEXT, app_logo_url TEXT, organization_name TEXT, last_updated TEXT, updated_by TEXT);
CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE, display_name TEXT, role TEXT, status TEXT, created_at TEXT, last_login_at TEXT, storage_bytes INTEGER);
CREATE TABLE IF NOT EXISTS exams (id TEXT PRIMARY KEY, title TEXT, code TEXT, grade_level TEXT, description TEXT, question_count INTEGER, choice_count INTEGER, choice_label_type TEXT, pass_percentage INTEGER, created_by TEXT, creator_name TEXT, created_at TEXT, updated_at TEXT, answer_key_json TEXT);
CREATE TABLE IF NOT EXISTS scan_results (id TEXT PRIMARY KEY, exam_id TEXT, exam_title TEXT, student_name TEXT, student_id TEXT, student_class TEXT, score INTEGER, total_questions INTEGER, score_percentage INTEGER, passed INTEGER, answers_json TEXT, annotated_image_url TEXT, scanned_at TEXT, notes TEXT);`;
                copyToClipboard(sql, 'SQL Schema');
              }}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              คัดลอก SQL
            </button>
          </div>
          <p className="text-xs text-slate-500">
            โครงสร้างตาราง SQLite ออกแบบเฉพาะสำหรับ Cloudflare D1 เก็บชุดข้อสอบ ผลตรวจ OMR และผู้ใช้งาน
          </p>
        </div>

        {/* Data Backup */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-indigo-600" />
              <h5 className="font-heading font-bold text-sm text-slate-800">
                สำรองข้อมูลทั้งหมด (Backup JSON)
              </h5>
            </div>
            <button
              onClick={handleExportBackup}
              className="text-xs px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              ดาวน์โหลด JSON
            </button>
          </div>
          <p className="text-xs text-slate-500">
            ดาวน์โหลดชุดข้อสอบและประวัติผลการตรวจทั้งหมดเป็นไฟล์ JSON เพื่อนำไปกู้คืนหรือย้ายฐานข้อมูลได้ตลอดเวลา
          </p>
        </div>
      </div>
    </div>
  );
};
