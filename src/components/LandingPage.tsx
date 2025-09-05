"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Brain, 
  PieChart, 
  Target, 
  BarChart3, 
  Eye,
  Star,
  Check,
  Play,
  Menu,
  X,
  ChevronDown,
  IndianRupee,
  Shield,
  Zap,
  Users
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onSignIn }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const features = [
    {
      icon: TrendingUp,
      title: "Smart Investment Tracking",
      description: "Real-time portfolio analytics with AI-powered insights to maximize your returns and minimize risk."
    },
    {
      icon: Brain,
      title: "AI Financial Assistant",
      description: "Get personalized financial advice tailored to your goals, spending habits, and market conditions."
    },
    {
      icon: PieChart,
      title: "Expense Management",
      description: "Intelligent categorization and insights that help you understand where your money goes."
    },
    {
      icon: Target,
      title: "Goal Planning",
      description: "Set financial goals and track progress with visual milestones and actionable recommendations."
    },
    {
      icon: BarChart3,
      title: "Stock Market Hub",
      description: "Real-time market data, advanced charting, and research tools all in one place."
    },
    {
      icon: Eye,
      title: "Behavioral Insights",
      description: "Understand your spending patterns and get nudges to build better financial habits."
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Your data is protected with enterprise-grade encryption and security protocols.",
      stat: "256-bit encryption"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get instant insights and real-time updates across all your financial accounts.",
      stat: "< 100ms response time"
    },
    {
      icon: Users,
      title: "Trusted by Thousands",
      description: "Join over 50,000 users who have taken control of their financial future.",
      stat: "50,000+ users"
    }
  ];

  const testimonials = [
    {
      quote: "FinanceFlow transformed how I manage my money. The AI insights are incredible!",
      author: "Sarah Chen",
      role: "Software Engineer"
    },
    {
      quote: "Finally, a finance app that actually helps me reach my goals. Love the goal tracking!",
      author: "Marcus Johnson",
      role: "Marketing Director"
    },
    {
      quote: "The investment tracking features saved me thousands. Couldn't be happier.",
      author: "Emily Rodriguez",
      role: "Entrepreneur"
    }
  ];

  const FloatingShape = ({ delay = 0, duration = 20 }) => (
    <motion.div
      className="absolute w-64 h-64 rounded-full opacity-5"
      style={{
        background: "linear-gradient(45deg, #38bdf8, #8b5cf6)",
        filter: "blur(40px)"
      }}
      animate={{
        x: [0, 100, 0],
        y: [0, -100, 0],
        scale: [1, 1.1, 1]
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
    />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F14] via-[#0E1217] to-[#0B0F14] text-foreground overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <FloatingShape delay={0} />
        <div className="absolute top-1/4 right-1/4">
          <FloatingShape delay={5} duration={25} />
        </div>
        <div className="absolute bottom-1/4 left-1/3">
          <FloatingShape delay={10} duration={30} />
        </div>
      </div>

      {/* Navigation */}
      <motion.nav 
        className="relative z-50 bg-background/80 backdrop-blur-lg border-b border-border/50 sticky top-0"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-[#38bdf8] to-[#8b5cf6] rounded-lg flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#38bdf8] to-[#8b5cf6] bg-clip-text text-transparent">
                FinanceFlow
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#benefits" className="text-muted-foreground hover:text-foreground transition-colors">Why Us</a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Reviews</a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={onSignIn}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={onGetStarted}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg transition-colors"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden mt-4 py-4 border-t border-border/50"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
                <a href="#benefits" className="text-muted-foreground hover:text-foreground transition-colors">Why Us</a>
                <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Reviews</a>
                <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
                <div className="flex flex-col space-y-2 pt-4 border-t border-border/50">
                  <button
                    onClick={onSignIn}
                    className="text-left text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={onGetStarted}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg transition-colors text-left"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full bg-secondary/50 border border-border/50 mb-8"
              {...fadeInUp}
            >
              <Zap className="w-4 h-4 mr-2 text-primary" />
              <span className="text-sm text-muted-foreground">AI-Powered Financial Coach</span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight bg-gradient-to-r from-[#38bdf8] to-[#8b5cf6] bg-clip-text text-transparent"
              {...fadeInUp}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              Take Control of Your Financial Future
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
              {...fadeInUp}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              AI-powered personal finance platform that turns your money goals into reality
              with intelligent insights, automated tracking, and personalized guidance.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              {...fadeInUp}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <button
                onClick={onGetStarted}
                className="group relative bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-primary/25"
              >
                Get Started Free
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </button>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              className="mt-16 relative"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="relative max-w-4xl mx-auto">
                {/* Glassmorphic card mockup */}
                <div className="bg-gradient-to-br from-secondary/20 to-secondary/10 backdrop-blur-sm border border-border/20 rounded-2xl p-8 shadow-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-background/40 backdrop-blur-sm rounded-xl p-6 border border-border/20">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-muted-foreground">Portfolio Value</span>
                        <TrendingUp className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-2xl font-bold text-foreground">₹125,430</div>
                      <div className="text-sm text-green-400">+12.5% this month</div>
                    </div>
                    
                    <div className="bg-background/40 backdrop-blur-sm rounded-xl p-6 border border-border/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Monthly Budget</span>
                        <PieChart className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-2xl font-bold text-foreground">₹3,450</div>
                      <div className="w-full bg-secondary rounded-full h-2 mt-3">
                        <div className="bg-gradient-to-r from-primary to-primary/60 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    
                    <div className="bg-background/40 backdrop-blur-sm rounded-xl p-6 border border-border/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Savings Goal</span>
                        <Target className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-2xl font-bold text-foreground">87%</div>
                      <div className="text-sm text-muted-foreground">₹8,700 of ₹10,000</div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <IndianRupee className="w-8 h-8 text-white" />
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-green-500 to-green-400 rounded-full flex items-center justify-center"
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <TrendingUp className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 bg-gradient-to-b from-transparent to-secondary/20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Powerful Features for{" "}
              <span className="bg-gradient-to-r from-[#38bdf8] to-[#8b5cf6] bg-clip-text text-transparent">
                Smart Money Management
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to take control of your finances and build wealth intelligently.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group bg-gradient-to-br from-secondary/20 to-secondary/10 backdrop-blur-sm border border-border/20 rounded-2xl p-8 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-[#38bdf8] to-[#8b5cf6] bg-clip-text text-transparent">
                FinanceFlow?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of users who have transformed their financial lives with our platform.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="text-center group"
                variants={fadeInUp}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {benefit.description}
                </p>
                <div className="text-2xl font-bold text-primary">
                  {benefit.stat}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Social Proof */}
          <motion.div
            className="bg-gradient-to-br from-secondary/20 to-secondary/10 backdrop-blur-sm border border-border/20 rounded-2xl p-8 text-center"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                <div className="text-muted-foreground">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">$2.5B+</div>
                <div className="text-muted-foreground">Assets Tracked</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">4.9/5</div>
                <div className="text-muted-foreground">User Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
                <div className="text-muted-foreground">Uptime</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 py-20 bg-gradient-to-b from-transparent to-secondary/20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              What Our{" "}
              <span className="bg-gradient-to-r from-[#38bdf8] to-[#8b5cf6] bg-clip-text text-transparent">
                Users Say
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real stories from real users who have transformed their financial lives.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-secondary/20 to-secondary/10 backdrop-blur-sm border border-border/20 rounded-2xl p-8 hover:border-primary/30 transition-all duration-300"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm border border-primary/20 rounded-3xl p-12 text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Transform Your{" "}
              <span className="bg-gradient-to-r from-[#38bdf8] to-[#8b5cf6] bg-clip-text text-transparent">
                Financial Future?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users who have taken control of their finances with FinanceFlow.
              Start your journey today, completely free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={onGetStarted}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-primary/25"
              >
                Get Started Free
              </button>
              <button
                onClick={onSignIn}
                className="text-foreground border border-border/50 hover:border-border px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:bg-secondary/30"
              >
                Sign In
              </button>
            </div>
            <div className="flex items-center justify-center mt-6 text-sm text-muted-foreground">
              <Check className="w-4 h-4 mr-2 text-green-400" />
              No credit card required
              <Check className="w-4 h-4 ml-6 mr-2 text-green-400" />
              Free forever plan available
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="relative z-10 bg-secondary/20 border-t border-border/20">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-[#38bdf8] to-[#8b5cf6] rounded-lg flex items-center justify-center">
                  <IndianRupee className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-[#38bdf8] to-[#8b5cf6] bg-clip-text text-transparent">
                  FinanceFlow
                </span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md">
                Empowering individuals to take control of their financial future with AI-powered insights and intelligent automation.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <div className="space-y-2">
                <a href="#features" className="block text-muted-foreground hover:text-foreground transition-colors">Features</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Security</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">API</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <div className="space-y-2">
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">About</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Blog</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Careers</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Contact</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground">
              © 2024 FinanceFlow. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;