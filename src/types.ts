import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type RiskLevel = 'GREEN' | 'AMBER' | 'RED';

export interface Patient {
  id: string;
  name: string;
  age: number;
  rchId: string;
  gestationWeeks: number;
  gestationDays: number;
  lastVisitDate: string;
  riskLevel: RiskLevel;
}

export interface Visit {
  id: string;
  patientId: string;
  date: string;
  gestationWeeks: number;
  riskLevel: RiskLevel;
  vitals: {
    height: number;
    weight: number;
    bmi: number;
    bpSys: number;
    bpDia: number;
  };
  labs: {
    hb: number;
    hivStatus: 'REACTIVE' | 'NON_REACTIVE';
    syphilisStatus: 'REACTIVE' | 'NON_REACTIVE';
  };
  history: {
    previousLscs: boolean;
    hypertension: boolean;
    diabetes: boolean;
    thyroid: boolean;
    gravida: number;
    parity: number;
    stillbirths: number;
    abortions: number;
  };
  symptoms: {
    highFever: boolean;
    vaginalBleeding: boolean;
    convulsions: boolean;
    severeSwelling: boolean;
  };
  notes?: string;
  specialistAdvice?: string;
  medications?: Array<{
    name: string;
    dosage: string;
    type: 'TABLET' | 'INJECTION';
    schedule: string;
  }>;
}

export interface Referral {
  id: string;
  visitId: string;
  patientId: string;
  status: 'INITIATED' | 'DISPATCHED' | 'IN_TRANSIT' | 'ARRIVED' | 'ADMITTED';
  urgency: 'STANDARD' | 'URGENT' | 'EMERGENCY';
  fromFacility: string;
  toFacility: string;
  initiatedAt: string;
  dispatchedAt?: string;
  arrivedAt?: string;
  admittedAt?: string;
  etaMinutes?: number;
}
