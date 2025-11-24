import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MessageCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { PublicNav } from "@/components/navigation/PublicNav";

const Support = () => {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <section className="px-6 lg:px-8 pt-24 pb-16">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold mb-8 text-center">Customer Support</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Phone, title: "Phone Support", value: "302-343-5004", desc: "24/7 availability", href: "tel:+13023435004" },
              { icon: Mail, title: "Email", value: "support@invepin.com", desc: "Response within 2 hours", href: "mailto:support@invepin.com" },
              { icon: MessageCircle, title: "Live Chat", value: "Start Chat", desc: "Instant assistance" },
              { icon: Clock, title: "Support Hours", value: "24/7/365", desc: "Always available" }
            ].map((item, i) => (
              <Card key={i} className="hover-card">
                <CardHeader>
                  <item.icon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {item.href ? (
                    <a href={item.href} className="text-xl font-semibold mb-1 hover:text-primary transition-colors block">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-xl font-semibold mb-1">{item.value}</p>
                  )}
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Support;
