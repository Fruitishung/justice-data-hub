
import { useState, useEffect } from "react";
import { CompStatData, CrimeStatistic } from "@/types/compstat";

export const useCompStatData = (jurisdiction: {
  city: string;
  county: string;
  state: string;
}) => {
  const [compStatData, setCompStatData] = useState<CompStatData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompStatData = async () => {
      try {
        setIsLoading(true);
        
        // In a real application, this would be an API call to fetch real CompStat data
        // For this demo, we'll generate mock data based on the jurisdiction
        
        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockCrimeCategories = [
          "Homicide", 
          "Rape", 
          "Robbery", 
          "Felony Assault", 
          "Burglary", 
          "Grand Larceny", 
          "Grand Larceny Auto"
        ];
        
        // Generate random but somewhat realistic crime statistics
        const generateStats = (baseMultiplier: number): CrimeStatistic[] => {
          return mockCrimeCategories.map(category => {
            // Generate base count based on category severity and jurisdiction size
            let baseCount = 0;
            switch(category) {
              case "Homicide": baseCount = Math.floor(Math.random() * 5 * baseMultiplier); break;
              case "Rape": baseCount = Math.floor(Math.random() * 15 * baseMultiplier); break;
              case "Robbery": baseCount = Math.floor(Math.random() * 50 * baseMultiplier); break;
              case "Felony Assault": baseCount = Math.floor(Math.random() * 70 * baseMultiplier); break;
              case "Burglary": baseCount = Math.floor(Math.random() * 80 * baseMultiplier); break;
              case "Grand Larceny": baseCount = Math.floor(Math.random() * 100 * baseMultiplier); break;
              case "Grand Larceny Auto": baseCount = Math.floor(Math.random() * 40 * baseMultiplier); break;
              default: baseCount = Math.floor(Math.random() * 30 * baseMultiplier);
            }
            
            // Generate previous period with some variation
            const previousPeriodCount = Math.max(0, baseCount + Math.floor(Math.random() * 20 - 10));
            
            // Calculate percent change
            const percentChange = previousPeriodCount > 0 
              ? ((baseCount - previousPeriodCount) / previousPeriodCount * 100)
              : 0;
            
            return {
              category,
              count: baseCount,
              previousPeriodCount,
              yearToDateCount: baseCount * 10 + Math.floor(Math.random() * 100),
              previousYearCount: baseCount * 9 + Math.floor(Math.random() * 150),
              percentChange: Math.round(percentChange * 10) / 10
            };
          });
        };
        
        // Determine a base multiplier for the jurisdiction (bigger cities = more crime)
        let jurisdictionMultiplier = 1;
        if (jurisdiction.city) {
          // Simulate different city sizes
          const majorCities = ["New York", "Los Angeles", "Chicago", "Houston", "Philadelphia"];
          const mediumCities = ["Phoenix", "San Antonio", "San Diego", "Dallas", "San Jose"];
          
          if (majorCities.some(city => jurisdiction.city.includes(city))) {
            jurisdictionMultiplier = 3;
          } else if (mediumCities.some(city => jurisdiction.city.includes(city))) {
            jurisdictionMultiplier = 2;
          }
        }
        
        const crimeStats = generateStats(jurisdictionMultiplier);
        
        // Calculate totals
        const totalIncidents = crimeStats.reduce((sum, stat) => sum + stat.count, 0);
        const previousPeriodTotal = crimeStats.reduce((sum, stat) => sum + stat.previousPeriodCount, 0);
        const yearToDateTotal = crimeStats.reduce((sum, stat) => sum + stat.yearToDateCount, 0);
        const previousYearTotal = crimeStats.reduce((sum, stat) => sum + stat.previousYearCount, 0);
        
        // Calculate overall percent change
        const overallPercentChange = previousPeriodTotal > 0
          ? Math.round(((totalIncidents - previousPeriodTotal) / previousPeriodTotal * 100) * 10) / 10
          : 0;
        
        const mockData: CompStatData = {
          jurisdiction: jurisdiction.city 
            ? `${jurisdiction.city}, ${jurisdiction.state}`
            : jurisdiction.county
            ? `${jurisdiction.county}, ${jurisdiction.state}`
            : jurisdiction.state,
          reportDate: new Date().toLocaleDateString(),
          period: 'weekly',
          crimeStats,
          totalIncidents,
          previousPeriodTotal,
          yearToDateTotal,
          previousYearTotal,
          overallPercentChange
        };
        
        setCompStatData(mockData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching CompStat data:", error);
        setError("Failed to load crime statistics");
        setIsLoading(false);
      }
    };

    if (jurisdiction.state) {
      fetchCompStatData();
    } else {
      setCompStatData(null);
      setIsLoading(false);
    }
  }, [jurisdiction.city, jurisdiction.county, jurisdiction.state]);

  return { compStatData, isLoading, error };
};
