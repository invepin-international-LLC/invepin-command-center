import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Shield, Zap, Lock, CheckCircle, ArrowRight, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { PublicNav } from "@/components/navigation/PublicNav";

const FacialRecognition = () => {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      
      <section className="relative px-6 lg:px-8 pt-24 pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge className="mb-4">V2 Technology</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              AI Facial Recognition
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
              Advanced AI-powered identification system for known offenders with privacy-first design
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg">
                <Link to="/demo">
                  See Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link to="/contact">Schedule Consultation</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                icon: Eye,
                title: "Accuracy",
                value: "99.7%",
                description: "Industry-leading recognition rate"
              },
              {
                icon: Zap,
                title: "Speed",
                value: "0.3s",
                description: "Real-time identification"
              },
              {
                icon: Shield,
                title: "Privacy",
                value: "GDPR",
                description: "Fully compliant system"
              },
              {
                icon: Lock,
                title: "Security",
                value: "AES-256",
                description: "Encrypted data storage"
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

          <Card className="mb-16 border-warning/50 bg-warning/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <CardTitle className="text-xl">Privacy-First Design</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Invepin's facial recognition technology is designed with privacy as a core principle:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Only identifies individuals on your private watchlist",
                  "Does not track or identify regular customers",
                  "All biometric data is encrypted and stored locally",
                  "Fully compliant with GDPR, CCPA, and BIPA regulations",
                  "Automatic data deletion after configurable period",
                  "Complete audit trail of all system access"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="hover-card">
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">1. Camera Integration</h4>
                  <p className="text-sm text-muted-foreground">
                    Works with your existing security camera infrastructure - no special cameras required
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">2. Watchlist Management</h4>
                  <p className="text-sm text-muted-foreground">
                    Add known offenders to your private, encrypted watchlist with photos and incident history
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">3. Real-Time Alerts</h4>
                  <p className="text-sm text-muted-foreground">
                    Instant notifications to security staff when a watchlisted individual is detected
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">4. Evidence Collection</h4>
                  <p className="text-sm text-muted-foreground">
                    Automatically captures timestamped video evidence for incident documentation
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-card">
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Multi-camera support (up to 64 cameras)",
                    "Works in varying lighting conditions",
                    "Handles partial face occlusion",
                    "Age progression compensation",
                    "Multi-angle recognition",
                    "Configurable confidence thresholds",
                    "Integration with POS systems",
                    "Mobile app alerts for managers"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="text-2xl">Use Cases</CardTitle>
              <CardDescription>Protect your business from repeat offenders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Retail Theft Prevention</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Identify known shoplifters at entry</li>
                    <li>• Alert security staff in real-time</li>
                    <li>• Track repeat offender patterns</li>
                    <li>• Reduce organized retail crime</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Casino Security</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Detect banned players at entry</li>
                    <li>• Identify card counters</li>
                    <li>• Monitor self-excluded individuals</li>
                    <li>• Prevent organized fraud</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Healthcare Protection</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Identify individuals with past drug-seeking behavior</li>
                    <li>• Alert staff to potential threats</li>
                    <li>• Protect against prescription fraud</li>
                    <li>• Enhance patient and staff safety</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="text-xl">Compliance & Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { name: "GDPR", desc: "EU Compliance" },
                  { name: "CCPA", desc: "California Privacy" },
                  { name: "BIPA", desc: "Biometric Privacy" },
                  { name: "SOC 2", desc: "Security Standards" }
                ].map((cert, index) => (
                  <div key={index} className="text-center p-4 bg-background rounded-lg">
                    <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="font-semibold">{cert.name}</div>
                    <div className="text-xs text-muted-foreground">{cert.desc}</div>
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
              Stop Repeat Offenders
            </h2>
            <p className="mt-4 text-lg text-muted-foreground mb-8">
              Privacy-compliant facial recognition for loss prevention
            </p>
            <Button asChild size="lg">
              <Link to="/contact">Request Demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FacialRecognition;
