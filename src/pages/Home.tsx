import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, TrendingUp, Eye, Users, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { PublicNav } from "@/components/navigation/PublicNav";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      
      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 pt-24 pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Stop Retail Theft with{" "}
              <span className="text-primary">Smart IoT</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
              Invepin's Colony and Hive system provides real-time inventory protection with micro-pin technology, 
              reducing shrinkage by up to 78% and saving retailers millions in losses.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 hover:scale-105 transition-all">
                <Link to="/dashboard?autoLogin=company">
                  Try Demo Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link to="/roi-calculator">Calculate ROI</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              No signup required • Instant access • Full features
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Shrinkage Reduction", value: "78%", icon: TrendingUp },
              { label: "Real-time Alerts", value: "<1sec", icon: Eye },
              { label: "Client Satisfaction", value: "99%", icon: CheckCircle },
              { label: "Stores Protected", value: "2,500+", icon: Shield }
            ].map((stat, index) => (
              <Card key={index} className="text-center hover-card">
                <CardContent className="p-6">
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Complete Loss Prevention Solution
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From micro-pins to facial recognition, protect your inventory with cutting-edge technology
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "V1 Micro-Pins",
                description: "Invisible protection for high-value items with real-time movement detection",
                features: ["Sub-millimeter tracking", "6-month battery life", "Instant alerts"]
              },
              {
                title: "V2 Facial Recognition", 
                description: "Advanced AI-powered identification system for known offenders",
                features: ["99.7% accuracy", "Privacy compliant", "Real-time matching"]
              },
              {
                title: "Colony Hub System",
                description: "Central command center managing up to 10,000 devices per location",
                features: ["Cloud connectivity", "Analytics dashboard", "Multi-store management"]
              }
            ].map((feature, index) => (
              <Card key={index} className="hover-card">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-success mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Ready to Eliminate Retail Theft?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground mb-8">
              Join 2,500+ stores already protected by Invepin technology
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link to="/dashboard?autoLogin=company">
                  Try Demo Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link to="/contact">Schedule Consultation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;