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
  Target,
  Building2,
  Utensils,
  ShoppingCart,
  Truck,
  Factory,
  Heart,
  GraduationCap,
  Home
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

interface Industry {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  modules: TutorialModule[];
}

const TutorialSystem: React.FC = () => {
  const [activeIndustry, setActiveIndustry] = useState<string>('hospitality');
  const [activeModule, setActiveModule] = useState<string>('getting-started');
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const industries: Industry[] = [
    {
      id: 'hospitality',
      name: 'Hospitality & Food Service',
      description: 'Restaurants, bars, hotels, and catering services',
      icon: <Utensils className="h-6 w-6" />,
      modules: [
        {
          id: 'getting-started',
          title: 'Getting Started',
          description: 'Learn the basics of your hospitality management system',
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
          title: 'Food & Beverage Inventory',
          description: 'Master your ingredient and beverage tracking',
          icon: <Package className="h-5 w-5" />,
          difficulty: 'Intermediate',
          steps: [
            {
              id: 'inventory-setup',
              title: 'Inventory Setup',
              description: 'Add and configure your food and beverage inventory',
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
              id: 'waste-tracking',
              title: 'Waste & Loss Prevention',
              description: 'Track waste and implement loss prevention strategies',
              icon: <Shield className="h-4 w-4" />,
              duration: '12 min'
            }
          ]
        },
        {
          id: 'staff-management',
          title: 'Staff & Service Management',
          description: 'Manage your team and optimize service',
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
              id: 'service-tracking',
              title: 'Service Quality Monitoring',
              description: 'Track customer satisfaction and service metrics',
              icon: <Target className="h-4 w-4" />,
              duration: '15 min'
            }
          ]
        }
      ]
    },
    {
      id: 'retail',
      name: 'Retail & E-commerce',
      description: 'Stores, warehouses, and online retail operations',
      icon: <ShoppingCart className="h-6 w-6" />,
      modules: [
        {
          id: 'getting-started-retail',
          title: 'Getting Started',
          description: 'Learn the basics of your retail management system',
          icon: <Play className="h-5 w-5" />,
          difficulty: 'Beginner',
          steps: [
            {
              id: 'retail-login',
              title: 'System Access',
              description: 'Access your retail dashboard and key features',
              icon: <Users className="h-4 w-4" />,
              duration: '2 min'
            },
            {
              id: 'pos-setup',
              title: 'Point of Sale Setup',
              description: 'Configure your POS system and payment methods',
              icon: <Target className="h-4 w-4" />,
              duration: '8 min'
            },
            {
              id: 'retail-dashboard',
              title: 'Retail Analytics Dashboard',
              description: 'Understand sales metrics and inventory levels',
              icon: <BarChart3 className="h-4 w-4" />,
              duration: '5 min'
            }
          ]
        },
        {
          id: 'product-management',
          title: 'Product & Inventory Management',
          description: 'Manage products and stock levels',
          icon: <Package className="h-5 w-5" />,
          difficulty: 'Intermediate',
          steps: [
            {
              id: 'product-catalog',
              title: 'Product Catalog Setup',
              description: 'Add products and SKU information',
              icon: <Package className="h-4 w-4" />,
              duration: '15 min'
            },
            {
              id: 'inventory-tracking',
              title: 'Inventory Tracking',
              description: 'Monitor stock levels across multiple locations',
              icon: <BarChart3 className="h-4 w-4" />,
              duration: '12 min'
            },
            {
              id: 'supplier-management',
              title: 'Supplier Management',
              description: 'Manage suppliers and purchase orders',
              icon: <Truck className="h-4 w-4" />,
              duration: '10 min'
            }
          ]
        }
      ]
    },
    {
      id: 'manufacturing',
      name: 'Manufacturing & Production',
      description: 'Factories, production facilities, and assembly lines',
      icon: <Factory className="h-6 w-6" />,
      modules: [
        {
          id: 'getting-started-manufacturing',
          title: 'Getting Started',
          description: 'Learn the basics of your manufacturing system',
          icon: <Play className="h-5 w-5" />,
          difficulty: 'Beginner',
          steps: [
            {
              id: 'manufacturing-login',
              title: 'System Access',
              description: 'Access your manufacturing dashboard',
              icon: <Users className="h-4 w-4" />,
              duration: '2 min'
            },
            {
              id: 'production-overview',
              title: 'Production Overview',
              description: 'Understand production metrics and workflows',
              icon: <Factory className="h-4 w-4" />,
              duration: '8 min'
            },
            {
              id: 'quality-control',
              title: 'Quality Control Setup',
              description: 'Configure quality checkpoints and standards',
              icon: <Shield className="h-4 w-4" />,
              duration: '10 min'
            }
          ]
        },
        {
          id: 'production-management',
          title: 'Production Management',
          description: 'Optimize production workflows and efficiency',
          icon: <Factory className="h-5 w-5" />,
          difficulty: 'Advanced',
          steps: [
            {
              id: 'workflow-setup',
              title: 'Production Workflow Setup',
              description: 'Design and configure production workflows',
              icon: <Target className="h-4 w-4" />,
              duration: '20 min'
            },
            {
              id: 'machine-monitoring',
              title: 'Machine Monitoring',
              description: 'Track machine performance and maintenance',
              icon: <Smartphone className="h-4 w-4" />,
              duration: '15 min'
            },
            {
              id: 'production-analytics',
              title: 'Production Analytics',
              description: 'Analyze efficiency and identify bottlenecks',
              icon: <BarChart3 className="h-4 w-4" />,
              duration: '12 min'
            }
          ]
        }
      ]
    },
    {
      id: 'healthcare',
      name: 'Healthcare & Medical',
      description: 'Hospitals, clinics, and medical facilities',
      icon: <Heart className="h-6 w-6" />,
      modules: [
        {
          id: 'getting-started-healthcare',
          title: 'Getting Started',
          description: 'Learn the basics of your healthcare management system',
          icon: <Play className="h-5 w-5" />,
          difficulty: 'Beginner',
          steps: [
            {
              id: 'healthcare-login',
              title: 'Secure Access',
              description: 'Access your healthcare dashboard securely',
              icon: <Shield className="h-4 w-4" />,
              duration: '3 min'
            },
            {
              id: 'patient-overview',
              title: 'Patient Management Overview',
              description: 'Navigate patient records and scheduling',
              icon: <Users className="h-4 w-4" />,
              duration: '8 min'
            },
            {
              id: 'compliance-basics',
              title: 'Compliance & Privacy',
              description: 'Understand HIPAA compliance and data security',
              icon: <Shield className="h-4 w-4" />,
              duration: '10 min'
            }
          ]
        },
        {
          id: 'medical-inventory',
          title: 'Medical Supply Management',
          description: 'Manage medical supplies and equipment',
          icon: <Package className="h-5 w-5" />,
          difficulty: 'Intermediate',
          steps: [
            {
              id: 'medical-supplies',
              title: 'Medical Supply Tracking',
              description: 'Track medicines, supplies, and expiration dates',
              icon: <Package className="h-4 w-4" />,
              duration: '15 min'
            },
            {
              id: 'equipment-management',
              title: 'Equipment Management',
              description: 'Monitor medical equipment and maintenance',
              icon: <Smartphone className="h-4 w-4" />,
              duration: '12 min'
            },
            {
              id: 'controlled-substances',
              title: 'Controlled Substance Tracking',
              description: 'Safely manage and track controlled medications',
              icon: <Shield className="h-4 w-4" />,
              duration: '18 min'
            }
          ]
        }
      ]
    },
    {
      id: 'education',
      name: 'Education & Training',
      description: 'Schools, universities, and training centers',
      icon: <GraduationCap className="h-6 w-6" />,
      modules: [
        {
          id: 'getting-started-education',
          title: 'Getting Started',
          description: 'Learn the basics of your education management system',
          icon: <Play className="h-5 w-5" />,
          difficulty: 'Beginner',
          steps: [
            {
              id: 'education-login',
              title: 'System Access',
              description: 'Access your education dashboard and features',
              icon: <Users className="h-4 w-4" />,
              duration: '2 min'
            },
            {
              id: 'student-overview',
              title: 'Student Management',
              description: 'Navigate student records and enrollment',
              icon: <GraduationCap className="h-4 w-4" />,
              duration: '8 min'
            },
            {
              id: 'curriculum-setup',
              title: 'Curriculum Management',
              description: 'Set up courses, schedules, and assessments',
              icon: <BookOpen className="h-4 w-4" />,
              duration: '12 min'
            }
          ]
        },
        {
          id: 'resource-management',
          title: 'Educational Resource Management',
          description: 'Manage classroom resources and equipment',
          icon: <Package className="h-5 w-5" />,
          difficulty: 'Intermediate',
          steps: [
            {
              id: 'classroom-resources',
              title: 'Classroom Resource Tracking',
              description: 'Track books, equipment, and digital resources',
              icon: <Package className="h-4 w-4" />,
              duration: '10 min'
            },
            {
              id: 'digital-assets',
              title: 'Digital Asset Management',
              description: 'Manage digital content and learning materials',
              icon: <Smartphone className="h-4 w-4" />,
              duration: '15 min'
            },
            {
              id: 'facility-scheduling',
              title: 'Facility Scheduling',
              description: 'Schedule classrooms and common areas',
              icon: <Target className="h-4 w-4" />,
              duration: '8 min'
            }
          ]
        }
      ]
    },
    {
      id: 'office',
      name: 'Office & Corporate',
      description: 'Corporate offices and business facilities',
      icon: <Building2 className="h-6 w-6" />,
      modules: [
        {
          id: 'getting-started-office',
          title: 'Getting Started',
          description: 'Learn the basics of your office management system',
          icon: <Play className="h-5 w-5" />,
          difficulty: 'Beginner',
          steps: [
            {
              id: 'office-login',
              title: 'System Access',
              description: 'Access your office management dashboard',
              icon: <Users className="h-4 w-4" />,
              duration: '2 min'
            },
            {
              id: 'workspace-overview',
              title: 'Workspace Management',
              description: 'Navigate desk booking and space utilization',
              icon: <Building2 className="h-4 w-4" />,
              duration: '6 min'
            },
            {
              id: 'employee-tracking',
              title: 'Employee Access Tracking',
              description: 'Monitor office access and attendance',
              icon: <Users className="h-4 w-4" />,
              duration: '8 min'
            }
          ]
        },
        {
          id: 'office-resources',
          title: 'Office Resource Management',
          description: 'Manage office supplies and equipment',
          icon: <Package className="h-5 w-5" />,
          difficulty: 'Intermediate',
          steps: [
            {
              id: 'office-supplies',
              title: 'Office Supply Management',
              description: 'Track supplies, stationery, and consumables',
              icon: <Package className="h-4 w-4" />,
              duration: '10 min'
            },
            {
              id: 'meeting-rooms',
              title: 'Meeting Room Booking',
              description: 'Manage conference rooms and equipment',
              icon: <Target className="h-4 w-4" />,
              duration: '8 min'
            },
            {
              id: 'security-access',
              title: 'Security & Access Control',
              description: 'Configure access cards and security protocols',
              icon: <Shield className="h-4 w-4" />,
              duration: '12 min'
            }
          ]
        }
      ]
    }
  ];

  const generalFaqItems = [
    {
      question: "How accurate is the tracking system?",
      answer: "Our tracking systems use advanced sensors and are accurate to industry standards, with most measurements within ±2% variance."
    },
    {
      question: "Can I use this system without internet?",
      answer: "Yes! The system works offline and automatically syncs data when connection is restored. Critical functions continue working offline."
    },
    {
      question: "How do I calibrate sensors and devices?",
      answer: "Navigate to the Device Management section, select your device, and follow the calibration wizard specific to your industry requirements."
    },
    {
      question: "What happens if a device loses connection?",
      answer: "Devices store data locally and automatically reconnect. You'll receive alerts for extended disconnections to maintain tracking accuracy."
    },
    {
      question: "How secure is my data?",
      answer: "We use enterprise-grade encryption and comply with industry standards including GDPR, HIPAA (where applicable), and SOC 2 Type II."
    },
    {
      question: "Can I customize the system for my specific needs?",
      answer: "Yes! The system is highly configurable with custom fields, workflows, and integrations available for enterprise customers."
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

  const currentIndustry = industries.find(industry => industry.id === activeIndustry) || industries[0];
  const currentModules = currentIndustry.modules;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4 mb-8">
        <div className="flex items-center justify-center gap-3">
          <div className="bg-gradient-primary p-3 rounded-xl">
            <BookOpen className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Universal System Tutorial
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Master your system with our comprehensive industry-specific tutorials and guides. 
          Learn everything from basic navigation to advanced analytics across multiple industries.
        </p>
      </div>

      {/* Industry Selection */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Select Your Industry
          </CardTitle>
          <CardDescription>
            Choose your industry to see tailored tutorials and guidance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {industries.map((industry) => (
              <Button
                key={industry.id}
                variant={activeIndustry === industry.id ? "default" : "outline"}
                className="h-auto p-4 flex flex-col gap-2"
                onClick={() => setActiveIndustry(industry.id)}
              >
                {industry.icon}
                <span className="text-xs font-medium text-center">{industry.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeModule} onValueChange={setActiveModule} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="quick-tips">Quick Tips</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              {currentIndustry.icon}
              {currentIndustry.name}
            </h2>
            <p className="text-muted-foreground">{currentIndustry.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentModules.map((module) => (
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
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              {currentIndustry.icon}
              {currentIndustry.name} Tutorials
            </h2>
            <p className="text-muted-foreground">{currentIndustry.description}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="bg-gradient-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Tutorial Modules</CardTitle>
                  <CardDescription>Select a module to begin learning</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentModules.map((module) => (
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
              {currentModules.map((module) => (
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
                  <CardTitle>Industry Tips</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Optimize Tracking Accuracy</h4>
                  <p className="text-sm text-muted-foreground">
                    Regular calibration and maintenance ensure optimal system performance.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Inventory Efficiency</h4>
                  <p className="text-sm text-muted-foreground">
                    Set appropriate reorder points based on your industry's consumption patterns.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Team Performance</h4>
                  <p className="text-sm text-muted-foreground">
                    Regular reporting helps identify training opportunities and optimize workflows.
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
                    Check system status, review alerts, and verify key metrics daily.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Security & Compliance</h4>
                  <p className="text-sm text-muted-foreground">
                    Enable appropriate notifications and maintain compliance with industry standards.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Data Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Regular trend analysis helps optimize operations and identify cost savings.
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
                Common questions and answers about the universal management system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {generalFaqItems.map((item, index) => (
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