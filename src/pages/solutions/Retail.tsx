import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, TrendingDown, Eye, Zap, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PublicNav } from "@/components/navigation/PublicNav";

const Retail = () => {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      
      <section className="relative px-6 lg:px-8 pt-24 pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Retail Loss Prevention
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
              Eliminate retail shrinkage with real-time IoT monitoring and AI-powered theft detection
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg">
                <Link to="/demo">
                  Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link to="/roi-calculator">Calculate Savings</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
            {[
              {
                icon: TrendingDown,
                title: "78% Shrinkage Reduction",
                description: "Proven results across 2,500+ retail locations with real-time monitoring"
              },
              {
                icon: Eye,
                title: "Sub-Second Alerts",
                description: "Instant notifications when high-value items are moved or tampered with"
              },
              {
                icon: Zap,
                title: "Zero False Positives",
                description: "AI-powered detection eliminates false alarms and alert fatigue"
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
              <CardTitle className="text-2xl">How It Works</CardTitle>
              <CardDescription>Simple 3-step deployment for maximum protection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    step: "1",
                    title: "Deploy V1 Micro-Pins",
                    description: "Attach invisible micro-pins to high-value merchandise with 6-month battery life"
                  },
                  {
                    step: "2",
                    title: "Install Colony Hub",
                    description: "Central hub manages up to 10,000 devices with cloud connectivity"
                  },
                  {
                    step: "3",
                    title: "Monitor & Prevent",
                    description: "Real-time dashboard shows all activity with instant theft alerts"
                  }
                ].map((item) => (
                  <div key={item.step} className="relative">
                    <div className="text-6xl font-bold text-primary/20 mb-4">{item.step}</div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "Real-time movement detection on tagged items",
                  "Facial recognition for known offenders",
                  "Integration with existing POS systems",
                  "Multi-store management dashboard",
                  "Automated inventory reconciliation",
                  "Loss prevention analytics and reporting",
                  "Mobile app for security staff",
                  "24/7 cloud monitoring and support"
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-primary/5 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Ready to Stop Retail Theft?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground mb-8">
              Join leading retailers in eliminating shrinkage
            </p>
            <Button asChild size="lg">
              <Link to="/contact">Schedule Consultation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Retail;
