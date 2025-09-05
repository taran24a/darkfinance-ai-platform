"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Menu } from "lucide-react";
import { toast } from "sonner";

const navigationLinks = [
  { name: "Use cases", href: "#use-cases" },
  { name: "Company", href: "#company" },
  { name: "News", href: "#news" },
  { name: "Careers", href: "#careers" },
  { name: "Pricing", href: "#pricing" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !consent) {
      toast.error("Please fill in all fields and accept the terms");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Welcome! Check your email to get started.");
      setIsSignUpModalOpen(false);
      setEmail("");
      setConsent(false);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled 
          ? "backdrop-blur-md bg-background/80 shadow-sm border-b border-border" 
          : "bg-background"
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-primary-foreground rounded-sm"></div>
                </div>
                <span className="font-display font-bold text-lg text-foreground">Brand</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm px-1 py-1"
                  aria-label={`Navigate to ${link.name}`}
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-sm font-medium"
                aria-label="Log in to your account"
              >
                Log in
              </Button>
              <Button 
                size="sm" 
                className="rounded-full px-6"
                onClick={() => setIsSignUpModalOpen(true)}
                aria-label="Get started with a new account"
              >
                Get started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Popover open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="p-2"
                    aria-label="Open navigation menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4" align="end">
                  <nav className="space-y-4">
                    {navigationLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm px-2 py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-label={`Navigate to ${link.name}`}
                      >
                        {link.name}
                      </a>
                    ))}
                    <hr className="border-border my-4" />
                    <div className="space-y-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start text-sm font-medium"
                        aria-label="Log in to your account"
                      >
                        Log in
                      </Button>
                      <Button 
                        size="sm" 
                        className="w-full rounded-full"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsSignUpModalOpen(true);
                        }}
                        aria-label="Get started with a new account"
                      >
                        Get started
                      </Button>
                    </div>
                  </nav>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </header>

      {/* Sign Up Modal */}
      <Dialog open={isSignUpModalOpen} onOpenChange={setIsSignUpModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-display font-bold">Get started</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSignUp} className="space-y-6 mt-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
                aria-describedby="email-help"
              />
              <p id="email-help" className="text-xs text-muted-foreground">
                We'll send you a confirmation email to get started.
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="consent"
                checked={consent}
                onCheckedChange={(checked) => setConsent(checked === true)}
                required
                aria-describedby="consent-help"
              />
              <label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed">
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>

            <Button
              type="submit"
              className="w-full rounded-full"
              disabled={isSubmitting || !email || !consent}
              aria-label={isSubmitting ? "Creating account..." : "Create account"}
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}