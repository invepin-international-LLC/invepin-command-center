import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BLEScanner } from "@/components/devices/BLEScanner";
import { FloorPlan } from "@/components/floorplan/FloorPlan";
import { BarcodeScanner } from "@/components/scanner/BarcodeScanner";
import { Analytics } from "@/components/analytics/Analytics";
import { Notifications } from "@/components/notifications/Notifications";
import { BarManagement } from "@/components/bar/BarManagement";
import { CameraManager } from "@/components/cameras/CameraManager";
import { SecurityDashboard } from "@/components/dashboard/SecurityDashboard";
import TutorialSystem from "@/components/tutorial/TutorialSystem";
import { InvepinTracker } from "@/components/tracking/InvepinTracker";
import { PanicButton } from "@/components/security/PanicButton";
import { 
  Shield, 
  Smartphone, 
  Wifi, 
  Cloud, 
  AlertTriangle, 
  CheckCircle, 
  Battery, 
  MapPin,
  TrendingUp,
  Activity,
  Users,
  Package,
  Bell,
  Wine,
  BookOpen,
  Camera,
  Store,
  Building2,
  Heart,
  Navigation,
  ShieldAlert
} from "lucide-react";

interface User {
  id: string;
  email: string;
  role: 'super_admin' | 'company_admin' | 'manager' | 'bartender' | 'staff';
  name: string;
}

interface MainDashboardProps {
  user: User;
  onLogout: () => void;
}

export const MainDashboard = ({ user, onLogout }: MainDashboardProps) => {
  const [selectedIndustry, setSelectedIndustry] = useState<'casino' | 'grocery' | 'hospitality' | 'healthcare' | 'bar'>('grocery');
  const [activeView, setActiveView] = useState<'overview' | 'devices' | 'floorplan' | 'scanner' | 'analytics' | 'notifications' | 'bar' | 'tutorial' | 'cameras' | 'security' | 'tracker' | 'panic'>('overview');
  const navigate = useNavigate();

  // All industries available
  const industries = [
    { id: 'casino', name: 'Casino', icon: Activity, color: 'from-red-500 to-red-700', textColor: 'text-red-500', description: 'Chip & table monitoring' },
    { id: 'grocery', name: 'Grocery', icon: Store, color: 'from-blue-500 to-blue-700', textColor: 'text-blue-500', description: 'Loss prevention & inventory' },
    { id: 'hospitality', name: 'Hospitality', icon: Wine, color: 'from-purple-500 to-purple-700', textColor: 'text-purple-500', description: 'Hotel & restaurant tracking' },
    { id: 'healthcare', name: 'Healthcare', icon: Heart, color: 'from-green-500 to-green-700', textColor: 'text-green-500', description: 'Medical supply tracking' },
    { id: 'bar', name: 'Bar', icon: Wine, color: 'from-amber-500 to-amber-700', textColor: 'text-amber-500', description: 'Beverage & bottle tracking' },
  ];

  // Industry-specific navigation tabs
  const getIndustryTabs = (industry: string) => {
    const industryTabs = {
      casino: [
        { id: 'overview', label: 'Overview', icon: null },
        { id: 'tracker', label: 'Live Tracker', icon: Navigation },
        { id: 'panic', label: 'Panic Button', icon: ShieldAlert },
        { id: 'devices', label: 'Devices', icon: Smartphone },
        { id: 'floorplan', label: 'Floor Plan', icon: MapPin },
        { id: 'scanner', label: 'Chip Scanner', icon: Package },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp },
        { id: 'notifications', label: 'Security Alerts', icon: Bell },
        { id: 'cameras', label: 'Cameras', icon: Camera },
        { id: 'security', label: 'Security Center', icon: Shield },
        { id: 'tutorial', label: 'Tutorial', icon: BookOpen }
      ],
      grocery: [
        { id: 'overview', label: 'Overview', icon: null },
        { id: 'tracker', label: 'Live Tracker', icon: Navigation },
        { id: 'panic', label: 'Panic Button', icon: ShieldAlert },
        { id: 'devices', label: 'Devices', icon: Smartphone },
        { id: 'floorplan', label: 'Floor Plan', icon: MapPin },
        { id: 'scanner', label: 'Scanner', icon: Package },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp },
        { id: 'notifications', label: 'Security Alerts', icon: Bell },
        { id: 'cameras', label: 'Cameras', icon: Camera },
        { id: 'security', label: 'Security Center', icon: Shield },
        { id: 'tutorial', label: 'Tutorial', icon: BookOpen }
      ],
      hospitality: [
        { id: 'overview', label: 'Overview', icon: null },
        { id: 'tracker', label: 'Live Tracker', icon: Navigation },
        { id: 'panic', label: 'Panic Button', icon: ShieldAlert },
        { id: 'devices', label: 'Devices', icon: Smartphone },
        { id: 'floorplan', label: 'Floor Plan', icon: MapPin },
        { id: 'bar', label: 'Minibar Tracking', icon: Wine },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp },
        { id: 'notifications', label: 'Guest Alerts', icon: Bell },
        { id: 'cameras', label: 'Cameras', icon: Camera },
        { id: 'security', label: 'Security Center', icon: Shield },
        { id: 'tutorial', label: 'Tutorial', icon: BookOpen }
      ],
      healthcare: [
        { id: 'overview', label: 'Overview', icon: null },
        { id: 'tracker', label: 'Live Tracker', icon: Navigation },
        { id: 'panic', label: 'Panic Button', icon: ShieldAlert },
        { id: 'devices', label: 'Devices', icon: Smartphone },
        { id: 'floorplan', label: 'Floor Plan', icon: MapPin },
        { id: 'scanner', label: 'Medical Scanner', icon: Package },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp },
        { id: 'notifications', label: 'Supply Alerts', icon: Bell },
        { id: 'cameras', label: 'Cameras', icon: Camera },
        { id: 'security', label: 'Security Center', icon: Shield },
        { id: 'tutorial', label: 'Tutorial', icon: BookOpen }
      ],
      bar: [
        { id: 'overview', label: 'Overview', icon: null },
        { id: 'tracker', label: 'Live Tracker', icon: Navigation },
        { id: 'panic', label: 'Panic Button', icon: ShieldAlert },
        { id: 'devices', label: 'Devices', icon: Smartphone },
        { id: 'floorplan', label: 'Floor Plan', icon: MapPin },
        { id: 'bar', label: 'Bar Management', icon: Wine },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp },
        { id: 'notifications', label: 'Inventory Alerts', icon: Bell },
        { id: 'cameras', label: 'Cameras', icon: Camera },
        { id: 'security', label: 'Security Center', icon: Shield },
        { id: 'tutorial', label: 'Tutorial', icon: BookOpen }
      ]
    };
    return industryTabs[industry as keyof typeof industryTabs];
  };

  // Industry-specific data
  const getIndustryData = (industry: string) => {
    const industryConfig = {
      casino: {
        stats: {
          connectedDevices: 245,
          activeAlerts: 7,
          inventoryAccuracy: 99.9,
          batteryHealth: 96
        },
        alerts: [
          { id: 1, type: 'movement', item: 'High-Value Chips', location: 'Table 12', time: '1 min ago', severity: 'high' },
          { id: 2, type: 'suspicious', item: 'Player Activity', location: 'Blackjack Area', time: '8 min ago', severity: 'high' },
          { id: 3, type: 'low_battery', item: 'Chip Tracker #89', location: 'Poker Room', time: '20 min ago', severity: 'medium' }
        ],
        quickActions: [
          { label: 'Security Monitor', icon: Shield, color: 'bg-gradient-primary', action: () => setActiveView('security') },
          { label: 'Chip Tracking', icon: Package, color: 'bg-gradient-success', action: () => setActiveView('scanner') },
          { label: 'Table Status', icon: MapPin, color: 'bg-gradient-warning', action: () => setActiveView('floorplan') },
          { label: 'Incident Report', icon: AlertTriangle, color: 'bg-gradient-danger', action: () => setActiveView('notifications') }
        ]
      },
      grocery: {
        stats: {
          connectedDevices: 127,
          activeAlerts: 3,
          inventoryAccuracy: 99.2,
          batteryHealth: 94
        },
        alerts: [
          { id: 1, type: 'movement', item: 'Premium Electronics', location: 'Electronics Aisle', time: '2 min ago', severity: 'high' },
          { id: 2, type: 'low_battery', item: 'Security Tag #47', location: 'Produce Section', time: '15 min ago', severity: 'medium' },
          { id: 3, type: 'disconnect', item: 'High-Value Item', location: 'Checkout Area', time: '1 hour ago', severity: 'high' }
        ],
        quickActions: [
          { label: 'Scan Inventory', icon: Package, color: 'bg-gradient-primary', action: () => setActiveView('scanner') },
          { label: 'View Floor Plan', icon: MapPin, color: 'bg-gradient-success', action: () => setActiveView('floorplan') },
          { label: 'Security Check', icon: Shield, color: 'bg-gradient-warning', action: () => setActiveView('security') },
          { label: 'Loss Report', icon: TrendingUp, color: 'bg-gradient-danger', action: () => setActiveView('analytics') }
        ]
      },
      hospitality: {
        stats: {
          connectedDevices: 89,
          activeAlerts: 1,
          inventoryAccuracy: 97.8,
          batteryHealth: 92
        },
        alerts: [
          { id: 1, type: 'consumption', item: 'Minibar - Room 204', location: 'Floor 2', time: '5 min ago', severity: 'medium' },
          { id: 2, type: 'low_battery', item: 'Room Service Tracker', location: 'Kitchen', time: '30 min ago', severity: 'low' },
          { id: 3, type: 'temperature', item: 'Wine Cellar', location: 'Basement', time: '45 min ago', severity: 'medium' }
        ],
        quickActions: [
          { label: 'Room Service', icon: Bell, color: 'bg-gradient-primary', action: () => setActiveView('notifications') },
          { label: 'Minibar Status', icon: Wine, color: 'bg-gradient-success', action: () => setActiveView('bar') },
          { label: 'Guest Check-in', icon: Users, color: 'bg-gradient-warning', action: () => setActiveView('security') },
          { label: 'Revenue Report', icon: TrendingUp, color: 'bg-gradient-danger', action: () => setActiveView('analytics') }
        ]
      },
      healthcare: {
        stats: {
          connectedDevices: 156,
          activeAlerts: 2,
          inventoryAccuracy: 99.8,
          batteryHealth: 98
        },
        alerts: [
          { id: 1, type: 'temperature', item: 'Cold Storage Unit B', location: 'Medical Wing', time: '3 min ago', severity: 'high' },
          { id: 2, type: 'compliance', item: 'Controlled Medication', location: 'Pharmacy', time: '12 min ago', severity: 'medium' },
          { id: 3, type: 'expiry', item: 'Medical Supply Batch #447', location: 'Storage Room C', time: '25 min ago', severity: 'low' }
        ],
        quickActions: [
          { label: 'Cold Chain Monitor', icon: Activity, color: 'bg-gradient-primary', action: () => setActiveView('analytics') },
          { label: 'Supply Tracking', icon: Package, color: 'bg-gradient-success', action: () => setActiveView('tracker') },
          { label: 'Compliance Check', icon: CheckCircle, color: 'bg-gradient-warning', action: () => setActiveView('security') },
          { label: 'Audit Report', icon: TrendingUp, color: 'bg-gradient-danger', action: () => setActiveView('analytics') }
        ]
      },
      bar: {
        stats: {
          connectedDevices: 78,
          activeAlerts: 4,
          inventoryAccuracy: 98.5,
          batteryHealth: 95
        },
        alerts: [
          { id: 1, type: 'pour_detected', item: 'Premium Whiskey', location: 'Bar Station 3', time: '1 min ago', severity: 'medium' },
          { id: 2, type: 'low_stock', item: 'Vodka Bottle', location: 'Main Bar', time: '10 min ago', severity: 'high' },
          { id: 3, type: 'temperature', item: 'Beer Cooler', location: 'Storage', time: '30 min ago', severity: 'medium' }
        ],
        quickActions: [
          { label: 'Bottle Inventory', icon: Wine, color: 'bg-gradient-primary', action: () => setActiveView('bar') },
          { label: 'Pour Tracking', icon: Activity, color: 'bg-gradient-success', action: () => setActiveView('tracker') },
          { label: 'Stock Alert', icon: Bell, color: 'bg-gradient-warning', action: () => setActiveView('notifications') },
          { label: 'Sales Report', icon: TrendingUp, color: 'bg-gradient-danger', action: () => setActiveView('analytics') }
        ]
      }
    };
    return industryConfig[industry as keyof typeof industryConfig];
  };

  const currentIndustryData = getIndustryData(selectedIndustry);
  const stats = currentIndustryData.stats;
  const recentAlerts = currentIndustryData.alerts;
  const quickActions = currentIndustryData.quickActions;
  const currentTabs = getIndustryTabs(selectedIndustry);

  // Reset activeView to overview when industry changes if current view is not available
  const handleIndustryChange = (industry: 'casino' | 'grocery' | 'hospitality' | 'healthcare' | 'bar') => {
    setSelectedIndustry(industry);
    const newTabs = getIndustryTabs(industry);
    const availableTabIds = newTabs.map(tab => tab.id);
    if (!availableTabIds.includes(activeView)) {
      setActiveView('overview');
    }
  };

  const industryLabels = {
    casino: { primary: 'Chip Monitoring', secondary: 'Table Games', kpi: 'Security Events' },
    grocery: { primary: 'Shrinkage Prevention', secondary: 'Loss Rate', kpi: 'Theft Alerts' },
    hospitality: { primary: 'Minibar Tracking', secondary: 'Room Service', kpi: 'Guest Usage' },
    healthcare: { primary: 'Supply Tracking', secondary: 'Cold Chain', kpi: 'Compliance Score' },
    bar: { primary: 'Bottle Tracking', secondary: 'Pour Detection', kpi: 'Inventory Accuracy' }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-gradient-danger';
      case 'manager': return 'bg-gradient-warning';
      case 'staff': return 'bg-gradient-success';
      default: return 'bg-gradient-primary';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-danger';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Enhanced Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl border-b border-border/30 bg-background/95 animate-slide-in-from-top">
        <div className="container mx-auto p-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Logo and Title */}
            <div className="flex items-center gap-4 animate-fade-in">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-primary rounded-xl blur opacity-75 animate-pulse-glow group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-primary p-3 rounded-xl shadow-glow hover:scale-110 transition-transform duration-300">
                  <Shield className="h-7 w-7 text-primary-foreground" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Invepin Command Center
                </h1>
                <p className="text-sm lg:text-base text-muted-foreground">Welcome back, {user.name}</p>
              </div>
            </div>
            
            {/* User Actions */}
            <div className="flex items-center gap-3 flex-wrap animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <Badge className={`${getRoleColor(user.role)} text-white px-3 py-1 shadow-card hover:scale-105 transition-transform duration-200`}>
                <Users className="h-3 w-3 mr-1" />
                {user.role.toUpperCase()}
              </Badge>
              <Button variant="outline" size="sm" onClick={onLogout} className="hover:shadow-card hover:scale-105 transition-all duration-200">
                Sign Out
              </Button>
            </div>
          </div>
          
          {/* Enhanced Navigation */}
          <div className="mt-6 overflow-x-auto">
            <div className="flex gap-2 min-w-max pb-2">
              {currentTabs.map((tab, index) => (
                <Button 
                  key={tab.id}
                  variant={activeView === tab.id ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveView(tab.id as any)}
                  className={`transition-all duration-300 hover-scale ${
                    activeView === tab.id 
                      ? 'bg-gradient-primary shadow-glow scale-105' 
                      : 'hover:shadow-card hover:scale-105 hover:border-primary/50'
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {tab.icon && <tab.icon className="h-4 w-4 mr-1" />}
                  <span className={tab.icon ? "hidden sm:inline" : ""}>{tab.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4 space-y-6">

        {/* Enhanced System Status */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <Card className="relative overflow-hidden group hover:shadow-elevated transition-all duration-300 hover:scale-105 animate-scale-in cursor-pointer">
            <div className="absolute inset-0 bg-gradient-success opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <CardContent className="relative p-4 lg:p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="relative">
                  <div className="absolute -inset-2 bg-success rounded-full blur opacity-30 animate-pulse-glow"></div>
                  <Wifi className="relative h-6 w-6 lg:h-8 lg:w-8 text-success" />
                </div>
              </div>
              <p className="text-sm lg:text-base font-medium">Colony</p>
              <p className="text-xs lg:text-sm text-success font-semibold animate-pulse">Connected</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-elevated transition-all duration-300 hover:scale-105 animate-scale-in cursor-pointer" style={{ animationDelay: '0.1s' }}>
            <div className="absolute inset-0 bg-gradient-primary opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <CardContent className="relative p-4 lg:p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="relative">
                  <div className="absolute -inset-2 bg-primary rounded-full blur opacity-30 animate-pulse-glow"></div>
                  <Cloud className="relative h-6 w-6 lg:h-8 lg:w-8 text-primary" />
                </div>
              </div>
              <p className="text-sm lg:text-base font-medium">Hive</p>
              <p className="text-xs lg:text-sm text-primary font-semibold animate-pulse">Synced</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-elevated transition-all duration-300 hover:scale-105 animate-scale-in cursor-pointer" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-gradient-warning opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <CardContent className="relative p-4 lg:p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="relative">
                  <div className="absolute -inset-2 bg-warning rounded-full blur opacity-30"></div>
                  <Smartphone className="relative h-6 w-6 lg:h-8 lg:w-8 text-warning" />
                </div>
              </div>
              <p className="text-sm lg:text-base font-medium">Devices</p>
              <p className="text-xs lg:text-sm text-warning font-semibold">{stats.connectedDevices} Active</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-elevated transition-all duration-300 hover:scale-105 animate-scale-in cursor-pointer" style={{ animationDelay: '0.3s' }}>
            <div className="absolute inset-0 bg-gradient-success opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <CardContent className="relative p-4 lg:p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="relative">
                  <div className="absolute -inset-2 bg-success rounded-full blur opacity-30"></div>
                  <Activity className="relative h-6 w-6 lg:h-8 lg:w-8 text-success" />
                </div>
              </div>
              <p className="text-sm lg:text-base font-medium">System</p>
              <p className="text-xs lg:text-sm text-success font-semibold">Operational</p>
            </CardContent>
          </Card>
        </div>

      {/* Content based on active view */}
      {activeView === 'overview' ? (
        <div className="animate-fade-in space-y-6">
          {/* INDUSTRY SELECTOR - ALL INDUSTRIES */}
          <Card className="relative overflow-hidden border-2 border-primary/30 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10"></div>
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-3 bg-gradient-primary rounded-xl shadow-glow animate-pulse-glow">
                  <Building2 className="h-7 w-7 text-primary-foreground" />
                </div>
                Select Your Industry
              </CardTitle>
              <CardDescription className="text-lg">
                Choose your industry to access specialized tracking solutions
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {industries.map((industry, index) => {
                  const Icon = industry.icon;
                  const isSelected = selectedIndustry === industry.id;
                  return (
                    <Card
                      key={industry.id}
                      onClick={() => handleIndustryChange(industry.id as any)}
                      className={`relative overflow-hidden cursor-pointer transition-all duration-500 hover:scale-110 hover:shadow-2xl group ${
                        isSelected ? 'ring-4 ring-primary shadow-2xl scale-105' : 'hover:ring-2 hover:ring-primary/50'
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${industry.color} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                      <CardContent className="relative p-6 text-center space-y-4">
                        <div className="relative">
                          <div className={`absolute -inset-3 bg-gradient-to-br ${industry.color} rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity`}></div>
                          <Icon className={`relative h-16 w-16 mx-auto ${industry.textColor} group-hover:scale-125 transition-transform duration-300`} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-2">{industry.name}</h3>
                          <p className="text-sm text-muted-foreground">{industry.description}</p>
                        </div>
                        {isSelected && (
                          <Badge className="bg-gradient-primary text-white animate-pulse-glow">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            ACTIVE
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <Card className="relative overflow-hidden group hover:shadow-elevated transition-all duration-300 hover:scale-105 animate-scale-in cursor-pointer">
              <div className="absolute inset-0 bg-gradient-success opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <CardContent className="relative p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs lg:text-sm text-muted-foreground font-medium">
                      {industryLabels[selectedIndustry].primary}
                    </p>
                    <p className="text-xl lg:text-3xl font-bold text-success animate-fade-in">{stats.inventoryAccuracy}%</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -inset-2 bg-success rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <CheckCircle className="relative h-8 w-8 lg:h-10 lg:w-10 text-success group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-elevated transition-all duration-300 hover:scale-105 animate-scale-in cursor-pointer" style={{ animationDelay: '0.1s' }}>
              <div className="absolute inset-0 bg-gradient-danger opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <CardContent className="relative p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs lg:text-sm text-muted-foreground font-medium">Active Alerts</p>
                    <p className="text-xl lg:text-3xl font-bold text-danger animate-fade-in">{stats.activeAlerts}</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -inset-2 bg-danger rounded-full blur opacity-30 animate-pulse group-hover:opacity-50 transition-opacity"></div>
                    <AlertTriangle className="relative h-8 w-8 lg:h-10 lg:w-10 text-danger animate-pulse group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-elevated transition-all duration-300 hover:scale-105 animate-scale-in cursor-pointer" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-0 bg-gradient-primary opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <CardContent className="relative p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs lg:text-sm text-muted-foreground font-medium">Connected Devices</p>
                    <p className="text-xl lg:text-3xl font-bold text-primary animate-fade-in">{stats.connectedDevices}</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -inset-2 bg-primary rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <Smartphone className="relative h-8 w-8 lg:h-10 lg:w-10 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-elevated transition-all duration-300 hover:scale-105 animate-scale-in cursor-pointer" style={{ animationDelay: '0.3s' }}>
              <div className="absolute inset-0 bg-gradient-success opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <CardContent className="relative p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs lg:text-sm text-muted-foreground font-medium">Battery Health</p>
                    <p className="text-xl lg:text-3xl font-bold text-success animate-fade-in">{stats.batteryHealth}%</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -inset-2 bg-success rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <Battery className="relative h-8 w-8 lg:h-10 lg:w-10 text-success group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Quick Actions */}
          <Card className="relative overflow-hidden border-border/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
            <CardHeader className="relative">
              <CardTitle className="text-lg lg:text-xl">Quick Actions</CardTitle>
              <CardDescription className="text-base">Frequently used operations</CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={action.action}
                    className="h-20 lg:h-24 flex flex-col gap-2 group hover:shadow-elevated transition-all duration-300 hover:scale-105 hover:border-primary/50"
                  >
                    <div className="relative">
                      <div className="absolute -inset-2 bg-primary rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
                      <action.icon className="relative h-6 w-6 lg:h-8 lg:w-8 group-hover:text-primary transition-colors" />
                    </div>
                    <span className="text-xs lg:text-sm font-medium group-hover:text-primary transition-colors">
                      {action.label}
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Recent Alerts */}
          <Card className="relative overflow-hidden border-border/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-danger/5 to-warning/5"></div>
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-3 text-lg lg:text-xl">
                <div className="p-2 bg-gradient-danger rounded-lg shadow-glow">
                  <AlertTriangle className="h-5 w-5 text-white animate-pulse" />
                </div>
                Recent Alerts
              </CardTitle>
              <CardDescription className="text-base">Live security and system notifications</CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="group flex items-center justify-between p-4 lg:p-5 bg-background/60 backdrop-blur-sm rounded-xl border border-border/50 hover:shadow-elevated hover:border-primary/30 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="flex-1 space-y-1">
                      <p className="font-semibold text-sm lg:text-base group-hover:text-primary transition-colors">
                        {alert.item}
                      </p>
                      <p className="text-xs lg:text-sm text-muted-foreground">{alert.location}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className={`text-xs lg:text-sm font-bold ${getSeverityColor(alert.severity)}`}>
                        {alert.type.replace('_', ' ').toUpperCase()}
                      </p>
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : activeView === 'devices' ? (
        <div className="animate-fade-in space-y-4">
          <Card className="bg-gradient-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Smartphone className="h-6 w-6 text-primary" />
                    BLE Device Scanner
                  </h3>
                  <p className="text-muted-foreground">Scan building for Invepin devices</p>
                </div>
                <Badge variant="outline">Auto-Scan Enabled</Badge>
              </div>
            </CardContent>
          </Card>
          <BLEScanner industry={selectedIndustry} />
        </div>
      ) : activeView === 'floorplan' ? (
        <div className="animate-fade-in space-y-4">
          <Card className="bg-gradient-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-primary animate-pulse" />
                    Live Invepin Tracking
                  </h3>
                  <p className="text-muted-foreground">Real-time location and movement monitoring</p>
                </div>
                <Badge className="bg-success text-white animate-pulse px-3 py-1">
                  <Activity className="h-3 w-3 mr-1" />
                  LIVE TRACKING
                </Badge>
              </div>
            </CardContent>
          </Card>
          <FloorPlan industry={selectedIndustry} />
        </div>
      ) : activeView === 'tracker' ? (
        <InvepinTracker />
      ) : activeView === 'panic' ? (
        <PanicButton />
      ) : activeView === 'scanner' ? (
        <BarcodeScanner industry={selectedIndustry} />
      ) : activeView === 'analytics' ? (
        <Analytics industry={selectedIndustry} />
      ) : activeView === 'bar' ? (
        <BarManagement industry={selectedIndustry} />
      ) : activeView === 'cameras' ? (
        <CameraManager />
      ) : activeView === 'security' ? (
        <SecurityDashboard />
      ) : activeView === 'tutorial' ? (
        <TutorialSystem />
      ) : (
        <Notifications industry={selectedIndustry} />
      )}
      </div>
    </div>
  );
};
