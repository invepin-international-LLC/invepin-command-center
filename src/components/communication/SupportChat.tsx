import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle, X, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const SupportChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const { error } = await supabase.functions.invoke('send-support-chat', {
        body: { name, email, message }
      });

      if (error) throw error;

      toast({
        title: "Message Sent!",
        description: "We'll respond to your email as soon as possible.",
      });

      setName("");
      setEmail("");
      setMessage("");
      setIsOpen(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try emailing support@invepin.com directly.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
        aria-label="Open support chat"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 shadow-xl z-50 animate-in slide-in-from-bottom-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg">Contact Support</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Send us a message and we'll respond to your email.
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="chat-name">Name</Label>
              <Input
                id="chat-name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chat-email">Email</Label>
              <Input
                id="chat-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chat-message">Message</Label>
              <Textarea
                id="chat-message"
                placeholder="How can we help you?"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isSending}
              />
            </div>

            <Button
              onClick={handleSend}
              disabled={isSending}
              className="w-full"
            >
              {isSending ? (
                "Sending..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Or email us directly at{" "}
              <a href="mailto:support@invepin.com" className="text-primary hover:underline">
                support@invepin.com
              </a>
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
};
