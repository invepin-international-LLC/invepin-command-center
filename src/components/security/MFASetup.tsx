import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Shield, Phone, Lock, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UserSecurity {
  mfa_enabled: boolean;
  mfa_phone_verified: boolean;
  mfa_phone: string | null;
  password_expires_at: string;
  password_last_changed: string;
  failed_login_attempts: number;
  account_locked_until: string | null;
}

export function MFASetup() {
  const [security, setSecurity] = useState<UserSecurity | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSecuritySettings();
  }, []);

  const loadSecuritySettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_security')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setSecurity(data);
        if (data.mfa_phone) {
          setPhoneNumber(data.mfa_phone);
        }
      }
    } catch (error: any) {
      console.error('Error loading security settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const enrollMFA = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: 'Invalid Phone',
        description: 'Please enter a valid phone number',
        variant: 'destructive',
      });
      return;
    }

    setIsEnrolling(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Enroll phone for MFA
      const { error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: 'phone',
        phone: phoneNumber,
      });

      if (enrollError) throw enrollError;

      // Update user_security table
      const { error: updateError } = await supabase
        .from('user_security')
        .update({ 
          mfa_phone: phoneNumber,
          mfa_enabled: true 
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setIsVerifying(true);
      toast({
        title: 'Verification Code Sent',
        description: 'Please check your phone for the verification code',
      });
    } catch (error: any) {
      toast({
        title: 'Enrollment Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  const verifyMFA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: 'Invalid Code',
        description: 'Please enter a valid 6-digit code',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get the factor ID (would need to be stored during enrollment)
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const phoneFactor = factors?.all.find(f => f.factor_type === 'phone');

      if (!phoneFactor) throw new Error('No phone factor found');

      // Verify the code
      const { error: verifyError } = await supabase.auth.mfa.challenge({
        factorId: phoneFactor.id,
      });

      if (verifyError) throw verifyError;

      // Update verification status
      const { error: updateError } = await supabase
        .from('user_security')
        .update({ 
          mfa_phone_verified: true,
          last_mfa_verification: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      toast({
        title: 'MFA Enabled',
        description: 'Two-factor authentication is now active',
      });

      setIsVerifying(false);
      loadSecuritySettings();
    } catch (error: any) {
      toast({
        title: 'Verification Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const disableMFA = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: factors } = await supabase.auth.mfa.listFactors();
      const phoneFactor = factors?.all.find(f => f.factor_type === 'phone');

      if (phoneFactor) {
        await supabase.auth.mfa.unenroll({ factorId: phoneFactor.id });
      }

      const { error } = await supabase
        .from('user_security')
        .update({ 
          mfa_enabled: false,
          mfa_phone_verified: false,
          mfa_phone: null
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'MFA Disabled',
        description: 'Two-factor authentication has been disabled',
      });

      setPhoneNumber('');
      loadSecuritySettings();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getDaysUntilExpiry = () => {
    if (!security?.password_expires_at) return null;
    const expiryDate = new Date(security.password_expires_at);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return <div>Loading security settings...</div>;
  }

  const daysUntilExpiry = getDaysUntilExpiry();
  const isPasswordExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry < 14;
  const isPasswordExpired = daysUntilExpiry !== null && daysUntilExpiry < 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Multi-Factor Authentication
              </CardTitle>
              <CardDescription>
                Add an extra layer of security with phone verification
              </CardDescription>
            </div>
            {security?.mfa_enabled && security?.mfa_phone_verified && (
              <Badge variant="default" className="gap-1">
                <Lock className="h-3 w-3" />
                Enabled
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!security?.mfa_enabled ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isEnrolling || isVerifying}
                />
              </div>
              {!isVerifying ? (
                <Button onClick={enrollMFA} disabled={isEnrolling}>
                  <Phone className="mr-2 h-4 w-4" />
                  {isEnrolling ? 'Enrolling...' : 'Enable MFA'}
                </Button>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button onClick={verifyMFA}>Verify Code</Button>
                    <Button variant="outline" onClick={() => setIsVerifying(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div className="text-sm">
                <p className="font-medium">Phone: {security.mfa_phone}</p>
                {security.mfa_phone_verified && (
                  <p className="text-muted-foreground">Status: Verified</p>
                )}
              </div>
              <Button variant="destructive" onClick={disableMFA}>
                Disable MFA
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Password Security
          </CardTitle>
          <CardDescription>
            Your password expires every 90 days for security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPasswordExpired && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Your password has expired. Please change it immediately.
              </AlertDescription>
            </Alert>
          )}
          {!isPasswordExpired && isPasswordExpiringSoon && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Your password will expire in {daysUntilExpiry} days. Please change it soon.
              </AlertDescription>
            </Alert>
          )}
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Last changed:</span>{' '}
              {security?.password_last_changed
                ? new Date(security.password_last_changed).toLocaleDateString()
                : 'Never'}
            </p>
            <p>
              <span className="font-medium">Expires:</span>{' '}
              {security?.password_expires_at
                ? new Date(security.password_expires_at).toLocaleDateString()
                : 'Unknown'}
            </p>
          </div>
          <Button variant="outline" onClick={() => {
            // This would trigger password change flow
            toast({
              title: 'Change Password',
              description: 'Password change functionality coming soon',
            });
          }}>
            Change Password
          </Button>
        </CardContent>
      </Card>

      {security && security.failed_login_attempts > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-amber-600">Security Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Failed login attempts: {security.failed_login_attempts}
            </p>
            {security.account_locked_until && (
              <Alert variant="destructive" className="mt-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Account locked until{' '}
                  {new Date(security.account_locked_until).toLocaleString()}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
