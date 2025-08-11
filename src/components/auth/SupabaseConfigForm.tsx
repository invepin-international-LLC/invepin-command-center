import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export const SupabaseConfigForm = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [anonKey, setAnonKey] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const existingUrl = localStorage.getItem("invepin_supabase_url") || "";
      const existingKey = localStorage.getItem("invepin_supabase_anon_key") || "";
      setUrl(existingUrl);
      setAnonKey(existingKey);
    } catch {}
  }, []);

  const handleSave = async () => {
    if (!url || !anonKey) {
      toast({
        title: "Missing values",
        description: "Please enter both URL and anon key.",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    try {
      localStorage.setItem("invepin_supabase_url", url);
      localStorage.setItem("invepin_supabase_anon_key", anonKey);
      // Also set on window for immediate availability
      (window as any).__SUPABASE_URL__ = url;
      (window as any).__SUPABASE_ANON_KEY__ = anonKey;
      toast({ title: "Supabase configured", description: "Reloading to apply settings..." });
      setTimeout(() => {
        window.location.reload();
      }, 400);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-xs text-muted-foreground">
        Enter your Supabase Project credentials (Settings → API → Project URL and anon public key).
      </div>
      <div className="space-y-2">
        <Label htmlFor="sb-url">Project URL</Label>
        <Input
          id="sb-url"
          placeholder="https://YOUR-PROJECT.supabase.co"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="bg-background/50 border-border/50 focus:border-primary"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sb-key">Anon public key</Label>
        <Input
          id="sb-key"
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          value={anonKey}
          onChange={(e) => setAnonKey(e.target.value)}
          className="bg-background/50 border-border/50 focus:border-primary"
        />
      </div>
      <Button onClick={handleSave} disabled={saving || !url || !anonKey} className="w-full">
        {saving ? "Saving..." : "Save & Reload"}
      </Button>
    </div>
  );
};

export default SupabaseConfigForm;
