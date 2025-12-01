import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useOrganization } from '@/components/auth/OrganizationProvider';
import { 
  Building2, 
  Users, 
  MapPin, 
  CheckCircle, 
  ArrowRight, 
  Store,
  Shield,
  Smartphone
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  completed: boolean;
}

export function CustomerOnboarding({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [stepsData, setStepsData] = useState<OnboardingStep[]>([
    { id: 'welcome', title: 'Welcome', description: 'Get started with your Invepin system', icon: Shield, completed: false },
    { id: 'store_setup', title: 'Store Setup', description: 'Configure your first location', icon: Store, completed: false },
    { id: 'device_pairing', title: 'Device Pairing', description: 'Connect your first devices', icon: Smartphone, completed: false },
    { id: 'team_setup', title: 'Team Setup', description: 'Invite your team members', icon: Users, completed: false }
  ]);
  
  // Form data
  const [storeName, setStoreName] = useState('');
  const [storeLocation, setStoreLocation] = useState('');
  const [teamEmail, setTeamEmail] = useState('');
  
  const { organization, refreshOrganization } = useOrganization();
  const { toast } = useToast();

  const progress = ((stepsData.filter(s => s.completed).length) / stepsData.length) * 100;

  const markStepCompleted = async (stepId: string, data?: any) => {
    if (!organization) return;

    try {
      await supabase
        .from('onboarding_progress')
        .upsert({
          organization_id: organization.id,
          step_name: stepId,
          completed: true,
          completed_at: new Date().toISOString(),
          data: data || {}
        });

      setStepsData(prev =>
        prev.map(s => s.id === stepId ? { ...s, completed: true } : s)
      );
    } catch (error) {
      console.error('Error marking step completed:', error);
    }
  };

  const handleWelcomeNext = async () => {
    await markStepCompleted('welcome');
    setCurrentStep(1);
  };

  const handleStoreSetup = async () => {
    if (!storeName || !storeLocation) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all store details',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      await markStepCompleted('store_setup', { storeName, storeLocation });
      toast({
        title: 'Store Configured!',
        description: `${storeName} has been set up successfully`
      });
      setCurrentStep(2);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save store information',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipDevices = async () => {
    await markStepCompleted('device_pairing', { skipped: true });
    setCurrentStep(3);
  };

  const handleTeamSetup = async () => {
    setIsLoading(true);
    try {
      await markStepCompleted('team_setup', { 
        invitedEmail: teamEmail || 'skipped',
        skipped: !teamEmail 
      });
      
      // Mark onboarding as completed
      if (organization) {
        await supabase
          .from('organizations')
          .update({ 
            onboarding_completed: true,
            setup_completed_at: new Date().toISOString()
          })
          .eq('id', organization.id);
      }

      toast({
        title: 'Onboarding Complete!',
        description: 'Your Invepin system is ready to use'
      });

      await refreshOrganization();
      onComplete();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete onboarding',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const CurrentStepIcon = stepsData[currentStep]?.icon || Shield;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CurrentStepIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>{stepsData[currentStep]?.title}</CardTitle>
                <CardDescription>{stepsData[currentStep]?.description}</CardDescription>
              </div>
            </div>
            <Badge variant="outline">
              Step {currentStep + 1} of {stepsData.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 0: Welcome */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Welcome to Invepin!</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Thank you for choosing Invepin for your loss prevention needs. Let's get your system set up in just a few minutes.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {stepsData.slice(1).map((step, idx) => (
                  <Card key={step.id} className="p-4">
                    <div className="flex items-center gap-3">
                      <step.icon className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{step.title}</p>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Button onClick={handleWelcomeNext} className="w-full" size="lg">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 1: Store Setup */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store/Location Name *</Label>
                <Input
                  id="storeName"
                  placeholder="Main Street Store"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeLocation">Address/Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="storeLocation"
                    placeholder="123 Main St, City, State"
                    value={storeLocation}
                    onChange={(e) => setStoreLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> You can add additional stores and locations later from your dashboard settings.
                </p>
              </div>

              <Button 
                onClick={handleStoreSetup} 
                disabled={isLoading || !storeName || !storeLocation}
                className="w-full" 
                size="lg"
              >
                {isLoading ? 'Saving...' : 'Continue'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 2: Device Pairing */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <Smartphone className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Device Pairing</h3>
                <p className="text-muted-foreground">
                  Your Invepin hardware will arrive soon. Our installation team will handle device pairing during your on-site setup.
                </p>
              </div>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">What happens next:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                      <span>Hardware ships within 2-3 business days</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                      <span>Professional installation scheduled</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                      <span>Devices automatically paired during setup</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Button onClick={handleSkipDevices} className="w-full" size="lg">
                Continue to Team Setup <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 3: Team Setup */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <Users className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Invite Your Team</h3>
                <p className="text-muted-foreground">
                  Add team members now or skip and invite them later from your dashboard.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="teamEmail">Team Member Email (Optional)</Label>
                <Input
                  id="teamEmail"
                  type="email"
                  placeholder="teammate@yourcompany.com"
                  value={teamEmail}
                  onChange={(e) => setTeamEmail(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  You can invite multiple team members from Settings → Team Management
                </p>
              </div>

              <div className="bg-success/5 border border-success/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Almost Done!</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your Invepin system is ready. Complete setup to access your dashboard.
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleTeamSetup} 
                disabled={isLoading}
                className="w-full" 
                size="lg"
              >
                {isLoading ? 'Completing Setup...' : 'Complete Setup'}
                <CheckCircle className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
