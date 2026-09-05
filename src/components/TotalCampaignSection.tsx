import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Award,
  Users,
  AlertCircle,
  TrendingUp,
  Package,
  Droplets,
  RotateCcw,
  Copy,
  Check,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  AlertTriangle,
  UserX,
  Target,
  FileSpreadsheet,
} from 'lucide-react';
import {
  calculateCoverage,
  calculateVialsRequired,
  calculateTotalDrops,
  calculateTeamRequirements,
  calculateDailyCatchUp,
  BOPV_CONSTANTS,
} from '../calculatorEngine';
import { useLanguage } from '../LanguageContext';

export interface AreaData {
  id: string;
  name: string;
  target: number;
  covered: number;
  na: number;
  refusals: number;
  teams: number;
}

const DEFAULT_AREAS: AreaData[] = [
  { id: '1', name: 'UC-01 Central Urban', target: 6200, covered: 5950, na: 180, refusals: 70, teams: 14 },
  { id: '2', name: 'UC-02 North Suburbs', target: 5800, covered: 5420, na: 240, refusals: 140, teams: 13 },
  { id: '3', name: 'UC-03 Riverine Settlement', target: 7100, covered: 6650, na: 310, refusals: 140, teams: 16 },
  { id: '4', name: 'UC-04 Cantonment & Transit', target: 5900, covered: 5430, na: 290, refusals: 180, teams: 13 },
];

export const TotalCampaignSection: React.FC = () => {
  const { isUrdu, t } = useLanguage();

  const [areas, setAreas] = useState<AreaData[]>(DEFAULT_AREAS);
  const [daysRemaining, setDaysRemaining] = useState<number>(2);
  const [copied, setCopied] = useState<boolean>(false);

  // Quick Inline Edit state for areas
  const [editingAreaId, setEditingAreaId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<AreaData | null>(null);

  // New Area Modal / Toggle state
  const [isAddingArea, setIsAddingArea] = useState<boolean>(false);
  const [newAreaForm, setNewAreaForm] = useState<Omit<AreaData, 'id'>>({
    name: '',
    target: 5000,
    covered: 4700,
    na: 200,
    refusals: 100,
    teams: 12,
  });

  // Calculate totals across all areas using calculatorEngine
  const totals = useMemo(() => {
    const totalTarget = areas.reduce((acc, a) => acc + (Number(a.target) || 0), 0);
    const totalCovered = areas.reduce((acc, a) => acc + (Number(a.covered) || 0), 0);
    const totalNA = areas.reduce((acc, a) => acc + (Number(a.na) || 0), 0);
    const totalRefusals = areas.reduce((acc, a) => acc + (Number(a.refusals) || 0), 0);
    const totalTeams = areas.reduce((acc, a) => acc + (Number(a.teams) || 0), 0);

    const coverageRes = calculateCoverage(totalTarget, totalCovered);
    const totalVials = calculateVialsRequired(totalTarget);
    const bufferVials = Math.ceil(totalVials * 0.05); // Standard 5% field reserve
    const totalDrops = calculateTotalDrops(totalTarget);
    const remainingToVaccinate = coverageRes.remainingChildren;

    // Workforce calculations: 1 Area Supervisor per 4 mobile teams
    const supervisorsNeeded = Math.ceil(totalTeams / 4);

    // Catch-up calculations
    let catchUp = null;
    try {
      catchUp = calculateDailyCatchUp(totalTarget, totalCovered, Math.max(1, daysRemaining));
    } catch {
      catchUp = null;
    }

    const isBenchmarkMet = coverageRes.coveragePercent >= 95;
    const gapToBenchmark = Math.max(0, Math.round((95 - coverageRes.coveragePercent) * 10) / 10);

    return {
      totalTarget,
      totalCovered,
      remainingToVaccinate,
      coveragePercent: coverageRes.coveragePercent,
      isBenchmarkMet,
      gapToBenchmark,
      totalNA,
      totalRefusals,
      totalTeams,
      supervisorsNeeded,
      totalVials,
      bufferVials,
      totalDrops,
      catchUp,
    };
  }, [areas, daysRemaining]);

  const handleCopyReport = async () => {
    const text = `📋 POLIO CAMPAIGN FIELD REPORT (Consolidated Summary)
=====================================
• Total Target Children: ${totals.totalTarget.toLocaleString()}
• Total Covered: ${totals.totalCovered.toLocaleString()} (${totals.coveragePercent}%)
• Remaining to Vaccinate: ${totals.remainingToVaccinate.toLocaleString()}
• Benchmark Status: ${totals.isBenchmarkMet ? '✅ ≥95% Target Achieved' : `⚠️ ${totals.gapToBenchmark}% gap to 95% benchmark`}
-------------------------------------
• Missed Children (NA): ${totals.totalNA.toLocaleString()}
• Refusal Cases: ${totals.totalRefusals.toLocaleString()}
• Total bOPV Vials Required: ${totals.totalVials.toLocaleString()} (+${totals.bufferVials} buffer)
• Total Drops (2 drops/child): ${totals.totalDrops.toLocaleString()}
• Mobile Teams: ${totals.totalTeams} | Supervisors: ${totals.supervisorsNeeded}
• Remaining Days: ${daysRemaining} | Daily Catch-Up Target: ${totals.catchUp && totals.catchUp.dailyTarget != null ? totals.catchUp.dailyTarget.toLocaleString() : 'N/A'}/day
=====================================
Areas / UCs:
${areas.map((a) => `- ${a.name}: ${a.covered.toLocaleString()}/${a.target.toLocaleString()} (${a.target > 0 ? Math.round((a.covered / a.target) * 1000) / 10 : 0}%) | NA: ${a.na} | Ref: ${a.refusals}`).join('\n')}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleResetDefaults = () => {
    setAreas(DEFAULT_AREAS);
    setDaysRemaining(2);
    setEditingAreaId(null);
    setIsAddingArea(false);
  };

  const startEdit = (area: AreaData) => {
    setEditingAreaId(area.id);
    setEditForm({ ...area });
  };

  const saveEdit = () => {
    if (!editForm) return;
    setAreas((prev) =>
      prev.map((item) =>
        item.id === editForm.id
          ? {
              ...editForm,
              target: Math.max(0, Number(editForm.target) || 0),
              covered: Math.min(Number(editForm.target) || 0, Math.max(0, Number(editForm.covered) || 0)),
              na: Math.max(0, Number(editForm.na) || 0),
              refusals: Math.max(0, Number(editForm.refusals) || 0),
              teams: Math.max(1, Number(editForm.teams) || 1),
            }
          : item
      )
    );
    setEditingAreaId(null);
    setEditForm(null);
  };

  const cancelEdit = () => {
    setEditingAreaId(null);
    setEditForm(null);
  };

  const deleteArea = (id: string) => {
    if (areas.length <= 1) return;
    setAreas((prev) => prev.filter((a) => a.id !== id));
  };

  const addArea = () => {
    if (!newAreaForm.name.trim()) return;
    const newArea: AreaData = {
      id: String(Date.now()),
      name: newAreaForm.name.trim(),
      target: Math.max(0, Number(newAreaForm.target) || 0),
      covered: Math.min(Number(newAreaForm.target) || 0, Math.max(0, Number(newAreaForm.covered) || 0)),
      na: Math.max(0, Number(newAreaForm.na) || 0),
      refusals: Math.max(0, Number(newAreaForm.refusals) || 0),
      teams: Math.max(1, Number(newAreaForm.teams) || 1),
    };
    setAreas((prev) => [...prev, newArea]);
    setIsAddingArea(false);
    setNewAreaForm({
      name: '',
      target: 5000,
      covered: 4700,
      na: 200,
      refusals: 100,
      teams: 12,
    });
  };

  return (
    <section
      id="total-campaign-section"
      className={`w-full max-w-6xl mx-auto space-y-4 sm:space-y-6 pb-6 ${isUrdu ? 'font-arabic' : ''}`}
      aria-label={t.totalCampaign}
    >
      {/* 1. TOP HEADER & QUICK FIELD ACTIONS */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-teal-600 text-white font-bold text-xs shadow-2xs">
                <Target className="w-4 h-4" />
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {t.totalCampaign}
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  totals.isBenchmarkMet
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}
              >
                {totals.isBenchmarkMet ? t.benchmarkMetBadge : `${totals.gapToBenchmark}% ${t.benchmarkNeededBadge}`}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t.totalCampaignDesc}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Copy Field Report Button */}
            <button
              id="copy-report-btn"
              type="button"
              onClick={handleCopyReport}
              className="h-11 px-3.5 sm:px-4 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer flex-1 sm:flex-none"
            >
              {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? t.reportCopiedMsg : t.copyReportBtn}</span>
            </button>

            {/* Reset to Default Sample */}
            <button
              id="reset-campaign-btn"
              type="button"
              onClick={handleResetDefaults}
              title={t.resetDefaultDataBtn}
              className="h-11 px-3 text-slate-600 hover:text-slate-900 border border-slate-200/90 rounded-xl hover:bg-slate-100 active:scale-[0.98] transition flex items-center justify-center gap-1.5 text-xs font-medium cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">{t.resetDefaultDataBtn}</span>
            </button>
          </div>
        </div>

        {/* Quick Campaign Days / Catch-Up Input Filter */}
        <div className="pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-700">{t.daysRemainingLabel}:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 5].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDaysRemaining(d)}
                  className={`h-8 px-2.5 rounded-lg font-bold border transition text-xs cursor-pointer ${
                    daysRemaining === d
                      ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {d} {isUrdu ? 'دن' : d === 1 ? 'day' : 'days'}
                </button>
              ))}
            </div>
          </div>

          <div className="text-slate-500 text-[11px] sm:text-xs">
            <span className="font-medium text-slate-700">{areas.length}</span> {isUrdu ? 'علاقے / یوسیز فعال' : 'Operational Areas active'}
          </div>
        </div>
      </div>

      {/* 2. THE RECOMMENDED TOTAL CAMPAIGN KPI SECTION
          On MOBILE (< 640px):
          - 1 dominant Total Target card (full-width)
          - 2-column compact cards for [ COVERED ] [ REMAINING ]
          - 1 dominant Coverage % card (large number)
          On TABLET & DESKTOP (>= 640px):
          - Multi-column dashboard grid (2 cols sm, 4 cols lg)
      */}
      <div className="space-y-3">
        {/* Mobile View: Restructured as explicitly instructed */}
        <div className="block sm:hidden space-y-2.5">
          {/* [ TOTAL TARGET ] */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                {t.totalTargetLabel}
              </span>
              <div className="text-2xl font-black font-mono text-slate-900 mt-0.5">
                {totals.totalTarget.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                {isUrdu ? 'مہم کا کل 0-59 ماہ ہدف' : 'Full Under-5 Target Cohort'}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5 text-slate-600" />
            </div>
          </div>

          {/* [ COVERED ] [ REMAINING ] (2-column compact cards) */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white rounded-2xl p-3.5 border border-emerald-200/80 shadow-xs bg-gradient-to-br from-white to-emerald-50/30">
              <div className="flex items-center gap-1.5 text-emerald-700 mb-1">
                <Check className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold uppercase tracking-wider truncate">
                  {t.totalCoveredLabel}
                </span>
              </div>
              <div className="text-xl font-black font-mono text-emerald-900">
                {totals.totalCovered.toLocaleString()}
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                {totals.coveragePercent}% {isUrdu ? 'مکمل' : 'covered'}
              </span>
            </div>

            <div className="bg-white rounded-2xl p-3.5 border border-amber-200/80 shadow-xs bg-gradient-to-br from-white to-amber-50/30">
              <div className="flex items-center gap-1.5 text-amber-800 mb-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold uppercase tracking-wider truncate">
                  {t.remainingLabel}
                </span>
              </div>
              <div className="text-xl font-black font-mono text-amber-900">
                {totals.remainingToVaccinate.toLocaleString()}
              </div>
              <span className="text-[10px] text-amber-800 font-semibold block mt-0.5">
                {isUrdu ? 'ویکسین درکار' : 'to vaccinate'}
              </span>
            </div>
          </div>

          {/* [ COVERAGE % — large ] */}
          <div className="bg-white rounded-2xl p-4 border border-teal-200/90 shadow-xs bg-gradient-to-r from-teal-50/40 via-white to-teal-50/20">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">
                  {t.coveragePercentLabel}
                </span>
                <div className="text-3xl font-black font-mono text-teal-900 tracking-tight mt-0.5">
                  {totals.coveragePercent}%
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    totals.isBenchmarkMet
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{totals.isBenchmarkMet ? '≥95% Met' : `${totals.gapToBenchmark}% Needed`}</span>
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">
                  WHO 95% Herd Immunity
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tablet & Desktop View: 4-column responsive grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: Total Target */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                {t.totalTargetLabel}
              </span>
              <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
              {totals.totalTarget.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isUrdu ? 'مہم کا کل 0-59 ماہ ہدف' : 'Registered 0-59m target cohort'}
            </p>
          </div>

          {/* Card 2: Total Covered */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-200/90 shadow-xs bg-gradient-to-br from-white to-emerald-50/30 hover:border-emerald-300 transition">
            <div className="flex items-center justify-between text-emerald-700 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                {t.totalCoveredLabel}
              </span>
              <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Check className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-900">
              {totals.totalCovered.toLocaleString()}
            </div>
            <p className="text-xs text-emerald-700 font-medium mt-1">
              {totals.coveragePercent}% {isUrdu ? 'کوریج حاصل ہوئی' : 'of target vaccinated'}
            </p>
          </div>

          {/* Card 3: Remaining to Vaccinate */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/90 shadow-xs bg-gradient-to-br from-white to-amber-50/30 hover:border-amber-300 transition">
            <div className="flex items-center justify-between text-amber-800 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                {t.remainingLabel}
              </span>
              <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <AlertCircle className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-amber-900">
              {totals.remainingToVaccinate.toLocaleString()}
            </div>
            <p className="text-xs text-amber-800 font-medium mt-1">
              {isUrdu ? 'ویکسینیشن ابھی باقی ہے' : 'Pending vaccination'}
            </p>
          </div>

          {/* Card 4: Coverage % */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-teal-200/90 shadow-xs bg-gradient-to-br from-white to-teal-50/40 hover:border-teal-300 transition">
            <div className="flex items-center justify-between text-teal-800 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                {t.coveragePercentLabel}
              </span>
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                <Award className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-teal-900">
              {totals.coveragePercent}%
            </div>
            <p className="text-xs text-teal-700 font-semibold mt-1">
              {totals.isBenchmarkMet
                ? (isUrdu ? '95% قومی ہدف پورا' : '≥95% National target met')
                : `${totals.gapToBenchmark}% ${isUrdu ? 'ہدف تک کمی' : 'gap to 95% benchmark'}`}
            </p>
          </div>
        </div>
      </div>

      {/* 3. CAMPAIGN PROGRESS — LARGE VISUAL PROGRESS INDICATOR */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              {t.campaignProgressBarLabel}
            </h3>
            <p className="text-xs text-slate-500">
              {isUrdu
                ? '95% یا زائد کوریج پولیو وائرس کے پھیلاؤ کو روکنے کے لیے ضروری ہے'
                : 'Coverage milestone tracking against WHO 95% herd immunity threshold'}
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-600 font-semibold self-start sm:self-auto">
            <span>{totals.coveragePercent}% / 100%</span>
          </div>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="relative pt-2 pb-1">
          {/* Benchmark 95% line marker */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10 pointer-events-none"
            style={{ left: isUrdu ? '5%' : '95%' }}
            title="95% Target Benchmark"
          >
            <span className="absolute -top-4 -translate-x-1/2 bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded shadow-xs whitespace-nowrap">
              95% Target
            </span>
          </div>

          <div className="w-full bg-slate-100 h-6 sm:h-7 rounded-xl overflow-hidden flex border border-slate-200/80 p-0.5">
            {/* Covered segment */}
            <div
              className="bg-teal-600 rounded-lg h-full transition-all duration-500 flex items-center justify-center text-[10px] sm:text-xs font-bold text-white px-1 overflow-hidden"
              style={{ width: `${Math.min(100, Math.max(0, totals.coveragePercent))}%` }}
              title={`Covered: ${totals.totalCovered.toLocaleString()} (${totals.coveragePercent}%)`}
            >
              {totals.coveragePercent >= 15 && `${totals.coveragePercent}%`}
            </div>

            {/* Remaining empty space */}
            <div
              className="bg-transparent h-full flex items-center justify-center text-[10px] text-slate-400 font-medium px-1"
              style={{ width: `${Math.max(0, 100 - totals.coveragePercent)}%` }}
            >
              {100 - totals.coveragePercent >= 20 && `${Math.round((100 - totals.coveragePercent) * 10) / 10}%`}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-[11px] pt-1 text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-teal-600 inline-block" />
            <span>{isUrdu ? 'ویکسین شدہ' : 'Covered'}: <strong className="font-mono text-slate-900">{totals.totalCovered.toLocaleString()}</strong> ({totals.coveragePercent}%)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-amber-400 inline-block" />
            <span>{isUrdu ? 'غیر موجود (NA)' : 'Not Available (NA)'}: <strong className="font-mono text-slate-900">{totals.totalNA.toLocaleString()}</strong></span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-rose-400 inline-block" />
            <span>{isUrdu ? 'انکاری کیسز' : 'Refusals'}: <strong className="font-mono text-slate-900">{totals.totalRefusals.toLocaleString()}</strong></span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-slate-300 inline-block" />
            <span>{isUrdu ? 'باقی ماندہ' : 'Remaining'}: <strong className="font-mono text-slate-900">{totals.remainingToVaccinate.toLocaleString()}</strong></span>
          </div>
        </div>
      </div>

      {/* 4. AREA / UC / TEAM BREAKDOWN
          - Stacked responsive cards on Mobile (no horizontal squeeze, no zooming)
          - Clean responsive table on Tablet & Desktop
      */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              {t.areaBreakdownTitle}
            </h3>
            <p className="text-xs text-slate-500">
              {t.areaBreakdownDesc}
            </p>
          </div>

          <button
            id="add-area-btn"
            type="button"
            onClick={() => setIsAddingArea(!isAddingArea)}
            className="h-10 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl active:scale-[0.98] transition flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto border border-slate-200"
          >
            <Plus className="w-4 h-4 text-teal-700" />
            <span>{t.addAreaBtn}</span>
          </button>
        </div>

        {/* Add Area Form (collapsible) */}
        {isAddingArea && (
          <div className="p-3.5 sm:p-4 bg-teal-50/50 rounded-xl border border-teal-200/80 space-y-3 animate-in fade-in duration-150">
            <h4 className="text-xs font-bold text-teal-900">
              {isUrdu ? 'نیا یونین کونسل / ایریا شامل کریں' : 'Add New Union Council / Operational Area'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="sm:col-span-1">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {t.areaNameLabel}
                </label>
                <input
                  type="text"
                  placeholder="e.g. UC-05 South"
                  value={newAreaForm.name}
                  onChange={(e) => setNewAreaForm({ ...newAreaForm, name: e.target.value })}
                  className="h-11 w-full px-3 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {t.totalTargetLabel}
                </label>
                <input
                  type="number"
                  min="0"
                  value={newAreaForm.target}
                  onChange={(e) => setNewAreaForm({ ...newAreaForm, target: Number(e.target.value) || 0 })}
                  className="h-11 w-full px-3 text-sm font-mono bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {t.totalCoveredLabel}
                </label>
                <input
                  type="number"
                  min="0"
                  value={newAreaForm.covered}
                  onChange={(e) => setNewAreaForm({ ...newAreaForm, covered: Number(e.target.value) || 0 })}
                  className="h-11 w-full px-3 text-sm font-mono bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  NA (Not Available)
                </label>
                <input
                  type="number"
                  min="0"
                  value={newAreaForm.na}
                  onChange={(e) => setNewAreaForm({ ...newAreaForm, na: Number(e.target.value) || 0 })}
                  className="h-11 w-full px-3 text-sm font-mono bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Refusals
                </label>
                <input
                  type="number"
                  min="0"
                  value={newAreaForm.refusals}
                  onChange={(e) => setNewAreaForm({ ...newAreaForm, refusals: Number(e.target.value) || 0 })}
                  className="h-11 w-full px-3 text-sm font-mono bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {t.mobileTeamsLabel}
                </label>
                <input
                  type="number"
                  min="1"
                  value={newAreaForm.teams}
                  onChange={(e) => setNewAreaForm({ ...newAreaForm, teams: Number(e.target.value) || 1 })}
                  className="h-11 w-full px-3 text-sm font-mono bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={addArea}
                className="h-10 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
              >
                {t.saveBtn}
              </button>
              <button
                type="button"
                onClick={() => setIsAddingArea(false)}
                className="h-10 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs cursor-pointer"
              >
                {t.cancelBtn}
              </button>
            </div>
          </div>
        )}

        {/* MOBILE: STACKED RESPONSIVE CARDS (No horizontal scrolling on phones!) */}
        <div className="block md:hidden space-y-3">
          {areas.map((area) => {
            const areaCov = area.target > 0 ? Math.round(((area.covered / area.target) * 100) * 10) / 10 : 0;
            const areaRem = Math.max(0, area.target - area.covered);
            const isMet = areaCov >= 95;
            const isEditing = editingAreaId === area.id;

            if (isEditing && editForm) {
              return (
                <div key={area.id} className="p-3.5 bg-slate-50 rounded-2xl border border-teal-300 space-y-3">
                  <div className="font-bold text-xs text-teal-900">{t.editAreaBtn}: {area.name}</div>
                  <div className="grid grid-cols-1 gap-2.5 text-xs">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">{t.areaNameLabel}</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="h-10 w-full px-3 text-sm bg-white border border-slate-200 rounded-xl font-medium"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">{t.totalTargetLabel}</label>
                        <input
                          type="number"
                          value={editForm.target}
                          onChange={(e) => setEditForm({ ...editForm, target: Number(e.target.value) || 0 })}
                          className="h-10 w-full px-2.5 text-sm font-mono bg-white border border-slate-200 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">{t.totalCoveredLabel}</label>
                        <input
                          type="number"
                          value={editForm.covered}
                          onChange={(e) => setEditForm({ ...editForm, covered: Number(e.target.value) || 0 })}
                          className="h-10 w-full px-2.5 text-sm font-mono bg-white border border-slate-200 rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">NA</label>
                        <input
                          type="number"
                          value={editForm.na}
                          onChange={(e) => setEditForm({ ...editForm, na: Number(e.target.value) || 0 })}
                          className="h-10 w-full px-2 text-sm font-mono bg-white border border-slate-200 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">Refusals</label>
                        <input
                          type="number"
                          value={editForm.refusals}
                          onChange={(e) => setEditForm({ ...editForm, refusals: Number(e.target.value) || 0 })}
                          className="h-10 w-full px-2 text-sm font-mono bg-white border border-slate-200 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">Teams</label>
                        <input
                          type="number"
                          value={editForm.teams}
                          onChange={(e) => setEditForm({ ...editForm, teams: Number(e.target.value) || 1 })}
                          className="h-10 w-full px-2 text-sm font-mono bg-white border border-slate-200 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={saveEdit}
                      className="h-9 px-3 bg-teal-600 text-white font-bold rounded-lg text-xs"
                    >
                      {t.saveBtn}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="h-9 px-3 bg-slate-200 text-slate-700 font-medium rounded-lg text-xs"
                    >
                      {t.cancelBtn}
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={area.id}
                className="bg-slate-50/70 rounded-2xl p-3.5 border border-slate-200/90 space-y-2.5 shadow-2xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                    {area.name}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      isMet
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}
                  >
                    {areaCov}% {isMet ? 'Met' : 'Pending'}
                  </span>
                </div>

                {/* 2-column compact metric pairs */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white rounded-xl p-2.5 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">{t.totalTargetLabel}</span>
                    <span className="font-mono font-bold text-slate-900">{area.target.toLocaleString()}</span>
                  </div>
                  <div className="bg-white rounded-xl p-2.5 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">{t.totalCoveredLabel}</span>
                    <span className="font-mono font-bold text-emerald-800">{area.covered.toLocaleString()}</span>
                  </div>
                  <div className="bg-white rounded-xl p-2.5 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">{t.remainingLabel}</span>
                    <span className="font-mono font-bold text-amber-900">{areaRem.toLocaleString()}</span>
                  </div>
                  <div className="bg-white rounded-xl p-2.5 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">bOPV Vials</span>
                    <span className="font-mono font-bold text-teal-800">{calculateVialsRequired(area.target)}</span>
                  </div>
                  <div className="bg-white rounded-xl p-2.5 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">NA / Refusals</span>
                    <span className="font-mono font-semibold text-slate-700">{area.na} NA • {area.refusals} Ref</span>
                  </div>
                  <div className="bg-white rounded-xl p-2.5 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">{t.mobileTeamsLabel}</span>
                    <span className="font-mono font-semibold text-slate-700">{area.teams} teams</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => startEdit(area)}
                    className="h-8 px-2.5 text-xs text-slate-600 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition font-semibold flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>{t.editAreaBtn}</span>
                  </button>
                  {areas.length > 1 && (
                    <button
                      type="button"
                      onClick={() => deleteArea(area.id)}
                      className="h-8 px-2.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t.deleteBtn}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* TABLET & DESKTOP: CLEAN DATA TABLE */}
        <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200/80">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-3">{t.areaNameLabel}</th>
                <th className="p-3 text-right">{t.totalTargetLabel}</th>
                <th className="p-3 text-right">{t.totalCoveredLabel}</th>
                <th className="p-3 text-right">{t.remainingLabel}</th>
                <th className="p-3 text-right">{t.coveragePercentLabel}</th>
                <th className="p-3 text-right">NA</th>
                <th className="p-3 text-right">Ref</th>
                <th className="p-3 text-right">{t.vialsRequiredShort}</th>
                <th className="p-3 text-right">{t.mobileTeamsLabel}</th>
                <th className="p-3 text-center">{t.actionsLabel}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {areas.map((area) => {
                const areaCov = area.target > 0 ? Math.round(((area.covered / area.target) * 100) * 10) / 10 : 0;
                const areaRem = Math.max(0, area.target - area.covered);
                const isMet = areaCov >= 95;
                const isEditing = editingAreaId === area.id;

                if (isEditing && editForm) {
                  return (
                    <tr key={area.id} className="bg-teal-50/40">
                      <td className="p-2">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="h-8 w-full px-2 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </td>
                      <td className="p-2 text-right">
                        <input
                          type="number"
                          value={editForm.target}
                          onChange={(e) => setEditForm({ ...editForm, target: Number(e.target.value) || 0 })}
                          className="h-8 w-20 px-1.5 text-right bg-white border border-slate-200 rounded-lg text-xs font-mono"
                        />
                      </td>
                      <td className="p-2 text-right">
                        <input
                          type="number"
                          value={editForm.covered}
                          onChange={(e) => setEditForm({ ...editForm, covered: Number(e.target.value) || 0 })}
                          className="h-8 w-20 px-1.5 text-right bg-white border border-slate-200 rounded-lg text-xs font-mono"
                        />
                      </td>
                      <td className="p-2 text-right text-slate-400 font-mono">Auto</td>
                      <td className="p-2 text-right text-slate-400 font-mono">Auto</td>
                      <td className="p-2 text-right">
                        <input
                          type="number"
                          value={editForm.na}
                          onChange={(e) => setEditForm({ ...editForm, na: Number(e.target.value) || 0 })}
                          className="h-8 w-14 px-1 text-right bg-white border border-slate-200 rounded-lg text-xs font-mono"
                        />
                      </td>
                      <td className="p-2 text-right">
                        <input
                          type="number"
                          value={editForm.refusals}
                          onChange={(e) => setEditForm({ ...editForm, refusals: Number(e.target.value) || 0 })}
                          className="h-8 w-14 px-1 text-right bg-white border border-slate-200 rounded-lg text-xs font-mono"
                        />
                      </td>
                      <td className="p-2 text-right text-slate-400 font-mono">Auto</td>
                      <td className="p-2 text-right">
                        <input
                          type="number"
                          value={editForm.teams}
                          onChange={(e) => setEditForm({ ...editForm, teams: Number(e.target.value) || 1 })}
                          className="h-8 w-14 px-1 text-right bg-white border border-slate-200 rounded-lg text-xs font-mono"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={saveEdit}
                            className="p-1 text-teal-700 hover:bg-teal-100 rounded"
                            title="Save"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="p-1 text-slate-400 hover:bg-slate-200 rounded"
                            title="Cancel"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={area.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-semibold text-slate-900">{area.name}</td>
                    <td className="p-3 text-right font-mono">{area.target.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-800">{area.covered.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono text-amber-900">{areaRem.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          isMet
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {areaCov}%
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono text-slate-600">{area.na}</td>
                    <td className="p-3 text-right font-mono text-rose-700">{area.refusals}</td>
                    <td className="p-3 text-right font-mono text-teal-800 font-semibold">{calculateVialsRequired(area.target)}</td>
                    <td className="p-3 text-right font-mono text-slate-700">{area.teams}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(area)}
                          className="p-1 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded"
                          title="Edit Area"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {areas.length > 1 && (
                          <button
                            type="button"
                            onClick={() => deleteArea(area.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                            title="Delete Area"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100/80 font-bold border-t border-slate-200 text-slate-900">
                <td className="p-3">{isUrdu ? 'مجموعی کل مہم' : 'Total Campaign'}</td>
                <td className="p-3 text-right font-mono">{totals.totalTarget.toLocaleString()}</td>
                <td className="p-3 text-right font-mono text-emerald-800">{totals.totalCovered.toLocaleString()}</td>
                <td className="p-3 text-right font-mono text-amber-900">{totals.remainingToVaccinate.toLocaleString()}</td>
                <td className="p-3 text-right font-mono text-teal-900">{totals.coveragePercent}%</td>
                <td className="p-3 text-right font-mono">{totals.totalNA}</td>
                <td className="p-3 text-right font-mono text-rose-700">{totals.totalRefusals}</td>
                <td className="p-3 text-right font-mono text-teal-800">{totals.totalVials}</td>
                <td className="p-3 text-right font-mono">{totals.totalTeams}</td>
                <td className="p-3 text-center text-slate-400">—</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 5. ADDITIONAL CAMPAIGN STATISTICS
          - 1 column on mobile
          - 2 columns on tablet
          - 3 columns on desktop
      */}
      <div className="space-y-3">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 px-1">
          {t.additionalStatsTitle}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Box A: bOPV Vaccine Logistics */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-teal-800 font-bold text-xs sm:text-sm">
              <span className="p-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200/80">
                <Package className="w-4 h-4" />
              </span>
              <span>{t.vaccineLogisticsTitle}</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="text-slate-500">Base Vials Required:</span>
                <span className="font-mono font-bold text-slate-900">
                  {totals.totalVials.toLocaleString()} vials
                </span>
              </div>
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="text-slate-500">5% Buffer Reserve:</span>
                <span className="font-mono font-bold text-teal-800">
                  +{totals.bufferVials} vials
                </span>
              </div>
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="text-slate-500">Total Vials Needed:</span>
                <span className="font-mono font-black text-slate-900 text-sm">
                  {(totals.totalVials + totals.bufferVials).toLocaleString()} vials
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Total Drops (2 drops/child):</span>
                <span className="font-mono font-bold text-slate-700">
                  {totals.totalDrops.toLocaleString()} drops
                </span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 bg-slate-50 p-2 rounded-xl font-mono">
              Fixed standard: 1 vial = 20 doses (covers 20 kids)
            </div>
          </div>

          {/* Box B: Workforce & Supervision */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-xs sm:text-sm">
              <span className="p-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                <Users className="w-4 h-4" />
              </span>
              <span>{t.workforceTitle}</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="text-slate-500">Mobile Vaccination Teams:</span>
                <span className="font-mono font-bold text-slate-900">
                  {totals.totalTeams} teams
                </span>
              </div>
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="text-slate-500">Area Supervisors Needed:</span>
                <span className="font-mono font-bold text-slate-900">
                  {totals.supervisorsNeeded} supervisors
                </span>
              </div>
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="text-slate-500">Avg Children / Team / Day:</span>
                <span className="font-mono font-bold text-slate-700">
                  {totals.totalTeams > 0
                    ? Math.round(totals.totalTarget / totals.totalTeams / Math.max(1, daysRemaining))
                    : 0}{' '}
                  kids
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Supervisor Ratio:</span>
                <span className="font-mono font-bold text-teal-800">
                  1 supervisor : 4 teams
                </span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 bg-slate-50 p-2 rounded-xl font-mono">
              Standard: 120-150 children target per mobile team per day
            </div>
          </div>

          {/* Box C: Missed Children & Catch-up Operations */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-3 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs sm:text-sm">
              <span className="p-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
                <TrendingUp className="w-4 h-4" />
              </span>
              <span>{t.missedChildrenTitle}</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="text-slate-500">Not Available (NA) Cases:</span>
                <span className="font-mono font-bold text-amber-900">
                  {totals.totalNA.toLocaleString()} children
                </span>
              </div>
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="text-slate-500">Refusal Cases (R):</span>
                <span className="font-mono font-bold text-rose-700">
                  {totals.totalRefusals.toLocaleString()} children
                </span>
              </div>
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="text-slate-500">Daily Catch-up Target:</span>
                <span className="font-mono font-black text-teal-900 text-sm">
                  {totals.catchUp && totals.catchUp.dailyTarget != null ? totals.catchUp.dailyTarget.toLocaleString() : 'N/A'} / day
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Vials / Day (Catch-Up):</span>
                <span className="font-mono font-bold text-slate-700">
                  {totals.catchUp && totals.catchUp.dailyVialsRequired != null ? totals.catchUp.dailyVialsRequired.toLocaleString() : 'N/A'} vials
                </span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 bg-slate-50 p-2 rounded-xl font-mono">
              Based on {daysRemaining} campaign {daysRemaining === 1 ? 'day' : 'days'} remaining
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
