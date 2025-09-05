"use client";

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Webhook, 
  Import, 
  ArrowRightLeft, 
  FileInput, 
  ChartNetwork, 
  FolderSync, 
  ChartSpline, 
  BanknoteArrowUp, 
  ChartBarIncreasing, 
  PiggyBank, 
  CreditCard, 
  FileCog, 
  SquareActivity, 
  Nfc, 
  CalendarSync 
} from 'lucide-react';

interface ConnectionStatus {
  id: string;
  name: string;
  type: 'bank' | 'investment' | 'fitness' | 'manual';
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  lastSync: string;
  accounts?: number;
  icon: typeof Webhook;
}

interface ImportHistory {
  id: string;
  name: string;
  type: 'csv' | 'xlsx' | 'manual';
  date: string;
  records: number;
  status: 'success' | 'error' | 'partial';
  errors?: number;
}

const mockConnections: ConnectionStatus[] = [
  {
    id: '1',
    name: 'Chase Bank',
    type: 'bank',
    status: 'connected',
    lastSync: '2 min ago',
    accounts: 3,
    icon: CreditCard
  },
  {
    id: '2',
    name: 'Vanguard',
    type: 'investment',
    status: 'connected',
    lastSync: '1 hour ago',
    accounts: 2,
    icon: ChartBarIncreasing
  },
  {
    id: '3',
    name: 'Google Fit',
    type: 'fitness',
    status: 'syncing',
    lastSync: 'Syncing...',
    icon: SquareActivity
  },
  {
    id: '4',
    name: 'Wells Fargo',
    type: 'bank',
    status: 'error',
    lastSync: '3 days ago',
    accounts: 1,
    icon: CreditCard
  }
];

const mockImportHistory: ImportHistory[] = [
  {
    id: '1',
    name: 'transactions_q4_2023.csv',
    type: 'csv',
    date: '2 hours ago',
    records: 245,
    status: 'success'
  },
  {
    id: '2',
    name: 'investment_data.xlsx',
    type: 'xlsx',
    date: '1 day ago',
    records: 156,
    status: 'partial',
    errors: 3
  },
  {
    id: '3',
    name: 'Manual Entry - Crypto',
    type: 'manual',
    date: '3 days ago',
    records: 12,
    status: 'success'
  }
];

export default function IntegrationsHub() {
  const [activeTab, setActiveTab] = useState('connections');
  const [showConnectionDialog, setShowConnectionDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'syncing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getImportStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'partial':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  }, []);

  const handleImport = useCallback(async () => {
    if (!selectedFile) return;
    
    setIsImporting(true);
    setImportProgress(0);
    
    // Simulate import progress
    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsImporting(false);
          setShowImportDialog(false);
          setSelectedFile(null);
          setImportProgress(0);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  }, [selectedFile]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gradient-finance-flow">
            Integrations Hub
          </h2>
          <p className="text-muted-foreground mt-2">
            Connect your accounts and import data from multiple sources
          </p>
        </div>
        <div className="flex gap-3">
          <Dialog open={showConnectionDialog} onOpenChange={setShowConnectionDialog}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <ChartNetwork className="h-4 w-4 mr-2" />
                Add Connection
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>Add New Connection</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardContent className="p-4 text-center">
                    <CreditCard className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold">Bank Account</h3>
                    <p className="text-sm text-muted-foreground">Connect via Plaid</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardContent className="p-4 text-center">
                    <ChartBarIncreasing className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold">Investment</h3>
                    <p className="text-sm text-muted-foreground">Brokerage accounts</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardContent className="p-4 text-center">
                    <SquareActivity className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold">Fitness</h3>
                    <p className="text-sm text-muted-foreground">Health & activity data</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardContent className="p-4 text-center">
                    <PiggyBank className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold">Savings</h3>
                    <p className="text-sm text-muted-foreground">High-yield accounts</p>
                  </CardContent>
                </Card>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-border hover:bg-accent">
                <Import className="h-4 w-4 mr-2" />
                Import Data
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>Import Financial Data</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {!selectedFile && (
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <FileInput className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-semibold mb-2">Select file to import</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Supports CSV, XLSX, and OFX formats
                    </p>
                    <Input
                      type="file"
                      accept=".csv,.xlsx,.xls,.ofx"
                      onChange={handleFileSelect}
                      className="max-w-xs mx-auto"
                    />
                  </div>
                )}
                
                {selectedFile && !isImporting && (
                  <div className="space-y-4">
                    <div className="bg-accent/30 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <FileCog className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold">{selectedFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(selectedFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="data-type">Data Type</Label>
                        <Select defaultValue="transactions">
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="transactions">Transactions</SelectItem>
                            <SelectItem value="investments">Investments</SelectItem>
                            <SelectItem value="budgets">Budget Data</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="categorize">Auto-categorize</Label>
                        <Switch id="categorize" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="duplicates">Detect duplicates</Label>
                        <Switch id="duplicates" defaultChecked />
                      </div>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleImport} className="flex-1">
                        Import Data
                      </Button>
                      <Button variant="outline" onClick={() => setSelectedFile(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                
                {isImporting && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <FolderSync className="h-12 w-12 mx-auto mb-4 text-primary animate-spin" />
                      <h3 className="font-semibold mb-2">Importing data...</h3>
                      <p className="text-sm text-muted-foreground">
                        Processing {selectedFile?.name}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{importProgress}%</span>
                      </div>
                      <Progress value={importProgress} className="w-full" />
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-muted/30">
          <TabsTrigger value="connections" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <ChartNetwork className="h-4 w-4 mr-2" />
            Connections
          </TabsTrigger>
          <TabsTrigger value="imports" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Import className="h-4 w-4 mr-2" />
            Import History
          </TabsTrigger>
          <TabsTrigger value="sync" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <CalendarSync className="h-4 w-4 mr-2" />
            Sync Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connections" className="space-y-4">
          <div className="grid gap-4">
            {mockConnections.map((connection) => {
              const IconComponent = connection.icon;
              return (
                <Card key={connection.id} className="bg-card/50 backdrop-blur-sm border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{connection.name}</h3>
                          <div className="flex items-center gap-4 mt-1">
                            <Badge className={getStatusColor(connection.status)}>
                              {connection.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Last sync: {connection.lastSync}
                            </span>
                            {connection.accounts && (
                              <span className="text-sm text-muted-foreground">
                                {connection.accounts} accounts
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {connection.status === 'syncing' && (
                          <ArrowRightLeft className="h-4 w-4 text-blue-400 animate-pulse" />
                        )}
                        <Button variant="outline" size="sm">
                          {connection.status === 'error' ? 'Reconnect' : 'Manage'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="imports" className="space-y-4">
          <div className="grid gap-4">
            {mockImportHistory.map((item) => (
              <Card key={item.id} className="bg-card/50 backdrop-blur-sm border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-accent/50 border border-border">
                        <FileInput className="h-6 w-6 text-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <Badge className={getImportStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {item.records} records
                          </span>
                          {item.errors && (
                            <span className="text-sm text-red-400">
                              {item.errors} errors
                            </span>
                          )}
                          <span className="text-sm text-muted-foreground">
                            {item.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {item.status === 'error' && (
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          Retry
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sync" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarSync className="h-5 w-5 text-primary" />
                  Sync Frequency
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="bank-sync">Bank Accounts</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="investment-sync">Investments</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="fitness-sync">Fitness Data</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartSpline className="h-5 w-5 text-primary" />
                  Data Processing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-categorize">Auto-categorize transactions</Label>
                  <Switch id="auto-categorize" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="duplicate-detection">Duplicate detection</Label>
                  <Switch id="duplicate-detection" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="smart-matching">Smart merchant matching</Label>
                  <Switch id="smart-matching" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="data-enrichment">Data enrichment</Label>
                  <Switch id="data-enrichment" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Nfc className="h-5 w-5 text-primary" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="encryption">End-to-end encryption</Label>
                    <Switch id="encryption" defaultChecked disabled />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="two-factor">Two-factor authentication</Label>
                    <Switch id="two-factor" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="access-logs">Access logging</Label>
                    <Switch id="access-logs" defaultChecked />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="data-retention">Data retention (days)</Label>
                    <Input type="number" defaultValue="2555" className="w-20" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="backup-frequency">Backup frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}