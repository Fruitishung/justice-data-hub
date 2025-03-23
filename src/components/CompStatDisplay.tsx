import { CompStatData } from "@/types/compstat";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpIcon, ArrowDownIcon, TrendingDown, TrendingUp, BarChart4 } from "lucide-react";

interface CompStatDisplayProps {
  compStatData: CompStatData | null;
  isLoading: boolean;
  error: string | null;
}

export const CompStatDisplay = ({ compStatData, isLoading, error }: CompStatDisplayProps) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-8 w-1/3 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !compStatData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Crime Statistics</CardTitle>
          <CardDescription>Unable to load data at this time.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
          {error || "No data available for this jurisdiction"}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <BarChart4 className="h-5 w-5" />
            Crime Statistics
          </CardTitle>
          <Badge variant={compStatData.overallPercentChange < 0 ? "outline" : "destructive"}>
            {compStatData.overallPercentChange > 0 ? "+" : ""}
            {compStatData.overallPercentChange}%
            {compStatData.overallPercentChange < 0 ? 
              <TrendingDown className="ml-1 h-3 w-3" /> : 
              <TrendingUp className="ml-1 h-3 w-3" />
            }
          </Badge>
        </div>
        <CardDescription>
          {compStatData.jurisdiction} | {compStatData.period.charAt(0).toUpperCase() + compStatData.period.slice(1)} Report: {compStatData.reportDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="current">
          <TabsList className="mb-4">
            <TabsTrigger value="current">Current Period</TabsTrigger>
            <TabsTrigger value="ytd">Year-to-Date</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={compStatData.crimeStats}
                  margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const percentChange = data.percentChange;
                        const isIncrease = percentChange > 0;
                        
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-md text-xs">
                            <div className="font-bold">{data.category}</div>
                            <div className="grid grid-cols-2 gap-x-4 mt-1">
                              <div>Current:</div>
                              <div className="text-right">{data.count}</div>
                              
                              <div>Previous:</div>
                              <div className="text-right">{data.previousPeriodCount}</div>
                              
                              <div>Change:</div>
                              <div className={`text-right flex items-center justify-end ${isIncrease ? 'text-destructive' : 'text-green-600'}`}>
                                {isIncrease ? '+' : ''}{percentChange}%
                                {isIncrease ? 
                                  <ArrowUpIcon className="h-3 w-3 ml-1" /> : 
                                  <ArrowDownIcon className="h-3 w-3 ml-1" />
                                }
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Bar name="Current Period" dataKey="count" fill="#3b82f6" />
                  <Bar name="Previous Period" dataKey="previousPeriodCount" fill="#94a3b8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Incidents</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="text-2xl font-bold">{compStatData.totalIncidents}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Previous Period</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="text-2xl font-bold">{compStatData.previousPeriodTotal}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">YTD Total</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="text-2xl font-bold">{compStatData.yearToDateTotal}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Previous Year</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="text-2xl font-bold">{compStatData.previousYearTotal}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="ytd" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={compStatData.crimeStats}
                  margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar name="Year to Date" dataKey="yearToDateCount" fill="#3b82f6" />
                  <Bar name="Previous Year" dataKey="previousYearCount" fill="#94a3b8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">YTD Total</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="text-2xl font-bold">{compStatData.yearToDateTotal}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Previous Year</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="text-2xl font-bold">{compStatData.previousYearTotal}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
