import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Badge } from '../components/UI';
import { PhoneOff, Mic, MicOff, Video, VideoOff, MessageSquare, Activity, Heart, FlaskConical, AlertTriangle, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../types';

export default function LiveConsultation() {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'doctor', text: 'Hello, I am reviewing the vitals now.' },
    { role: 'anm', text: 'The patient is Meera Devi, 24 weeks. BP is high.' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const vitals = [
    { label: 'BP', value: '145/95', unit: 'mmHg', icon: Activity, status: 'high' },
    { label: 'Hb', value: '9.8', unit: 'g/dL', icon: FlaskConical, status: 'low' },
    { label: 'HR', value: '88', unit: 'bpm', icon: Heart, status: 'normal' },
  ];

  return (
    <div className="fixed inset-0 bg-background-dark z-[100] flex flex-col md:flex-row overflow-hidden">
      {/* Main Video Area */}
      <div className="flex-1 relative bg-slate-900 flex items-center justify-center">
        {/* Doctor Video (Main) */}
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8iamefniXi9r1IhgAFaqm0DCCuaWfgR5s4xna86lrkk_60hHmrEU4olYdwchpv4o8eMXSmLlY3oo-6q9t81Ncb3uz7S69_XY7p19GNJyOqnBtpkH7BLGAGhLsienblVIpV3Tqa8quNOQaPqGFy8kPvrZwvi9kaEEEoZ7copKdHNs4eb2FQyGoVJYUy7_gsUqR-FZrsHojGvefNXpqhuKxVc4TLV4hWRNILYHzTH5DsO060y3ry8TM1_cVWOXh8YtqQjsZmjvg4S4" 
          className="w-full h-full object-cover opacity-80"
          alt="Doctor"
        />
        
        {/* Self Video (PIP) */}
        <div className="absolute top-6 right-6 w-32 md:w-48 aspect-video bg-slate-800 rounded-xl border-2 border-white/20 overflow-hidden shadow-2xl">
          {!isVideoOff ? (
            <img src="https://picsum.photos/seed/anm/400/300" className="w-full h-full object-cover" alt="Self" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-700">
              <VideoOff className="text-white/40 w-8 h-8" />
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-0.5 rounded text-[10px] text-white font-bold">YOU (ANM)</div>
        </div>

        {/* Vitals Overlay */}
        <div className="absolute top-6 left-6 space-y-3">
          {vitals.map((v, i) => (
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              key={v.label} 
              className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-3 flex items-center gap-3 min-w-[140px]"
            >
              <div className={cn(
                "size-8 rounded-lg flex items-center justify-center",
                v.status === 'high' ? "bg-red-500/20 text-red-400" :
                v.status === 'low' ? "bg-amber-500/20 text-amber-400" :
                "bg-emerald-500/20 text-emerald-400"
              )}>
                <v.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-white/60 font-bold uppercase tracking-wider">{v.label}</p>
                <p className="text-white font-bold">{v.value} <span className="text-[10px] font-normal opacity-60">{v.unit}</span></p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={cn(
              "size-14 rounded-full flex items-center justify-center transition-all",
              isMuted ? "bg-red-500 text-white" : "bg-white/10 backdrop-blur-md text-white hover:bg-white/20"
            )}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          <button 
            onClick={() => navigate('/directory')}
            className="size-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl shadow-red-600/40 hover:scale-110 active:scale-95 transition-all"
          >
            <PhoneOff className="w-8 h-8" />
          </button>
          <button 
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={cn(
              "size-14 rounded-full flex items-center justify-center transition-all",
              isVideoOff ? "bg-red-500 text-white" : "bg-white/10 backdrop-blur-md text-white hover:bg-white/20"
            )}
          >
            {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          </button>
          <button 
            onClick={() => setShowChat(!showChat)}
            className={cn(
              "size-14 rounded-full flex items-center justify-center transition-all md:hidden",
              showChat ? "bg-primary text-white" : "bg-white/10 backdrop-blur-md text-white hover:bg-white/20"
            )}
          >
            <MessageSquare className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Sidebar (Chat & Notes) */}
      <AnimatePresence>
        {(showChat || window.innerWidth > 768) && (
          <motion.div 
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="w-full md:w-[400px] bg-white flex flex-col border-l border-primary/10 shadow-2xl"
          >
            <div className="p-6 border-b border-primary/10 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-serif font-bold text-heading">Clinical Notes</h3>
                <p className="text-xs text-slate-500">Live consultation with Dr. Aruna</p>
              </div>
              <button onClick={() => setShowChat(false)} className="md:hidden p-2 text-slate-400">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="text-red-600 w-4 h-4" />
                  <span className="text-xs font-bold text-red-800 uppercase tracking-wider">Doctor's Observation</span>
                </div>
                <p className="text-sm text-red-900 font-medium">Patient shows signs of pre-eclampsia. Immediate referral to District Hospital recommended.</p>
              </div>

              <div className="space-y-4">
                {messages.map((m, i) => (
                  <div key={i} className={cn(
                    "flex flex-col max-w-[85%]",
                    m.role === 'doctor' ? "mr-auto" : "ml-auto items-end"
                  )}>
                    <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">{m.role}</span>
                    <div className={cn(
                      "p-3 rounded-2xl text-sm",
                      m.role === 'doctor' ? "bg-slate-100 text-slate-800 rounded-tl-none" : "bg-primary text-white rounded-tr-none"
                    )}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-primary/10 bg-background-light">
              <div className="relative">
                <input 
                  className="w-full h-12 pl-4 pr-12 rounded-xl border-none bg-white shadow-sm focus:ring-2 focus:ring-primary/20 text-sm"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && newMessage && (setMessages([...messages, { role: 'anm', text: newMessage }]), setNewMessage(''))}
                />
                <button 
                  onClick={() => newMessage && (setMessages([...messages, { role: 'anm', text: newMessage }]), setNewMessage(''))}
                  className="absolute right-2 top-2 size-8 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary-dark transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
