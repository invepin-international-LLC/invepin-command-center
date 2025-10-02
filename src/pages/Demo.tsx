import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PublicNav } from "@/components/navigation/PublicNav";
import { Eye, Shield, TrendingUp, AlertTriangle, CheckCircle, Play } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Demo = () => {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const navigate = useNavigate();

  const demoScenarios = [
    {
      id: "theft-attempt",
      title: "Theft Attempt Detection",
      description: "Watch how our system detects and responds to theft attempts in real-time",
      duration: "2 min",
      type: "Interactive Demo"
    },
    {
      id: "inventory-tracking",
      title: "Real-time Inventory Tracking",
      description: "See live inventory updates as items move throughout your store",
      duration: "3 min",
      type: "Live Dashboard"
    },
    {
      id: "facial-recognition",
      title: "Facial Recognition Alert",
      description: "Experience how V2 system identifies known offenders instantly",
      duration: "1 min",
      type: "AI Demo"
    }
  ];

  const liveStats = [
    { label: "Items Protected", value: "15,847", trend: "+12%" },
    { label: "Theft Attempts Prevented", value: "23", trend: "Today" },
    { label: "Alert Response Time", value: "0.3s", trend: "Average" },
    { label: "System Accuracy", value: "99.7%", trend: "Last 30 days" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Experience Invepin in Action
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Take an interactive tour of our loss prevention system. No setup required - start protecting your inventory in seconds.
          </p>
          <Badge variant="outline" className="mb-8">
            Live Demo Environment • Updated Every 5 Minutes
          </Badge>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {liveStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <div className="text-xs text-success mt-1">{stat.trend}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="scenarios" className="mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scenarios">Demo Scenarios</TabsTrigger>
            <TabsTrigger value="dashboard">Live Dashboard</TabsTrigger>
            <TabsTrigger value="mobile">Mobile Interface</TabsTrigger>
          </TabsList>

          <TabsContent value="scenarios" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {demoScenarios.map((scenario) => (
                <Card key={scenario.id} className="hover-card cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{scenario.type}</Badge>
                      <span className="text-sm text-muted-foreground">{scenario.duration}</span>
                    </div>
                    <CardTitle className="text-xl">{scenario.title}</CardTitle>
                    <CardDescription>{scenario.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        setActiveDemo(scenario.id);
                        navigate('/dashboard');
                      }}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Demo
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="dashboard">
            <Card className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">Real-Time Dashboard</h3>
                <p className="text-muted-foreground">
                  This is a live view of a demo retail store with 847 protected items
                </p>
              </div>
              
              {/* Simulated Dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Eye className="h-5 w-5 mr-2" />
                        Store Floor Plan
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
                        <div className="text-center">
                          <Shield className="h-12 w-12 text-primary mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Interactive Floor Plan</p>
                          <p className="text-xs text-muted-foreground">847 devices active</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2 text-warning" />
                        Active Alerts
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Movement detected - Aisle 7</span>
                        <Badge variant="outline">2m ago</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Low battery - Pin #A847</span>
                        <Badge variant="secondary">1h ago</Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-success" />
                        Today's Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Prevented Losses</span>
                        <span className="font-semibold">$2,847</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Alerts Triggered</span>
                        <span className="font-semibold">23</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Response Time</span>
                        <span className="font-semibold">0.3s avg</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="mobile">
            <div className="text-center">
              <Card className="max-w-md mx-auto">
                <CardHeader>
                  <CardTitle>Mobile App Demo</CardTitle>
                  <CardDescription>
                    Experience the mobile interface used by store managers and security teams
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg h-96 flex items-center justify-center">
                    <div className="text-center">
                      <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
                      <p className="text-lg font-semibold mb-2">Mobile Interface</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Full-featured mobile app for iOS and Android
                      </p>
                      <Button asChild>
                        <Link to="/mobile">Launch Mobile Demo</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Protect Your Inventory?</h3>
            <p className="text-muted-foreground mb-6">
              Get a personalized demo for your specific retail environment and see actual ROI projections.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/contact">Schedule Live Demo</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/roi-calculator">Calculate Your ROI</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Demo;