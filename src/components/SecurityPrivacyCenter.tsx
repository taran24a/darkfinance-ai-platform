"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Calendar, Clock, Download, Eye, EyeOff, Globe, Info, Key, MapPin, MoreHorizontal, RefreshCw, Search, Shield, Smartphone, Trash2, User, Wifi, X } from "lucide-react";
import {
  ShieldOff,
  ShieldPlus,
  ScanFace,
  ShieldEllipsis,
  Lock,
  Fingerprint,
  Cctv,
  UserLock,
  ShieldQuestionMark,
  FileLock2
} from "lucide-react";
import { toast } from "sonner";

interface Device {
  id: string;
  name: string;
  type: "desktop" | "mobile" | "tablet";
  location: string;
  lastActive: string;
  ipAddress: string;
  isCurrent: boolean;
  trusted: boolean;
}

interface AuditLogEntry {
  id: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  location: string;
  userAgent: string;
  risk: "low" | "medium" | "high";
}

interface SecurityAlert {
  id: string;
  type: "login" | "transaction" | "data_access" | "privacy";
  title: string;
  description: string;
  timestamp: string;
  severity: "info" | "warning" | "critical";
  resolved: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  loginAlerts: boolean;
  transactionAlerts: boolean;
  dataExportRequests: boolean;
  autoLockEnabled: boolean;
  sessionTimeout: number;
  panicModeEnabled: boolean;
  panicHotkey: string;
}

export default function SecurityPrivacyCenter() {
  const [settings, setSettings] = useState<SecuritySettings>({
    twoFactorEnabled: true,
    biometricEnabled: false,
    emailNotifications: true,
    smsNotifications: true,
    loginAlerts: true,
    transactionAlerts: true,
    dataExportRequests: false,
    autoLockEnabled: true,
    sessionTimeout: 30,
    panicModeEnabled: false,
    panicHotkey: "Ctrl+Shift+H"
  });

  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [panicMode, setPanicMode] = useState(false);
  const [maskMode, setMaskMode] = useState(false);
  const [securityScore, setSecurityScore] = useState(87);

  const devices: Device[] = [
    {
      id: "1",
      name: "MacBook Pro",
      type: "desktop",
      location: "San Francisco, CA",
      lastActive: "2 minutes ago",
      ipAddress: "192.168.1.100",
      isCurrent: true,
      trusted: true
    },
    {
      id: "2", 
      name: "iPhone 15 Pro",
      type: "mobile",
      location: "San Francisco, CA",
      lastActive: "1 hour ago",
      ipAddress: "192.168.1.101",
      isCurrent: false,
      trusted: true
    },
    {
      id: "3",
      name: "Unknown Device",
      type: "desktop",
      location: "New York, NY",
      lastActive: "3 days ago",
      ipAddress: "203.45.67.89",
      isCurrent: false,
      trusted: false
    }
  ];

  const auditLogs: AuditLogEntry[] = [
    {
      id: "1",
      action: "Login successful",
      timestamp: "2024-01-15 14:30:22",
      ipAddress: "192.168.1.100",
      location: "San Francisco, CA",
      userAgent: "Chrome 120.0 macOS",
      risk: "low"
    },
    {
      id: "2",
      action: "Password changed",
      timestamp: "2024-01-14 09:15:10",
      ipAddress: "192.168.1.100",
      location: "San Francisco, CA",
      userAgent: "Chrome 120.0 macOS",
      risk: "medium"
    },
    {
      id: "3",
      action: "Failed login attempt",
      timestamp: "2024-01-13 22:45:33",
      ipAddress: "203.45.67.89",
      location: "New York, NY",
      userAgent: "Firefox 121.0 Windows",
      risk: "high"
    }
  ];

  const securityAlerts: SecurityAlert[] = [
    {
      id: "1",
      type: "login",
      title: "Suspicious login attempt",
      description: "Login attempt from unrecognized device in New York",
      timestamp: "2024-01-13 22:45:33",
      severity: "warning",
      resolved: false
    },
    {
      id: "2",
      type: "transaction",
      title: "Unusual spending pattern detected",
      description: "AI detected spending pattern deviation (+150% from normal)",
      timestamp: "2024-01-12 16:20:15",
      severity: "info",
      resolved: true
    }
  ];

  // Panic mode hotkey handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (settings.panicModeEnabled && event.ctrlKey && event.shiftKey && event.key === 'H') {
        event.preventDefault();
        togglePanicMode();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [settings.panicModeEnabled]);

  const togglePanicMode = useCallback(() => {
    setPanicMode(prev => {
      const newState = !prev;
      if (newState) {
        setMaskMode(true);
        toast.success("Panic mode activated - Numbers hidden");
      } else {
        setMaskMode(false);
        toast.success("Panic mode deactivated");
      }
      return newState;
    });
  }, []);

  const handleSettingChange = useCallback((key: keyof SecuritySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast.success("Setting updated successfully");
  }, []);

  const handleDeviceAction = useCallback((deviceId: string, action: "trust" | "remove") => {
    setIsLoading(true);
    setTimeout(() => {
      if (action === "remove") {
        toast.success("Device removed successfully");
      } else {
        toast.success("Device trust status updated");
      }
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleDataExport = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      toast.success("Data export request submitted. You'll receive an email when ready.");
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleDataDeletion = useCallback(() => {
    toast.error("Account deletion request submitted. This action cannot be undone.");
  }, []);

  const getDeviceIcon = (type: Device["type"]) => {
    switch (type) {
      case "mobile": return <Smartphone className="h-4 w-4" />;
      case "tablet": return <Smartphone className="h-4 w-4" />;
      default: return <Cctv className="h-4 w-4" />;
    }
  };

  const getRiskBadgeColor = (risk: AuditLogEntry["risk"]) => {
    switch (risk) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-green-500/20 text-green-400 border-green-500/30";
    }
  };

  const getSeverityIcon = (severity: SecurityAlert["severity"]) => {
    switch (severity) {
      case "critical": return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      default: return <Info className="h-4 w-4 text-blue-400" />;
    }
  };

  const filteredLogs = auditLogs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--text-gradient-start)] to-[var(--text-gradient-end)] bg-clip-text text-transparent">
            Security & Privacy Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your account security, privacy settings, and monitor account activity
          </p>
        </div>
        
        {/* Panic Mode Toggle */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={panicMode}
              onCheckedChange={togglePanicMode}
              disabled={!settings.panicModeEnabled}
            />
            <Label className="text-sm font-medium">Panic Mode</Label>
          </div>
          <Badge variant="outline" className="text-xs">
            Security Score: {securityScore}%
          </Badge>
        </div>
      </div>

      {/* Security Score Card */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Security Overview</CardTitle>
            </div>
            <Badge variant={securityScore >= 80 ? "default" : "destructive"}>
              {securityScore >= 80 ? "Strong" : "Needs Attention"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShieldPlus className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium">2FA Enabled</span>
              </div>
              <p className="text-xs text-muted-foreground">Two-factor authentication active</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium">Data Encrypted</span>
              </div>
              <p className="text-xs text-muted-foreground">End-to-end encryption enabled</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Fingerprint className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-medium">Biometric Auth</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {settings.biometricEnabled ? "Enabled" : "Disabled"}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Security Score</span>
              <span>{securityScore}%</span>
            </div>
            <Progress value={securityScore} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="authentication">Auth</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Security Alerts */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  Security Alerts
                </CardTitle>
                <Badge variant="outline">
                  {securityAlerts.filter(alert => !alert.resolved).length} Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {securityAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                  {getSeverityIcon(alert.severity)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{alert.title}</h4>
                      <Badge variant={alert.resolved ? "default" : "destructive"} className="text-xs">
                        {alert.resolved ? "Resolved" : "Active"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {alert.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <UserLock className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Change Password</h3>
                    <p className="text-sm text-muted-foreground">Update your account password</p>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Change Password
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <ScanFace className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Biometric Setup</h3>
                    <p className="text-sm text-muted-foreground">Enable fingerprint or face ID</p>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Setup Biometrics
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <FileLock2 className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Export Data</h3>
                    <p className="text-sm text-muted-foreground">Download your account data</p>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline" onClick={handleDataExport}>
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Export Data"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Authentication Tab */}
        <TabsContent value="authentication" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Two-Factor Authentication */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldPlus className="h-5 w-5" />
                  Two-Factor Authentication
                </CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">2FA Status</Label>
                    <p className="text-sm text-muted-foreground">
                      {settings.twoFactorEnabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                  <Switch
                    checked={settings.twoFactorEnabled}
                    onCheckedChange={(checked) => handleSettingChange("twoFactorEnabled", checked)}
                  />
                </div>
                {settings.twoFactorEnabled && (
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Key className="h-4 w-4 mr-2" />
                      View Recovery Codes
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate Codes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Biometric Authentication */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Fingerprint className="h-5 w-5" />
                  Biometric Authentication
                </CardTitle>
                <CardDescription>
                  Use your fingerprint or face ID to sign in
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Biometric Login</Label>
                    <p className="text-sm text-muted-foreground">
                      {settings.biometricEnabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                  <Switch
                    checked={settings.biometricEnabled}
                    onCheckedChange={(checked) => handleSettingChange("biometricEnabled", checked)}
                  />
                </div>
                {!settings.biometricEnabled && (
                  <Button className="w-full">
                    <ScanFace className="h-4 w-4 mr-2" />
                    Setup Biometric Auth
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Session Management */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Session Management
                </CardTitle>
                <CardDescription>
                  Control how long you stay logged in
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Auto-lock</Label>
                    <p className="text-sm text-muted-foreground">
                      Lock account after inactivity
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoLockEnabled}
                    onCheckedChange={(checked) => handleSettingChange("autoLockEnabled", checked)}
                  />
                </div>
                {settings.autoLockEnabled && (
                  <div className="space-y-2">
                    <Label>Session Timeout (minutes)</Label>
                    <Select
                      value={settings.sessionTimeout.toString()}
                      onValueChange={(value) => handleSettingChange("sessionTimeout", parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Panic Mode */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <EyeOff className="h-5 w-5" />
                  Panic Mode
                </CardTitle>
                <CardDescription>
                  Quickly hide sensitive information with a hotkey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Enable Panic Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Hide numbers instantly with {settings.panicHotkey}
                    </p>
                  </div>
                  <Switch
                    checked={settings.panicModeEnabled}
                    onCheckedChange={(checked) => handleSettingChange("panicModeEnabled", checked)}
                  />
                </div>
                {settings.panicModeEnabled && (
                  <div className="space-y-2">
                    <Label>Hotkey Combination</Label>
                    <Input
                      value={settings.panicHotkey}
                      onChange={(e) => handleSettingChange("panicHotkey", e.target.value)}
                      placeholder="Ctrl+Shift+H"
                    />
                  </div>
                )}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={togglePanicMode}
                  disabled={!settings.panicModeEnabled}
                >
                  Test Panic Mode
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Devices Tab */}
        <TabsContent value="devices" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Cctv className="h-5 w-5" />
                    Active Devices
                  </CardTitle>
                  <CardDescription>
                    Manage devices that have access to your account
                  </CardDescription>
                </div>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {devices.map((device) => (
                <div key={device.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-3">
                    {getDeviceIcon(device.type)}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{device.name}</h4>
                        {device.isCurrent && (
                          <Badge variant="default" className="text-xs">Current</Badge>
                        )}
                        {device.trusted && (
                          <Badge variant="outline" className="text-xs">Trusted</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {device.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {device.lastActive}
                        </span>
                        <span className="flex items-center gap-1">
                          <Wifi className="h-3 w-3" />
                          {device.ipAddress}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!device.trusted && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeviceAction(device.id, "trust")}
                      >
                        Trust
                      </Button>
                    )}
                    {!device.isCurrent && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeviceAction(device.id, "remove")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Notification Preferences */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you want to be notified about account activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive security alerts via email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive security alerts via SMS</p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleSettingChange("smsNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Login Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified of new logins</p>
                  </div>
                  <Switch
                    checked={settings.loginAlerts}
                    onCheckedChange={(checked) => handleSettingChange("loginAlerts", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Transaction Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified of suspicious transactions</p>
                  </div>
                  <Switch
                    checked={settings.transactionAlerts}
                    onCheckedChange={(checked) => handleSettingChange("transactionAlerts", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Data Rights */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Data Rights & GDPR</CardTitle>
                <CardDescription>
                  Exercise your data protection rights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start" onClick={handleDataExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export My Data
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full justify-start">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete My Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Account</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. All your data will be permanently deleted.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Type "DELETE" to confirm</Label>
                        <Input placeholder="DELETE" />
                      </div>
                      <div className="space-y-2">
                        <Label>Reason for deletion (optional)</Label>
                        <Textarea placeholder="Please tell us why you're leaving..." />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="destructive" onClick={handleDataDeletion} className="flex-1">
                          Confirm Deletion
                        </Button>
                        <Button variant="outline" className="flex-1">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <div className="pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Data Export Requests</Label>
                      <p className="text-sm text-muted-foreground">Allow automated data exports</p>
                    </div>
                    <Switch
                      checked={settings.dataExportRequests}
                      onCheckedChange={(checked) => handleSettingChange("dataExportRequests", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Audit Tab */}
        <TabsContent value="audit" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldEllipsis className="h-5 w-5" />
                    Audit Log
                  </CardTitle>
                  <CardDescription>
                    View detailed account activity and security events
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{log.action}</h4>
                      <Badge className={getRiskBadgeColor(log.risk)}>
                        {log.risk} risk
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {log.timestamp}
                      </span>
                      <span className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {log.ipAddress}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {log.location}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{log.userAgent}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}