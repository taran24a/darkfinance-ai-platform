"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ChartSpline, 
  ChartArea, 
  ChartCandlestick, 
  TrendingUpDown, 
  ChartBarIncreasing, 
  TrendingUp, 
  SquareActivity,
  FileChartPie,
  BadgeJapaneseYen,
  Radar,
  ScreenShare,
  FileChartLine,
  MonitorPlay
} from 'lucide-react';

// Mock data for demonstration
const mockStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 2.34, changePercent: 1.35, volume: '58.2M', marketCap: '2.75T', pe: 28.5, pb: 39.4, sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 138.21, change: -1.87, changePercent: -1.33, volume: '25.1M', marketCap: '1.73T', pe: 25.8, pb: 5.1, sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.85, change: 4.12, changePercent: 1.10, volume: '32.7M', marketCap: '2.81T', pe: 32.1, pb: 12.8, sector: 'Technology' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.42, change: -5.67, changePercent: -2.23, volume: '89.4M', marketCap: '790B', pe: 65.2, pb: 15.3, sector: 'Automotive' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 147.92, change: 1.23, changePercent: 0.84, volume: '41.2M', marketCap: '1.54T', pe: 42.7, pb: 8.9, sector: 'Consumer Discretionary' }
];

const mockNews = [
  { title: 'Federal Reserve maintains interest rates', time: '2h ago', source: 'Reuters' },
  { title: 'Tech earnings season shows mixed results', time: '4h ago', source: 'Bloomberg' },
  { title: 'Oil prices surge on supply concerns', time: '6h ago', source: 'CNBC' },
  { title: 'Cryptocurrency market sees volatility', time: '8h ago', source: 'MarketWatch' }
];

const mockEarnings = [
  { symbol: 'NVDA', company: 'NVIDIA Corp.', date: 'Today', time: 'After Close', estimate: '$5.08' },
  { symbol: 'DIS', company: 'Walt Disney Co.', date: 'Tomorrow', time: 'After Close', estimate: '$1.14' },
  { symbol: 'UBER', company: 'Uber Technologies', date: 'Feb 8', time: 'After Close', estimate: '$0.17' },
  { symbol: 'RBLX', company: 'Roblox Corp.', date: 'Feb 9', time: 'After Close', estimate: '$0.22' }
];

const investmentProfiles = {
  conservative: {
    title: 'Conservative',
    description: 'Low risk, steady growth',
    suggestions: ['VTI', 'SCHD', 'BND', 'VXUS'],
    riskLevel: 'Low'
  },
  moderate: {
    title: 'Moderate',
    description: 'Balanced risk and reward',
    suggestions: ['SPY', 'QQQ', 'VEA', 'VTEB'],
    riskLevel: 'Medium'
  },
  aggressive: {
    title: 'Growth Focused',
    description: 'Higher risk, growth potential',
    suggestions: ['TQQQ', 'ARKK', 'ICLN', 'BLOK'],
    riskLevel: 'High'
  }
};

interface StockMarketHubProps {
  className?: string;
}

export default function StockMarketHub({ className }: StockMarketHubProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [watchlist, setWatchlist] = useState<string[]>(['AAPL', 'GOOGL', 'MSFT']);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(['AAPL', 'TSLA']);
  const [filters, setFilters] = useState({
    sector: 'all',
    marketCap: 'all',
    peRatio: 'all'
  });
  const [priceAlerts, setPriceAlerts] = useState<Array<{symbol: string, price: number, condition: 'above' | 'below'}>>([]);
  const [paperTradingEnabled, setPaperTradingEnabled] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<keyof typeof investmentProfiles>('moderate');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const filteredStocks = mockStocks.filter(stock => {
    const matchesSearch = stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         stock.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = filters.sector === 'all' || stock.sector === filters.sector;
    const matchesMarketCapValue = parseFloat(stock.marketCap.replace(/[^0-9.]/g, ''));
    const matchesMarketCap = filters.marketCap === 'all' || 
      (filters.marketCap === 'large' && matchesMarketCapValue > 10) ||
      (filters.marketCap === 'mid' && matchesMarketCapValue >= 2 && matchesMarketCapValue <= 10) ||
      (filters.marketCap === 'small' && matchesMarketCapValue < 2);
    const matchesPE = filters.peRatio === 'all' ||
      (filters.peRatio === 'low' && stock.pe < 20) ||
      (filters.peRatio === 'medium' && stock.pe >= 20 && stock.pe <= 35) ||
      (filters.peRatio === 'high' && stock.pe > 35);
    
    return matchesSearch && matchesSector && matchesMarketCap && matchesPE;
  });

  const addToWatchlist = useCallback((symbol: string) => {
    setWatchlist(prev => prev.includes(symbol) ? prev : [...prev, symbol]);
  }, []);

  const removeFromWatchlist = useCallback((symbol: string) => {
    setWatchlist(prev => prev.filter(s => s !== symbol));
  }, []);

  const addToRecentlyViewed = useCallback((symbol: string) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(s => s !== symbol);
      return [symbol, ...filtered].slice(0, 5);
    });
  }, []);

  const refreshData = useCallback(() => {
    setLastRefresh(new Date());
    // In real implementation, this would fetch fresh data from APIs
  }, []);

  useEffect(() => {
    const interval = setInterval(refreshData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [refreshData]);

  const renderSparkline = (symbol: string) => (
    <div className="h-8 w-16 flex items-end space-x-1">
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          className={`w-1 rounded-t ${
            Math.random() > 0.5 ? 'bg-green-500' : 'bg-red-500'
          }`}
          style={{ height: `${Math.random() * 100}%` }}
        />
      ))}
    </div>
  );

  const getStockDisplayValue = (value: number, prefix: string = '') => {
    return value >= 0 ? `+${prefix}${value}` : `${prefix}${value}`;
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Stock Market Hub</h1>
          <p className="text-muted-foreground">
            Last updated: {lastRefresh.toLocaleTimeString()} • Real-time market data
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={refreshData} variant="outline" size="sm">
            <SquareActivity className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <div className="flex items-center space-x-2">
            <Switch
              id="paper-trading"
              checked={paperTradingEnabled}
              onCheckedChange={setPaperTradingEnabled}
            />
            <Label htmlFor="paper-trading" className="text-sm">Paper Trading</Label>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          <TabsTrigger value="screener">Screener</TabsTrigger>
          <TabsTrigger value="news">News &amp; Events</TabsTrigger>
          <TabsTrigger value="advisor">AI Advisor</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Market Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card/50 backdrop-blur border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                  S&P 500
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4,567.23</div>
                <div className="flex items-center text-sm text-green-500">
                  +23.45 (+0.52%)
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <ChartBarIncreasing className="h-4 w-4 mr-2 text-blue-500" />
                  NASDAQ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">14,234.56</div>
                <div className="flex items-center text-sm text-green-500">
                  +89.12 (+0.63%)
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <FileChartPie className="h-4 w-4 mr-2 text-purple-500" />
                  Dow Jones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">34,892.11</div>
                <div className="flex items-center text-sm text-red-500">
                  -45.67 (-0.13%)
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <TrendingUpDown className="h-4 w-4 mr-2 text-orange-500" />
                  VIX
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18.42</div>
                <div className="flex items-center text-sm text-red-500">
                  +1.23 (+7.15%)
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Movers */}
          <Card className="bg-card/50 backdrop-blur border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ChartSpline className="h-5 w-5 mr-2" />
                Market Movers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 text-green-500">Top Gainers</h4>
                  <div className="space-y-2">
                    {mockStocks
                      .filter(stock => stock.change > 0)
                      .slice(0, 3)
                      .map((stock) => (
                        <div key={stock.symbol} className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
                          <div className="flex items-center space-x-3">
                            <Badge variant="secondary">{stock.symbol}</Badge>
                            <span className="text-sm">{stock.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {renderSparkline(stock.symbol)}
                            <div className="text-right">
                              <div className="font-medium">${stock.price}</div>
                              <div className="text-sm text-green-500">
                                +{stock.changePercent.toFixed(2)}%
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3 text-red-500">Top Decliners</h4>
                  <div className="space-y-2">
                    {mockStocks
                      .filter(stock => stock.change < 0)
                      .slice(0, 3)
                      .map((stock) => (
                        <div key={stock.symbol} className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
                          <div className="flex items-center space-x-3">
                            <Badge variant="secondary">{stock.symbol}</Badge>
                            <span className="text-sm">{stock.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {renderSparkline(stock.symbol)}
                            <div className="text-right">
                              <div className="font-medium">${stock.price}</div>
                              <div className="text-sm text-red-500">
                                {stock.changePercent.toFixed(2)}%
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="watchlist" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <SquareActivity className="h-5 w-5 mr-2" />
                  My Watchlist
                </CardTitle>
                <Badge variant="outline">{watchlist.length} stocks</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {watchlist.map((symbol) => {
                  const stock = mockStocks.find(s => s.symbol === symbol);
                  if (!stock) return null;
                  
                  return (
                    <div key={symbol} className="flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="font-medium">{stock.symbol}</div>
                          <div className="text-sm text-muted-foreground">{stock.name}</div>
                        </div>
                        {renderSparkline(stock.symbol)}
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-medium">${stock.price}</div>
                          <div className={`text-sm ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {getStockDisplayValue(stock.change)} ({getStockDisplayValue(stock.changePercent)}%)
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromWatchlist(symbol)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recently Viewed */}
          <Card className="bg-card/50 backdrop-blur border-border">
            <CardHeader>
              <CardTitle>Recently Viewed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {recentlyViewed.map((symbol) => {
                  const stock = mockStocks.find(s => s.symbol === symbol);
                  if (!stock) return null;
                  
                  return (
                    <Card key={symbol} className="p-3 cursor-pointer hover:bg-muted/20 transition-colors">
                      <div className="text-center">
                        <Badge variant="secondary" className="mb-2">{stock.symbol}</Badge>
                        <div className="text-lg font-medium">${stock.price}</div>
                        <div className={`text-sm ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {getStockDisplayValue(stock.changePercent)}%
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="screener" className="space-y-6">
          {/* Search and Filters */}
          <Card className="bg-card/50 backdrop-blur border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Radar className="h-5 w-5 mr-2" />
                Stock Screener
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Search stocks by symbol or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Sector</Label>
                  <Select value={filters.sector} onValueChange={(value) => setFilters(prev => ({ ...prev, sector: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Sectors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sectors</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Financial">Financial</SelectItem>
                      <SelectItem value="Consumer Discretionary">Consumer Discretionary</SelectItem>
                      <SelectItem value="Automotive">Automotive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Market Cap</Label>
                  <Select value={filters.marketCap} onValueChange={(value) => setFilters(prev => ({ ...prev, marketCap: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Market Caps" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Market Caps</SelectItem>
                      <SelectItem value="large">Large Cap (&gt;$10B)</SelectItem>
                      <SelectItem value="mid">Mid Cap ($2B-$10B)</SelectItem>
                      <SelectItem value="small">Small Cap (&lt;$2B)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>P/E Ratio</Label>
                  <Select value={filters.peRatio} onValueChange={(value) => setFilters(prev => ({ ...prev, peRatio: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All P/E Ratios" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All P/E Ratios</SelectItem>
                      <SelectItem value="low">Low (&lt;20)</SelectItem>
                      <SelectItem value="medium">Medium (20-35)</SelectItem>
                      <SelectItem value="high">High (&gt;35)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="bg-card/50 backdrop-blur border-border">
            <CardHeader>
              <CardTitle>Screener Results ({filteredStocks.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {filteredStocks.map((stock) => (
                    <div key={stock.symbol} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center space-x-4">
                        <Badge variant="secondary">{stock.symbol}</Badge>
                        <div>
                          <div className="font-medium">{stock.name}</div>
                          <div className="text-sm text-muted-foreground">{stock.sector}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Price</div>
                          <div className="font-medium">${stock.price}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Change</div>
                          <div className={`font-medium ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {getStockDisplayValue(stock.changePercent)}%
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">P/E</div>
                          <div className="font-medium">{stock.pe}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Market Cap</div>
                          <div className="font-medium">{stock.marketCap}</div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addToWatchlist(stock.symbol)}
                          disabled={watchlist.includes(stock.symbol)}
                        >
                          {watchlist.includes(stock.symbol) ? 'Added' : 'Watch'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Market News */}
            <Card className="bg-card/50 backdrop-blur border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileChartLine className="h-5 w-5 mr-2" />
                  Market News
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-4">
                    {mockNews.map((news, index) => (
                      <div key={index} className="p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer">
                        <div className="font-medium mb-1">{news.title}</div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{news.source}</span>
                          <span>{news.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Earnings Calendar */}
            <Card className="bg-card/50 backdrop-blur border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BadgeJapaneseYen className="h-5 w-5 mr-2" />
                  Earnings Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-3">
                    {mockEarnings.map((earning, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline">{earning.symbol}</Badge>
                          <div>
                            <div className="font-medium">{earning.company}</div>
                            <div className="text-sm text-muted-foreground">{earning.time}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{earning.date}</div>
                          <div className="text-sm text-muted-foreground">Est: {earning.estimate}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="advisor" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MonitorPlay className="h-5 w-5 mr-2" />
                AI Investment Advisor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Investment Profile</Label>
                <Select value={selectedProfile} onValueChange={(value: keyof typeof investmentProfiles) => setSelectedProfile(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(investmentProfiles).map(([key, profile]) => (
                      <SelectItem key={key} value={key}>
                        {profile.title} - {profile.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 rounded-lg bg-muted/20">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Recommended for {investmentProfiles[selectedProfile].title}</h4>
                  <Badge variant={
                    investmentProfiles[selectedProfile].riskLevel === 'Low' ? 'secondary' :
                    investmentProfiles[selectedProfile].riskLevel === 'Medium' ? 'default' : 'destructive'
                  }>
                    {investmentProfiles[selectedProfile].riskLevel} Risk
                  </Badge>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {investmentProfiles[selectedProfile].suggestions.map((symbol) => (
                    <Card key={symbol} className="p-3 text-center">
                      <Badge variant="outline" className="mb-2">{symbol}</Badge>
                      <div className="text-sm text-muted-foreground">
                        {symbol === 'VTI' && 'Total Stock Market ETF'}
                        {symbol === 'SCHD' && 'Dividend Equity ETF'}
                        {symbol === 'BND' && 'Total Bond Market ETF'}
                        {symbol === 'VXUS' && 'International Stock ETF'}
                        {symbol === 'SPY' && 'S&P 500 ETF'}
                        {symbol === 'QQQ' && 'NASDAQ-100 ETF'}
                        {symbol === 'VEA' && 'Developed Markets ETF'}
                        {symbol === 'VTEB' && 'Tax-Exempt Bond ETF'}
                        {symbol === 'TQQQ' && '3x NASDAQ ETF'}
                        {symbol === 'ARKK' && 'Innovation ETF'}
                        {symbol === 'ICLN' && 'Clean Energy ETF'}
                        {symbol === 'BLOK' && 'Blockchain ETF'}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-yellow-200 mb-1">Investment Disclaimer</div>
                    <div className="text-sm text-muted-foreground">
                      These suggestions are for educational purposes only and do not constitute financial advice. 
                      Past performance does not guarantee future results. Please consult with a qualified financial advisor 
                      before making investment decisions. Always consider your risk tolerance and investment objectives.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ChartCandlestick className="h-5 w-5 mr-2" />
                Advanced Charting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Input
                  placeholder="Enter stock symbol (e.g., AAPL)"
                  value={selectedStock || ''}
                  onChange={(e) => setSelectedStock(e.target.value.toUpperCase())}
                  className="max-w-xs"
                />
                <Select defaultValue="1d">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1d">1 Day</SelectItem>
                    <SelectItem value="1w">1 Week</SelectItem>
                    <SelectItem value="1m">1 Month</SelectItem>
                    <SelectItem value="3m">3 Months</SelectItem>
                    <SelectItem value="1y">1 Year</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="candlestick">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="candlestick">Candlestick</SelectItem>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="area">Area Chart</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="h-96 rounded-lg bg-muted/10 border border-dashed border-muted-foreground/20 flex items-center justify-center">
                <div className="text-center">
                  <ChartArea className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <div className="text-muted-foreground">
                    {selectedStock ? `Chart for ${selectedStock}` : 'Select a stock symbol to view chart'}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Interactive charting with technical indicators coming soon
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-3">
                  <div className="text-sm text-muted-foreground">RSI (14)</div>
                  <div className="font-medium">62.4</div>
                </Card>
                <Card className="p-3">
                  <div className="text-sm text-muted-foreground">MACD</div>
                  <div className="font-medium text-green-500">Bullish</div>
                </Card>
                <Card className="p-3">
                  <div className="text-sm text-muted-foreground">SMA (50)</div>
                  <div className="font-medium">$172.85</div>
                </Card>
                <Card className="p-3">
                  <div className="text-sm text-muted-foreground">Volume</div>
                  <div className="font-medium">58.2M</div>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Price Alerts */}
          <Card className="bg-card/50 backdrop-blur border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ScreenShare className="h-5 w-5 mr-2" />
                Price Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input placeholder="Stock Symbol" />
                  <Input placeholder="Target Price" type="number" />
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="above">Above</SelectItem>
                      <SelectItem value="below">Below</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>Set Alert</Button>
              </div>

              {priceAlerts.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Active Alerts</h4>
                  <div className="space-y-2">
                    {priceAlerts.map((alert, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                        <div>
                          <Badge variant="outline" className="mr-2">{alert.symbol}</Badge>
                          <span className="text-sm">
                            Alert when price goes {alert.condition} ${alert.price}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm">Remove</Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}