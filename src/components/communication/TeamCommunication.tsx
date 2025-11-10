import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { WalkieTalkie } from "./WalkieTalkie";
import { StaffChat } from "./StaffChat";
import { MessageCircle, Radio } from "lucide-react";

export const TeamCommunication = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="walkie-talkie" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="walkie-talkie" className="flex items-center gap-2">
            <Radio className="h-4 w-4" />
            Walkie-Talkie
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Text Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="walkie-talkie" className="mt-6">
          <WalkieTalkie />
        </TabsContent>

        <TabsContent value="chat" className="mt-6">
          <StaffChat />
        </TabsContent>
      </Tabs>
    </div>
  );
};
