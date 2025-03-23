
export interface CrimeStatistic {
  category: string;
  count: number;
  previousPeriodCount: number;
  yearToDateCount: number;
  previousYearCount: number;
  percentChange: number;
}

export interface CompStatData {
  jurisdiction: string;
  reportDate: string;
  period: 'weekly' | 'monthly' | 'yearly';
  crimeStats: CrimeStatistic[];
  totalIncidents: number;
  previousPeriodTotal: number;
  yearToDateTotal: number;
  previousYearTotal: number;
  overallPercentChange: number;
}
