import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, DollarSign, Clock, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PublicNav } from "@/components/navigation/PublicNav";

const CaseStudies = () => {
  const caseStudies = [
    {
      company: "National Electronics Retailer",
      industry: "Retail",
      size: "240 stores",
      challenge: "Facing $12M annual losses from organized retail crime targeting high-value electronics",
      solution: "Deployed V1 Micro-Pins on all items over $500 with Colony Hub integration",
      results: [
        { label: "Shrinkage Reduction", value: "82%" },
        { label: "Annual Savings", value: "$9.8M" },
        { label: "ROI Period", value: "4 months" },
        { label: "False Alarms", value: "0.01%" }
      ],
      quote: "Invepin Command Center paid for itself in four months. Our shrinkage has dropped from 3.2% to 0.6%, saving us nearly $10M annually.",
      author: "VP of Loss Prevention"
    },
    {
      company: "Luxury Department Store Chain",
      industry: "Retail",
      size: "45 locations",
      challenge: "High-end merchandise theft and known repeat offenders targeting designer goods",
      solution: "V1 Micro-Pins + V2 Facial Recognition system with integrated alert management",
      results: [
        { label: "Theft Prevention", value: "91%" },
        { label: "Repeat Offender ID", value: "98%" },
        { label: "Response Time", value: "<30s" },
        { label: "Customer Impact", value: "Zero" }
      ],
      quote: "The facial recognition system identifies known shoplifters before they even reach our displays. It's been a game-changer.",
      author: "Director of Security"
    },
    {
      company: "Regional Casino Resort",
      industry: "Gaming",
      size: "1 large property",
      challenge: "Chip theft and unauthorized individuals on self-exclusion list entering premises",
      solution: "Complete Invepin system with 64-camera facial recognition and chip tracking",
      results: [
        { label: "Chip Loss Reduction", value: "95%" },
        { label: "List Match Rate", value: "99.7%" },
        { label: "Annual Savings", value: "$4.2M" },
        { label: "Regulatory Compliance", value: "100%" }
      ],
      quote: "We've virtually eliminated chip theft and can immediately identify self-excluded players. The compliance reporting alone saves us countless hours.",
      author: "Chief Security Officer"
    },
    {
      company: "Hospital Pharmacy Network",
      industry: "Healthcare",
      size: "12 facilities",
      challenge: "Controlled substance tracking compliance and cold chain monitoring",
      solution: "HIPAA-compliant tracking with temperature monitoring and automated DEA reporting",
      results: [
        { label: "Compliance Score", value: "100%" },
        { label: "Audit Time Saved", value: "85%" },
        { label: "Diversion Events", value: "-94%" },
        { label: "Temperature Violations", value: "Zero" }
      ],
      quote: "DEA audits that used to take weeks now take hours. The system has paid for itself in reduced audit costs alone.",
      author: "Pharmacy Director"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      
      <section className="relative px-6 lg:px-8 pt-24 pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Customer Success Stories
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
              Real results from real businesses using Invepin Command Center
            </p>
          </div>

          <div className="space-y-12">
            {caseStudies.map((study, index) => (
              <Card key={index} className="hover-card">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <CardTitle className="text-2xl mb-2">{study.company}</CardTitle>
                      <CardDescription className="text-base">
                        <Badge variant="outline" className="mr-2">{study.industry}</Badge>
                        <span className="text-muted-foreground">{study.size}</span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        <TrendingDown className="h-5 w-5 text-destructive" />
                        Challenge
                      </h4>
                      <p className="text-muted-foreground">{study.challenge}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Solution
                      </h4>
                      <p className="text-muted-foreground">{study.solution}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {study.results.map((result, idx) => (
                      <div key={idx} className="text-center p-4 bg-primary/5 rounded-lg">
                        <div className="text-3xl font-bold text-primary mb-1">{result.value}</div>
                        <div className="text-sm text-muted-foreground">{result.label}</div>
                      </div>
                    ))}
                  </div>

                  <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                    "{study.quote}"
                    <footer className="mt-2 text-sm font-semibold text-foreground">
                      — {study.author}, {study.company}
                    </footer>
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-16 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-2xl">Average Results Across All Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { icon: TrendingDown, label: "Shrinkage Reduction", value: "78%" },
                  { icon: DollarSign, label: "Average Annual Savings", value: "$2.4M" },
                  { icon: Clock, label: "Average ROI Period", value: "5 months" },
                  { icon: Users, label: "Customer Satisfaction", value: "99%" }
                ].map((metric, index) => (
                  <div key={index} className="text-center">
                    <metric.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                    <div className="text-4xl font-bold text-foreground mb-2">{metric.value}</div>
                    <div className="text-sm text-muted-foreground">{metric.label}</div>
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
              Ready to See Similar Results?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground mb-8">
              Join 2,500+ businesses protecting their inventory with Invepin
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/contact">
                  Schedule Consultation <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link to="/roi-calculator">Calculate Your Savings</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudies;
