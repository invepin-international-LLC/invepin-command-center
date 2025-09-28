import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PublicNav } from "@/components/navigation/PublicNav";
import { Check, Shield, Eye, Zap, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "$299",
      period: "per month",
      description: "Perfect for single location retailers up to 2,500 sq ft",
      features: [
        "Up to 500 micro-pins",
        "Basic theft detection",
        "Mobile app access",
        "Email alerts",
        "Standard reporting",
        "Phone support"
      ],
      maxSqFt: "2,500",
      setupFee: "$2,500",
      popular: false
    },
    {
      name: "Professional",
      price: "$799",
      period: "per month",
      description: "Ideal for medium retailers with advanced security needs",
      features: [
        "Up to 2,000 micro-pins",
        "V2 Facial recognition",
        "Real-time dashboard",
        "SMS + Email alerts",
        "Advanced analytics",
        "Priority support",
        "Custom integrations",
        "Multi-user access"
      ],
      maxSqFt: "10,000",
      setupFee: "$7,500",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "Complete solution for large retailers and multi-location operations",
      features: [
        "Unlimited micro-pins",
        "Full Colony hub system",
        "Advanced AI analytics",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 phone support",
        "On-site training",
        "SLA guarantees",
        "White-label options"
      ],
      maxSqFt: "Unlimited",
      setupFee: "Quote",
      popular: false
    }
  ];

  const addOns = [
    {
      name: "Additional Micro-Pins",
      price: "$12",
      unit: "per pin/month",
      description: "Expand coverage beyond your plan limits"
    },
    {
      name: "Facial Recognition V2",
      price: "$299",
      unit: "per month",
      description: "Add AI-powered offender identification"
    },
    {
      name: "Advanced Analytics",
      price: "$199",
      unit: "per month", 
      description: "Enhanced reporting and insights dashboard"
    },
    {
      name: "Priority Support",
      price: "$99",
      unit: "per month",
      description: "24/7 phone support and faster response times"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your retail security needs. All plans include our core loss prevention technology with no hidden fees.
          </p>
          <Badge variant="outline" className="mb-4">
            30-day free trial • No setup fees for annual plans
          </Badge>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  {plan.popular && <Star className="h-5 w-5 text-primary" />}
                </div>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Store Size</span>
                    <span className="font-semibold">Up to {plan.maxSqFt} sq ft</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Setup Fee</span>
                    <span className="font-semibold">{plan.setupFee}</span>
                  </div>
                </div>
                
                <Separator />
                
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-success mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                  asChild
                >
                  <Link to={plan.name === "Enterprise" ? "/contact" : "/demo"}>
                    {plan.name === "Enterprise" ? "Contact Sales" : "Start Free Trial"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add-ons */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Add-On Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addOns.map((addon, index) => (
              <Card key={index} className="hover-card">
                <CardHeader>
                  <CardTitle className="text-lg">{addon.name}</CardTitle>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-primary">{addon.price}</span>
                    <span className="text-sm text-muted-foreground ml-1">{addon.unit}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{addon.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Comparison */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">What's Included</h2>
          <Card>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Hardware Included</h3>
                  <p className="text-muted-foreground">
                    All micro-pins, Colony hubs, and necessary hardware included in monthly pricing
                  </p>
                </div>
                <div className="text-center">
                  <Eye className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">24/7 Monitoring</h3>
                  <p className="text-muted-foreground">
                    Continuous monitoring with real-time alerts and instant notifications
                  </p>
                </div>
                <div className="text-center">
                  <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Regular Updates</h3>
                  <p className="text-muted-foreground">
                    Automatic software updates and new feature rollouts at no extra cost
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "Is there a long-term contract?",
                answer: "No, all plans are month-to-month. Annual plans receive setup fee waiver and 10% discount."
              },
              {
                question: "What happens if I exceed my pin limit?",
                answer: "Additional pins are automatically billed at $12/pin/month. You can upgrade your plan anytime."
              },
              {
                question: "Is installation included?",
                answer: "Yes, professional installation and setup is included with all plans."
              },
              {
                question: "Can I try before committing?",
                answer: "Absolutely! We offer a 30-day free trial with full access to all features."
              }
            ].map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground text-sm">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Stop Theft Today?</h3>
            <p className="text-muted-foreground mb-6">
              Start your free trial and see immediate results with Invepin's loss prevention system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/demo">
                  Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact">Talk to Sales</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Pricing;