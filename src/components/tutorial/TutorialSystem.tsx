import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Play, 
  CheckCircle2, 
  ArrowRight, 
  BarChart3, 
  Users, 
  Package, 
  Shield, 
  Smartphone,
  HelpCircle,
  Lightbulb,
  Target
} from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  completed?: boolean;
}

interface TutorialModule {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  steps: TutorialStep[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const TutorialSystem: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string>('getting-started');
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const tutorialModules: TutorialModule[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Learn the basics of your bar management system',
      icon: <Play className="h-5 w-5" />,
      difficulty: 'Beginner',
      steps: [
        {
          id: 'login',
          title: 'Logging In',
          description: 'Access your dashboard with your credentials',
          icon: <Users className="h-4 w-4" />,
          duration: '2 min'
        },
        {
          id: 'navigation',
          title: 'Navigation Overview',
          description: 'Explore the main dashboard and navigation tabs',
          icon: <Target className="h-4 w-4" />,
          duration: '3 min'
        },
        {
          id: 'dashboard',
          title: 'Understanding Your Dashboard',
          description: 'Overview of key metrics and real-time data',
          icon: <BarChart3 className="h-4 w-4" />,
          duration: '5 min'
        }
      ]
    },
    {
      id: 'inventory',
      title: 'Inventory Management',
      description: 'Master your bottle tracking and stock control',
      icon: <Package className="h-5 w-5" />,
      difficulty: 'Intermediate',
      steps: [
        {
          id: 'bottle-tracking',
          title: 'Bottle Inventory Setup',
          description: 'Add and configure your bottle inventory',
          icon: <Package className="h-4 w-4" />,
          duration: '10 min'
        },
        {
          id: 'stock-levels',
          title: 'Managing Stock Levels',
          description: 'Set minimum thresholds and reorder alerts',
          icon: <Shield className="h-4 w-4" />,
          duration: '8 min'
        },
        {
          id: 'reports',
          title: 'Inventory Reports',
          description: 'Generate and analyze inventory reports',
          icon: <BarChart3 className="h-4 w-4" />,
          duration: '12 min'
        }
      ]
    },
    {
      id: 'pour-detection',
      title: 'Smart Pour Detection',
      description: 'Set up and optimize your pour tracking system',
      icon: <Shield className="h-5 w-5" />,
      difficulty: 'Advanced',
      steps: [
        {
          id: 'device-setup',
          title: 'Device Configuration',
          description: 'Connect and configure BLE pour sensors',
          icon: <Smartphone className="h-4 w-4" />,
          duration: '15 min'
        },
        {
          id: 'calibration',
          title: 'Pour Calibration',
          description: 'Calibrate sensors for accurate measurements',
          icon: <Target className="h-4 w-4" />,
          duration: '20 min'
        },
        {
          id: 'alerts',
          title: 'Loss Prevention Alerts',
          description: 'Configure theft and waste detection alerts',
          icon: <Shield className="h-4 w-4" />,
          duration: '10 min'
        }
      ]
    },
    {
      id: 'staff-management',
      title: 'Staff & Shifts',
      description: 'Manage your team and track performance',
      icon: <Users className="h-5 w-5" />,
      difficulty: 'Intermediate',
      steps: [
        {
          id: 'staff-setup',
          title: 'Staff Configuration',
          description: 'Add staff members and assign roles',
          icon: <Users className="h-4 w-4" />,
          duration: '8 min'
        },
        {
          id: 'shift-tracking',
          title: 'Shift Management',
          description: 'Track clock-ins, breaks, and performance',
          icon: <BarChart3 className="h-4 w-4" />,
          duration: '12 min'
        },
        {
          id: 'face-recognition',
          title: 'Face Recognition Setup',
          description: 'Configure mobile face recognition for clock-ins',
          icon: <Smartphone className="h-4 w-4" />,
          duration: '15 min'
        }
      ]
    }
  ];

  const faqItems = [
    {
      question: "How accurate is the pour detection system?",
      answer: "Our BLE-based pour detection system is accurate to within ±2ml, providing reliable tracking for loss prevention and inventory management."
    },
    {
      question: "Can I use this system without internet?",
      answer: "Yes! The system works offline and syncs data when connection is restored. Critical functions like pour detection continue working offline."
    },
    {
      question: "How do I calibrate pour sensors?",
      answer: "Navigate to the Pour Detection tab, select your device, and follow the calibration wizard. Pour known volumes to establish baseline measurements."
    },
    {
      question: "What happens if a device loses connection?",
      answer: "Devices store data locally and automatically reconnect. You'll receive alerts for extended disconnections to maintain tracking accuracy."
    }
  ];

  const toggleStepCompletion = (stepId: string) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
  };

  const getModuleProgress = (module: TutorialModule) => {
    const completedCount = module.steps.filter(step => completedSteps.has(step.id)).length;
    return (completedCount / module.steps.length) * 100;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/10 text-green-700 dark:text-green-300';
      case 'Intermediate': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300';
      case 'Advanced': return 'bg-red-500/10 text-red-700 dark:text-red-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4 mb-8">
        <div className="flex items-center justify-center gap-3">
          <div className="bg-gradient-primary p-3 rounded-xl">
            <BookOpen className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Bar Management Tutorial
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Master your bar management system with our comprehensive tutorials and guides. 
          Learn everything from basic navigation to advanced analytics.
        </p>
      </div>

      <Tabs value={activeModule} onValueChange={setActiveModule} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="quick-tips">Quick Tips</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tutorialModules.map((module) => (
              <Card key={module.id} className="bg-gradient-card border-border hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setActiveModule('tutorials')}>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-primary p-2 rounded-lg">
                      {module.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-sm">{module.title}</CardTitle>
                      <Badge className={getDifficultyColor(module.difficulty)} variant="outline">
                        {module.difficulty}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>{Math.round(getModuleProgress(module))}%</span>
                    </div>
                    <Progress value={getModuleProgress(module)} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tutorials" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="bg-gradient-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Tutorial Modules</CardTitle>
                  <CardDescription>Select a module to begin learning</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tutorialModules.map((module) => (
                    <Button
                      key={module.id}
                      variant={activeModule === module.id ? "default" : "ghost"}
                      className="w-full justify-start gap-3"
                      onClick={() => setActiveModule(module.id)}
                    >
                      {module.icon}
                      <div className="text-left">
                        <div className="font-medium">{module.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {module.steps.length} steps
                        </div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              {tutorialModules.map((module) => (
                <div key={module.id} className={activeModule === module.id ? 'block' : 'hidden'}>
                  <Card className="bg-gradient-card border-border">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-primary p-2 rounded-lg">
                          {module.icon}
                        </div>
                        <div>
                          <CardTitle>{module.title}</CardTitle>
                          <CardDescription>{module.description}</CardDescription>
                        </div>
                        <Badge className={getDifficultyColor(module.difficulty)} variant="outline">
                          {module.difficulty}
                        </Badge>
                      </div>
                      <Progress value={getModuleProgress(module)} className="h-2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {module.steps.map((step, index) => (
                        <div key={step.id} className="flex items-start gap-4 p-4 rounded-lg border border-border bg-muted/20">
                          <Button
                            size="sm"
                            variant={completedSteps.has(step.id) ? "default" : "outline"}
                            onClick={() => toggleStepCompletion(step.id)}
                            className="shrink-0 mt-1"
                          >
                            {completedSteps.has(step.id) ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <span className="text-xs">{index + 1}</span>
                            )}
                          </Button>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {step.icon}
                              <h3 className="font-medium">{step.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                {step.duration}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                            {!completedSteps.has(step.id) && (
                              <Button size="sm" variant="ghost" className="mt-2 p-0 h-auto">
                                Start Step <ArrowRight className="h-3 w-3 ml-1" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="quick-tips" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <CardTitle>Pro Tips</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Optimize Pour Accuracy</h4>
                  <p className="text-sm text-muted-foreground">
                    Calibrate sensors weekly and clean pour spouts daily for best results.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Inventory Efficiency</h4>
                  <p className="text-sm text-muted-foreground">
                    Set reorder points at 20% of normal usage to avoid stockouts.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Staff Performance</h4>
                  <p className="text-sm text-muted-foreground">
                    Review weekly reports to identify training opportunities.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  <CardTitle>Best Practices</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Daily Routines</h4>
                  <p className="text-sm text-muted-foreground">
                    Check device status, review overnight alerts, and verify inventory levels.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Security</h4>
                  <p className="text-sm text-muted-foreground">
                    Enable notifications for after-hours activity and unusual pour patterns.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Data Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Review weekly trends to optimize inventory and identify cost savings.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                <CardTitle>Frequently Asked Questions</CardTitle>
              </div>
              <CardDescription>
                Common questions and answers about the bar management system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {faqItems.map((item, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-medium">{item.question}</h3>
                  <p className="text-sm text-muted-foreground pl-4 border-l-2 border-primary/20">
                    {item.answer}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TutorialSystem;