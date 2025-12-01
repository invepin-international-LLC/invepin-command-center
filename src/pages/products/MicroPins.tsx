import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Battery, Wifi, Shield, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PublicNav } from "@/components/navigation/PublicNav";

const MicroPins = () => {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      
      <section className="relative px-6 lg:px-8 pt-24 pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge className="mb-4">V1 Technology</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Micro-Pin Tracking System
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
              Invisible protection for high-value merchandise with sub-millimeter precision tracking
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg">
                <Link to="/demo">
                  Try Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link to="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                icon: Zap,
                title: "Sub-Second Response",
                value: "<1s",
                description: "Instant alerts when items are moved"
              },
              {
                icon: Battery,
                title: "Battery Life",
                value: "6 months",
                description: "Maintenance-free operation"
              },
              {
                icon: Wifi,
                title: "Range",
                value: "150ft",
                description: "Wide coverage area per hub"
              },
              {
                icon: Shield,
                title: "Accuracy",
                value: "99.8%",
                description: "Near-perfect detection rate"
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
              <CardTitle className="text-2xl">Technical Specifications</CardTitle>
              <CardDescription>Enterprise-grade hardware designed for retail environments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Device Specs</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Dimensions:</span>
                      <span className="font-medium">3mm × 1.5mm × 0.8mm</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Weight:</span>
                      <span className="font-medium">0.02g</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Power:</span>
                      <span className="font-medium">Micro battery (6mo life)</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Connectivity:</span>
                      <span className="font-medium">BLE 5.2</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Detection Range:</span>
                      <span className="font-medium">Up to 150ft (45m)</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-4">Environmental</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Operating Temp:</span>
                      <span className="font-medium">-10°C to 60°C</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Humidity:</span>
                      <span className="font-medium">5% to 95% RH</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Water Resistance:</span>
                      <span className="font-medium">IP67 rated</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Certifications:</span>
                      <span className="font-medium">FCC, CE, RoHS</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Durability:</span>
                      <span className="font-medium">5-year lifespan</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="hover-card">
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Sub-millimeter precision tracking",
                    "Motion and vibration detection",
                    "Tamper-resistant design",
                    "Low-energy Bluetooth connectivity",
                    "Automatic sleep/wake modes",
                    "Multi-point triangulation",
                    "Secure encrypted communication",
                    "Over-the-air firmware updates"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="hover-card">
              <CardHeader>
                <CardTitle>Ideal Use Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "High-value electronics and appliances",
                    "Designer clothing and accessories",
                    "Jewelry and luxury watches",
                    "Premium cosmetics and fragrances",
                    "Sporting goods and equipment",
                    "Power tools and hardware",
                    "Wine and spirits bottles",
                    "Pharmaceutical products"
                  ].map((useCase, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{useCase}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="text-xl">Installation & Deployment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">1. Tag Items</h4>
                  <p className="text-sm text-muted-foreground">
                    Attach micro-pins to merchandise using adhesive backing or integrated holes
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">2. Pair Devices</h4>
                  <p className="text-sm text-muted-foreground">
                    Automatic discovery and registration with Colony Hub system
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">3. Monitor</h4>
                  <p className="text-sm text-muted-foreground">
                    Real-time tracking begins immediately with instant alert configuration
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
              Protect Your High-Value Inventory
            </h2>
            <p className="mt-4 text-lg text-muted-foreground mb-8">
              Join 2,500+ stores using Micro-Pin technology
            </p>
            <Button asChild size="lg">
              <Link to="/contact">Request Quote</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MicroPins;
