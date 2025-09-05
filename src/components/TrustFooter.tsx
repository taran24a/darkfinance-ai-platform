"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ChevronUp, CircleArrowUp } from "lucide-react";
import { toast } from "sonner";

interface SignupFormData {
  email: string;
  company: string;
}

const PARTNER_LOGOS = [
  { name: "Stripe", logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=120&h=60&fit=crop&auto=format" },
  { name: "Shopify", logo: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=120&h=60&fit=crop&auto=format" },
  { name: "Slack", logo: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=120&h=60&fit=crop&auto=format" },
  { name: "Notion", logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=120&h=60&fit=crop&auto=format" },
  { name: "Linear", logo: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=120&h=60&fit=crop&auto=format" },
  { name: "Figma", logo: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=120&h=60&fit=crop&auto=format" }
];

const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "API", href: "/api" },
    { label: "Integrations", href: "/integrations" }
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" }
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
    { label: "Help Center", href: "/help" },
    { label: "Community", href: "/community" },
    { label: "Status", href: "/status" }
  ],
  Social: [
    { label: "Twitter", href: "https://twitter.com" },
    { label: "GitHub", href: "https://github.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "Discord", href: "https://discord.com" }
  ]
};

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" }
];

export default function TrustFooter() {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [signupForm, setSignupForm] = useState<SignupFormData>({ email: "", company: "" });
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success("Welcome to Bridge! Check your email for next steps.");
    setIsSignupModalOpen(false);
    setSignupForm({ email: "", company: "" });
    setIsSubmitting(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-card">
      {/* CTA Section */}
      <div className="border-t border-border py-16">
        <div className="container max-w-4xl">
          <div className="bg-primary rounded-2xl px-8 py-12 text-center shadow-inner">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
              Ready to bridge the gap?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join thousands of companies using Bridge to streamline their workflows and accelerate growth.
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => setIsSignupModalOpen(true)}
              className="text-lg px-8 py-6 h-auto bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              Open Bridge for free
              <ChevronUp className="ml-2 h-5 w-5 rotate-90" />
            </Button>
          </div>
        </div>
      </div>

      {/* Trust/Logo Section */}
      <div className="py-16 border-t border-border">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-muted-foreground mb-8">
              Companies who've grown with Bridge
            </p>
          </div>
          <div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center"
            role="region"
            aria-label="Companies who've grown with Bridge"
          >
            {PARTNER_LOGOS.map((partner, index) => (
              <div
                key={index}
                className="flex items-center justify-center p-4 rounded-lg transition-all duration-200 hover:scale-105 focus-within:scale-105 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring"
                tabIndex={0}
              >
                <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  className="h-8 w-auto grayscale hover:grayscale-0 transition-all duration-200 opacity-60 hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="border-t border-border py-16">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {Object.entries(FOOTER_LINKS).map(([category, links]) => (
              <div key={category}>
                <h3 className="font-display font-semibold text-foreground mb-4">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 no-underline"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Copyright and Language Selector */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Bridge. All rights reserved.
            </p>

            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          size="sm"
          variant="outline"
          className="fixed bottom-8 right-8 z-50 shadow-lg"
          aria-label="Back to top"
        >
          <CircleArrowUp className="h-4 w-4" />
        </Button>
      )}

      {/* Signup Modal */}
      <Dialog open={isSignupModalOpen} onOpenChange={setIsSignupModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Get started with Bridge</DialogTitle>
            <DialogDescription>
              Enter your details to create your free account and start bridging the gap today.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Work email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={signupForm.email}
                onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium mb-2">
                Company name
              </label>
              <Input
                id="company"
                type="text"
                placeholder="Acme Inc."
                value={signupForm.company}
                onChange={(e) => setSignupForm(prev => ({ ...prev, company: e.target.value }))}
                required
                disabled={isSubmitting}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Create free account"}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </DialogContent>
      </Dialog>
    </footer>
  );
}