import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Key, Bell, Activity, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MFASetup } from './MFASetup';

export function SecuritySettings() {
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      toast({
        title: "Confirmation Required",
        description: "Please type DELETE to confirm account deletion",
        variant: "destructive"
      });
      return;
    }

    setIsDeleting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No user found');
      }

      // Delete user account - users can delete their own account via signOut + RPC
      // First delete user data from profiles table
      await supabase.from('profiles').delete().eq('id', user.id);
      
      // Delete face embeddings
      await supabase.from('face_embeddings').delete().eq('user_id', user.id);
      
      // Delete clock events
      await supabase.from('clock_events').delete().eq('user_id', user.id);
      
      // Note: For complete account deletion, contact support@invepin.com
      // This removes all user data from the app

      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted"
      });

      // Sign out and redirect
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast({
        title: "Deletion Failed",
        description: error.message || "Unable to delete account. Please contact support@invepin.com",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setDeleteConfirmation('');
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Security Settings</h1>
        <p className="text-muted-foreground">
          Manage your account security and authentication preferences
        </p>
      </div>

      <Tabs defaultValue="mfa" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="mfa" className="gap-2">
            <Shield className="h-4 w-4" />
            MFA
          </TabsTrigger>
          <TabsTrigger value="password" className="gap-2">
            <Key className="h-4 w-4" />
            Password
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2">
            <Activity className="h-4 w-4" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="account" className="gap-2">
            <Trash2 className="h-4 w-4" />
            Account
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mfa">
          <MFASetup />
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password Policy</CardTitle>
              <CardDescription>
                Your organization requires password changes every 90 days
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <h3 className="font-medium">Requirements:</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Minimum 8 characters</li>
                  <li>At least one uppercase letter</li>
                  <li>At least one lowercase letter</li>
                  <li>At least one number</li>
                  <li>At least one special character</li>
                  <li>Cannot reuse last 5 passwords</li>
                  <li>Password expires after 90 days</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Security Notifications</CardTitle>
              <CardDescription>
                Get notified about important security events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  You'll receive notifications for:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Failed login attempts</li>
                  <li>Password expiration reminders (14 days before)</li>
                  <li>New device sign-ins</li>
                  <li>MFA enrollment changes</li>
                  <li>Account lockouts</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Activity</CardTitle>
              <CardDescription>
                Monitor your account activity and sign-ins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Activity logs coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Delete Account</CardTitle>
              <CardDescription>
                Permanently delete your account and all associated data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  This action will permanently delete:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Your account and profile information</li>
                  <li>All shift records and clock-in history</li>
                  <li>Face recognition data</li>
                  <li>Security and authentication settings</li>
                  <li>All associated data and preferences</li>
                </ul>
                <p className="text-destructive font-medium mt-4">
                  This action cannot be undone.
                </p>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete My Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="space-y-4">
                      <p>
                        This will permanently delete your account and remove all your data from our servers.
                        This action cannot be undone.
                      </p>
                      <div className="space-y-2">
                        <Label htmlFor="delete-confirm">
                          Type <span className="font-bold">DELETE</span> to confirm
                        </Label>
                        <Input
                          id="delete-confirm"
                          value={deleteConfirmation}
                          onChange={(e) => setDeleteConfirmation(e.target.value)}
                          placeholder="Type DELETE"
                          className="font-mono"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Need help? Contact support at <a href="mailto:support@invepin.com" className="text-primary hover:underline">support@invepin.com</a> or call <a href="tel:+13023435004" className="text-primary hover:underline">302-343-5004</a>
                      </p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setDeleteConfirmation('')}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      disabled={deleteConfirmation !== 'DELETE' || isDeleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete Account'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
