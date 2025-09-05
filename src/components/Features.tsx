"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { 
  Grid3x2, 
  Component, 
  PanelTopDashed, 
  Repeat1, 
  ChevronsUpDown, 
  ListFilter,
  SquareUser 
} from "lucide-react";

interface Feature {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  details: string;
}

const features: Feature[] = [
  {
    id: "1",
    title: "Customer Management",
    description: "Centralize customer data and interactions in one unified platform.",
    category: "CRM",
    icon: SquareUser,
    details: "Our comprehensive customer management system allows you to track customer interactions, manage contact information, and analyze customer behavior patterns. Features include contact segmentation, interaction history, and customizable fields."
  },
  {
    id: "2",
    title: "Workflow Automation",
    description: "Automate repetitive tasks and streamline your business processes.",
    category: "Automation",
    icon: Repeat1,
    details: "Build powerful automation workflows that trigger based on customer actions, time intervals, or data changes. Reduce manual work and ensure consistent processes across your organization."
  },
  {
    id: "3",
    title: "Data Analytics",
    description: "Transform your data into actionable insights with advanced analytics.",
    category: "Analytics",
    icon: Grid3x2,
    details: "Comprehensive analytics dashboard with real-time reporting, custom metrics, and predictive insights. Track KPIs, generate reports, and make data-driven decisions."
  },
  {
    id: "4",
    title: "Integration Hub",
    description: "Connect with your favorite tools and platforms seamlessly.",
    category: "Integration",
    icon: Component,
    details: "Pre-built integrations with popular business tools including CRMs, email platforms, and project management systems. Custom API connections available for enterprise needs."
  },
  {
    id: "5",
    title: "Dashboard Builder",
    description: "Create custom dashboards tailored to your business needs.",
    category: "Analytics",
    icon: PanelTopDashed,
    details: "Drag-and-drop dashboard builder with customizable widgets, real-time data visualization, and role-based access controls. Perfect for teams of any size."
  },
  {
    id: "6",
    title: "Smart Filtering",
    description: "Advanced filtering capabilities to find exactly what you need.",
    category: "CRM",
    icon: ListFilter,
    details: "Intelligent search and filtering system with natural language queries, saved filters, and automated tagging. Find customers, deals, or data points instantly."
  }
];

const categories = ["All", "CRM", "Automation", "Analytics", "Integration"];

type LoadingState = "loading" | "error" | "success";

export default function Features() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loadingState, setLoadingState] = useState<LoadingState>("loading");
  const [filteredFeatures, setFilteredFeatures] = useState<Feature[]>([]);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingState("success");
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter features based on category
  useEffect(() => {
    if (loadingState === "success") {
      const filtered = selectedCategory === "All" 
        ? features 
        : features.filter(feature => feature.category === selectedCategory);
      setFilteredFeatures(filtered);
    }
  }, [selectedCategory, loadingState]);

  const handleRetry = () => {
    setLoadingState("loading");
    setTimeout(() => {
      setLoadingState("success");
    }, 1000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for your interest! We'll be in touch soon.");
    setContactForm({ name: "", email: "", message: "" });
    setIsContactModalOpen(false);
  };

  const renderSkeletonCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-card border rounded-lg p-6">
          <Skeleton className="h-6 w-6 mb-4" />
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-4" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );

  const renderErrorState = () => (
    <div className="text-center py-12">
      <div className="mb-4">
        <ChevronsUpDown className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Failed to load features</h3>
        <p className="text-muted-foreground mb-4">
          We couldn't load the features. Please try again.
        </p>
      </div>
      <Button onClick={handleRetry} variant="outline">
        Try Again
      </Button>
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-12">
      <div className="mb-4">
        <Grid3x2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No features found</h3>
        <p className="text-muted-foreground mb-4">
          No features match your current filter. Contact us to learn about custom solutions.
        </p>
      </div>
      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogTrigger asChild>
          <Button>Contact Us</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Get in Touch</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={contactForm.name}
                onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={contactForm.message}
                onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                rows={3}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );

  const renderFeatureCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredFeatures.map((feature) => {
        const Icon = feature.icon;
        return (
          <div key={feature.id} className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
            <Icon className="h-6 w-6 text-primary mb-4" />
            <h3 className="font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground text-sm mb-4">{feature.description}</p>
            
            <Accordion type="single" collapsible>
              <AccordionItem value="details" className="border-none">
                <AccordionTrigger className="text-sm font-medium hover:no-underline p-0">
                  Learn more
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pt-2">
                  {feature.details}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        );
      })}
    </div>
  );

  return (
    <section className="py-16 bg-background">
      <div className="container max-w-6xl mx-auto px-6">
        {/* Header and Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-3xl font-bold">Features & Use Cases</h2>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loadingState === "loading" && renderSkeletonCards()}
        {loadingState === "error" && renderErrorState()}
        {loadingState === "success" && (
          filteredFeatures.length === 0 ? renderEmptyState() : renderFeatureCards()
        )}
      </div>
    </section>
  );
}