import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Download, Video, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { PublicNav } from "@/components/navigation/PublicNav";

const Docs = () => {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <section className="px-6 lg:px-8 pt-24 pb-16">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold mb-8">Documentation</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: BookOpen, title: "User Guides", desc: "Step-by-step tutorials" },
              { icon: Video, title: "Video Training", desc: "Video walkthroughs" },
              { icon: FileText, title: "Technical Specs", desc: "API documentation" }
            ].map((item, i) => (
              <Card key={i} className="hover-card">
                <CardHeader>
                  <item.icon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{item.desc}</p>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Docs;
