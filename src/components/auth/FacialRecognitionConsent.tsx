import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Shield, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FacialRecognitionConsentProps {
  onConsentGiven: () => void;
  userId: string;
}

export const FacialRecognitionConsent = ({ onConsentGiven, userId }: FacialRecognitionConsentProps) => {
  const [hasReadFully, setHasReadFully] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const consentText = `
FACIAL RECOGNITION TECHNOLOGY CONSENT AGREEMENT

Version 1.0 - Effective Date: ${new Date().toLocaleDateString()}

I, the undersigned employee, hereby acknowledge and consent to the following:

1. DATA COLLECTION AND PROCESSING
   - I understand that Invepin utilizes facial recognition technology for employee authentication and time tracking
   - My facial biometric data will be captured, processed, analyzed, and stored in encrypted format
   - The system may capture multiple images to create a biometric template unique to me
   - This data will be used solely for authorized business purposes

2. PURPOSE AND USE
   - Employee clock-in/clock-out authentication
   - Security monitoring and access control
   - Time and attendance tracking
   - Loss prevention and security investigations when authorized

3. DATA STORAGE AND SECURITY
   - My biometric data will be encrypted using industry-standard encryption
   - Data is stored securely with restricted access to authorized personnel only
   - The system complies with applicable biometric privacy laws and regulations
   - Regular security audits are conducted to protect my data

4. DATA RETENTION AND DELETION
   - My biometric data will be retained during the term of my employment
   - Upon termination of employment, I may request deletion of my biometric data
   - Deletion requests will be processed within 30 days unless legal retention is required
   - I can contact privacy@invepin.com to request data deletion

5. MY RIGHTS
   - I have the right to access my biometric data
   - I have the right to request correction of inaccurate data
   - I have the right to withdraw consent (which may affect my access to certain features)
   - I have the right to file a complaint with appropriate regulatory authorities

6. RESPONSIBLE USE OBLIGATIONS
   I agree to:
   - Use the facial recognition system only for authorized purposes
   - NOT attempt to manipulate, bypass, or interfere with the system
   - NOT use another person's biometric data or allow others to use mine
   - NOT share my access credentials with unauthorized individuals
   - Report any suspected misuse or security breaches immediately

7. CONSEQUENCES OF MISUSE
   I understand that misuse of this system may result in:
   - Immediate suspension of system access
   - Disciplinary action up to and including termination
   - Legal action for privacy violations or fraud
   - Potential criminal liability under applicable laws

8. THIRD-PARTY DISCLOSURE
   - My biometric data will NOT be sold or shared with third parties
   - Data may be disclosed only when legally required (court order, legal process)
   - Data may be shared with service providers under strict confidentiality agreements

9. SYSTEM LIMITATIONS
   I acknowledge that:
   - No facial recognition system is 100% accurate
   - False positives or false negatives may occasionally occur
   - I should report any system errors or concerns to management
   - Alternative authentication methods may be available if needed

10. CONSENT ACKNOWLEDGMENT
    - I have read and understood this entire consent agreement
    - I have had the opportunity to ask questions and receive answers
    - I provide my consent voluntarily and understand I may withdraw it
    - I understand the implications of providing or withholding consent
    - I acknowledge that facial recognition features require this consent

By checking the box below and clicking "I Consent", I certify that:
- I have read this agreement in its entirety
- I understand all terms and conditions
- I voluntarily consent to the collection and use of my facial biometric data
- I acknowledge my rights and responsibilities
- I agree to use the system responsibly and in accordance with company policy
`;

  const handleScroll = (event: any) => {
    const target = event.target;
    const bottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 50;
    if (bottom) {
      setHasReadFully(true);
    }
  };

  const handleSubmit = async () => {
    if (!agreedToTerms) {
      toast({
        title: "Consent Required",
        description: "You must agree to the terms to use facial recognition features.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Record consent in database
      const { error: consentError } = await supabase
        .from("user_consents")
        .insert({
          user_id: userId,
          consent_type: "facial_recognition",
          consent_text: consentText,
          ip_address: null, // Could be captured if needed
          user_agent: navigator.userAgent,
          version: "1.0",
        });

      if (consentError) throw consentError;

      // Update profile with consent flag
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          facial_recognition_consent_signed: true,
          facial_recognition_consent_date: new Date().toISOString(),
        })
        .eq("id", userId);

      if (profileError) throw profileError;

      toast({
        title: "Consent Recorded",
        description: "Your consent has been recorded. You can now access facial recognition features.",
      });

      onConsentGiven();
    } catch (error: any) {
      console.error("Error recording consent:", error);
      toast({
        title: "Error",
        description: "Failed to record consent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-warning" />
            <CardTitle className="text-2xl">Facial Recognition Consent Required</CardTitle>
          </div>
          <CardDescription className="text-base">
            Before accessing facial recognition features, you must review and consent to the following terms.
            This is required by privacy laws and company policy.
          </CardDescription>
          <div className="bg-warning/10 border border-warning rounded-lg p-4 flex gap-3">
            <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="text-sm text-warning-foreground">
              <strong>Important:</strong> Please read the entire agreement carefully. 
              Scroll to the bottom to enable the consent button.
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <ScrollArea 
            className="h-[400px] border rounded-lg p-6 bg-muted/30"
            onScrollCapture={handleScroll}
          >
            <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
              {consentText}
            </pre>
          </ScrollArea>

          {!hasReadFully && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>Scroll to the bottom of the agreement to continue</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
              <Checkbox
                id="consent"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                disabled={!hasReadFully}
              />
              <label
                htmlFor="consent"
                className="text-sm leading-relaxed cursor-pointer"
              >
                <strong>I have read and understand the Facial Recognition Technology Consent Agreement.</strong>
                <br />
                I voluntarily consent to the collection, processing, and storage of my facial biometric data
                as described above. I acknowledge my rights and agree to use the system responsibly.
              </label>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSubmit}
                disabled={!agreedToTerms || !hasReadFully || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Recording Consent..." : "I Consent - Grant Access"}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              By providing consent, you acknowledge that you have read, understood, and agree to all terms.
              Your consent will be recorded with a timestamp for compliance purposes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
