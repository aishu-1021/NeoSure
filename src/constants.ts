import { Patient, Visit, Referral } from './types';

// ============================================================
//  NeoSure — ANC Risk Intelligence
//  Mock data mirroring neosure_db MySQL database
//  (Live DB integration: next sprint via REST API)
// ============================================================

export const API_BASE_URL = 'http://localhost:8080/api'; // Backend URL (future use)

// ── Patients (mirrors patient_info + vitals + labs in neosure_db) ──
export const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    name: 'Meera Devi',
    age: 24,
    rchId: 'RCH/KA/BLR/SC045/001',
    gestationWeeks: 28,
    gestationDays: 0,
    lastVisitDate: '2026-02-21',
    riskLevel: 'AMBER',           // Mild anaemia (Hb 10.5), thyroid disorder
  },
  {
    id: '2',
    name: 'Sunita Yadav',
    age: 30,
    rchId: 'RCH/KA/BLR/SC046/002',
    gestationWeeks: 36,
    gestationDays: 0,
    lastVisitDate: '2026-02-21',
    riskLevel: 'RED',             // Stage2_HTN, Moderate anaemia, Rh-, protein in urine
  },
  {
    id: '3',
    name: 'Prabhavathi R',
    age: 22,
    rchId: 'RCH/KA/BLR/SC047/003',
    gestationWeeks: 16,
    gestationDays: 0,
    lastVisitDate: '2026-02-21',
    riskLevel: 'GREEN',           // Normal vitals, Hb 11.8
  },
  // ── Additional patients matching ANM workers in nhm_anc_project ──
  {
    id: '4',
    name: 'Radha Kumari',
    age: 26,
    rchId: 'RCH/KA/MYS/SC050/004',
    gestationWeeks: 20,
    gestationDays: 3,
    lastVisitDate: '2026-02-20',
    riskLevel: 'GREEN',
  },
  {
    id: '5',
    name: 'Fatima Begum',
    age: 29,
    rchId: 'RCH/KA/BGT/SC058/005',
    gestationWeeks: 32,
    gestationDays: 1,
    lastVisitDate: '2026-02-19',
    riskLevel: 'AMBER',           // Previous C-section, diabetes
  },
  {
    id: '6',
    name: 'Lakshmi Bai',
    age: 21,
    rchId: 'RCH/KA/MNG/SC053/006',
    gestationWeeks: 12,
    gestationDays: 5,
    lastVisitDate: '2026-02-18',
    riskLevel: 'GREEN',
  },
];

// ── Visits (mirrors patient_vitals + patient_lab_reports + patient_medical_history) ──
export const MOCK_VISITS: Visit[] = [
  {
    id: 'v1',
    patientId: '1',
    date: '2026-02-21',
    gestationWeeks: 28,
    riskLevel: 'AMBER',
    vitals: {
      height: 155,
      weight: 58,
      bmi: 24.1,       // auto-calc: 58 / (1.55^2)
      bpSys: 110,
      bpDia: 70,
    },
    labs: {
      hb: 10.5,                    // Mild anaemia
      hivStatus: 'NON_REACTIVE',
      syphilisStatus: 'NON_REACTIVE',
    },
    history: {
      previousLscs: false,
      hypertension: false,
      diabetes: false,
      thyroid: true,               // Thyroid disorder flagged
      gravida: 1,
      parity: 0,
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
  {
    id: 'v2',
    patientId: '2',
    date: '2026-02-21',
    gestationWeeks: 36,
    riskLevel: 'RED',
    vitals: {
      height: 160,
      weight: 72.5,
      bmi: 28.3,       // auto-calc: 72.5 / (1.60^2)
      bpSys: 145,      // Stage 2 HTN
      bpDia: 95,
    },
    labs: {
      hb: 8.2,                     // Moderate anaemia
      hivStatus: 'NON_REACTIVE',
      syphilisStatus: 'NON_REACTIVE',
    },
    history: {
      previousLscs: true,          // Previous C-section
      hypertension: true,          // Chronic hypertension
      diabetes: true,              // Diabetes
      thyroid: false,
      gravida: 3,
      parity: 2,
      stillbirths: 0,
      abortions: 0,
    },
    symptoms: {
      highFever: false,
      vaginalBleeding: false,
      convulsions: false,
      severeSwelling: true,        // Protein in urine → swelling
    },
  },
  {
    id: 'v3',
    patientId: '3',
    date: '2026-02-21',
    gestationWeeks: 16,
    riskLevel: 'GREEN',
    vitals: {
      height: 152,
      weight: 49,
      bmi: 21.2,       // auto-calc: 49 / (1.52^2)
      bpSys: 118,
      bpDia: 76,
    },
    labs: {
      hb: 11.8,                    // Normal
      hivStatus: 'NON_REACTIVE',
      syphilisStatus: 'NON_REACTIVE',
    },
    history: {
      previousLscs: false,
      hypertension: false,
      diabetes: false,
      thyroid: false,
      gravida: 2,
      parity: 1,
      stillbirths: 0,
      abortions: 1,
    },
    symptoms: {
      highFever: false,
      vaginalBleeding: false,
      convulsions: false,
      severeSwelling: false,
    },
  },
];

// ── ANM Workers (mirrors nhm_anc_project.anm_workers) ──
export const MOCK_ANM_WORKERS = [
  {
    id: 'ANM/KA/BLR/2024/0178',
    name: 'Suman R.',
    subCentre: 'SC-045 – Hesaraghatta',
    district: 'Bangalore Rural',
    phone: '9845001001',
    activePatients: 22,
  },
  {
    id: 'ANM/KA/BLR/2024/0179',
    name: 'Rekha D.',
    subCentre: 'SC-046 – Doddaballapur',
    district: 'Bangalore Rural',
    phone: '9845001002',
    activePatients: 30,
  },
  {
    id: 'ANM/KA/MYS/2024/0001',
    name: 'Anitha P.',
    subCentre: 'SC-050 – Hunsur',
    district: 'Mysuru',
    phone: '9880001006',
    activePatients: 28,
  },
  {
    id: 'ANM/KA/MNG/2024/0002',
    name: 'Deepa A.',
    subCentre: 'SC-054 – Bantwal',
    district: 'Mangaluru',
    phone: '9945001010',
    activePatients: 40,
  },
  {
    id: 'ANM/KA/HVR/2024/0002',
    name: 'Usha C.',
    subCentre: 'SC-056 – Shiggaon',
    district: 'Haveri',
    phone: '9886001012',
    activePatients: 45,
  },
];

// ── Risk Summary (for dashboard stats) ──
export const RISK_SUMMARY = {
  totalPatients: 6,
  redRisk: 1,
  amberRisk: 2,
  greenRisk: 3,
  totalANMWorkers: 50,
  totalDistricts: 10,
};