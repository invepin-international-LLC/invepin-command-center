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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              Preventing $100B+ in Annual Retail Losses
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              <span className="block">PINPOINT PRECISION</span>
              <span className="block text-primary mt-2">INFINITE PROTECTION</span>
            </h1>
            <p className="mt-6 text-xl leading-8 text-muted-foreground max-w-3xl mx-auto">
              Invepin's Colony and Hive system provides real-time inventory protection with micro-pin technology, 
              reducing shrinkage by up to <span className="text-primary font-bold">94.7%</span> and saving retailers millions in losses.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 hover:scale-105 transition-all">
                <Link to="/demo">
                  See Live Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link to="/roi-calculator">Calculate Your Savings</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              No signup required • Instant access • Full features
            </p>
            
            {/* Trust Badges */}
            <div className="mt-12 flex items-center justify-center gap-8 flex-wrap opacity-70">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-5 w-5" />
                <span className="font-semibold">FCC Certified</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-5 w-5" />
                <span className="font-semibold">CE Certified</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-5 w-5" />
                <span className="font-semibold">ISO Certified</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-5 w-5" />
                <span className="font-semibold">AES-256 Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Loss Reduction", value: "94.7%", icon: TrendingUp },
              { label: "Detection Speed", value: "<1sec", icon: Eye },
              { label: "Client Satisfaction", value: "99.2%", icon: CheckCircle },
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

      {/* Social Proof Section */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              Trusted by Leading Retailers
            </h2>
            <p className="text-lg text-muted-foreground">
              Join 2,500+ stores already protected by Invepin technology
            </p>
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mb-12">
            {[
              {
                quote: "Invepin reduced our shrinkage by 92% in the first quarter. The ROI was immediate and the system is incredibly intuitive.",
                author: "Michael Chen",
                role: "VP of Loss Prevention",
                company: "Regional Retail Chain"
              },
              {
                quote: "Real-time alerts have transformed how we manage inventory. We catch issues before they become losses.",
                author: "Sarah Martinez",
                role: "Store Operations Manager",
                company: "Specialty Boutique"
              },
              {
                quote: "The Colony-HIVE architecture scales perfectly. We manage 47 locations from a single dashboard.",
                author: "David Kim",
                role: "Director of Security",
                company: "Enterprise Retail Group"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="hover-card bg-background">
                <CardContent className="p-6">
                  <div className="flex items-start gap-1 mb-4 text-primary">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                  <div className="border-t border-border pt-4">
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Industry Recognition */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-6 uppercase tracking-wide">Industry Certifications & Recognition</p>
            <div className="flex items-center justify-center gap-12 flex-wrap opacity-60">
              <div className="flex flex-col items-center gap-2">
                <Shield className="h-12 w-12 text-primary" />
                <span className="text-xs font-semibold">FCC Certified</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Shield className="h-12 w-12 text-primary" />
                <span className="text-xs font-semibold">CE Certified</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Shield className="h-12 w-12 text-primary" />
                <span className="text-xs font-semibold">ISO Certified</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Shield className="h-12 w-12 text-primary" />
                <span className="text-xs font-semibold">SOC 2 Compliant</span>
              </div>
            </div>
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
              See how Invepin can protect your business with a live demonstration
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