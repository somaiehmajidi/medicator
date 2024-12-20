import { Medication } from './medication';

export const Medications: Medication[] = [
  { 
    name: 'Asprin', 
    dosage: '3', 
    unit: 'capsule', 
    days: ['Wed', 'Sat'], 
    times: ['00:00'], 
    lastUpdated: new Date()
  },
  { 
    name: 'Insulin', 
    dosage: '20', 
    unit: 'mg', 
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], 
    times: ['10:15', '18:15'], 
    lastUpdated: new Date()
  }
]