import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PublicNav } from "@/components/navigation/PublicNav";
import { Calculator, TrendingUp, DollarSign, Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ROIInputs {
  monthlyRevenue: number;
  currentShrinkageRate: number;
  averageItemValue: number;
  storeSize: number;
  securityStaffCost: number;
}

const ROICalculator = () => {
  const [inputs, setInputs] = useState<ROIInputs>({
    monthlyRevenue: 250000,
    currentShrinkageRate: 2.8,
    averageItemValue: 45,
    storeSize: 5000,
    securityStaffCost: 4500
  });

  const [showResults, setShowResults] = useState(false);

  // Savings Calculations (without pricing)
  const currentMonthlyShrinkage = (inputs.monthlyRevenue * inputs.currentShrinkageRate) / 100;
  const projectedShrinkageReduction = 0.78; // 78% reduction based on Invepin data
  const newShrinkageRate = inputs.currentShrinkageRate * (1 - projectedShrinkageReduction);
  const newMonthlyShrinkage = (inputs.monthlyRevenue * newShrinkageRate) / 100;
  const monthlySavings = currentMonthlyShrinkage - newMonthlyShrinkage;
  
  const annualSavings = monthlySavings * 12;

  const handleCalculate = () => {
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Savings Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover how much your business could save by reducing shrinkage with advanced loss prevention technology. 
            Contact sales for detailed pricing and implementation plans.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Store Information
              </CardTitle>
              <CardDescription>
                Enter your current store metrics to calculate potential savings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="revenue">Monthly Revenue ($)</Label>
                <Input
                  id="revenue"
                  type="number"
                  value={inputs.monthlyRevenue}
                  onChange={(e) => setInputs({...inputs, monthlyRevenue: Number(e.target.value)})}
                  placeholder="250,000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shrinkage">Current Shrinkage Rate (%)</Label>
                <Input
                  id="shrinkage"
                  type="number"
                  step="0.1"
                  value={inputs.currentShrinkageRate}
                  onChange={(e) => setInputs({...inputs, currentShrinkageRate: Number(e.target.value)})}
                  placeholder="2.8"
                />
                <p className="text-xs text-muted-foreground">Industry average is 2.8%</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="itemValue">Average Item Value ($)</Label>
                <Input
                  id="itemValue"
                  type="number"
                  value={inputs.averageItemValue}
                  onChange={(e) => setInputs({...inputs, averageItemValue: Number(e.target.value)})}
                  placeholder="45"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="storeSize">Store Size (sq ft)</Label>
                <Input
                  id="storeSize"
                  type="number"
                  value={inputs.storeSize}
                  onChange={(e) => setInputs({...inputs, storeSize: Number(e.target.value)})}
                  placeholder="5,000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="securityCost">Current Security Costs (Monthly $)</Label>
                <Input
                  id="securityCost"
                  type="number"
                  value={inputs.securityStaffCost}
                  onChange={(e) => setInputs({...inputs, securityStaffCost: Number(e.target.value)})}
                  placeholder="4,500"
                />
                <p className="text-xs text-muted-foreground">Include staff, cameras, and other security expenses</p>
              </div>
              
              <Button onClick={handleCalculate} className="w-full" size="lg">
                Calculate Savings
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {showResults ? (
              <>
                <Card className="border-success">
                  <CardHeader>
                    <CardTitle className="flex items-center text-success">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Projected Annual Savings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-success">
                      ${annualSavings.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Based on 78% reduction in shrinkage losses
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Savings Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Current Monthly Shrinkage Loss</span>
                      <span className="font-semibold text-destructive">
                        ${currentMonthlyShrinkage.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Projected Monthly Shrinkage</span>
                      <span className="font-semibold text-success">
                        ${newMonthlyShrinkage.toLocaleString()}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg">
                      <span className="font-semibold">Monthly Savings Potential</span>
                      <span className="font-bold text-success">
                        ${monthlySavings.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">
                        ${annualSavings.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Potential Annual Savings from Reduced Shrinkage
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-semibold mb-2">Ready to Get Started?</h3>
                    <p className="text-muted-foreground mb-4">
                      Schedule a consultation to discuss your specific needs and implementation plan.
                    </p>
                    <Button asChild size="lg" className="w-full">
                      <Link to="/contact">
                        Schedule Consultation <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </>
            ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center p-8">
                    <DollarSign className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Calculate Your Savings</h3>
                    <p className="text-muted-foreground">
                      Enter your store information to see how much you could save by reducing shrinkage losses.
                    </p>
                  </CardContent>
                </Card>
            )}
          </div>
        </div>

        {/* Industry Benchmarks */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Industry Benchmarks</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                title: "Average Retail Shrinkage",
                value: "2.8%",
                description: "of total revenue lost to theft, errors, and fraud annually"
              },
              {
                title: "Invepin Reduction Rate",
                value: "78%",
                description: "average shrinkage reduction achieved by our clients"
              },
              {
                title: "Typical ROI Timeline",
                value: "8-14 months",
                description: "payback period for most implementations"
              }
            ].map((benchmark, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{benchmark.value}</div>
                  <div className="font-semibold mb-2">{benchmark.title}</div>
                  <div className="text-sm text-muted-foreground">{benchmark.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;