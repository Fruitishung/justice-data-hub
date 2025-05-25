
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, FileText, Calendar, MapPin, Users, TrendingUp, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SimilarCase {
  id: string;
  case_number: string;
  incident_description: string;
  incident_date: string;
  location_address: string;
  similarity_score: number;
  matching_factors: string[];
  officer_name: string;
  status: string;
}

interface SimilarityMetrics {
  total_cases_analyzed: number;
  high_similarity_matches: number;
  medium_similarity_matches: number;
  low_similarity_matches: number;
  most_common_patterns: string[];
}

const CaseSimilarityAnalysis = () => {
  const navigate = useNavigate();
  const [selectedCaseId, setSelectedCaseId] = React.useState<string>('');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [minimumSimilarity, setMinimumSimilarity] = React.useState(60);

  const { data: cases, isLoading: casesLoading } = useQuery({
    queryKey: ['cases-for-similarity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('incident_reports')
        .select('id, case_number, incident_description, officer_name')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: similarCases, isLoading: similarityLoading } = useQuery({
    queryKey: ['similar-cases', selectedCaseId, minimumSimilarity],
    queryFn: async () => {
      if (!selectedCaseId) return [];

      // Get the selected case details
      const { data: currentCase, error: caseError } = await supabase
        .from('incident_reports')
        .select('*')
        .eq('id', selectedCaseId)
        .single();

      if (caseError) throw caseError;

      // Get all other cases for comparison
      const { data: allCases, error: allCasesError } = await supabase
        .from('incident_reports')
        .select('*')
        .neq('id', selectedCaseId);

      if (allCasesError) throw allCasesError;

      // Calculate similarity scores (mock algorithm)
      const similarities: SimilarCase[] = allCases.map(case_ => {
        const matchingFactors: string[] = [];
        let score = 0;

        // Location similarity
        if (case_.location_address && currentCase.location_address) {
          const locationWords = currentCase.location_address.toLowerCase().split(' ');
          const caseLocationWords = case_.location_address.toLowerCase().split(' ');
          const commonLocationWords = locationWords.filter(word => 
            caseLocationWords.some(caseWord => caseWord.includes(word) || word.includes(caseWord))
          );
          if (commonLocationWords.length > 0) {
            matchingFactors.push('Similar Location');
            score += 20;
          }
        }

        // Description similarity
        if (case_.incident_description && currentCase.incident_description) {
          const descWords = currentCase.incident_description.toLowerCase().split(' ');
          const caseDescWords = case_.incident_description.toLowerCase().split(' ');
          const commonDescWords = descWords.filter(word => 
            word.length > 3 && caseDescWords.some(caseWord => caseWord.includes(word))
          );
          if (commonDescWords.length > 2) {
            matchingFactors.push('Similar Description');
            score += 30;
          }
        }

        // Time pattern similarity (same day of week, similar time of day)
        if (case_.incident_date && currentCase.incident_date) {
          const currentDate = new Date(currentCase.incident_date);
          const caseDate = new Date(case_.incident_date);
          
          if (currentDate.getDay() === caseDate.getDay()) {
            matchingFactors.push('Same Day of Week');
            score += 15;
          }

          const timeDiff = Math.abs(currentDate.getHours() - caseDate.getHours());
          if (timeDiff <= 2) {
            matchingFactors.push('Similar Time of Day');
            score += 15;
          }
        }

        // Suspect details similarity
        if (case_.suspect_details && currentCase.suspect_details) {
          const currentSuspect = currentCase.suspect_details as any;
          const caseSuspect = case_.suspect_details as any;
          
          if (currentSuspect.gender === caseSuspect.gender) {
            matchingFactors.push('Similar Suspect Profile');
            score += 10;
          }
        }

        // Vehicle similarity
        if (case_.vehicle_make && currentCase.vehicle_make && 
            case_.vehicle_make === currentCase.vehicle_make) {
          matchingFactors.push('Same Vehicle Make');
          score += 20;
        }

        return {
          id: case_.id,
          case_number: case_.case_number || 'N/A',
          incident_description: case_.incident_description || 'No description',
          incident_date: case_.incident_date,
          location_address: case_.location_address || 'Unknown location',
          similarity_score: Math.min(score, 100),
          matching_factors: matchingFactors,
          officer_name: case_.officer_name || 'Unknown',
          status: case_.report_status || 'Unknown'
        };
      })
      .filter(case_ => case_.similarity_score >= minimumSimilarity)
      .sort((a, b) => b.similarity_score - a.similarity_score);

      return similarities;
    },
    enabled: !!selectedCaseId
  });

  const metrics: SimilarityMetrics = React.useMemo(() => {
    if (!similarCases) return {
      total_cases_analyzed: 0,
      high_similarity_matches: 0,
      medium_similarity_matches: 0,
      low_similarity_matches: 0,
      most_common_patterns: []
    };

    const high = similarCases.filter(c => c.similarity_score >= 80).length;
    const medium = similarCases.filter(c => c.similarity_score >= 60 && c.similarity_score < 80).length;
    const low = similarCases.filter(c => c.similarity_score < 60).length;

    const allFactors = similarCases.flatMap(c => c.matching_factors);
    const factorCounts = allFactors.reduce((acc, factor) => {
      acc[factor] = (acc[factor] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const commonPatterns = Object.entries(factorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([factor]) => factor);

    return {
      total_cases_analyzed: similarCases.length,
      high_similarity_matches: high,
      medium_similarity_matches: medium,
      low_similarity_matches: low,
      most_common_patterns: commonPatterns
    };
  }, [similarCases]);

  const getSimilarityColor = (score: number) => {
    if (score >= 80) return 'text-red-600 bg-red-50';
    if (score >= 60) return 'text-orange-600 bg-orange-50';
    return 'text-blue-600 bg-blue-50';
  };

  const getSimilarityLabel = (score: number) => {
    if (score >= 80) return 'High';
    if (score >= 60) return 'Medium';
    return 'Low';
  };

  const filteredCases = cases?.filter(case_ => 
    !searchTerm || 
    case_.case_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    case_.incident_description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Case Similarity Analysis</h2>
          <p className="text-muted-foreground">
            Identify patterns and connections between cases using AI-powered similarity detection
          </p>
        </div>
        <Button onClick={() => navigate('/pattern-recognition')}>
          <TrendingUp className="mr-2 h-4 w-4" />
          View All Patterns
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Cases Analyzed</p>
                <p className="text-2xl font-bold">{metrics.total_cases_analyzed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-red-500 rounded-full" />
              <div>
                <p className="text-sm font-medium">High Similarity</p>
                <p className="text-2xl font-bold">{metrics.high_similarity_matches}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-orange-500 rounded-full" />
              <div>
                <p className="text-sm font-medium">Medium Similarity</p>
                <p className="text-2xl font-bold">{metrics.medium_similarity_matches}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-blue-500 rounded-full" />
              <div>
                <p className="text-sm font-medium">Low Similarity</p>
                <p className="text-2xl font-bold">{metrics.low_similarity_matches}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Case for Analysis</CardTitle>
            <CardDescription>
              Choose a case to find similar incidents and patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {casesLoading ? (
                <p className="text-sm text-muted-foreground">Loading cases...</p>
              ) : (
                filteredCases?.map((case_) => (
                  <div
                    key={case_.id}
                    className={`p-3 border rounded-lg cursor-pointer hover:bg-accent ${
                      selectedCaseId === case_.id ? 'bg-accent border-primary' : ''
                    }`}
                    onClick={() => setSelectedCaseId(case_.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{case_.case_number}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {case_.incident_description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Officer: {case_.officer_name}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Minimum Similarity Score: {minimumSimilarity}%</label>
              <input
                type="range"
                min="30"
                max="90"
                value={minimumSimilarity}
                onChange={(e) => setMinimumSimilarity(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common Patterns</CardTitle>
            <CardDescription>
              Most frequently occurring similarity factors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.most_common_patterns.length > 0 ? (
                metrics.most_common_patterns.map((pattern, index) => (
                  <div key={pattern} className="flex items-center justify-between">
                    <span className="text-sm">{pattern}</span>
                    <Badge variant="secondary">#{index + 1}</Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Select a case to view common patterns
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedCaseId && (
        <Card>
          <CardHeader>
            <CardTitle>Similar Cases Found</CardTitle>
            <CardDescription>
              Cases with similarity score ≥ {minimumSimilarity}%
            </CardDescription>
          </CardHeader>
          <CardContent>
            {similarityLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-muted-foreground">Analyzing similarities...</div>
              </div>
            ) : similarCases && similarCases.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case Number</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Similarity</TableHead>
                    <TableHead>Matching Factors</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {similarCases.map((case_) => (
                    <TableRow key={case_.id}>
                      <TableCell className="font-medium">{case_.case_number}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate">{case_.incident_description}</div>
                      </TableCell>
                      <TableCell>
                        {new Date(case_.incident_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={case_.similarity_score} className="w-16" />
                          <Badge className={getSimilarityColor(case_.similarity_score)}>
                            {case_.similarity_score}% {getSimilarityLabel(case_.similarity_score)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {case_.matching_factors.slice(0, 2).map((factor) => (
                            <Badge key={factor} variant="outline" className="text-xs">
                              {factor}
                            </Badge>
                          ))}
                          {case_.matching_factors.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{case_.matching_factors.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/report/${case_.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Alert>
                <AlertDescription>
                  No similar cases found with similarity score ≥ {minimumSimilarity}%. 
                  Try lowering the minimum similarity threshold.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CaseSimilarityAnalysis;
