import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Menu, Shield, Users, Building, Calculator, FileText } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function PublicNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { 
      title: "Solutions", 
      items: [
        { title: "Retail Loss Prevention", href: "/solutions/retail", icon: Shield },
        { title: "Multi-Store Management", href: "/solutions/enterprise", icon: Building },
        { title: "Healthcare Security", href: "/solutions/healthcare", icon: Users }
      ]
    },
    {
      title: "Products",
      items: [
        { title: "V1 Micro-Pins", href: "/products/micro-pins" },
        { title: "V2 Facial Recognition", href: "/products/facial-recognition" },
        { title: "Colony Hub System", href: "/products/colony-hub" }
      ]
    },
    {
      title: "Resources",
      items: [
        { title: "Case Studies", href: "/case-studies" },
        { title: "ROI Calculator", href: "/roi-calculator", icon: Calculator },
        { title: "Documentation", href: "/docs", icon: FileText },
        { title: "Support", href: "/support" }
      ]
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Invepin</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex mx-6">
          <NavigationMenuList>
            {navItems.map((item) => (
              <NavigationMenuItem key={item.title}>
                <NavigationMenuTrigger className="text-sm font-medium">
                  {item.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4">
                    {item.items.map((subItem) => (
                      <NavigationMenuLink key={subItem.href} asChild>
                        <Link 
                          to={subItem.href} 
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="flex items-center space-x-2">
                            {subItem.icon && <subItem.icon className="h-4 w-4" />}
                            <div className="text-sm font-medium leading-none">{subItem.title}</div>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto flex items-center space-x-2">
          <Button variant="ghost" asChild className="hidden md:inline-flex">
            <Link to="/pricing">Pricing</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/hive">Hive</Link>
          </Button>
          <Button variant="ghost" asChild className="hidden md:inline-flex">
            <Link to="/dashboard">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/demo">Start Demo</Link>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col space-y-4 mt-8">
                <Link to="/" className="text-lg font-semibold" onClick={() => setIsOpen(false)}>
                  Home
                </Link>
                {navItems.map((section) => (
                  <div key={section.title}>
                    <h3 className="font-medium text-muted-foreground mb-2">{section.title}</h3>
                    <div className="pl-4 space-y-2">
                      {section.items.map((item) => (
                        <Link 
                          key={item.href} 
                          to={item.href} 
                          className="block text-sm hover:text-primary" 
                          onClick={() => setIsOpen(false)}
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4 space-y-2">
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link to="/pricing" onClick={() => setIsOpen(false)}>Pricing</Link>
                  </Button>
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link to="/hive" onClick={() => setIsOpen(false)}>Hive</Link>
                  </Button>
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link to="/dashboard" onClick={() => setIsOpen(false)}>Login</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}