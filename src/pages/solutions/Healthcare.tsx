import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Pill, Thermometer, Lock, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PublicNav } from "@/components/navigation/PublicNav";

const Healthcare = () => {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      
      <section className="relative px-6 lg:px-8 pt-24 pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Healthcare Security
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
              HIPAA-compliant pharmaceutical tracking and controlled substance monitoring
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg">
                <Link to="/demo">
                  Schedule Healthcare Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link to="/contact">Contact Specialist</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
            {[
              {
                icon: Pill,
                title: "Drug Tracking",
                description: "Monitor controlled substances from storage to patient administration"
              },
              {
                icon: Thermometer,
                title: "Cold Chain Monitoring",
                description: "Real-time temperature tracking for sensitive medications"
              },
              {
                icon: Lock,
                title: "Compliance Automation",
                description: "Automated DEA and state regulatory reporting"
              }
            ].map((feature, index) => (
              <Card key={index} className="hover-card">
                <CardHeader>
                  <feature.icon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="text-2xl">Healthcare-Specific Features</CardTitle>
              <CardDescription>Purpose-built for medical environments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "HIPAA-compliant data encryption",
                  "Controlled substance vault monitoring",
                  "Automated DEA 222 form generation",
                  "Cold storage temperature alerts",
                  "Expiration date tracking and alerts",
                  "Chain of custody documentation",
                  "Integration with pharmacy systems",
                  "Audit trail for regulatory compliance",
                  "Patient safety incident reporting",
                  "Medical device asset tracking",
                  "Emergency medication cabinet monitoring",
                  "Automated inventory reconciliation"
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="hover-card">
              <CardHeader>
                <CardTitle className="text-xl">Pharmaceutical Monitoring</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Track every medication from receipt to administration with complete audit trails
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-1" />
                    <span>Automated perpetual inventory</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-1" />
                    <span>Controlled substance diversion detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-1" />
                    <span>Real-time discrepancy alerts</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover-card">
              <CardHeader>
                <CardTitle className="text-xl">Cold Chain Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Maintain temperature-sensitive medications with continuous monitoring
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-1" />
                    <span>24/7 temperature monitoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-1" />
                    <span>Instant out-of-range alerts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-1" />
                    <span>Automated compliance documentation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="text-xl">Regulatory Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Invepin Command Center meets all federal and state requirements for pharmaceutical security:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-background rounded-lg">
                  <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="font-semibold">HIPAA</div>
                </div>
                <div className="text-center p-4 bg-background rounded-lg">
                  <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="font-semibold">DEA</div>
                </div>
                <div className="text-center p-4 bg-background rounded-lg">
                  <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="font-semibold">FDA</div>
                </div>
                <div className="text-center p-4 bg-background rounded-lg">
                  <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="font-semibold">JCAHO</div>
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
              Secure Your Healthcare Facility
            </h2>
            <p className="mt-4 text-lg text-muted-foreground mb-8">
              Trusted by hospitals and pharmacies nationwide
            </p>
            <Button asChild size="lg">
              <Link to="/contact">Request Healthcare Consultation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Healthcare;
