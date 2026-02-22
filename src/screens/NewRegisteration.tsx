import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../types';

export default function NewRegisteration() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [f, setF] = useState({
    fullName: '', phone: '', rchId: '', age: '', lmpDate: '',
    previousLSCS: false, stillbirthHistory: false,
    chronicHypertension: false, diabetesThyroid: false,
    heightCm: '', weightKg: '', baselineBP: '',
    twinPregnancy: false, hivSyphilis: false,
    severeHeadache: false, vaginalBleeding: false,
    blurredVision: false, abdominalPain: false, swellingFeet: false,
  });

  const set = (key: keyof typeof f, val: any) => setF(prev => ({ ...prev, [key]: val }));

  const getGestationalAge = () => {
    if (!f.lmpDate) return null;
    const lmp = new Date(f.lmpDate);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return null;
    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;
    return { weeks, days, display: `${weeks} Weeks, ${days} Days` };
  };

  // ── Parse BP string "120/80" → systolic / diastolic ──
  const parseBP = (bp: string) => {
    const parts = bp.split('/');
    if (parts.length === 2) {
      return { systolic: parseInt(parts[0]) || null, diastolic: parseInt(parts[1]) || null };
    }
    return { systolic: null, diastolic: null };
  };

  // ── Save patient to MySQL via backend API ──
  const handleCompleteRegistration = async () => {
    if (!canComplete) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    const gestAge = getGestationalAge();
    const bp = parseBP(f.baselineBP);

    // Get the logged-in ANM worker ID from localStorage (set during login)
    const anmId = localStorage.getItem('anc_worker_id') || 'ANM/KA/BLR/2024/0178';

    const patientData = {
      worker_id:              anmId,
      full_name:              f.fullName,
      phone_number:           f.phone,
      rch_id:                 f.rchId,
      age:                    parseInt(f.age),
      lmp_date:               f.lmpDate,
      gestational_age_weeks:  gestAge?.weeks || 0,

      // Step 2
      previous_lscs:          f.previousLSCS ? 1 : 0,
      stillbirth_history:     f.stillbirthHistory ? 1 : 0,
      chronic_hypertension:   f.chronicHypertension ? 1 : 0,
      diabetes:               f.diabetesThyroid ? 1 : 0,
      thyroid:                f.diabetesThyroid ? 1 : 0,
      height_cm:              f.heightCm ? parseFloat(f.heightCm) : null,
      weight_kg:              f.weightKg ? parseFloat(f.weightKg) : null,
      baseline_bp_systolic:   bp.systolic,
      baseline_bp_diastolic:  bp.diastolic,

      // Step 3
      twin_pregnancy:         f.twinPregnancy ? 1 : 0,
      hiv_positive:           f.hivSyphilis ? 1 : 0,
      syphilis_positive:      f.hivSyphilis ? 1 : 0,
      severe_headache:        f.severeHeadache ? 1 : 0,
      vaginal_bleeding:       f.vaginalBleeding ? 1 : 0,
      blurred_vision:         f.blurredVision ? 1 : 0,
      abdominal_pain:         f.abdominalPain ? 1 : 0,
      swelling_of_feet:       f.swellingFeet ? 1 : 0,
    };

    try {
      const response = await fetch('http://localhost:8080/api/patient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        // Navigate to home after 2 seconds
        setTimeout(() => navigate('/'), 2000);
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setSubmitStatus('error');
      setErrorMessage('Cannot connect to server. Make sure the backend is running on port 8080.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      className={cn('w-12 h-6 rounded-full relative transition-colors flex-shrink-0', value ? 'bg-primary' : 'bg-slate-300')}
    >
      <span className={cn('absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all', value ? 'right-1' : 'left-1')} />
    </button>
  );

  const progress = step === 1 ? '33%' : step === 2 ? '66%' : '100%';
  const gestAge = getGestationalAge();
  const canComplete = f.fullName && f.rchId && f.age && f.lmpDate;

  return (
    <div className="bg-background-light min-h-screen font-sans">

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-primary/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-primary/10 rounded-full transition-colors text-primary">
              ←
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">NeoSure ANC</h1>
              <p className="text-xs text-slate-500 font-medium">New Patient Registration</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Onboarding Mode</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold">ANM Sunita</p>
              <p className="text-[10px] text-slate-500">Sub-Center A</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">SD</div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-8 pb-32">

        {/* Progress Stepper */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4 px-2">
            {[
              { id: 1, label: 'Basic Info' },
              { id: 2, label: 'Medical Baseline' },
              { id: 3, label: 'Symptoms' },
            ].map((s, i) => (
              <div key={s.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setStep(s.id)}>
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all',
                    step >= s.id ? 'bg-primary text-white ring-4 ring-primary/20' : 'bg-slate-200 text-slate-500'
                  )}>
                    {step > s.id ? '✓' : s.id}
                  </div>
                  <span className={cn('text-xs font-bold', step >= s.id ? 'text-primary' : 'text-slate-500')}>{s.label}</span>
                </div>
                {i < 2 && <div className={cn('h-0.5 flex-1 mx-4 -mt-6 rounded-full', step > s.id ? 'bg-primary' : 'bg-slate-200')} />}
              </div>
            ))}
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <motion.div className="bg-primary h-full rounded-full" animate={{ width: progress }} transition={{ duration: 0.5 }} />
          </div>
        </div>

        <div className="space-y-8">

          {/* Step 1: Patient Identity */}
          <section className={cn('bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8', step !== 1 && 'opacity-60 pointer-events-none')}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary font-bold text-lg">🪪</div>
                <h2 className="text-xl font-bold">Step 1: Patient Identity</h2>
              </div>
              <span className="text-primary text-xs font-bold uppercase tracking-widest">* Required</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Full Name <span className="text-primary">*</span></label>
                <input className="w-full bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent h-12 px-4 outline-none" placeholder="Enter mother's name" type="text" value={f.fullName} onChange={e => set('fullName', e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                <input className="w-full bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent h-12 px-4 outline-none" placeholder="+91 00000 00000" type="tel" value={f.phone} onChange={e => set('phone', e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">RCH ID <span className="text-primary">*</span></label>
                <input className="w-full bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent h-12 px-4 outline-none" placeholder="12-digit RCH ID" type="text" value={f.rchId} onChange={e => set('rchId', e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Age (Years) <span className="text-primary">*</span></label>
                <input className="w-full bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent h-12 px-4 outline-none" placeholder="e.g. 24" type="number" value={f.age} onChange={e => set('age', e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">LMP Date <span className="text-primary">*</span></label>
                <input className="w-full bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent h-12 px-4 outline-none" type="date" value={f.lmpDate} onChange={e => set('lmpDate', e.target.value)} />
              </div>
              <div className="flex items-center">
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 w-full flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-tighter">Estimated Gestational Age</p>
                    <p className="text-lg font-bold text-primary">{gestAge?.display || '— Weeks'}</p>
                  </div>
                  <span className="text-3xl opacity-50">🤱</span>
                </div>
              </div>
            </div>
          </section>

          {/* Step 2: Medical Baseline */}
          <section className={cn('bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8', step !== 2 && 'opacity-60 pointer-events-none')}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg text-lg">📋</div>
              <h2 className="text-xl font-bold">Step 2: Medical Baseline</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Obstetric History</p>
                {[
                  { key: 'previousLSCS' as const, label: 'Previous LSCS (C-Section)' },
                  { key: 'stillbirthHistory' as const, label: 'Stillbirth History' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium">{label}</span>
                    <Toggle value={f[key]} onChange={v => set(key, v)} />
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Chronic Conditions</p>
                {[
                  { key: 'chronicHypertension' as const, label: 'Chronic Hypertension' },
                  { key: 'diabetesThyroid' as const, label: 'Diabetes / Thyroid' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium">{label}</span>
                    <Toggle value={f[key]} onChange={v => set(key, v)} />
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { key: 'heightCm' as const, label: 'Height (cm)', placeholder: '160' },
                { key: 'weightKg' as const, label: 'Weight (kg)', placeholder: '58' },
                { key: 'baselineBP' as const, label: 'Baseline BP', placeholder: '120/80' },
              ].map(({ key, label, placeholder }) => (
                <div key={key} className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">{label}</label>
                  <input className="w-full bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent h-12 px-4 outline-none" placeholder={placeholder} value={f[key]} onChange={e => set(key, e.target.value)} />
                </div>
              ))}
            </div>
          </section>

          {/* Step 3: Current Status */}
          <section className={cn('bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8', step !== 3 && 'opacity-60 pointer-events-none')}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg text-lg">🩺</div>
              <h2 className="text-xl font-bold">Step 3: Current Status</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {[
                { key: 'twinPregnancy' as const, label: 'Twin Pregnancy', icon: '👥' },
                { key: 'hivSyphilis' as const, label: 'HIV / Syphilis Status', icon: '🧪' },
              ].map(({ key, label, icon }) => (
                <div key={key} className="p-4 border-2 border-slate-100 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{icon}</span>
                    <span className="font-medium">{label}</span>
                  </div>
                  <Toggle value={f[key]} onChange={v => set(key, v)} />
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Reported Symptoms</p>
              <div className="flex flex-wrap gap-3">
                {[
                  { key: 'severeHeadache' as const, label: 'Severe Headache' },
                  { key: 'vaginalBleeding' as const, label: 'Vaginal Bleeding' },
                  { key: 'blurredVision' as const, label: 'Blurred Vision' },
                  { key: 'abdominalPain' as const, label: 'Abdominal Pain' },
                  { key: 'swellingFeet' as const, label: 'Swelling of Feet' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => set(key, !f[key])}
                    className={cn(
                      'px-4 py-2 rounded-full border text-sm font-medium transition-all flex items-center gap-2',
                      f[key] ? 'border-primary/20 bg-primary/5 text-primary' : 'border-slate-200 text-slate-500 hover:border-primary/20'
                    )}
                  >
                    {f[key] && <span>✓</span>} {label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Success Banner */}
        {canComplete && step === 3 && submitStatus === 'idle' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex items-center justify-center gap-3 bg-green-50 border border-green-100 p-4 rounded-xl"
          >
            <span className="text-green-500 text-xl">✅</span>
            <p className="text-sm font-medium text-green-700">All baseline fields populated. Ready for Risk Analysis.</p>
          </motion.div>
        )}

        {/* Saving Banner */}
        {isSubmitting && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex items-center justify-center gap-3 bg-blue-50 border border-blue-100 p-4 rounded-xl"
          >
            <span className="text-blue-500 text-xl animate-spin">⏳</span>
            <p className="text-sm font-medium text-blue-700">Saving patient record to database...</p>
          </motion.div>
        )}

        {/* Saved Successfully Banner */}
        {submitStatus === 'success' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex items-center justify-center gap-3 bg-green-50 border border-green-200 p-4 rounded-xl"
          >
            <span className="text-green-500 text-xl">🎉</span>
            <p className="text-sm font-medium text-green-700">Patient saved to database successfully! Redirecting...</p>
          </motion.div>
        )}

        {/* Error Banner */}
        {submitStatus === 'error' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex items-center justify-center gap-3 bg-red-50 border border-red-100 p-4 rounded-xl"
          >
            <span className="text-red-500 text-xl">❌</span>
            <p className="text-sm font-medium text-red-700">{errorMessage}</p>
          </motion.div>
        )}

      </main>

      {/* Sticky Footer */}
      <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 p-4 sm:p-6 z-50">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-xl">🛡️</div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Data Integrity</p>
              <p className="text-sm font-bold">Protocol Compliant</p>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)}
                className="flex-1 sm:flex-none px-8 h-14 rounded-xl bg-slate-100 font-bold hover:bg-slate-200 transition-colors">
                Back
              </button>
            )}
            {step < 3 ? (
              <button onClick={() => setStep(s => s + 1)}
                className="flex-[2] sm:flex-none px-12 h-14 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                Next Step →
              </button>
            ) : (
              <button
                onClick={handleCompleteRegistration}
                disabled={!canComplete || isSubmitting}
                className={cn(
                  'flex-[2] sm:flex-none px-12 h-14 rounded-xl text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2',
                  canComplete && !isSubmitting
                    ? 'bg-primary shadow-primary/30 hover:scale-[1.02]'
                    : 'bg-slate-300 cursor-not-allowed'
                )}
              >
                {isSubmitting ? '⏳ Saving...' : '✅ Complete Registration ›'}
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}