import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Badge, Button } from '../components/UI';
import { Calendar, ChevronLeft, AlertTriangle, CheckCircle, Clock, ArrowRight, Activity, FlaskConical, Heart, User } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../types';
import { MOCK_PATIENTS } from '../constants';

export default function PatientHistory() {
  const { id } = useParams();
  const patient = MOCK_PATIENTS.find(p => p.id === id) || MOCK_PATIENTS[0];

  const visits = [
    {
      id: 'v1',
      date: '2023-10-12',
      risk: 'RED',
      gestation: '24w 3d',
      summary: 'Severe Anemia (Hb 9.8), Elevated BP (145/95). Tele-consultation completed.',
      vitals: { bp: '145/95', hb: '9.8', hr: '88' }
    },
    {
      id: 'v2',
      date: '2023-09-15',
      risk: 'AMBER',
      gestation: '20w 1d',
      summary: 'Mild Anemia (Hb 10.5), BP normal. Iron supplements prescribed.',
      vitals: { bp: '120/80', hb: '10.5', hr: '76' }
    },
    {
      id: 'v3',
      date: '2023-08-10',
      risk: 'GREEN',
      gestation: '15w 0d',
      summary: 'Routine checkup. All vitals stable.',
      vitals: { bp: '118/75', hb: '11.2', hr: '72' }
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/directory" className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-serif font-black text-heading">{patient.name}</h1>
          <p className="text-sm text-slate-500 font-mono">RCH ID: {patient.rchId} • Age: {patient.age}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="p-6 border-l-4 border-primary">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Gestation</p>
          <p className="text-2xl font-bold text-heading">{patient.gestationWeeks}w {patient.gestationDays}d</p>
          <p className="text-xs text-primary font-medium mt-1">EDD: 15 Feb 2024</p>
        </Card>
        <Card className={cn(
          "p-6 border-l-4",
          patient.riskLevel === 'RED' ? "border-red-500 bg-red-50" : "border-emerald-500 bg-emerald-50"
        )}>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Risk Status</p>
          <div className="flex items-center gap-2">
            <p className={cn(
              "text-2xl font-bold",
              patient.riskLevel === 'RED' ? "text-red-600" : "text-emerald-600"
            )}>{patient.riskLevel}</p>
            {patient.riskLevel === 'RED' && <AlertTriangle className="text-red-600 w-6 h-6" />}
          </div>
          <p className="text-xs text-slate-500 mt-1">Last updated: {patient.lastVisitDate}</p>
        </Card>
        <div className="flex flex-col gap-3">
          <Link to={`/assessment/${patient.id}`}>
            <Button className="w-full h-full py-4 text-lg">
              <Activity className="w-5 h-5 mr-2" />
              New Assessment
            </Button>
          </Link>
        </div>
      </div>

      <h2 className="text-2xl font-serif font-bold text-heading mb-6">Visit Timeline</h2>
      
      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
        {visits.map((visit, i) => (
          <div key={visit.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            {/* Icon */}
            <div className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow-md z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-all group-hover:scale-125",
              visit.risk === 'RED' ? "bg-red-500 text-white" : 
              visit.risk === 'AMBER' ? "bg-amber-500 text-white" : 
              "bg-emerald-500 text-white"
            )}>
              <Calendar className="w-4 h-4" />
            </div>

            {/* Content */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)]">
              <Card className="p-6 hover:shadow-lg transition-all border-transparent hover:border-primary/10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{visit.date}</p>
                    <h3 className="text-lg font-bold text-heading">{visit.gestation} Visit</h3>
                  </div>
                  <Badge variant={visit.risk === 'RED' ? 'red' : visit.risk === 'AMBER' ? 'amber' : 'green'}>
                    {visit.risk}
                  </Badge>
                </div>
                
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">{visit.summary}</p>

                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-slate-50 rounded-lg p-2 text-center">
                    <Activity className="w-3 h-3 text-slate-400 mx-auto mb-1" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase">BP</p>
                    <p className="text-xs font-bold text-heading">{visit.vitals.bp}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2 text-center">
                    <FlaskConical className="w-3 h-3 text-slate-400 mx-auto mb-1" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Hb</p>
                    <p className="text-xs font-bold text-heading">{visit.vitals.hb}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2 text-center">
                    <Heart className="w-3 h-3 text-slate-400 mx-auto mb-1" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase">HR</p>
                    <p className="text-xs font-bold text-heading">{visit.vitals.hr}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                  <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                    VIEW FULL REPORT <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
