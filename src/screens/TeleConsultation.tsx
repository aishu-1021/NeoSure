import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Badge } from '../components/UI';
import { ArrowLeft, Video, Phone, MessageSquare, User, AlertTriangle, ChevronRight, Activity, FlaskConical } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../types';

export default function TeleConsultation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [urgency, setUrgency] = useState('Urgent');
  const [mode, setMode] = useState('Video');

  const specialists = [
    { name: 'Dr. Aruna', online: true, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8iamefniXi9r1IhgAFaqm0DCCuaWfgR5s4xna86lrkk_60hHmrEU4olYdwchpv4o8eMXSmLlY3oo-6q9t81Ncb3uz7S69_XY7p19GNJyOqnBtpkH7BLGAGhLsienblVIpV3Tqa8quNOQaPqGFy8kPvrZwvi9kaEEEoZ7copKdHNs4eb2FQyGoVJYUy7_gsUqR-FZrsHojGvefNXpqhuKxVc4TLV4hWRNILYHzTH5DsO060y3ry8TM1_cVWOXh8YtqQjsZmjvg4S4' },
    { name: 'Dr. Vikram', online: true, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuQ-3YA-eaWOTJApW57EZFADzy_DfGB8bUUqhWfD8Zhe4MRNasx23W9cwl8Wa5klB8iHKmEH_IoOXOvGsY5zGMcgbMaT8Oky4ikQKCzYL6aji00ble14wbwlU--yyvSbv_MXSOot-J9V0m9MppwHRrHFqMiFP6ZRx22hR0ff6GUzqshQbnDppKRjWdPsAdR7mABB6GxKav_EaQQUIzm0QXNg4tLf0XReDXdulFqYAe16URorQqzhtB5NemCLiAq0ESs8ckrsEhbVs' },
    { name: 'Dr. Preeti', online: true, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArtAEz4uaK1WlK620noftmdOi0jS3IgmijsS-4mV78C9iH2rTe1XMOxqcN9t3TogTvql2Ntz44p-xEy_DZzwWmw35Dt-B_w8jnbAx-A6rOCe6kJFgopjNogVUtQ19OAZXjSZiRbcAdiSF5zGLfrKh5fldNyGCxyW9jvlWMJblOg5trktvokxu_PArOJ7k29TqjCVvgI8CIpgoEDX0kHtpdzrf88KG9H6FnecukfopIWCiIfIpH1NZFaS2Ah2lyZMOxvYGLZpjHuhQ' },
    { name: 'Dr. Sameer', online: true, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDhzmNscdKKE_tMJbW35K6_DpISxfyrX_L3ELHGK8tDWPdvmPvRm3CVDjOmxvdfVg8HpF6MZpmcfiD9Oohm8Y76_ZuSWmLYgx3iphA_XsbIRECnjA2ZE6f7uoQTatgKhP7YfQ-fC_XZL8ZJvQp85XMR4NiXd9fCQQK43NrTrIIwiJW-Sn1u1K0uQKqpULeLxZBcD24-veZFx69eZEiOkevoBXlAQa4EdxxkiLRBH7SzkQ05Gn0XRmHfN6mesOY4GPBCKXn7YZ7eEY' },
  ];

  return (
    <div className="max-w-[600px] mx-auto bg-white min-h-screen relative shadow-2xl flex flex-col">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-primary/10 bg-white/80 backdrop-blur-md px-6 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Tele-Consultation</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-green-500"></div>
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">System Ready</span>
        </div>
      </header>

      <main className="flex-1 px-6 py-8 space-y-8 pb-32">
        {/* Context */}
        <section className="bg-primary/5 rounded-xl p-6 border border-primary/10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-1">Patient Context</p>
              <h1 className="text-2xl font-bold text-slate-900">Anjali Devi, 32w</h1>
              <p className="text-slate-600 italic">3rd Pregnancy • Gestational Age: 32 Weeks</p>
            </div>
            <Badge variant="red" className="flex items-center gap-1 shadow-lg shadow-red-600/20 py-1 px-3">
              <AlertTriangle className="w-3 h-3" /> RED - HIGH RISK
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <div className="px-3 py-1.5 rounded-lg bg-white border border-red-200 flex items-center gap-2">
              <FlaskConical className="text-red-600 w-4 h-4" />
              <span className="text-sm font-medium">Severe Anemia</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-white border border-red-200 flex items-center gap-2">
              <Activity className="text-red-600 w-4 h-4" />
              <span className="text-sm font-medium">Elevated BP (150/95)</span>
            </div>
          </div>
        </section>

        {/* Urgency */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Urgency Level</h3>
          <div className="flex h-12 w-full items-center justify-center rounded-full bg-primary/5 p-1 border border-primary/10">
            {['Standard', 'Urgent', 'Emergency'].map((level) => (
              <button
                key={level}
                onClick={() => setUrgency(level)}
                className={cn(
                  "flex-1 h-full rounded-full text-sm font-bold transition-all",
                  urgency === level 
                    ? level === 'Emergency' ? "bg-red-600 text-white shadow-md animate-pulse" : "bg-white text-primary shadow-md"
                    : "text-slate-500"
                )}
              >
                {level}
              </button>
            ))}
          </div>
        </section>

        {/* Mode */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Consultation Mode</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setMode('Video')}
              className={cn(
                "h-32 flex flex-col items-center justify-center rounded-xl border-2 transition-all p-4",
                mode === 'Video' ? "border-primary bg-primary/5" : "border-primary/10 bg-white"
              )}
            >
              <Video className="w-10 h-10 text-primary mb-2" />
              <span className="font-bold text-slate-900">Video Call</span>
            </button>
            <button
              onClick={() => setMode('Audio')}
              className={cn(
                "h-32 flex flex-col items-center justify-center rounded-xl border-2 transition-all p-4",
                mode === 'Audio' ? "border-primary bg-primary/5" : "border-primary/10 bg-white"
              )}
            >
              <Phone className="w-10 h-10 text-primary mb-2" />
              <span className="font-bold text-slate-900">Audio Call</span>
            </button>
          </div>
        </section>

        {/* Notes */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Additional Notes</h3>
          <textarea 
            className="w-full rounded-xl border-primary/10 bg-primary/5 focus:border-primary focus:ring-primary placeholder:text-slate-400 text-sm p-4 min-h-[120px] resize-none"
            placeholder="Add specific concerns for the doctor (e.g., patient complains of severe dizziness)..."
          />
        </section>

        {/* Specialists */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Available Specialists</h3>
            <Badge variant="green">4 Online</Badge>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {specialists.map((doc, i) => (
              <div key={i} className="flex flex-col items-center min-w-[70px] gap-2">
                <div className="relative">
                  <img className="size-14 rounded-full object-cover border-2 border-primary" src={doc.img} alt={doc.name} />
                  <div className="absolute bottom-0 right-0 size-3.5 rounded-full bg-green-500 border-2 border-white" />
                </div>
                <span className="text-[10px] font-bold text-slate-600 text-center">{doc.name}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] z-50 px-6 py-6 bg-white/90 backdrop-blur-md border-t border-primary/10">
        <Button size="xl" className="w-full" onClick={() => navigate('/live-consultation')}>
          <Phone className="w-5 h-5 mr-3" />
          Request Consultation Now
        </Button>
      </footer>
    </div>
  );
}
