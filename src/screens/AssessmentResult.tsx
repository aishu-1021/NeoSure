import { useParams, Link } from 'react-router-dom';
import { Card, Button, Badge } from '../components/UI';
import { AlertTriangle, CheckCircle, Video, Printer, FileText, Calendar, User, FlaskConical, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../types';

export default function AssessmentResult() {
  const { risk } = useParams();
  const isRed = risk === 'RED';
  const isAmber = risk === 'AMBER';
  const isGreen = risk === 'GREEN';

  return (
    <div className="max-w-3xl mx-auto relative z-10 px-4 py-8">
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "rounded-[24px] border-l-8 shadow-xl overflow-hidden mb-12",
          isRed ? "bg-red-50 border-risk-red" : 
          isAmber ? "bg-amber-50 border-risk-amber" : 
          "bg-emerald-50 border-risk-green"
        )}
      >
        <div className="p-6 md:p-10">
          <div className="flex flex-col items-center text-center mb-8">
            <span className={cn(
              "text-[10px] font-bold tracking-[0.2em] uppercase mb-2",
              isRed ? "text-red-600/60" : isAmber ? "text-amber-600/60" : "text-emerald-600/60"
            )}>Risk Classification</span>
            <div className={cn(
              "text-white px-8 py-2.5 rounded-full text-xl font-black tracking-widest shadow-lg",
              isRed ? "bg-risk-red shadow-risk-red/20" : 
              isAmber ? "bg-risk-amber shadow-risk-amber/20" : 
              "bg-risk-green shadow-risk-green/20"
            )}>
              {isRed ? 'RED - HIGH RISK' : isAmber ? 'AMBER - MODERATE RISK' : 'GREEN - NORMAL RISK'}
            </div>
          </div>

          <div className="mb-8 space-y-4">
            <h4 className="text-xs font-bold text-heading/40 uppercase tracking-widest mb-4">
              {isGreen ? 'Assessment Summary' : 'Flagged Conditions'}
            </h4>
            
            {isGreen ? (
              <p className="text-sm font-semibold text-risk-green mb-4">No high-risk factors detected in this visit</p>
            ) : null}

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 flex items-start gap-4 border border-slate-100">
              {isGreen ? <CheckCircle className="text-risk-green w-6 h-6" /> : <AlertTriangle className={cn("w-6 h-6", isRed ? "text-risk-red" : "text-risk-amber")} />}
              <div>
                <p className="font-bold text-heading">{isGreen ? 'Vitals are Stable' : 'Severe Anemia'}</p>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {isGreen ? 'Blood pressure and heart rate are within optimal ranges for this gestational age.' : 'Hb levels are critically low (9.8 g/dL), indicating high risk for maternal exhaustion and fetal distress.'}
                </p>
              </div>
            </div>

            {!isGreen && (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 flex items-start gap-4 border border-slate-100">
                <AlertTriangle className={cn("w-6 h-6", isRed ? "text-risk-red" : "text-risk-amber")} />
                <div>
                  <p className="font-bold text-heading">Previous Preterm Delivery</p>
                  <p className="text-sm text-slate-500 leading-relaxed">History of LSCS and obstetric complications increases the likelihood of premature labor in current term.</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mb-8">
            <Badge variant="default" className="flex items-center gap-1.5 py-1.5">
              <FileText className="w-3.5 h-3.5" />
              MOHFW ANC Guidelines 2021 — Ref: Section 4.2
            </Badge>
          </div>

          <div className="mb-10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-heading/70">Assessment Confidence</span>
              <span className="text-sm font-bold text-primary">95%</span>
            </div>
            <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '95%' }}></div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {isGreen ? (
              <Button size="xl" className="w-full">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Next Routine Visit
              </Button>
            ) : (
              <Link to="/consultation/1">
                <Button variant="outline" size="xl" className="w-full group">
                  <Video className="w-5 h-5 mr-2" />
                  Escalate to Tele-Consultation
                </Button>
              </Link>
            )}
            <button className="text-center text-sm font-medium text-slate-500 hover:text-heading transition-colors underline underline-offset-4 decoration-primary/30">
              Save & Print Visit Summary
            </button>
          </div>
        </div>
      </motion.section>

      {/* Original Data Summary */}
      <div className="opacity-50 pointer-events-none">
        <div className="text-center mb-6">
          <Badge variant="default">ORIGINAL ASSESSMENT DATA</Badge>
        </div>
        <div className="space-y-4">
          <Card className="p-6 flex items-center gap-3">
            <User className="text-primary/40 w-5 h-5" />
            <h3 className="font-serif font-bold text-heading">Meera Devi, 24 Weeks Gestation</h3>
          </Card>
          <Card className="p-6 flex items-center gap-3">
            <FlaskConical className="text-primary/40 w-5 h-5" />
            <h3 className="font-serif font-bold text-heading">Lab Highlights: Hb 9.8 g/dL</h3>
          </Card>
          <Card className="p-6 flex items-center gap-3">
            <Activity className="text-primary/40 w-5 h-5" />
            <h3 className="font-serif font-bold text-heading">Vitals: BP 145/95 mmHg</h3>
          </Card>
        </div>
      </div>
    </div>
  );
}
