import { useState, useEffect } from 'react';
import { Patient, Referral, cn } from '../types';
import { MOCK_PATIENTS } from '../constants';
import { Card, Button, Input, Badge } from '../components/UI';
import { Search, UserPlus, ShieldPlus, Users, AlertTriangle, Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Directory() {
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [search, setSearch] = useState('');

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.rchId.includes(search)
  );

  const stats = [
    { label: "Today's Visits", value: 12, icon: Calendar, color: 'bg-primary', badge: 'TODAY' },
    { label: "High Risk Patients", value: 5, icon: AlertTriangle, color: 'bg-primary/90', badge: 'PRIORITY' },
    { label: "Registered Patients", value: 128, icon: Users, color: 'bg-white', badge: 'TOTAL', textColor: 'text-primary' },
  ];

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-8">
      {/* Search */}
      <div className="mb-10">
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="text-primary w-6 h-6 group-focus-within:scale-110 transition-transform" />
          </div>
          <Input 
            className="h-16 pl-14 pr-6 bg-white shadow-xl shadow-primary/5 text-lg"
            placeholder="Search by Name, RCH ID, or Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className={cn(
            "p-6 rounded-2xl shadow-lg flex flex-col justify-between h-40",
            stat.color,
            stat.textColor || 'text-white'
          )}>
            <div className="flex justify-between items-start">
              <stat.icon className={cn("w-6 h-6", stat.textColor ? 'text-primary' : 'opacity-80')} />
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded",
                stat.textColor ? 'bg-primary/10 text-primary' : 'bg-white/20'
              )}>
                {stat.badge}
              </span>
            </div>
            <div>
              <p className="text-4xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm font-medium opacity-90">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Patient List */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Your Patients</h2>
        <div className="flex gap-6 border-b border-primary/10">
          <button className="pb-3 border-b-4 border-primary text-primary font-bold text-sm tracking-wide">RECENTLY ACCESSED</button>
          <button className="pb-3 border-b-4 border-transparent text-slate-400 hover:text-primary transition-colors font-bold text-sm tracking-wide">UPCOMING VISITS</button>
        </div>
      </div>

      <div className="space-y-4 mb-24">
        {filteredPatients.map((patient) => (
          <Link to={`/patient/${patient.id}`} key={patient.id}>
            <Card className="p-5 hover:shadow-md transition-all border-transparent hover:border-primary/20 flex items-center group cursor-pointer">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "size-12 rounded-full flex items-center justify-center border-2 relative",
                    patient.riskLevel === 'RED' ? 'bg-red-100 text-red-600 border-red-500' :
                    patient.riskLevel === 'AMBER' ? 'bg-amber-100 text-amber-600 border-amber-500' :
                    'bg-green-100 text-green-600 border-green-500'
                  )}>
                    {patient.riskLevel === 'RED' ? <AlertTriangle className="w-6 h-6" /> : 
                     patient.riskLevel === 'AMBER' ? <AlertTriangle className="w-6 h-6" /> :
                     <ShieldPlus className="w-6 h-6" />}
                    <div className={cn(
                      "absolute -top-1 -right-1 size-3 rounded-full border-2 border-white",
                      patient.riskLevel === 'RED' ? 'bg-red-500' :
                      patient.riskLevel === 'AMBER' ? 'bg-amber-500' :
                      'bg-green-500'
                    )} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">{patient.name}</h3>
                    <p className="text-xs font-mono text-slate-500 tracking-tight">RCH ID: {patient.rchId}</p>
                  </div>
                </div>
                <div className="hidden md:block">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Gestation</p>
                  <p className="text-sm font-semibold text-slate-700">{patient.gestationWeeks} Weeks, {patient.gestationDays} Days</p>
                </div>
                <div className="hidden md:block">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Last Visit</p>
                  <p className="text-sm font-semibold text-slate-700">{patient.lastVisitDate}</p>
                </div>
                <div className="flex justify-end pr-2">
                  <ChevronRight className="text-primary opacity-40 group-hover:opacity-100 transition-all translate-x-0 group-hover:translate-x-2" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* FAB */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button size="xl" className="px-8 py-4 shadow-2xl shadow-primary/40 transform hover:scale-105">
          <UserPlus className="w-6 h-6 mr-3" />
          New Registration
        </Button>
      </div>
    </div>
  );
}
