import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EnterpriseConsultationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EnterpriseConsultationForm = ({ open, onOpenChange }: EnterpriseConsultationFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    numLocations: "",
    message: ""
  });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.company.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const { error } = await supabase.functions.invoke('send-enterprise-consultation', {
        body: formData
      });

      if (error) throw error;

      toast({
        title: "Consultation Request Sent!",
        description: "We'll contact you within 24 hours to schedule your enterprise consultation.",
      });

      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        numLocations: "",
        message: ""
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error sending consultation request:', error);
      toast({
        title: "Error",
        description: "Failed to send request. Please try calling us at 302-343-5004 or email support@invepin.com",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enterprise Consultation Request</DialogTitle>
          <DialogDescription>
            Tell us about your enterprise needs and we'll get back to you within 24 hours.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="John Smith"
              disabled={isSending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="john@company.com"
              disabled={isSending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company Name *</Label>
            <Input
              id="company"
              required
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              placeholder="Retail Corp Inc."
              disabled={isSending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="302-343-5004"
              disabled={isSending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="numLocations">Number of Locations</Label>
            <Select value={formData.numLocations} onValueChange={(value) => setFormData({...formData, numLocations: value})} disabled={isSending}>
              <SelectTrigger>
                <SelectValue placeholder="Select number of locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Single Location</SelectItem>
                <SelectItem value="2-5">2-5 Locations</SelectItem>
                <SelectItem value="6-20">6-20 Locations</SelectItem>
                <SelectItem value="21-50">21-50 Locations</SelectItem>
                <SelectItem value="51+">51+ Locations</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Additional Information</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              placeholder="Tell us about your enterprise security needs, timeline, and any specific requirements..."
              rows={4}
              disabled={isSending}
            />
          </div>

          <Button type="submit" disabled={isSending} className="w-full">
            {isSending ? "Sending..." : "Request Enterprise Consultation"}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Or call us directly at{" "}
            <a href="tel:+13023435004" className="text-primary hover:underline">
              302-343-5004
            </a>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};
