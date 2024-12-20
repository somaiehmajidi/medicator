export interface Medication {
  name: string;
  dosage: string;
  unit: string;
  days: Array<string>;
  times: Array<string>;
  lastUpdated: Date;
}