import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Directory from './screens/Directory';
import AssessmentForm from './screens/AssessmentForm';
import AssessmentResult from './screens/AssessmentResult';
import TeleConsultation from './screens/TeleConsultation';
import LiveConsultation from './screens/LiveConsultation';
import ReferralTracker from './screens/ReferralTracker';
import PatientHistory from './screens/PatientHistory';
import { Home, Users, Activity, Settings, Bell, Menu } from 'lucide-react';
import { cn } from './types';

function Navbar() {
  const location = useLocation();
  const isLive = location.pathname === '/live-consultation';

  if (isLive) return null;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/directory', icon: Users, label: 'Patients' },
    { path: '/referrals', icon: Activity, label: 'Referrals' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-primary/10 px-6 py-3 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="hidden md:flex items-center gap-2 group">
          <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-black text-heading leading-none">NeoSure</h1>
            <p className="text-[10px] font-bold text-primary tracking-widest uppercase">ANC Intelligence</p>
          </div>
        </Link>

        <div className="flex flex-1 md:flex-none justify-around md:justify-end gap-2 md:gap-8">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/directory' && location.pathname.startsWith('/patient'));
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={cn(
                  "flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-1 rounded-xl transition-all",
                  isActive ? "text-primary bg-primary/5" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <item.icon className={cn("w-6 h-6 md:w-5 md:h-5", isActive && "animate-pulse")} />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button className="relative p-2 text-slate-400 hover:text-primary transition-colors">
            <Bell className="w-6 h-6" />
            <div className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-primary/10">
            <div className="text-right">
              <p className="text-xs font-bold text-heading">ANM Sunita</p>
              <p className="text-[10px] text-slate-400">Sub-Center A</p>
            </div>
            <img src="https://picsum.photos/seed/user/100/100" className="size-10 rounded-full border-2 border-primary/20" alt="Avatar" />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 md:pt-20 pb-20 md:pb-0">
          <Routes>
            <Route path="/" element={<Directory />} />
            <Route path="/directory" element={<Directory />} />
            <Route path="/patient/:id" element={<PatientHistory />} />
            <Route path="/assessment/:id" element={<AssessmentForm />} />
            <Route path="/result/:risk" element={<AssessmentResult />} />
            <Route path="/consultation/:id" element={<TeleConsultation />} />
            <Route path="/live-consultation" element={<LiveConsultation />} />
            <Route path="/referrals" element={<ReferralTracker />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
