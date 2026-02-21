import { Patient, Visit, Referral } from './types';

export const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    name: 'Sunita Sharma',
    age: 24,
    rchId: '102938475612',
    gestationWeeks: 24,
    gestationDays: 3,
    lastVisitDate: '2023-10-12',
    riskLevel: 'RED',
  },
  {
    id: '2',
    name: 'Priya Patel',
    age: 22,
    rchId: '887722334455',
    gestationWeeks: 14,
    gestationDays: 0,
    lastVisitDate: '2023-09-28',
    riskLevel: 'AMBER',
  },
  {
    id: '3',
    name: 'Kavita Reddy',
    age: 28,
    rchId: '554433221100',
    gestationWeeks: 32,
    gestationDays: 5,
    lastVisitDate: '2023-10-05',
    riskLevel: 'GREEN',
  },
  {
    id: '4',
    name: 'Anjali Deshmukh',
    age: 26,
    rchId: '443322119988',
    gestationWeeks: 8,
    gestationDays: 2,
    lastVisitDate: '2023-10-23',
    riskLevel: 'GREEN',
  },
];

export const MOCK_VISITS: Visit[] = [
  {
    id: 'v1',
    patientId: '1',
    date: '2023-10-12',
    gestationWeeks: 24,
    riskLevel: 'RED',
    vitals: { height: 150, weight: 55, bmi: 22.4, bpSys: 145, bpDia: 95 },
    labs: { hb: 9.8, hivStatus: 'NON_REACTIVE', syphilisStatus: 'NON_REACTIVE' },
    history: {
      previousLscs: true,
      hypertension: false,
      diabetes: false,
      thyroid: false,
      gravida: 2,
      parity: 1,
      stillbirths: 0,
      abortions: 0,
    },
    symptoms: {
      highFever: false,
      vaginalBleeding: false,
      convulsions: false,
      severeSwelling: false,
    },
  },
];
