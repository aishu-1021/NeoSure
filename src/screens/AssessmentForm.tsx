import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Input, Badge } from '../components/UI';
import { User, Activity, Heart, FlaskConical, Baby, AlertCircle, Save, ArrowRight, ChevronLeft, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../types';

export default function AssessmentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

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
        <Badge variant="default" className="mb-3">ANC VISIT ENTRY</Badge>
        <h2 className="text-heading text-4xl md:text-5xl font-serif font-black leading-tight mb-2">Patient Risk Assessment</h2>
        <p className="text-slate-500 max-w-md mx-auto">AI-powered classification based on ICMR guidelines. Please ensure all data is accurate.</p>
      </div>

      {/* Stepper */}
      <div className="mb-8 overflow-x-auto no-scrollbar py-2">
        <div className="flex items-center justify-between min-w-[600px] md:min-w-full px-2">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className={cn(
                "flex flex-col items-center gap-2 group cursor-pointer w-20 transition-all",
                step === s.id ? "opacity-100" : "opacity-60"
              )} onClick={() => setStep(s.id)}>
                <div className={cn(
                  "size-8 rounded-full flex items-center justify-center transition-all",
                  step === s.id ? "bg-primary text-white shadow-lg shadow-primary/30 ring-4 ring-primary/10" : "bg-white border-2 border-subtle text-slate-400"
                )}>
                  <span className="text-sm font-bold">{s.id}</span>
                </div>
                <span className={cn("text-xs font-bold", step === s.id ? "text-heading" : "text-slate-400")}>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={cn(
                  "h-[2px] flex-1 mx-2 rounded-full",
                  step > s.id ? "bg-primary/30" : "bg-subtle"
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Sections */}
      <div className="flex flex-col gap-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[24px] shadow-card border-l-8 border-primary overflow-hidden p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-serif font-bold text-heading">1. Patient Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="block">
                  <span className="text-sm font-semibold text-heading mb-2 block">Full Name</span>
                  <Input placeholder="e.g. Meera Devi" />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-heading mb-2 block">Age</span>
                  <Input placeholder="Years" type="number" />
                </label>
                <label className="block">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-heading">Gestational Age</span>
                    <span className="text-xs text-primary font-medium">LMP: 12 Jan 2024</span>
                  </div>
                  <div className="relative">
                    <Input type="number" defaultValue={24} />
                    <span className="absolute right-4 top-3 text-sm text-slate-500 font-medium">Weeks</span>
                  </div>
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-heading mb-2 block">ANM / ASHA ID</span>
                  <Input readOnly value="ANM-2023-88" />
                </label>
              </div>
            </motion.section>
          )}

          {step === 2 && (
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[24px] shadow-card p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-serif font-bold text-heading">2. Medical History</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Previous LSCS', sub: 'Caesarean Section', active: true },
                  { label: 'Hypertension', sub: 'High BP History' },
                  { label: 'Diabetes', sub: 'Pre-existing or GDM' },
                  { label: 'Thyroid', sub: 'Hypo/Hyperthyroidism' },
                ].map((item, i) => (
                  <div key={i} className={cn(
                    "p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all",
                    item.active ? "bg-primary/5 border-primary/20" : "bg-background-light border-transparent hover:bg-slate-100"
                  )}>
                    <div className="flex flex-col">
                      <span className={cn("font-bold text-heading", !item.active && "font-medium")}>{item.label}</span>
                      <span className="text-xs text-slate-500">{item.sub}</span>
                    </div>
                    <div className={cn(
                      "relative w-12 h-7 rounded-full transition-colors",
                      item.active ? "bg-primary" : "bg-subtle"
                    )}>
                      <div className={cn(
                        "absolute top-1 size-5 bg-white rounded-full shadow-sm transition-transform",
                        item.active ? "right-1" : "left-1"
                      )} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {step === 3 && (
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[24px] shadow-card p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-serif font-bold text-heading">3. Vitals</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <label className="block">
                  <span className="text-sm font-semibold text-heading mb-2 block">Height (cm)</span>
                  <Input placeholder="150" type="number" />
                </label>
                <label className="block relative">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-heading">Weight (kg)</span>
                    <Badge variant="green">BMI: 22.4</Badge>
                  </div>
                  <Input placeholder="55" type="number" />
                </label>
                <label className="block relative">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-heading">BP (mmHg)</span>
                    <Badge variant="red" className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> High Risk
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="Sys" type="number" defaultValue={145} />
                    <span className="self-center text-slate-400">/</span>
                    <Input placeholder="Dia" type="number" defaultValue={95} />
                  </div>
                </label>
              </div>
            </motion.section>
          )}

          {step === 6 && (
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
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
                <AlertCircle className="text-red-500 w-5 h-5 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-800">Danger Signs Alert</p>
                  <p className="text-xs text-red-700 mt-1">Check carefully. Any positive selection here will mark this pregnancy as High Risk immediately.</p>
                </div>
              </div>
              <div className="space-y-3 relative z-10">
                {[
                  { label: 'High Fever (>38°C)', icon: 'thermometer' },
                  { label: 'Vaginal Bleeding', icon: 'droplets' },
                  { label: 'Convulsions / Fits', icon: 'brain' },
                  { label: 'Severe Swelling (Oedema)', icon: 'waves' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-background-light transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                        <Activity className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-heading">{item.label}</span>
                    </div>
                    <input type="checkbox" className="rounded text-red-500 focus:ring-red-500 size-6 border-2 border-slate-300" />
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-6 pt-12 sticky-bottom-gradient">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Button variant="outline" className="flex-1 h-14" onClick={() => step > 1 ? setStep(step - 1) : navigate('/')}>
            <Save className="w-5 h-5 mr-2" />
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          <Button className="flex-[2] h-14 text-lg group" onClick={() => step < 6 ? setStep(step + 1) : navigate('/result/RED')}>
            {step === 6 ? 'Analyze Risk' : 'Next Step'}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
