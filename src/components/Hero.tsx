"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, ArrowRight, Mail, Check } from "lucide-react";
import { toast } from "sonner";

interface EmailFormState {
  email: string;
  isLoading: boolean;
  isSubmitted: boolean;
  error: string;
}

export default function Hero() {
  const [showPopover, setShowPopover] = useState(false);
  const [emailForm, setEmailForm] = useState<EmailFormState>({
    email: "",
    isLoading: false,
    isSubmitted: false,
    error: "",
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(emailForm.email)) {
      setEmailForm(prev => ({ ...prev, error: "Please enter a valid email address" }));
      return;
    }

    setEmailForm(prev => ({ ...prev, isLoading: true, error: "" }));

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setEmailForm(prev => ({ 
      ...prev, 
      isLoading: false, 
      isSubmitted: true 
    }));

    toast.success("Welcome to Bridge! Check your inbox for next steps.");
  }, [emailForm.email]);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailForm(prev => ({ 
      ...prev, 
      email: e.target.value,
      error: "",
      isSubmitted: false
    }));
  }, []);

  const handleSecondaryClick = useCallback(() => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <section className="py-12 lg:py-20">
      <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
        {/* Left Content Card */}
        <Card className="lg:col-span-3 shadow-lg border-0">
          <CardContent className="p-8 lg:p-12">
            {/* Announcement Pill */}
            <div className="relative mb-8">
              <button
                onClick={() => setShowPopover(!showPopover)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-badge-new-bg text-badge-new-text rounded-full text-sm font-medium hover:bg-opacity-80 transition-colors"
                aria-expanded={showPopover}
                aria-haspopup="true"
              >
                <span className="px-2 py-0.5 bg-success text-white text-xs font-semibold rounded-full">
                  New
                </span>
                How Monobank uses Bridge...
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Popover */}
              {showPopover && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-lg p-4 z-10">
                  <p className="text-sm text-foreground leading-relaxed">
                    Monobank streamlined their payment infrastructure with Bridge, 
                    reducing transaction costs by 40% while improving checkout conversion rates. 
                    See how they built a seamless payment experience for millions of users.
                  </p>
                </div>
              )}
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl lg:text-6xl xl:text-7xl font-black leading-tight mb-6">
              Payments made
              <br />
              simple for
              <br />
              everyone
            </h1>

            {/* Supporting Copy */}
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg">
              Connect any payment method, anywhere in the world. 
              Bridge makes it easy to accept payments and get paid faster.
            </p>

            {/* Email Form / Success State */}
            {emailForm.isSubmitted ? (
              <div className="flex items-center gap-3 p-4 bg-success-soft border border-success/20 rounded-lg mb-4">
                <Check className="w-5 h-5 text-success" />
                <span className="text-success font-medium" aria-live="polite">
                  Check your inbox for next steps
                </span>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} className="mb-6">
                <div className="flex flex-col sm:flex-row gap-3 mb-3">
                  <div className="flex-1">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={emailForm.email}
                      onChange={handleEmailChange}
                      className={`h-12 text-base ${emailForm.error ? 'border-destructive' : ''}`}
                      disabled={emailForm.isLoading}
                      aria-label="Email address"
                      aria-describedby={emailForm.error ? "email-error" : undefined}
                    />
                    {emailForm.error && (
                      <p id="email-error" className="text-destructive text-sm mt-1" role="alert">
                        {emailForm.error}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="h-12 px-6 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors"
                    disabled={emailForm.isLoading}
                  >
                    {emailForm.isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Getting started...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Open Bridge for free
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            )}

            {/* Secondary CTA */}
            <button
              onClick={handleSecondaryClick}
              className="text-primary font-medium hover:text-primary/80 transition-colors underline decoration-primary/50 underline-offset-4"
            >
              See features
            </button>
          </CardContent>
        </Card>

        {/* Right Illustration Card */}
        <div className="lg:col-span-2">
          <Card className="border border-border shadow-sm hover:scale-[1.02] transition-transform duration-300 ease-out overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-[4/5] bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1556155092-490a1ba16284?w=600&h=750&fit=crop&crop=center"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}