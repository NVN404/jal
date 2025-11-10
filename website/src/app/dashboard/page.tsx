'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Droplets, Coins, Settings, CheckCircle, XCircle, Building, Users, Leaf, ArrowRight, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { placeHolderImages } from '@/lib/placeholder-images';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const waterSavedData = [
  { month: 'Jan', saved: 186 },
  { month: 'Feb', saved: 305 },
  { month: 'Mar', saved: 237 },
  { month: 'Apr', saved: 273 },
  { month: 'May', saved: 209 },
  { month: 'Jun', saved: 250 },
];

const chartConfig = {
  saved: { label: 'Liters', color: 'hsl(var(--primary))' },
};

const residentData = {
  name: 'Alex Johnson',
  apartment: 'Aqua Vista Tower, Apt. 12B',
  residentId: 'JAL-RES-84920'
};

const initialResidentStats = {
  waterSaved: 12543,
  jalMinted: 4821,
  lastMonthIncrease: 20.1
};

const ResidentsDashboard = () => {
  const [stats, setStats] = useState(initialResidentStats);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        waterSaved: prev.waterSaved + Math.floor(Math.random() * 5),
        jalMinted: prev.jalMinted + (Math.random() * 2),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="https://picsum.photos/seed/101/100/100" alt={residentData.name} />
            <AvatarFallback><User className="h-8 w-8" /></AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{residentData.name}</h2>
            <p className="text-muted-foreground">{residentData.apartment}</p>
            <p className="text-xs text-muted-foreground mt-1">ID: {residentData.residentId}</p>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Water Saved</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.waterSaved.toLocaleString()} L</div>
            <p className="text-xs text-muted-foreground">+{stats.lastMonthIncrease}% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">$JAL Minted</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.jalMinted.toFixed(0)} JAL</div>
            <p className="text-xs text-muted-foreground">Auto-minted from savings</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Water Saved Over Time</CardTitle>
            <CardDescription>Last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <AreaChart data={waterSavedData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `${v} L`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <defs>
                  <linearGradient id="fillSaved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-saved)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-saved)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area dataKey="saved" type="natural" fill="url(#fillSaved)" stroke="var(--color-saved)" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" /> Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="maintenance-fee" className="flex flex-col space-y-1">
                <span>Auto-deduct Maintenance Fee</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Allow automatic deduction of 25 JAL per month.
                </span>
              </Label>
              <Switch id="maintenance-fee" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const initialMunicipalitiesData = [
  { name: 'Delhi Yamuna Plant', tokens: 2.5, liters: 25, imageId: 'municipalities' },
  { name: 'Singapore NEWater', tokens: 5.0, liters: 50, imageId: 'hero-background' },
  { name: 'London Thames', tokens: 3.0, liters: 32, imageId: 'river-background' }
];

const municipalitiesChartConfig = {
  liters: { label: "M Liters", color: "hsl(var(--primary))" },
};

const MunicipalitiesDashboard = () => {
  const [data, setData] = useState(initialMunicipalitiesData);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev =>
        prev.map(p => ({
          ...p,
          liters: p.liters + Math.random() * 0.05,
          tokens: p.tokens + Math.random() * 0.1,
        }))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        {data.map((plant, i) => {
          const image = placeHolderImages.find(p => p.id === plant.imageId);
          return (
            <Card key={i} className="overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="relative h-48 md:h-full">
                  {image && <Image src={image.imageUrl} alt={plant.name} fill className="object-cover" />}
                </div>
                <div className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>{plant.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Liters Restored</p>
                      <p className="text-2xl font-bold flex items-center gap-2">
                        <Droplets className="h-5 w-5 text-primary"/>
                        {plant.liters.toFixed(1)}M L
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">$JAL Minted</p>
                      <p className="text-2xl font-bold flex items-center gap-2">
                        <Coins className="h-5 w-5 text-primary"/>
                        {plant.tokens.toFixed(1)}M JAL
                      </p>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Water Renewal Output</CardTitle>
          <CardDescription>Million liters per plant</CardDescription>
        </CardHeader>
        <CardContent className="h-96">
          <ChartContainer config={municipalitiesChartConfig} className="w-full h-full">
            <BarChart data={data} layout="vertical" margin={{ left: 30 }}>
              <CartesianGrid horizontal={false} />
              <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={10} className="text-sm" tickFormatter={(v) => v.split(" ").slice(0,2).join(" ")} />
              <XAxis dataKey="liters" type="number" hide />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="liters" fill="var(--color-liters)" radius={5} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

const corporationsData = [
  { name: 'Global Tech Inc.', compliant: true, credits: 150000 },
  { name: 'Aqua Solutions', compliant: true, credits: 75000 },
  { name: 'Industrial Co.', compliant: false, credits: 10000, penalty: 50000 },
  { name: 'Eco Innovators', compliant: true, credits: 250000 },
  { name: 'MegaCorp', compliant: false, credits: 5000, penalty: 100000 },
];

const compliantCount = corporationsData.filter(c => c.compliant).length;
const notCompliantCount = corporationsData.length - compliantCount;

const complianceChartData = [
  { status: 'Compliant', count: compliantCount, fill: 'hsl(var(--chart-2))' },
  { status: 'Not Compliant', count: notCompliantCount, fill: 'hsl(var(--destructive))' },
];

const complianceChartConfig = {
  count: { label: 'Corporations' },
  Compliant: { label: 'Compliant', color: 'hsl(var(--chart-2))' },
  "Not Compliant": { label: 'Not Compliant', color: 'hsl(var(--destructive))' }
};

const CorporationsDashboard = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Corporate ESG Compliance</CardTitle>
        <CardDescription>Tracking water credit purchases and compliance.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {corporationsData.map((corp, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-primary/5 transition-colors">
              <div className="font-medium text-lg">{corp.name}</div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="font-bold text-lg">{corp.credits.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Credits</div>
                </div>
                {corp.compliant ? (
                  <div className="flex items-center gap-2 text-green-600 font-semibold py-1 px-3 rounded-full bg-green-100/80">
                    <CheckCircle className="h-5 w-5" />
                    <span>Compliant</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2 text-red-600 font-semibold py-1 px-3 rounded-full bg-red-100/80">
                      <XCircle className="h-5 w-5" />
                      <span>Not Compliant</span>
                    </div>
                    <div className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Penalty: {corp.penalty.toLocaleString()} JAL
                    </div>
                  </div>
                )}
                <Button variant="outline">
                  View Details <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Compliance Overview</CardTitle>
        <CardDescription>Compliant vs non-compliant</CardDescription>
      </CardHeader>
      <CardContent className="h-64 flex items-center justify-center">
        <ChartContainer config={complianceChartConfig} className="w-full h-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="status" hideLabel />} />
            <Pie data={complianceChartData} dataKey="count" nameKey="status" innerRadius={50} outerRadius={80} paddingAngle={5}>
              {complianceChartData.map((entry, i) => (
                <Cell key={`cell-${i}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="status" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  </div>
);

const DashboardPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow pt-20">
        <div className="container mx-auto py-12 px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
            Dashboard
          </h1>

          <Tabs defaultValue="residents" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="residents">
                <Users className="mr-2 h-4 w-4" /> Residents
              </TabsTrigger>
              <TabsTrigger value="municipalities">
                <Building className="mr-2 h-4 w-4" /> Municipalities
              </TabsTrigger>
              <TabsTrigger value="corporations">
                <Leaf className="mr-2 h-4 w-4" /> Corporations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="residents"><ResidentsDashboard /></TabsContent>
            <TabsContent value="municipalities"><MunicipalitiesDashboard /></TabsContent>
            <TabsContent value="corporations"><CorporationsDashboard /></TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;