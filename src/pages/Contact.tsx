import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PublicNav } from "@/components/navigation/PublicNav";
import { Phone, Mail, MapPin, Clock, Shield, Users, Building } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    storeSize: "",
    currentSecurity: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll contact you within 24 hours to schedule your consultation.",
    });
    // Reset form
    setFormData({
      name: "",
      email: "",
      company: "",
      phone: "",
      storeSize: "",
      currentSecurity: "",
      message: ""
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Get Started with Invepin
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Ready to eliminate retail theft? Schedule a consultation with our loss prevention experts 
            and get a customized security solution for your store.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Schedule Your Consultation</CardTitle>
                <CardDescription>
                  Tell us about your store and security needs. Our experts will design a custom solution for you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="John Smith"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="john@retailstore.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        placeholder="Retail Store Inc."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="storeSize">Store Size</Label>
                      <Select value={formData.storeSize} onValueChange={(value) => setFormData({...formData, storeSize: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select store size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Under 2,500 sq ft</SelectItem>
                          <SelectItem value="medium">2,500 - 10,000 sq ft</SelectItem>
                          <SelectItem value="large">10,000 - 25,000 sq ft</SelectItem>
                          <SelectItem value="enterprise">25,000+ sq ft</SelectItem>
                          <SelectItem value="multiple">Multiple locations</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentSecurity">Current Security</Label>
                      <Select value={formData.currentSecurity} onValueChange={(value) => setFormData({...formData, currentSecurity: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Current security setup" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No security system</SelectItem>
                          <SelectItem value="cameras">Cameras only</SelectItem>
                          <SelectItem value="tags">Security tags/EAS</SelectItem>
                          <SelectItem value="guards">Security guards</SelectItem>
                          <SelectItem value="comprehensive">Comprehensive system</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Additional Information</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Tell us about your specific security challenges, budget considerations, or timeline..."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Schedule Free Consultation
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info & Benefits */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">(555) INVEPIN</div>
                    <div className="text-sm text-muted-foreground">Sales & Support</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">sales@invepin.com</div>
                    <div className="text-sm text-muted-foreground">Email us anytime</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">San Francisco, CA</div>
                    <div className="text-sm text-muted-foreground">Headquarters</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">24/7 Support</div>
                    <div className="text-sm text-muted-foreground">Always available</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What to Expect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">Security Assessment</div>
                    <div className="text-sm text-muted-foreground">
                      Free evaluation of your current setup and vulnerabilities
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Building className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">Custom Solution Design</div>
                    <div className="text-sm text-muted-foreground">
                      Tailored protection plan for your specific needs
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">ROI Projection</div>
                    <div className="text-sm text-muted-foreground">
                      Detailed analysis of savings and payback timeline
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold mb-2">Prefer to Talk Now?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our security experts are standing by to help you immediately.
                </p>
                <Button variant="outline" className="w-full">
                  Call (555) INVEPIN
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enterprise Section */}
        <div className="mt-16 text-center">
          <Card className="bg-card/50 border-dashed">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Enterprise & Multi-Location?</h3>
              <p className="text-muted-foreground mb-6">
                Large retailers and chains get dedicated account management, custom integrations, 
                and volume pricing. Let's discuss your specific requirements.
              </p>
              <Button size="lg" variant="outline">
                Schedule Enterprise Consultation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;