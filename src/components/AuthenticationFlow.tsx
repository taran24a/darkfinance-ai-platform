"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  UserRound, 
  LogIn, 
  UserRoundCheck, 
  IdCard, 
  CircleUserRound,
  Component,
  CaseSensitive,
  Vault,
  ScanQrCode,
  ShieldOff,
  TicketX,
  Spline
} from 'lucide-react';

type AuthStep = 'login' | 'signup' | '2fa-setup' | '2fa-verify' | 'recovery' | 'reset-password';
type AuthMode = 'login' | 'signup';

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  code?: string;
  general?: string;
}

interface PasswordStrength {
  score: number;
  feedback: string[];
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
}

interface TwoFAData {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export default function AuthenticationFlow() {
  const [currentStep, setCurrentStep] = useState<AuthStep>('login');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    recoveryEmail: '',
    verificationCode: ''
  });

  // Validation and errors
  const [errors, setErrors] = useState<FormErrors>({});
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSymbol: false
  });

  // 2FA data
  const [twoFAData, setTwoFAData] = useState<TwoFAData>({
    secret: 'JBSWY3DPEHPK3PXP',
    qrCodeUrl: '',
    backupCodes: []
  });

  // Refs for focus management
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  // Real-time password strength validation
  const validatePasswordStrength = useCallback((password: string): PasswordStrength => {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const criteria = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSymbol];
    const score = criteria.filter(Boolean).length;

    const feedback = [];
    if (!hasMinLength) feedback.push('At least 8 characters');
    if (!hasUppercase) feedback.push('One uppercase letter');
    if (!hasLowercase) feedback.push('One lowercase letter');
    if (!hasNumber) feedback.push('One number');
    if (!hasSymbol) feedback.push('One special character');

    return {
      score,
      feedback,
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSymbol
    };
  }, []);

  // Form validation
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (authMode === 'signup' && passwordStrength.score < 4) {
      newErrors.password = 'Password does not meet security requirements';
    }

    // Confirm password for signup
    if (authMode === 'signup') {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, authMode, passwordStrength.score]);

  // Handle input changes
  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear specific field error
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Update password strength for password field
    if (field === 'password') {
      setPasswordStrength(validatePasswordStrength(value));
    }
  }, [errors, validatePasswordStrength]);

  // Generate mock 2FA data
  const generate2FAData = useCallback(() => {
    const secret = 'JBSWY3DPEHPK3PXP';
    const appName = encodeURIComponent('FinanceFlow');
    const userEmail = encodeURIComponent(formData.email);
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/${appName}:${userEmail}?secret=${secret}&issuer=${appName}`;
    
    const backupCodes = Array.from({ length: 8 }, () => 
      Math.random().toString(36).substr(2, 4).toUpperCase() + '-' + 
      Math.random().toString(36).substr(2, 4).toUpperCase()
    );

    setTwoFAData({ secret, qrCodeUrl, backupCodes });
  }, [formData.email]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 'recovery') {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentStep('reset-password');
      setIsLoading(false);
      return;
    }

    if (currentStep === 'reset-password') {
      if (!validateForm()) return;
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentStep('login');
      setIsLoading(false);
      return;
    }

    if (currentStep === '2fa-verify') {
      if (formData.verificationCode.length !== 6) {
        setErrors({ code: 'Please enter a valid 6-digit code' });
        return;
      }
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Simulate successful login
      setIsLoading(false);
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (authMode === 'signup') {
        generate2FAData();
        setCurrentStep('2fa-setup');
      } else {
        // Simulate 2FA requirement for existing user
        setCurrentStep('2fa-verify');
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }, [currentStep, validateForm, authMode, formData.verificationCode, generate2FAData]);

  // Handle 2FA setup completion
  const handle2FASetup = useCallback(async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setCurrentStep('2fa-verify');
    setIsLoading(false);
  }, []);

  // Focus management
  useEffect(() => {
    if (currentStep === 'login' || currentStep === 'signup') {
      emailRef.current?.focus();
    } else if (currentStep === '2fa-verify') {
      codeRef.current?.focus();
    }
  }, [currentStep]);

  // Password strength indicator component
  const PasswordStrengthIndicator = ({ strength }: { strength: PasswordStrength }) => (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-colors ${
              level <= strength.score
                ? strength.score <= 2
                  ? 'bg-destructive'
                  : strength.score <= 3
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
                : 'bg-muted'
            }`}
          />
        ))}
      </div>
      {strength.feedback.length > 0 && (
        <div className="text-xs text-muted-foreground">
          Missing: {strength.feedback.join(', ')}
        </div>
      )}
    </div>
  );

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3, ease: "easeIn" }
    }
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="backdrop-blur-xl bg-card/50 border border-border rounded-2xl p-8 shadow-2xl"
          >
            {/* Login/Signup Form */}
            {(currentStep === 'login' || currentStep === 'signup') && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center">
                    <UserRound className="w-6 h-6 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {authMode === 'login' ? 'Welcome back' : 'Create account'}
                  </h1>
                  <p className="text-muted-foreground">
                    {authMode === 'login' 
                      ? 'Sign in to your FinanceFlow account' 
                      : 'Start your financial journey with FinanceFlow'
                    }
                  </p>
                </div>

                <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as AuthMode)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login" className="flex items-center gap-2">
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger value="signup" className="flex items-center gap-2">
                      <UserRoundCheck className="w-4 h-4" />
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <motion.div variants={inputVariants} whileFocus="focus" whileBlur="blur">
                          <Input
                            ref={emailRef}
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={errors.email ? 'border-destructive' : ''}
                            aria-describedby={errors.email ? 'email-error' : undefined}
                          />
                        </motion.div>
                        {errors.email && (
                          <p id="email-error" className="text-sm text-destructive">{errors.email}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <motion.div variants={inputVariants} whileFocus="focus" whileBlur="blur">
                          <div className="relative">
                            <Input
                              ref={passwordRef}
                              id="password"
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Enter your password"
                              value={formData.password}
                              onChange={(e) => handleInputChange('password', e.target.value)}
                              className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                              aria-describedby={errors.password ? 'password-error' : undefined}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                              <Component className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                        {errors.password && (
                          <p id="password-error" className="text-sm text-destructive">{errors.password}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={rememberDevice}
                            onChange={(e) => setRememberDevice(e.target.checked)}
                            className="rounded border-border"
                          />
                          <span className="text-muted-foreground">Remember this device</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setCurrentStep('recovery')}
                          className="text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>

                      {errors.general && (
                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                          <p className="text-sm text-destructive">{errors.general}</p>
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <Spline className="w-4 h-4 animate-spin" />
                            Signing in...
                          </div>
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First name</Label>
                          <Input
                            id="firstName"
                            placeholder="First name"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className={errors.firstName ? 'border-destructive' : ''}
                          />
                          {errors.firstName && (
                            <p className="text-xs text-destructive">{errors.firstName}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last name</Label>
                          <Input
                            id="lastName"
                            placeholder="Last name"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className={errors.lastName ? 'border-destructive' : ''}
                          />
                          {errors.lastName && (
                            <p className="text-xs text-destructive">{errors.lastName}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={errors.email ? 'border-destructive' : ''}
                        />
                        {errors.email && (
                          <p className="text-sm text-destructive">{errors.email}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a strong password"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Component className="w-4 h-4" />
                          </button>
                        </div>
                        {formData.password && <PasswordStrengthIndicator strength={passwordStrength} />}
                        {errors.password && (
                          <p className="text-sm text-destructive">{errors.password}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm password</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            className={errors.confirmPassword ? 'border-destructive pr-10' : 'pr-10'}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Component className="w-4 h-4" />
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <Spline className="w-4 h-4 animate-spin" />
                            Creating account...
                          </div>
                        ) : (
                          'Create Account'
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {/* 2FA Setup */}
            {currentStep === '2fa-setup' && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center">
                    <Vault className="w-6 h-6 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground">Set up 2FA</h1>
                  <p className="text-muted-foreground">
                    Secure your account with two-factor authentication
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border border-border rounded-xl bg-muted/20">
                    <div className="flex items-center gap-3 mb-3">
                      <ScanQrCode className="w-5 h-5 text-primary" />
                      <h3 className="font-medium">Scan QR Code</h3>
                    </div>
                    <div className="bg-white p-4 rounded-lg mb-3 flex justify-center">
                      <img
                        src={twoFAData.qrCodeUrl}
                        alt="2FA QR Code"
                        className="w-32 h-32"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                    </p>
                  </div>

                  <div className="p-4 border border-border rounded-xl bg-muted/20">
                    <div className="flex items-center gap-3 mb-3">
                      <CaseSensitive className="w-5 h-5 text-primary" />
                      <h3 className="font-medium">Manual Entry</h3>
                    </div>
                    <div className="bg-card p-3 rounded-lg border border-border font-mono text-sm">
                      {twoFAData.secret}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      If you can't scan the QR code, enter this secret key manually
                    </p>
                  </div>

                  <div className="p-4 border border-border rounded-xl bg-muted/20">
                    <div className="flex items-center gap-3 mb-3">
                      <TicketX className="w-5 h-5 text-primary" />
                      <h3 className="font-medium">Backup Codes</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {twoFAData.backupCodes.map((code, index) => (
                        <div
                          key={index}
                          className="bg-card p-2 rounded border border-border font-mono text-xs text-center"
                        >
                          {code}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Save these backup codes in a secure location. Use them if you lose access to your authenticator app.
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handle2FASetup}
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Spline className="w-4 h-4 animate-spin" />
                      Setting up...
                    </div>
                  ) : (
                    'Continue to Verification'
                  )}
                </Button>
              </div>
            )}

            {/* 2FA Verification */}
            {currentStep === '2fa-verify' && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center">
                    <ShieldOff className="w-6 h-6 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground">Verify your identity</h1>
                  <p className="text-muted-foreground">
                    Enter the 6-digit code from your authenticator app
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Verification code</Label>
                    <Input
                      ref={codeRef}
                      id="code"
                      type="text"
                      placeholder="000000"
                      maxLength={6}
                      value={formData.verificationCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        handleInputChange('verificationCode', value);
                      }}
                      className={`text-center font-mono text-lg tracking-wider ${
                        errors.code ? 'border-destructive' : ''
                      }`}
                      aria-describedby={errors.code ? 'code-error' : undefined}
                    />
                    {errors.code && (
                      <p id="code-error" className="text-sm text-destructive">{errors.code}</p>
                    )}
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      Use backup code instead
                    </button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || formData.verificationCode.length !== 6}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Spline className="w-4 h-4 animate-spin" />
                        Verifying...
                      </div>
                    ) : (
                      'Verify & Sign In'
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('login')}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Back to sign in
                  </button>
                </div>
              </div>
            )}

            {/* Password Recovery */}
            {currentStep === 'recovery' && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center">
                    <IdCard className="w-6 h-6 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground">Reset password</h1>
                  <p className="text-muted-foreground">
                    Enter your email address and we'll send you a reset link
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recoveryEmail">Email address</Label>
                    <Input
                      id="recoveryEmail"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.recoveryEmail}
                      onChange={(e) => handleInputChange('recoveryEmail', e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || !formData.recoveryEmail}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Spline className="w-4 h-4 animate-spin" />
                        Sending reset link...
                      </div>
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('login')}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Back to sign in
                  </button>
                </div>
              </div>
            )}

            {/* Reset Password */}
            {currentStep === 'reset-password' && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center">
                    <CircleUserRound className="w-6 h-6 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground">Create new password</h1>
                  <p className="text-muted-foreground">
                    Choose a strong password for your account
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Component className="w-4 h-4" />
                      </button>
                    </div>
                    {formData.password && <PasswordStrengthIndicator strength={passwordStrength} />}
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword">Confirm new password</Label>
                    <div className="relative">
                      <Input
                        id="confirmNewPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={errors.confirmPassword ? 'border-destructive pr-10' : 'pr-10'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Component className="w-4 h-4" />
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || passwordStrength.score < 4}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Spline className="w-4 h-4 animate-spin" />
                        Updating password...
                      </div>
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                </form>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}