import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Input, Badge } from '../components/UI';
import { User, Activity, Heart, FlaskConical, Baby, AlertCircle, Save, ArrowRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../types';

// ── Types ──────────────────────────────────────────────────────────────────
interface FormData {
  patientName: string; age: string; gestationalWeeks: string; anmWorkerId: string; visitDate: string;
  previousLSCS: boolean; badObstetricHistory: boolean; previousStillbirth: boolean;
  previousPretermDelivery: boolean; previousAbortion: boolean; systemicIllness: boolean;
  systemicIllnessDetails: string; chronicHypertension: boolean; diabetes: boolean;
  thyroidDisorder: boolean; smoking: boolean; tobaccoUse: boolean; alcoholUse: boolean;
  heightCm: string; weightKg: string; bpSystolic: string; bpDiastolic: string;
  hemoglobin: string; rhNegative: boolean; hivPositive: boolean; syphilisPositive: boolean;
  urineProtein: boolean; urineSugar: boolean;
  birthOrder: string; interPregnancyInterval: string; stillbirthCount: string; abortionCount: string;
  pretermHistory: boolean; twinPregnancy: boolean; malpresentation: boolean; placentaPrevia: boolean;
  reducedFetalMovement: boolean; amnioticFluidNormal: boolean; umbilicalDopplerAbnormal: boolean;
  headache: boolean; visualDisturbance: boolean; epigastricPain: boolean;
  decreasedUrineOutput: boolean; bleedingPerVagina: boolean; convulsions: boolean;
}

interface RiskFlag { condition: string; explanation: string; ref: string; }
interface RiskResult { level: 'GREEN' | 'AMBER' | 'RED'; flags: RiskFlag[]; confidence: number; }

// ── Risk Engine ────────────────────────────────────────────────────────────
const analyzeRisk = (f: FormData): RiskResult => {
  const flags: RiskFlag[] = [];
  let level: 'GREEN' | 'AMBER' | 'RED' = 'GREEN';
  const s = parseFloat(f.bpSystolic), d = parseFloat(f.bpDiastolic);
  const hb = parseFloat(f.hemoglobin);

  if (s >= 160 || d >= 110) { level = 'RED'; flags.push({ condition: 'Severe Hypertension', explanation: 'BP ≥160/110 mmHg — severe hypertensive disorder requiring urgent management.', ref: 'MOHFW ANC Guidelines 2021 — Section 4.3' }); }
  else if (s >= 140 || d >= 90) { if (level !== 'RED') level = 'AMBER'; flags.push({ condition: 'Gestational Hypertension', explanation: 'BP ≥140/90 mmHg — close monitoring and possible intervention required.', ref: 'MOHFW ANC Guidelines 2021 — Section 4.2' }); }

  if (f.urineProtein && (s >= 140 || d >= 90)) { level = 'RED'; flags.push({ condition: 'Pre-eclampsia (Suspected)', explanation: 'Hypertension + proteinuria meets diagnostic criteria for pre-eclampsia.', ref: 'MOHFW ANC Guidelines 2021 — Section 4.4' }); }

  if (hb < 7) { level = 'RED'; flags.push({ condition: 'Severe Anemia', explanation: 'Hemoglobin <7 g/dL — urgent iron therapy or transfusion required.', ref: 'MOHFW ANC Guidelines 2021 — Section 6.1' }); }
  else if (hb < 11) { if (level !== 'RED') level = 'AMBER'; flags.push({ condition: 'Anemia', explanation: 'Hemoglobin <11 g/dL — iron and folic acid supplementation required.', ref: 'MOHFW ANC Guidelines 2021 — Section 6.1' }); }

  if (f.convulsions)       { level = 'RED'; flags.push({ condition: 'Convulsions / Eclampsia', explanation: 'Medical emergency — immediate hospitalization required.', ref: 'MOHFW ANC Guidelines 2021 — Section 4.5' }); }
  if (f.bleedingPerVagina) { level = 'RED'; flags.push({ condition: 'Antepartum Hemorrhage', explanation: 'Vaginal bleeding requires immediate obstetric evaluation.', ref: 'MOHFW ANC Guidelines 2021 — Section 7.1' }); }
  if (f.placentaPrevia)    { level = 'RED'; flags.push({ condition: 'Placenta Previa', explanation: 'High-risk condition requiring specialist care.', ref: 'MOHFW ANC Guidelines 2021 — Section 7.2' }); }
  if (f.headache && f.visualDisturbance) { if (level !== 'RED') level = 'AMBER'; flags.push({ condition: 'Neurological Warning Signs', explanation: 'Headache + visual disturbance may indicate impending eclampsia.', ref: 'MOHFW ANC Guidelines 2021 — Section 4.4' }); }
  if (f.twinPregnancy)      { if (level !== 'RED') level = 'AMBER'; flags.push({ condition: 'Multiple Pregnancy', explanation: 'Twin pregnancy requires specialist monitoring.', ref: 'MOHFW ANC Guidelines 2021 — Section 8.2' }); }
  if (f.previousStillbirth) { if (level !== 'RED') level = 'AMBER'; flags.push({ condition: 'Previous Stillbirth', explanation: 'Increases risk in current pregnancy.', ref: 'MOHFW ANC Guidelines 2021 — Section 3.1' }); }
  if (f.hivPositive)        { if (level !== 'RED') level = 'AMBER'; flags.push({ condition: 'HIV Positive', explanation: 'PMTCT protocol initiation required.', ref: 'MOHFW ANC Guidelines 2021 — Section 9.2' }); }
  if (f.rhNegative)         { if (level !== 'RED') level = 'AMBER'; flags.push({ condition: 'Rh Negative', explanation: 'Anti-D prophylaxis required to prevent sensitization.', ref: 'MOHFW ANC Guidelines 2021 — Section 5.3' }); }
  if (f.chronicHypertension){ if (level !== 'RED') level = 'AMBER'; flags.push({ condition: 'Chronic Hypertension', explanation: 'Pre-existing hypertension increases maternal and fetal risk.', ref: 'MOHFW ANC Guidelines 2021 — Section 4.1' }); }
  if (f.diabetes)           { if (level !== 'RED') level = 'AMBER'; flags.push({ condition: 'Diabetes', explanation: 'Requires glycemic control and additional fetal monitoring.', ref: 'MOHFW ANC Guidelines 2021 — Section 5.1' }); }

  return { level, flags, confidence: Math.round(flags.length === 0 ? 96 : Math.min(92 + flags.length * 1.2, 98)) };
};

// ── Helpers ────────────────────────────────────────────────────────────────
const getBpBadge = (sys: string, dia: string) => {
  const s = parseFloat(sys), d = parseFloat(dia);
  if (!s || !d) return null;
  if (s >= 160 || d >= 110) return { label: 'Danger',   variant: 'red'   as const };
  if (s >= 140 || d >= 90)  return { label: 'Elevated', variant: 'amber' as const };
  return { label: 'Normal', variant: 'green' as const };
};

const getHbBadge = (hb: string) => {
  const v = parseFloat(hb);
  if (!v) return null;
  if (v < 7)  return { label: 'Severe Anemia',   variant: 'red'   as const };
  if (v < 9)  return { label: 'Moderate Anemia', variant: 'amber' as const };
  if (v < 11) return { label: 'Mild Anemia',     variant: 'amber' as const };
  return { label: 'Normal', variant: 'green' as const };
};

const getBmi = (h: string, w: string) => {
  const hm = parseFloat(h) / 100, wk = parseFloat(w);
  if (!hm || !wk) return null;
  return (wk / (hm * hm)).toFixed(1);
};

// ── Toggle ─────────────────────────────────────────────────────────────────
const Toggle = ({ label, sub, value, onChange, danger }: {
  label: string; sub?: string; value: boolean; onChange: (v: boolean) => void; danger?: boolean;
}) => (
  <div
    onClick={() => onChange(!value)}
    className={cn(
      'p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all select-none',
      value ? (danger ? 'bg-red-50 border-red-200' : 'bg-primary/5 border-primary/20') : 'bg-background-light border-transparent hover:bg-slate-100'
    )}
  >
    <div className="flex flex-col">
      <span className={cn('font-bold text-heading text-sm', !value && 'font-medium')}>{label}</span>
      {sub && <span className="text-xs text-slate-500">{sub}</span>}
    </div>
    <div className={cn('relative w-12 h-7 rounded-full transition-colors flex-shrink-0 ml-3', value ? (danger ? 'bg-red-500' : 'bg-primary') : 'bg-subtle')}>
      <div className={cn('absolute top-1 size-5 bg-white rounded-full shadow-sm transition-all', value ? 'right-1' : 'left-1')} />
    </div>
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────
export default function AssessmentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [f, setF] = useState<FormData>({
    patientName: '', age: '', gestationalWeeks: '', anmWorkerId: 'ANM-2023-88',
    visitDate: new Date().toISOString().split('T')[0],
    previousLSCS: false, badObstetricHistory: false, previousStillbirth: false,
    previousPretermDelivery: false, previousAbortion: false, systemicIllness: false,
    systemicIllnessDetails: '', chronicHypertension: false, diabetes: false,
    thyroidDisorder: false, smoking: false, tobaccoUse: false, alcoholUse: false,
    heightCm: '', weightKg: '', bpSystolic: '', bpDiastolic: '',
    hemoglobin: '', rhNegative: false, hivPositive: false, syphilisPositive: false,
    urineProtein: false, urineSugar: false,
    birthOrder: '', interPregnancyInterval: '', stillbirthCount: '', abortionCount: '',
    pretermHistory: false, twinPregnancy: false, malpresentation: false,
    placentaPrevia: false, reducedFetalMovement: false, amnioticFluidNormal: true,
    umbilicalDopplerAbnormal: false, headache: false, visualDisturbance: false,
    epigastricPain: false, decreasedUrineOutput: false, bleedingPerVagina: false, convulsions: false,
  });

  const set = (key: keyof FormData, val: any) => setF(prev => ({ ...prev, [key]: val }));

  const hasCritical = f.convulsions || f.bleedingPerVagina || f.placentaPrevia;
  const bpBadge  = getBpBadge(f.bpSystolic, f.bpDiastolic);
  const hbBadge  = getHbBadge(f.hemoglobin);
  const bmiVal   = getBmi(f.heightCm, f.weightKg);
  const canSubmit = !!(f.patientName && f.age && f.gestationalWeeks && f.bpSystolic && f.bpDiastolic && f.hemoglobin);

  const handleAnalyze = () => {
    const result = analyzeRisk(f);
    navigate(`/result/${result.level}`, { state: { result, patientId: id, formData: f } });
  };

  const steps = [
    { id: 1, label: 'Patient' },
    { id: 2, label: 'History' },
    { id: 3, label: 'Vitals' },
    { id: 4, label: 'Labs' },
    { id: 5, label: 'Obs' },
    { id: 6, label: 'Sx' },
  ];

  return (
    <div className="max-w-3xl mx-auto relative z-10 pb-28 pt-8 px-4">

      {/* Hero */}
      <div className="text-center mb-8">
        <Badge variant="default" className="mb-3">ANC VISIT ENTRY{id ? ` · Patient #${id}` : ''}</Badge>
        <h2 className="text-heading text-4xl md:text-5xl font-serif font-black leading-tight mb-2">Patient Risk Assessment</h2>
        <p className="text-slate-500 max-w-md mx-auto">AI-powered classification based on MOHFW guidelines. Please ensure all data is accurate.</p>
      </div>

      {/* Critical Alert */}
      {hasCritical && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-start gap-3"
        >
          <AlertCircle className="text-red-500 w-5 h-5 mt-0.5 flex-shrink-0 animate-pulse" />
          <div>
            <p className="text-sm font-bold text-red-800">🚨 Critical Symptom Detected</p>
            <p className="text-xs text-red-700 mt-1">Prepare for immediate escalation — do not delay referral.</p>
          </div>
        </motion.div>
      )}

      {/* Stepper */}
      <div className="mb-8 overflow-x-auto no-scrollbar py-2">
        <div className="flex items-center justify-between min-w-[600px] md:min-w-full px-2">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className={cn('flex flex-col items-center gap-2 group cursor-pointer w-20 transition-all', step === s.id ? 'opacity-100' : 'opacity-60')} onClick={() => setStep(s.id)}>
                <div className={cn(
                  'size-8 rounded-full flex items-center justify-center transition-all',
                  step > s.id  ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                  : step === s.id ? 'bg-primary text-white shadow-lg shadow-primary/30 ring-4 ring-primary/10'
                  : 'bg-white border-2 border-subtle text-slate-400'
                )}>
                  {step > s.id ? '✓' : <span className="text-sm font-bold">{s.id}</span>}
                </div>
                <span className={cn('text-xs font-bold', step === s.id ? 'text-heading' : 'text-slate-400')}>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={cn('h-[2px] flex-1 mx-2 rounded-full transition-colors', step > s.id ? 'bg-green-300' : 'bg-subtle')} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Sections */}
      <div className="flex flex-col gap-6">
        <AnimatePresence mode="wait">

          {/* Step 1 — Patient Info */}
          {step === 1 && (
            <motion.section key="s1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[24px] shadow-card border-l-8 border-primary overflow-hidden p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"><User className="w-5 h-5" /></div>
                <h3 className="text-xl font-serif font-bold text-heading">1. Patient Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="block md:col-span-2">
                  <span className="text-sm font-semibold text-heading mb-2 block">Full Name <span className="text-red-500">*</span></span>
                  <Input placeholder="e.g. Meera Devi" value={f.patientName} onChange={e => set('patientName', e.target.value)} />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-heading mb-2 block">Age <span className="text-red-500">*</span></span>
                  <Input placeholder="Years" type="number" value={f.age} onChange={e => set('age', e.target.value)} />
                </label>
                <label className="block">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-heading">Gestational Age <span className="text-red-500">*</span></span>
                    <span className="text-xs text-primary font-medium">Weeks (LMP / USG)</span>
                  </div>
                  <Input type="number" placeholder="e.g. 24" value={f.gestationalWeeks} onChange={e => set('gestationalWeeks', e.target.value)} />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-heading mb-2 block">ANM / ASHA ID</span>
                  <Input value={f.anmWorkerId} onChange={e => set('anmWorkerId', e.target.value)} />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-heading mb-2 block">Visit Date</span>
                  <Input type="date" value={f.visitDate} onChange={e => set('visitDate', e.target.value)} />
                </label>
              </div>
            </motion.section>
          )}

          {/* Step 2 — Medical History */}
          {step === 2 && (
            <motion.section key="s2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[24px] shadow-card p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Activity className="w-5 h-5" /></div>
                <h3 className="text-xl font-serif font-bold text-heading">2. Medical History</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {([
                  { key: 'previousLSCS',            label: 'Previous C-Section',       sub: 'Previous LSCS' },
                  { key: 'badObstetricHistory',      label: 'Bad Obstetric History',    sub: 'BOH' },
                  { key: 'previousStillbirth',       label: 'Previous Stillbirth' },
                  { key: 'previousPretermDelivery',  label: 'Preterm Delivery History' },
                  { key: 'previousAbortion',         label: 'Previous Abortion' },
                  { key: 'chronicHypertension',      label: 'Chronic Hypertension',     sub: 'High BP History' },
                  { key: 'diabetes',                 label: 'Diabetes',                 sub: 'Pre-existing or GDM' },
                  { key: 'thyroidDisorder',          label: 'Thyroid Disorder',         sub: 'Hypo / Hyperthyroidism' },
                  { key: 'smoking',                  label: 'Smoking' },
                  { key: 'tobaccoUse',               label: 'Tobacco Use' },
                  { key: 'alcoholUse',               label: 'Alcohol Use' },
                  { key: 'systemicIllness',          label: 'Systemic Illness',         sub: 'Epilepsy, heart disease etc.' },
                ] as { key: keyof FormData; label: string; sub?: string }[]).map(({ key, label, sub }) => (
                  <Toggle key={key} label={label} sub={sub} value={f[key] as boolean} onChange={v => set(key, v)} />
                ))}
              </div>
              {f.systemicIllness && (
                <div className="mt-4">
                  <label className="block">
                    <span className="text-sm font-semibold text-heading mb-2 block">Specify Illness</span>
                    <Input placeholder="e.g. Epilepsy, Heart disease..." value={f.systemicIllnessDetails} onChange={e => set('systemicIllnessDetails', e.target.value)} />
                  </label>
                </div>
              )}
            </motion.section>
          )}

          {/* Step 3 — Vitals */}
          {step === 3 && (
            <motion.section key="s3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[24px] shadow-card p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Heart className="w-5 h-5" /></div>
                <h3 className="text-xl font-serif font-bold text-heading">3. Vitals</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="block">
                  <span className="text-sm font-semibold text-heading mb-2 block">Height (cm)</span>
                  <Input placeholder="e.g. 155" type="number" value={f.heightCm} onChange={e => set('heightCm', e.target.value)} />
                </label>
                <label className="block">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-heading">Weight (kg)</span>
                    {bmiVal && <Badge variant="default">BMI: {bmiVal}</Badge>}
                  </div>
                  <Input placeholder="e.g. 55" type="number" value={f.weightKg} onChange={e => set('weightKg', e.target.value)} />
                </label>
                <label className="block md:col-span-2">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-heading">Blood Pressure (mmHg) <span className="text-red-500">*</span></span>
                    {bpBadge && (
                      <Badge variant={bpBadge.variant} className="flex items-center gap-1">
                        {bpBadge.variant !== 'green' && <AlertCircle className="w-3 h-3" />}
                        {bpBadge.label}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-3 items-center">
                    <Input placeholder="Systolic" type="number" value={f.bpSystolic} onChange={e => set('bpSystolic', e.target.value)} />
                    <span className="text-slate-400 font-bold text-lg">/</span>
                    <Input placeholder="Diastolic" type="number" value={f.bpDiastolic} onChange={e => set('bpDiastolic', e.target.value)} />
                  </div>
                </label>
              </div>
            </motion.section>
          )}

          {/* Step 4 — Lab Reports */}
          {step === 4 && (
            <motion.section key="s4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[24px] shadow-card p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"><FlaskConical className="w-5 h-5" /></div>
                <h3 className="text-xl font-serif font-bold text-heading">4. Lab Reports</h3>
              </div>
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-heading">Hemoglobin (g/dL) <span className="text-red-500">*</span></span>
                  {hbBadge && (
                    <Badge variant={hbBadge.variant} className="flex items-center gap-1">
                      {hbBadge.variant !== 'green' && <AlertCircle className="w-3 h-3" />}
                      {hbBadge.label}
                    </Badge>
                  )}
                </div>
                <Input placeholder="e.g. 10.5" type="number" step="0.1" value={f.hemoglobin} onChange={e => set('hemoglobin', e.target.value)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {([
                  { key: 'rhNegative',       label: 'Rh Negative',      sub: 'Anti-D prophylaxis required' },
                  { key: 'hivPositive',      label: 'HIV Positive',      sub: 'PMTCT protocol required',  danger: true },
                  { key: 'syphilisPositive', label: 'Syphilis Positive', sub: 'Refer for treatment',       danger: true },
                  { key: 'urineProtein',     label: 'Protein in Urine',  sub: 'Urine Protein' },
                  { key: 'urineSugar',       label: 'Sugar in Urine',    sub: 'Urine Sugar' },
                ] as { key: keyof FormData; label: string; sub?: string; danger?: boolean }[]).map(({ key, label, sub, danger }) => (
                  <Toggle key={key} label={label} sub={sub} value={f[key] as boolean} onChange={v => set(key, v)} danger={danger} />
                ))}
              </div>
            </motion.section>
          )}

          {/* Step 5 — Obstetric History */}
          {step === 5 && (
            <motion.section key="s5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[24px] shadow-card p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Baby className="w-5 h-5" /></div>
                <h3 className="text-xl font-serif font-bold text-heading">5. Obstetric History</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <label className="block">
                  <span className="text-sm font-semibold text-heading mb-2 block">Birth Order (Gravida)</span>
                  <Input placeholder="e.g. 3" type="number" value={f.birthOrder} onChange={e => set('birthOrder', e.target.value)} />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-heading mb-2 block">Inter-Pregnancy Interval</span>
                  <div className="relative">
                    <Input placeholder="e.g. 18" type="number" value={f.interPregnancyInterval} onChange={e => set('interPregnancyInterval', e.target.value)} />
                    <span className="absolute right-4 top-3 text-sm text-slate-400">months</span>
                  </div>
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-heading mb-2 block">Previous Stillbirths</span>
                  <Input placeholder="Count" type="number" value={f.stillbirthCount} onChange={e => set('stillbirthCount', e.target.value)} />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-heading mb-2 block">Previous Abortions</span>
                  <Input placeholder="Count" type="number" value={f.abortionCount} onChange={e => set('abortionCount', e.target.value)} />
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {([
                  { key: 'pretermHistory',          label: 'Previous Preterm History' },
                  { key: 'twinPregnancy',            label: 'Twin / Multiple Pregnancy' },
                  { key: 'malpresentation',          label: 'Malpresentation',            sub: 'Not cephalic presentation' },
                  { key: 'placentaPrevia',           label: 'Placenta Previa',            danger: true },
                  { key: 'reducedFetalMovement',     label: 'Reduced Fetal Movement' },
                  { key: 'amnioticFluidNormal',      label: 'Amniotic Fluid Normal' },
                  { key: 'umbilicalDopplerAbnormal', label: 'Umbilical Doppler Abnormal', danger: true },
                ] as { key: keyof FormData; label: string; sub?: string; danger?: boolean }[]).map(({ key, label, sub, danger }) => (
                  <Toggle key={key} label={label} sub={sub} value={f[key] as boolean} onChange={v => set(key, v)} danger={danger} />
                ))}
              </div>
            </motion.section>
          )}

          {/* Step 6 — Current Symptoms */}
          {step === 6 && (
            <motion.section key="s6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[24px] shadow-card border-2 border-red-50 p-6 md:p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <AlertCircle className="w-48 h-48 text-red-500" />
              </div>
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="size-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 animate-pulse">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-serif font-bold text-heading">6. Current Symptoms</h3>
              </div>
              <div className="bg-red-50 rounded-xl p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="text-red-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-red-800">Danger Signs Alert</p>
                  <p className="text-xs text-red-700 mt-1">Any positive selection here will classify this pregnancy as HIGH RISK immediately.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
                {([
                  { key: 'headache',             label: 'Headache',              sub: 'Persistent or severe' },
                  { key: 'visualDisturbance',    label: 'Visual Disturbance',    sub: 'Blurred vision, flashes' },
                  { key: 'epigastricPain',       label: 'Epigastric Pain',       sub: 'Upper abdominal pain' },
                  { key: 'decreasedUrineOutput', label: 'Decreased Urine Output' },
                  { key: 'bleedingPerVagina',    label: 'Vaginal Bleeding',      danger: true },
                  { key: 'convulsions',          label: 'Convulsions / Fits',    danger: true },
                ] as { key: keyof FormData; label: string; sub?: string; danger?: boolean }[]).map(({ key, label, sub, danger }) => (
                  <Toggle key={key} label={label} sub={sub} value={f[key] as boolean} onChange={v => set(key, v)} danger={danger} />
                ))}
              </div>
              {!canSubmit && (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-sm font-bold text-amber-800">⚠ Required fields missing</p>
                  <p className="text-xs text-amber-700 mt-1">Go back and complete: Patient Name, Age, Gestational Age, Blood Pressure, and Hemoglobin.</p>
                </div>
              )}
            </motion.section>
          )}

        </AnimatePresence>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-6 pt-12 sticky-bottom-gradient">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Button variant="outline" className="flex-1 h-14" onClick={() => step > 1 ? setStep(step - 1) : navigate('/')}>
            <ChevronLeft className="w-5 h-5 mr-1" />
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          {step < 6 ? (
            <Button className="flex-[2] h-14 text-lg group" onClick={() => setStep(step + 1)}>
              Next Step
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          ) : (
            <Button
              className={cn('flex-[2] h-14 text-lg group', !canSubmit && 'opacity-50 cursor-not-allowed')}
              onClick={canSubmit ? handleAnalyze : undefined}
            >
              🩺 Analyze Risk
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}