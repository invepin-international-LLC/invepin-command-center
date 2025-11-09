import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, ArrowRight, Building2, Users, MapPin, Briefcase } from "lucide-react";

interface CompanyRegistrationProps {
  onComplete: () => void;
  onBack: () => void;
}

export const CompanyRegistration = ({ onComplete, onBack }: CompanyRegistrationProps) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Step 1: Company Info
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [location, setLocation] = useState("");

  // Step 2: Employee Info
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [phone, setPhone] = useState("");

  const industries = [
    "Restaurant & Bar",
    "Retail",
    "Healthcare",
    "Manufacturing",
    "Logistics & Warehousing",
    "Hospitality",
    "Other"
  ];

  const companySizes = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "500+ employees"
  ];

  const handleStep1Next = () => {
    if (!companyName || !industry || !companySize || !location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all company details",
        variant: "destructive"
      });
      return;
    }
    setStep(2);
  };

  const handleRegistration = async () => {
    if (!fullName || !email || !password || !employeeId || !department || !position) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required employee details",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // First, check if organization exists by company code or create new one
      const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      // Generate company code
      const { data: codeData, error: codeError } = await supabase.rpc('generate_company_code', {
        company_name: companyName
      });

      if (codeError) throw codeError;
      const companyCode = codeData;

      // Create organization
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: companyName,
          slug,
          industry,
          company_size: companySize,
          location,
          company_code: companyCode,
          is_active: true
        })
        .select()
        .single();

      if (orgError) throw orgError;

      // Sign up the user with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            organization_id: orgData.id,
            employee_id: employeeId,
            department,
            position,
            phone,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (authError) throw authError;

      if (!authData.user) throw new Error("User creation failed");

      // Create pending approval
      await supabase.from('pending_approvals').insert({
        user_id: authData.user.id,
        organization_id: orgData.id,
        employee_id: employeeId,
        department,
        position,
        full_name: fullName,
        email,
        phone,
        status: 'pending'
      });

      // Send welcome email via edge function
      await supabase.functions.invoke('send-welcome-email', {
        body: {
          email,
          fullName,
          companyName,
          companyCode,
          employeeId
        }
      });

      toast({
        title: "Registration Submitted!",
        description: `Welcome to ${companyName}! Your registration is pending manager approval. You'll receive an email with your company access code.`,
      });

      onComplete();
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Unable to complete registration",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gradient-card border-border shadow-elevated">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            {step === 1 ? (
              <Building2 className="h-6 w-6 text-primary" />
            ) : (
              <Users className="h-6 w-6 text-primary" />
            )}
            <CardTitle>
              {step === 1 ? "Company Registration" : "Employee Information"}
            </CardTitle>
          </div>
          <CardDescription>
            {step === 1 
              ? "Tell us about your company to get started"
              : "Your employment details for verification"}
          </CardDescription>
          <div className="flex gap-2 mt-4">
            <div className={`h-1 flex-1 rounded ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`h-1 flex-1 rounded ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {step === 1 ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  placeholder="Acme Corporation"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((ind) => (
                      <SelectItem key={ind} value={ind}>
                        {ind}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companySize">Company Size *</Label>
                <Select value={companySize} onValueChange={setCompanySize}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="City, State/Country"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="bg-background/50 pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={onBack} className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
                <Button onClick={handleStep1Next} className="flex-1">
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Work Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID *</Label>
                  <Input
                    id="employeeId"
                    placeholder="EMP-001"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="department"
                      placeholder="Sales, IT, Operations..."
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="bg-background/50 pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    placeholder="Manager, Staff, etc."
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={handleRegistration} 
                  disabled={isLoading}
                  className="flex-1 bg-gradient-primary"
                >
                  {isLoading ? "Submitting..." : "Complete Registration"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
