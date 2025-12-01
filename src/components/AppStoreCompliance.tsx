import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export function AppStoreComplianceNotice() {
  return (
    <Alert className="mb-6 border-primary/20 bg-primary/5">
      <Info className="h-4 w-4" />
      <AlertTitle>Demo & Information App</AlertTitle>
      <AlertDescription>
        This app is for demonstration and informational purposes only. All Invepin services and subscriptions 
        are purchased through direct sales contact. For pricing and purchasing, contact{" "}
        <a href="mailto:support@invepin.com" className="text-primary hover:underline font-medium">
          support@invepin.com
        </a>{" "}
        or call{" "}
        <a href="tel:+13023435004" className="text-primary hover:underline font-medium">
          302-343-5004
        </a>.
      </AlertDescription>
    </Alert>
  );
}
