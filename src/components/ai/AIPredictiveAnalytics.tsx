import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, AlertCircle, Package } from "lucide-react";
import { aiAnalysisService } from "@/services/aiAnalysisService";
import { useOrganization } from "@/components/auth/OrganizationProvider";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const AIPredictiveAnalytics = () => {
  const { organization } = useOrganization();
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [theftAnalysis, setTheftAnalysis] = useState<string>("");
  const [inventoryPrediction, setInventoryPrediction] = useState<string>("");
  const [anomalyDetection, setAnomalyDetection] = useState<string>("");

  const runTheftAnalysis = async () => {
    if (!organization?.id) return;
    
    setIsAnalyzing(true);
    try {
      // In a real app, fetch actual data from the database
      const mockData = {
        recentAlerts: 5,
        inventoryDiscrepancies: 3,
        accessPatterns: "unusual_after_hours",
        timeframe: "last_30_days"
      };
      
      const result = await aiAnalysisService.analyzeTheftPatterns(
        mockData,
        organization.id
      );
      
      setTheftAnalysis(result.analysis);
      
      toast({
        title: "Analysis Complete",
        description: "AI has analyzed theft patterns",
      });
    } catch (error) {
      console.error('Error running theft analysis:', error);
      toast({
        title: "Error",
        description: "Failed to run theft analysis",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runInventoryPrediction = async () => {
    if (!organization?.id) return;
    
    setIsAnalyzing(true);
    try {
      const mockData = {
        currentStock: { item1: 50, item2: 30 },
        historicalUsage: { item1: [10, 12, 15], item2: [5, 6, 8] },
        seasonality: "high_demand_period"
      };
      
      const result = await aiAnalysisService.predictInventoryNeeds(
        mockData,
        organization.id
      );
      
      setInventoryPrediction(result.analysis);
      
      toast({
        title: "Prediction Complete",
        description: "AI has predicted inventory needs",
      });
    } catch (error) {
      console.error('Error running inventory prediction:', error);
      toast({
        title: "Error",
        description: "Failed to predict inventory needs",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runAnomalyDetection = async () => {
    if (!organization?.id) return;
    
    setIsAnalyzing(true);
    try {
      const mockData = {
        accessLogs: [{ time: "03:00", user: "unknown", action: "access" }],
        inventoryMovements: [{ item: "item1", change: -10, expected: -5 }],
        systemEvents: [{ event: "camera_offline", duration: 120 }]
      };
      
      const result = await aiAnalysisService.detectAnomalies(
        mockData,
        organization.id
      );
      
      setAnomalyDetection(result.analysis);
      
      toast({
        title: "Detection Complete",
        description: "AI has detected anomalies",
      });
    } catch (error) {
      console.error('Error running anomaly detection:', error);
      toast({
        title: "Error",
        description: "Failed to detect anomalies",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI-Powered Predictive Analytics
        </CardTitle>
        <CardDescription>
          Machine learning insights for loss prevention and optimization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="theft" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="theft">
              <AlertCircle className="h-4 w-4 mr-2" />
              Theft Detection
            </TabsTrigger>
            <TabsTrigger value="inventory">
              <Package className="h-4 w-4 mr-2" />
              Inventory Prediction
            </TabsTrigger>
            <TabsTrigger value="anomaly">
              <TrendingUp className="h-4 w-4 mr-2" />
              Anomaly Detection
            </TabsTrigger>
          </TabsList>

          <TabsContent value="theft" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                AI analyzes patterns to detect potential theft
              </p>
              <Button
                onClick={runTheftAnalysis}
                disabled={isAnalyzing}
                size="sm"
              >
                {isAnalyzing ? "Analyzing..." : "Run Analysis"}
              </Button>
            </div>
            {theftAnalysis && (
              <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap text-sm">
                {theftAnalysis}
              </div>
            )}
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Predict future stock needs based on patterns
              </p>
              <Button
                onClick={runInventoryPrediction}
                disabled={isAnalyzing}
                size="sm"
              >
                {isAnalyzing ? "Predicting..." : "Run Prediction"}
              </Button>
            </div>
            {inventoryPrediction && (
              <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap text-sm">
                {inventoryPrediction}
              </div>
            )}
          </TabsContent>

          <TabsContent value="anomaly" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Detect unusual patterns in operations
              </p>
              <Button
                onClick={runAnomalyDetection}
                disabled={isAnalyzing}
                size="sm"
              >
                {isAnalyzing ? "Detecting..." : "Run Detection"}
              </Button>
            </div>
            {anomalyDetection && (
              <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap text-sm">
                {anomalyDetection}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
