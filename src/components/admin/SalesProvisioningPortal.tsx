import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Building2, Mail, CreditCard, Calendar, CheckCircle } from 'lucide-react';

export function SalesProvisioningPortal() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Form state
  const [companyCode, setCompanyCode] = useState('');
  const [subscriptionTier, setSubscriptionTier] = useState<'starter' | 'professional' | 'enterprise'>('professional');
  const [salesEmail, setSalesEmail] = useState('');
  const [notes, setNotes] = useState('');

  const handleProvisionCustomer = async () => {
    if (!companyCode) {
      toast({
        title: 'Missing Information',
        description: 'Please enter the company code',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      // Find the organization by company code
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('company_code', companyCode.toUpperCase())
        .single();

      if (orgError || !org) {
        toast({
          title: 'Company Not Found',
          description: `No organization found with code: ${companyCode}`,
          variant: 'destructive'
        });
        return;
      }

      // Update organization to paying customer status
      const { error: updateError } = await supabase
        .from('organizations')
        .update({
          customer_status: 'active',
          subscription_tier: subscriptionTier,
          purchased_at: new Date().toISOString(),
          settings: {
            ...(typeof org.settings === 'object' && org.settings ? org.settings : {}),
            sales_contact: salesEmail,
            provisioning_notes: notes
          }
        })
        .eq('id', org.id);

      if (updateError) throw updateError;

      toast({
        title: 'Customer Provisioned!',
        description: `${org.name} is now an active ${subscriptionTier} customer`,
      });

      // Clear form
      setCompanyCode('');
      setSalesEmail('');
      setNotes('');

    } catch (error: any) {
      console.error('Provisioning error:', error);
      toast({
        title: 'Provisioning Failed',
        description: error.message || 'Unable to provision customer',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Sales Provisioning Portal</h1>
        <p className="text-muted-foreground">
          Convert registered organizations into paying customers
        </p>
      </div>

      <div className="grid gap-6">
        {/* Provisioning Form */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <CardTitle>Provision New Customer</CardTitle>
            </div>
            <CardDescription>
              Enter details for a customer who has completed the purchase process
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyCode">Company Code *</Label>
              <Input
                id="companyCode"
                placeholder="ABC1234"
                value={companyCode}
                onChange={(e) => setCompanyCode(e.target.value.toUpperCase())}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                The unique code assigned during company registration
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tier">Subscription Tier *</Label>
              <Select value={subscriptionTier} onValueChange={(v: any) => setSubscriptionTier(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Starter</Badge>
                      <span className="text-sm text-muted-foreground">$299/mo</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="professional">
                    <div className="flex items-center gap-2">
                      <Badge>Professional</Badge>
                      <span className="text-sm text-muted-foreground">$799/mo</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="enterprise">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Enterprise</Badge>
                      <span className="text-sm text-muted-foreground">Custom</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salesEmail">Sales Contact Email</Label>
              <Input
                id="salesEmail"
                type="email"
                placeholder="sales@invepin.com"
                value={salesEmail}
                onChange={(e) => setSalesEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                placeholder="Contract details, special terms, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleProvisionCustomer} 
              disabled={isLoading || !companyCode}
              className="w-full"
              size="lg"
            >
              {isLoading ? 'Provisioning...' : 'Provision Customer'}
              <CheckCircle className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Provisioning Process
            </h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="font-semibold">1.</span>
                <span>Customer registers their company in the app (creates demo account)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold">2.</span>
                <span>Sales team closes the deal via phone/email (outside the app)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold">3.</span>
                <span>Customer receives company code from registration email</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold">4.</span>
                <span>Sales team enters company code here to activate subscription</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold">5.</span>
                <span>Customer's app immediately updates to show full features</span>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Quick Reference */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Contact Information</h4>
                <p className="text-sm text-muted-foreground">
                  All sales inquiries: <a href="mailto:support@invepin.com" className="text-primary hover:underline">support@invepin.com</a> • 
                  Phone: <a href="tel:+13023435004" className="text-primary hover:underline">302-343-5004</a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
