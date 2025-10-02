import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Cpu, Wifi, Database, CheckCircle, ArrowRight, Network } from "lucide-react";
import { Link } from "react-router-dom";
import { PublicNav } from "@/components/navigation/PublicNav";

const ColonyHub = () => {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      
      <section className="relative px-6 lg:px-8 pt-24 pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge className="mb-4">Central Hub</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Colony Hub System
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
              Central command center managing up to 10,000 devices per location with cloud connectivity
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg">
                <Link to="/demo">
                  View Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link to="/contact">Talk to Sales</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                icon: Network,
                title: "Device Capacity",
                value: "10,000",
                description: "Simultaneous connected devices"
              },
              {
                icon: Cloud,
                title: "Uptime",
                value: "99.99%",
                description: "Enterprise-grade reliability"
              },
              {
                icon: Wifi,
                title: "Coverage",
                value: "50,000 sq ft",
                description: "Per hub unit"
              },
              {
                icon: Cpu,
                title: "Processing",
                value: "Real-time",
                description: "Edge computing power"
              }
            ].map((spec, index) => (
              <Card key={index} className="hover-card text-center">
                <CardContent className="pt-6">
                  <spec.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-bold text-foreground mb-1">{spec.value}</div>
                  <div className="font-semibold mb-1">{spec.title}</div>
                  <p className="text-sm text-muted-foreground">{spec.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="text-2xl">Technical Architecture</CardTitle>
              <CardDescription>Industrial-grade hardware for mission-critical applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Hardware Specifications</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Processor:</span>
                      <span className="font-medium">Quad-core ARM Cortex</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">RAM:</span>
                      <span className="font-medium">8GB DDR4</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Storage:</span>
                      <span className="font-medium">256GB SSD</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Connectivity:</span>
                      <span className="font-medium">Gigabit Ethernet, WiFi 6, LTE</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Power:</span>
                      <span className="font-medium">PoE+ or 12V DC</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Backup Battery:</span>
                      <span className="font-medium">8-hour UPS</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-4">Physical Specs</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Dimensions:</span>
                      <span className="font-medium">12" × 8" × 2"</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Weight:</span>
                      <span className="font-medium">2.5 lbs (1.13 kg)</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Operating Temp:</span>
                      <span className="font-medium">0°C to 40°C</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Mounting:</span>
                      <span className="font-medium">Wall, ceiling, or rack</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Certifications:</span>
                      <span className="font-medium">FCC, CE, UL</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Warranty:</span>
                      <span className="font-medium">5 years</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="hover-card">
              <CardHeader>
                <CardTitle>Core Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Manages up to 10,000 connected devices",
                    "Real-time edge computing for instant alerts",
                    "Automatic device discovery and pairing",
                    "Cloud synchronization and backup",
                    "Multi-location management support",
                    "Advanced analytics and reporting",
                    "Remote configuration and updates",
                    "Redundant failover systems"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="hover-card">
              <CardHeader>
                <CardTitle>Security Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "AES-256 encryption for all data",
                    "Secure boot and firmware validation",
                    "Network intrusion detection",
                    "Role-based access control",
                    "Automatic security updates",
                    "Audit logging and monitoring",
                    "VPN support for remote access",
                    "Compliance with SOC 2 standards"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="text-2xl">System Integration</CardTitle>
              <CardDescription>Seamless integration with your existing infrastructure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Database className="h-8 w-8 text-primary mb-3" />
                  <h4 className="font-semibold mb-2">POS Systems</h4>
                  <p className="text-sm text-muted-foreground">
                    Direct integration with major POS platforms for real-time inventory reconciliation
                  </p>
                  <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                    <li>• Square, Shopify, Lightspeed</li>
                    <li>• NCR, Oracle Retail</li>
                    <li>• Custom API integration</li>
                  </ul>
                </div>
                <div>
                  <Cloud className="h-8 w-8 text-primary mb-3" />
                  <h4 className="font-semibold mb-2">ERP Systems</h4>
                  <p className="text-sm text-muted-foreground">
                    Connect with enterprise resource planning systems for complete visibility
                  </p>
                  <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                    <li>• SAP, Oracle ERP</li>
                    <li>• Microsoft Dynamics</li>
                    <li>• NetSuite</li>
                  </ul>
                </div>
                <div>
                  <Network className="h-8 w-8 text-primary mb-3" />
                  <h4 className="font-semibold mb-2">Security Systems</h4>
                  <p className="text-sm text-muted-foreground">
                    Works alongside existing security cameras and alarm systems
                  </p>
                  <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                    <li>• IP camera integration</li>
                    <li>• Access control systems</li>
                    <li>• Alarm panel connectivity</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="text-xl">Installation & Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">1</div>
                  <h4 className="font-semibold mb-1">Plan</h4>
                  <p className="text-sm text-muted-foreground">
                    Site survey and coverage planning
                  </p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">2</div>
                  <h4 className="font-semibold mb-1">Install</h4>
                  <p className="text-sm text-muted-foreground">
                    Professional mounting and cabling
                  </p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">3</div>
                  <h4 className="font-semibold mb-1">Configure</h4>
                  <p className="text-sm text-muted-foreground">
                    Network setup and device pairing
                  </p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">4</div>
                  <h4 className="font-semibold mb-1">Train</h4>
                  <p className="text-sm text-muted-foreground">
                    Staff training and go-live support
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-primary/5 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Power Your Loss Prevention System
            </h2>
            <p className="mt-4 text-lg text-muted-foreground mb-8">
              Enterprise-grade hub for mission-critical security
            </p>
            <Button asChild size="lg">
              <Link to="/contact">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ColonyHub;
