'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { placeHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ArrowUpDown, Droplet ,Plus} from 'lucide-react';
import { Logo } from '@/components/icons/logo';

const SolanaIcon = () => (
  <Image src="/solana-sol-logo.webp" alt="Solana" width={24} height={24} className="h-6 w-6" />
);

const UsdcIcon = () => (
  <Image src="/usd-coin-usdc-logo-png_seeklogo-408043.webp" alt="USDC" width={24} height={24} className="h-6 w-6" />
);

type Token = {
  name: string;
  icon: React.ReactNode;
  balance: number;
};

const tokens: Record<string, Token> = {
  JAL: { name: 'JAL', icon: <Logo className="h-6 w-6 text-primary" />, balance: 1234.56 },
  USDC: { name: 'USDC', icon: <UsdcIcon />, balance: 1200.50 },
  SOL: { name: 'SOL', icon: <SolanaIcon />, balance: 15.8 },
};

// === SWAP: TRUE SWAP + TOGGLE USDC/SOL ===
const SwapInterface = () => {
  const [isFromJal, setIsFromJal] = useState(false); // false = pay USDC/SOL → receive $JAL
  const [payToken, setPayToken] = useState<Token>(tokens.SOL);
  const [amountPay, setAmountPay] = useState('');
  const [amountReceive, setAmountReceive] = useState('');

  // Toggle USDC ↔ SOL (only when not $JAL)
  const togglePayToken = () => {
    setPayToken(prev => prev.name === 'USDC' ? tokens.SOL : tokens.USDC);
    setAmountPay('');
    setAmountReceive('');
  };

  // Swap top/bottom
  const handleSwapDirection = () => {
    setIsFromJal(prev => !prev);
    setAmountPay(amountReceive);
    setAmountReceive(amountPay);
  };

  // Auto-calculate
  useEffect(() => {
    if (!amountPay || isNaN(parseFloat(amountPay))) {
      setAmountReceive('');
      return;
    }

    const amount = parseFloat(amountPay);
    let rate = 0;

    if (isFromJal) {
      // $JAL → USDC or SOL
      rate = payToken.name === 'USDC' ? 0.15 : 0.009;
      setAmountReceive((amount * rate).toFixed(6));
    } else {
      // USDC or SOL → $JAL
      rate = payToken.name === 'USDC' ? 1 / 0.15 : 1 / 0.009;
      setAmountReceive((amount * rate).toFixed(2));
    }
  }, [amountPay, payToken, isFromJal]);

  const topToken = isFromJal ? tokens.JAL : payToken;
  const bottomToken = isFromJal ? payToken : tokens.JAL;
  const topAmount = isFromJal ? amountReceive : amountPay;
  const bottomAmount = isFromJal ? amountPay : amountReceive;
  const setTopAmount = isFromJal ? setAmountReceive : setAmountPay;
  const setBottomAmount = isFromJal ? setAmountPay : setAmountReceive;

  return (
    <div className="space-y-4">
      {/* TOP INPUT */}
      <div className="bg-primary/10 rounded-lg p-4">
        <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
          <span>You {isFromJal ? 'sell' : 'pay'}</span>
          <span>Balance: {topToken.balance.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {topToken.icon}
            <span className="text-lg font-bold">{topToken.name}</span>
          </div>
          <Input 
            type="number" 
            placeholder="0.0" 
            value={topAmount}
            onChange={(e) => setTopAmount(e.target.value)}
            className="text-2xl font-bold text-right bg-transparent border-none focus-visible:ring-0" 
          />
        </div>

        {/* TOGGLE: Only if top is not $JAL */}
        {!isFromJal && (
          <button
            onClick={togglePayToken}
            className="mt-2 text-xs text-blue-600 hover:text-blue-700 underline flex items-center gap-1"
          >
            <ArrowUpDown className="w-3 h-3" />
            Switch to {payToken.name === 'USDC' ? 'SOL' : 'USDC'}
          </button>
        )}
      </div>

      {/* SWAP ARROW */}
      <div className="flex justify-center -my-2 z-10 relative">
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-card rounded-full border-2 border-background hover:bg-card"
          onClick={handleSwapDirection}
        >
          <ArrowUpDown className="h-5 w-5" />
        </Button>
      </div>

      {/* BOTTOM INPUT */}
      <div className="bg-primary/10 rounded-lg p-4">
        <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
          <span>You {isFromJal ? 'pay' : 'receive'}</span>
          <span>Balance: {bottomToken.balance.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {bottomToken.icon}
            <span className="text-lg font-bold">{bottomToken.name}</span>
          </div>
          <Input 
            type="number" 
            placeholder="0.0" 
            value={bottomAmount}
            onChange={(e) => setBottomAmount(e.target.value)}
            className="text-2xl font-bold text-right bg-transparent border-none focus-visible:ring-0" 
          />
        </div>
      </div>

      {/* RATE */}
      <div className="text-sm text-muted-foreground flex justify-between items-center">
        <span>
          1 {isFromJal ? bottomToken.name : '$JAL'} ={' '}
          {isFromJal 
            ? (bottomToken.name === 'USDC' ? '6.67 $JAL' : '111.11 $JAL')
            : (payToken.name === 'USDC' ? '0.15 USDC' : '0.009 SOL')
          }
        </span>
        <div className="flex items-center gap-1">
          <Droplet className="w-4 h-4 text-blue-500" />
          <span className="text-xs">1 $JAL = 1 m³ verified water</span>
        </div>
      </div>

      {/* CTA */}
      <Button size="lg" className="w-full text-lg font-bold bg-blue-600 hover:bg-blue-600 text-white">
        {isFromJal ? 'Sell $JAL' : 'Buy $JAL'}
      </Button>
    </div>
  );
};

// === STAKE $JAL ===
const StakeInterface = () => {
  const [amount, setAmount] = useState('');

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-bold text-foreground">Stake $JAL to Fund Water Projects</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Lock $JAL → Earn 8% APY → Fund meters & lake restoration
        </p>
      </div>

      <Card className="bg-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Logo className="h-8 w-8 text-primary" />
              <div>
                <p className="font-bold">$JAL</p>
                <p className="text-sm text-muted-foreground">Balance: {tokens.JAL.balance.toLocaleString()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-600">8.0%</p>
              <p className="text-xs text-muted-foreground">APY</p>
            </div>
          </div>

          <Input
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-2xl font-bold text-center"
          />

          <div className="mt-3 text-xs text-muted-foreground space-y-1">
            <p>• 40% → New meters in Bangalore</p>
            <p>• 30% → NGO lake restoration</p>
            <p>• 30% → Treasury upgrades</p>
          </div>

          <Button size="lg" className="w-full mt-4 bg-blue-600 hover:bg-blue-600 text-white">
            Stake $JAL
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// === ADD LIQUIDITY ===
const PoolInterface = () => {
  const pools = [
    { 
      id: 1, 
      token1: tokens.JAL, 
      token2: tokens.SOL, 
      apy: 118.5, 
      totalLiquidity: 2_800_000,
      fee: '0.3%'
    },
    { 
      id: 2, 
      token1: tokens.JAL, 
      token2: tokens.USDC, 
      apy: 95.2, 
      totalLiquidity: 1_500_000,
      fee: '0.3%'
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-foreground">Liquidity Pools (Solana)</h3>
        <Button className="bg-blue-600 hover:bg-blue-600 text-white">
          <Plus className="mr-2 h-4 w-4" />
          New Position
        </Button>
      </div>

      {pools.map(pool => (
        <Card key={pool.id} className="bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {pool.token1.icon}
                  {pool.token2.icon}
                </div>
                <div>
                  <p className="font-bold">{pool.token1.name}/{pool.token2.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ${pool.totalLiquidity.toLocaleString()} TVL
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-500">{pool.apy.toFixed(1)}% APY</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>{pool.fee} fee</span>
                </div>
              </div>
            </div>
            <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-600 text-white">
              Add Liquidity
            </Button>
          </CardContent>
        </Card>
      ))}

      <div className="text-center text-xs text-muted-foreground mt-6">
        <p>Powered by <span className="font-bold text-blue-500">Raydium</span> on Solana</p>
      </div>
    </div>
  );
};

const MarketplacePage = () => {
  const marketplaceImage = placeHolderImages.find(p => p.id === 'river-background');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* HERO — OLD IMAGE */}
        <div className="relative flex items-center justify-center text-center min-h-[40vh] overflow-hidden bg-primary/10">
          {marketplaceImage && (
            <Image
              src={marketplaceImage.imageUrl}
              alt={marketplaceImage.description}
              fill
              className="object-cover z-0"
              data-ai-hint={marketplaceImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-primary/80 z-10"></div>
          <div className="container mx-auto px-4 md:px-6 relative z-20">
            <h1 className="text-4xl md:text-6xl font-bold text-white">Jal Marketplace</h1>
            <p className="mt-4 text-lg text-white/90 max-w-3xl mx-auto">
              The official exchange for $JAL token. Swap, provide liquidity, and engage with the Jal ecosystem.
            </p>
          </div>
        </div>

        {/* MAIN CARD */}
        <div className="py-16 sm:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <Card className="max-w-md mx-auto bg-card/80 backdrop-blur-sm border-primary/20 shadow-xl">
              <CardContent className="p-4">
                <Tabs defaultValue="buy">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="buy">Buy $JAL</TabsTrigger>
                    <TabsTrigger value="stake">Stake $JAL</TabsTrigger>
                    <TabsTrigger value="pool">Add Liquidity</TabsTrigger>
                  </TabsList>

                  <TabsContent value="buy" className="mt-6">
                    <SwapInterface />
                  </TabsContent>

                  <TabsContent value="stake" className="mt-6">
                    <StakeInterface />
                  </TabsContent>

                  <TabsContent value="pool" className="mt-6">
                    <PoolInterface />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MarketplacePage;