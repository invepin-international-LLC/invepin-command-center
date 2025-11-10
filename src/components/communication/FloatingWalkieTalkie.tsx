import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Radio } from "lucide-react";
import { WalkieTalkie } from "./WalkieTalkie";

export const FloatingWalkieTalkie = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="h-16 w-16 rounded-full shadow-glow bg-primary hover:bg-primary/90 animate-pulse"
          >
            <Radio className="h-8 w-8" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-primary" />
              Walkie-Talkie
            </SheetTitle>
            <SheetDescription>
              Instant voice communication with your team
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <WalkieTalkie />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
