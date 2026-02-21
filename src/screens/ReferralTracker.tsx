import { useState, useEffect } from 'react';
import { Card, Badge, Button } from '../components/UI';
import { Activity, MapPin, Truck, AlertTriangle, CheckCircle, Clock, ChevronRight, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { cn, Referral } from '../types';

export default function ReferralTracker() {
  const [referrals, setReferrals] = useState<Referral[]>([
    {
      id: 'R1',
      visitId: 'V1',
      patientId: '1',
      status: 'IN_TRANSIT',
      urgency: 'EMERGENCY',
      fromFacility: 'Sub-Center A',
      toFacility: 'District Hospital',
      initiatedAt: '2023-10-24T10:30:00Z',
      etaMinutes: 12,
    },
    {
      id: 'R2',
      visitId: 'V2',
      patientId: '2',
      status: 'INITIATED',
      urgency: 'URGENT',
      fromFacility: 'Sub-Center B',
      toFacility: 'Community Health Center',
      initiatedAt: '2023-10-24T11:15:00Z',
      etaMinutes: 45,
    }
  ]);

  const statusSteps = ['INITIATED', 'DISPATCHED', 'IN_TRANSIT', 'ARRIVED', 'ADMITTED'];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-serif font-black text-heading mb-2">Active Referrals</h1>
          <p className="text-slate-500">Real-time logistics and admission tracking for high-risk cases.</p>
        </div>
        <div className="flex gap-4">
          <Card className="p-4 flex items-center gap-4 bg-red-50 border-red-100">
            <div className="size-12 rounded-full bg-red-500 flex items-center justify-center text-white animate-pulse">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">3</p>
              <p className="text-xs font-bold text-red-800 uppercase tracking-wider">Emergency</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-4 bg-emerald-50 border-emerald-100">
            <div className="size-12 rounded-full bg-emerald-500 flex items-center justify-center text-white">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">12</p>
              <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Completed</p>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Referral List */}
        <div className="lg:col-span-2 space-y-6">
          {referrals.map((ref) => (
            <Card key={ref.id} className="p-0 overflow-hidden border-l-8 border-l-red-500">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-heading">Referral #{ref.id}</h3>
                      <p className="text-sm text-slate-500">{ref.fromFacility} → {ref.toFacility}</p>
                    </div>
                  </div>
                  <Badge variant={ref.urgency === 'EMERGENCY' ? 'red' : 'amber'}>{ref.urgency}</Badge>
                </div>

                {/* Progress Tracker */}
                <div className="relative mb-8 px-2">
                  <div className="absolute top-4 left-0 right-0 h-1 bg-slate-100 rounded-full" />
                  <div 
                    className="absolute top-4 left-0 h-1 bg-primary rounded-full transition-all duration-1000" 
                    style={{ width: `${(statusSteps.indexOf(ref.status) / (statusSteps.length - 1)) * 100}%` }}
                  />
                  <div className="flex justify-between relative z-10">
                    {statusSteps.map((step, i) => {
                      const isCompleted = statusSteps.indexOf(ref.status) >= i;
                      const isCurrent = ref.status === step;
                      return (
                        <div key={step} className="flex flex-col items-center gap-2">
                          <div className={cn(
                            "size-9 rounded-full flex items-center justify-center border-4 transition-all",
                            isCompleted ? "bg-primary border-primary/20 text-white" : "bg-white border-slate-100 text-slate-300",
                            isCurrent && "ring-4 ring-primary/10 scale-110"
                          )}>
                            {isCompleted ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                          </div>
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider text-center max-w-[60px]",
                            isCompleted ? "text-primary" : "text-slate-400"
                          )}>
                            {step.replace('_', ' ')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 rounded-xl p-4">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">ETA</p>
                    <p className="text-lg font-bold text-primary">{ref.etaMinutes} Mins</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Ambulance</p>
                    <p className="text-sm font-bold text-heading">DL-12-AB-9921</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Driver</p>
                    <p className="text-sm font-bold text-heading">Rajesh Kumar</p>
                  </div>
                  <div className="flex justify-end items-center">
                    <Button variant="secondary" size="sm">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                  </div>
                </div>
              </div>
              <div className="bg-primary/5 px-6 py-3 flex justify-between items-center border-t border-primary/10">
                <p className="text-xs text-slate-500">Initiated at {new Date(ref.initiatedAt).toLocaleTimeString()}</p>
                <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                  VIEW LOGS <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Map Placeholder / Info */}
        <div className="space-y-6">
          <Card className="p-0 overflow-hidden h-[400px] relative">
            <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
              <div className="text-center p-8">
                <MapPin className="w-12 h-12 text-primary/40 mx-auto mb-4" />
                <p className="text-slate-500 font-medium italic">Live Logistics Map View</p>
                <p className="text-xs text-slate-400 mt-2">Connecting to GPS tracking system...</p>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur shadow-lg rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-heading">Ambulance 102</p>
                  <p className="text-[10px] text-slate-500">Moving at 45 km/h</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold text-heading mb-4">Regional Capacity</h3>
            <div className="space-y-4">
              {[
                { name: 'District Hospital', beds: 12, total: 50, color: 'bg-red-500' },
                { name: 'CHC Malviya', beds: 4, total: 10, color: 'bg-amber-500' },
                { name: 'City Maternity', beds: 25, total: 30, color: 'bg-emerald-500' },
              ].map((h) => (
                <div key={h.name}>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-600">{h.name}</span>
                    <span className="text-heading">{h.beds}/{h.total} Beds</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", h.color)} style={{ width: `${(h.beds / h.total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
