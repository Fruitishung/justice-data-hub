
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Users, MapPin, FileText, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface PatternData {
  suspects: Array<{
    name: string;
    count: number;
    cases: string[];
    riskLevel: 'low' | 'medium' | 'high';
  }>;
  locations: Array<{
    address: string;
    count: number;
    crimeTypes: string[];
    hotspotLevel: 'low' | 'medium' | 'high';
  }>;
  crimeTypes: Array<{
    type: string;
    count: number;
    trend: 'increasing' | 'stable' | 'decreasing';
  }>;
}

const PatternRecognitionDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: patternData, isLoading } = useQuery({
    queryKey: ['pattern-analysis'],
    queryFn: async (): Promise<PatternData> => {
      const { data: reports, error } = await supabase
        .from('incident_reports')
        .select('*');

      if (error) throw error;

      // Analyze suspect patterns
      const suspectMap = new Map();
      const locationMap = new Map();
      const crimeTypeMap = new Map();

      reports?.forEach(report => {
        // Suspect analysis
        if (report.suspect_details) {
          const suspectName = `${report.suspect_details.first_name || ''} ${report.suspect_details.last_name || ''}`.trim();
          if (suspectName) {
            if (!suspectMap.has(suspectName)) {
              suspectMap.set(suspectName, { count: 0, cases: [] });
            }
            suspectMap.get(suspectName).count++;
            suspectMap.get(suspectName).cases.push(report.case_number);
          }
        }

        // Location analysis
        if (report.location_address) {
          if (!locationMap.has(report.location_address)) {
            locationMap.set(report.location_address, { count: 0, crimeTypes: new Set() });
          }
          locationMap.get(report.location_address).count++;
          if (report.report_category) {
            locationMap.get(report.location_address).crimeTypes.add(report.report_category);
          }
        }

        // Crime type analysis
        if (report.report_category) {
          if (!crimeTypeMap.has(report.report_category)) {
            crimeTypeMap.set(report.report_category, 0);
          }
          crimeTypeMap.set(report.report_category, crimeTypeMap.get(report.report_category) + 1);
        }
      });

      const suspects = Array.from(suspectMap.entries()).map(([name, data]) => ({
        name,
        count: data.count,
        cases: data.cases,
        riskLevel: data.count >= 3 ? 'high' : data.count >= 2 ? 'medium' : 'low' as const
      })).sort((a, b) => b.count - a.count);

      const locations = Array.from(locationMap.entries()).map(([address, data]) => ({
        address,
        count: data.count,
        crimeTypes: Array.from(data.crimeTypes),
        hotspotLevel: data.count >= 3 ? 'high' : data.count >= 2 ? 'medium' : 'low' as const
      })).sort((a, b) => b.count - a.count);

      const crimeTypes = Array.from(crimeTypeMap.entries()).map(([type, count]) => ({
        type,
        count,
        trend: 'stable' as const // Would need historical data for real trend analysis
      })).sort((a, b) => b.count - a.count);

      return { suspects, locations, crimeTypes };
    }
  });

  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(var(--chart-1))",
    },
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Pattern Recognition Dashboard</h1>
        <div className="text-center">Loading pattern analysis...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pattern Recognition Dashboard</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search patterns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Button variant="outline">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="suspects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="suspects" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Suspects
          </TabsTrigger>
          <TabsTrigger value="locations" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Locations
          </TabsTrigger>
          <TabsTrigger value="crimes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Crime Types
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suspects">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Repeat Offenders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patternData?.suspects.slice(0, 10).map((suspect, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <div className="font-medium">{suspect.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {suspect.count} incidents • Cases: {suspect.cases.join(', ')}
                        </div>
                      </div>
                      <Badge variant={
                        suspect.riskLevel === 'high' ? 'destructive' :
                        suspect.riskLevel === 'medium' ? 'secondary' : 'outline'
                      }>
                        {suspect.riskLevel.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Suspect Frequency Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={patternData?.suspects.slice(0, 5)}>
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="var(--color-count)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="locations">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Crime Hotspots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patternData?.locations.slice(0, 10).map((location, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <div className="font-medium">{location.address}</div>
                        <div className="text-sm text-muted-foreground">
                          {location.count} incidents • Types: {location.crimeTypes.join(', ')}
                        </div>
                      </div>
                      <Badge variant={
                        location.hotspotLevel === 'high' ? 'destructive' :
                        location.hotspotLevel === 'medium' ? 'secondary' : 'outline'
                      }>
                        {location.hotspotLevel.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location Frequency Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={patternData?.locations.slice(0, 5)}>
                      <XAxis 
                        dataKey="address" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="var(--color-count)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="crimes">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Crime Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patternData?.crimeTypes.map((crime, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <div className="font-medium">{crime.type}</div>
                        <div className="text-sm text-muted-foreground">
                          {crime.count} cases
                        </div>
                      </div>
                      <Badge variant="outline">
                        {crime.trend.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Crime Type Pie Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={patternData?.crimeTypes}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {patternData?.crimeTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Pattern Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-destructive">
                    {patternData?.suspects.filter(s => s.riskLevel === 'high').length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">High-Risk Suspects</div>
                </div>
                <div className="text-center p-6 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-orange-500">
                    {patternData?.locations.filter(l => l.hotspotLevel === 'high').length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Crime Hotspots</div>
                </div>
                <div className="text-center p-6 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-blue-500">
                    {patternData?.crimeTypes.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Crime Categories</div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">Key Insights</h4>
                <ul className="text-sm space-y-1">
                  <li>• Focus investigation resources on high-risk suspects and crime hotspots</li>
                  <li>• Consider increased patrols in areas with multiple incidents</li>
                  <li>• Look for connections between repeat offenders and specific locations</li>
                  <li>• Analyze temporal patterns for more effective resource allocation</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatternRecognitionDashboard;
