import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, BarChart3, Shield, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PublicNav } from "@/components/navigation/PublicNav";
import { EnterpriseConsultationForm } from "@/components/communication/EnterpriseConsultationForm";

const Enterprise = () => {
  const [consultationOpen, setConsultationOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      
      <section className="relative px-6 lg:px-8 pt-24 pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Multi-Store Management
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
              Centralized loss prevention across all your locations with unified analytics and control
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" onClick={() => setConsultationOpen(true)}>
                Request Enterprise Demo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => setConsultationOpen(true)}>
                Talk to Sales
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
            {[
              {
                icon: Building,
                title: "Unlimited Locations",
                description: "Manage thousands of stores from a single dashboard"
              },
              {
                icon: Users,
                title: "Role-Based Access",
                description: "Granular permissions for different team levels"
              },
              {
                icon: BarChart3,
                title: "Unified Analytics",
                description: "Cross-location insights and comparative reporting"
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "SOC 2 compliant with advanced encryption"
              }
            ].map((feature, index) => (
              <Card key={index} className="hover-card">
                <CardHeader>
                  <feature.icon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="text-2xl">Enterprise Features</CardTitle>
              <CardDescription>Built for scale, designed for performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "Centralized multi-location dashboard",
                  "Custom reporting and data exports",
                  "API access for system integration",
                  "Dedicated account manager",
                  "Priority 24/7 support",
                  "Custom SLA agreements",
                  "On-premise deployment options",
                  "White-label capabilities",
                  "Advanced user role management",
                  "Automated compliance reporting",
                  "Custom training programs",
                  "Integration with enterprise ERP/POS"
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover-card">
              <CardHeader>
                <CardTitle>Deployment</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Phased rollout planning</li>
                  <li>• On-site installation support</li>
                  <li>• Custom integration services</li>
                  <li>• Change management assistance</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="hover-card">
              <CardHeader>
                <CardTitle>Training</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Executive leadership briefings</li>
                  <li>• Store manager certification</li>
                  <li>• Security team workshops</li>
                  <li>• Ongoing education programs</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="hover-card">
              <CardHeader>
                <CardTitle>Support</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Dedicated success manager</li>
                  <li>• Priority ticket resolution</li>
                  <li>• Quarterly business reviews</li>
                  <li>• Custom SLA options</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-primary/5 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Scale Loss Prevention Across Your Enterprise
            </h2>
            <p className="mt-4 text-lg text-muted-foreground mb-8">
              Trusted by Fortune 500 retailers worldwide
            </p>
            <Button size="lg" onClick={() => setConsultationOpen(true)}>
              Contact Enterprise Sales
            </Button>
          </div>
        </div>
      </section>

      <EnterpriseConsultationForm open={consultationOpen} onOpenChange={setConsultationOpen} />
    </div>
  );
};

export default Enterprise;
