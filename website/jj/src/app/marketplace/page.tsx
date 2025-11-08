
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { placeHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ArrowUpDown, Settings, Plus, Info } from 'lucide-react';
import { Logo } from '@/components/icons/logo';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const UsdcIcon = () => (
    <svg width="24" height="24" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
        <g fill="none" fillRule="evenodd">
            <circle fill="#2775CA" cx="19" cy="19" r="19"/>
            <path d="M19.833 26.583c-4.41 0-7.989-3.483-7.989-7.778s3.58-7.778 7.99-7.778c1.332 0 2.58.32 3.693.88l-1.39 2.3A4.925 4.925 0 0019.833 13.9c-2.824 0-5.117 2.22-5.117 4.905 0 2.686 2.293 4.906 5.117 4.906a4.92 4.92 0 003.3-.993l1.403 2.316a7.86 7.86 0 01-4.703 1.448zm4.564-10.46l-1.42 2.339c.228.43.355.914.355 1.432s-.127 1.002-.356 1.432l1.42 2.338c.6-.93.94-2.01.94-3.17s-.34-2.24-.94-3.17z" fill="#FFF"/>
        </g>
    </svg>
)

const EthIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
        <path d="M12 1.75L11.25 2.5V15.5L12 16L18.75 12.25L12 1.75Z" fill="#343434" />
        <path d="M12 1.75L5.25 12.25L12 16V1.75Z" fill="#8C8C8C" />
        <path d="M12 17.25V22.25L18.75 13.5L12 17.25Z" fill="#3C3C3B" />
        <path d="M12 22.25V17.25L5.25 13.5L12 22.25Z" fill="#8C8C8C" />
        <path d="M18.75 12.25L12 16L12.75 15.5V2.5L18.75 12.25Z" fill="#141414" />
        <path d="M5.25 12.25L12 16V2.5L5.25 12.25Z" fill="#393939" />
    </svg>
)

type Token = {
    name: string;
    icon: React.ReactNode;
    balance: number;
}

const tokens: Record<string, Token> = {
    JAL: { name: 'JAL', icon: <Logo className="h-6 w-6 text-primary" />, balance: 0.00 },
    USDC: { name: 'USDC', icon: <UsdcIcon />, balance: 1200.50 },
    wETH: { name: 'wETH', icon: <EthIcon />, balance: 2.5 },
}

const SwapTokenInput = ({ side, token, amount, onAmountChange } : { side: 'pay' | 'receive', token: Token, amount: string, onAmountChange: (value: string) => void }) => (
     <div className="bg-primary/10 rounded-lg p-4">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>You {side}</span>
            <span>Balance: {token.balance.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-2">
                {token.icon}
                <span className="text-lg font-bold">{token.name}</span>
            </div>
            <Input 
                type="number" 
                placeholder="0.0" 
                value={amount}
                onChange={(e) => onAmountChange(e.target.value)}
                className="text-2xl font-bold text-right bg-transparent border-none focus-visible:ring-0" 
            />
        </div>
    </div>
);


const SwapInterface = () => {
    const [swapFrom, setSwapFrom] = useState<Token>(tokens.USDC);
    const [swapTo, setSwapTo] = useState<Token>(tokens.JAL);
    const [amountFrom, setAmountFrom] = useState('');
    const [amountTo, setAmountTo] = useState('');

    const handleSwapDirection = () => {
        setSwapFrom(swapTo);
        setSwapTo(swapFrom);
        setAmountFrom(amountTo);
        setAmountTo(amountFrom);
    }
    
    // Dummy conversion
    React.useEffect(() => {
        const rate = swapFrom.name === 'USDC' ? 1 / 0.15 : 0.15;
        const from = parseFloat(amountFrom);
        if(!isNaN(from)) {
            setAmountTo((from * rate).toFixed(2));
        } else {
            setAmountTo('');
        }
    }, [amountFrom, swapFrom]);

    return (
        <div className="space-y-4">
            <SwapTokenInput side="pay" token={swapFrom} amount={amountFrom} onAmountChange={setAmountFrom} />

            <div className="flex justify-center -my-2 z-10 relative">
                <Button variant="outline" size="icon" className="bg-card rounded-full border-2 border-background" onClick={handleSwapDirection}>
                    <ArrowUpDown className="h-5 w-5" />
                </Button>
            </div>

            <SwapTokenInput side="receive" token={swapTo} amount={amountTo} onAmountChange={setAmountTo} />
            
            <div className="text-sm text-muted-foreground flex justify-between">
                <span>1 JAL = 0.15 USDC</span>
                <Settings className="w-4 h-4 cursor-pointer" />
            </div>

            <Button size="lg" className="w-full text-lg font-bold">Connect Wallet</Button>
        </div>
    )
}

const DepositInterface = () => {
    const depositAssets = [
        { ...tokens.JAL, apy: 5.2 },
        { ...tokens.USDC, apy: 3.8 },
        { ...tokens.wETH, apy: 2.5 },
    ];

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Deposit Tokens to Earn Yield</h3>
            {depositAssets.map(asset => (
                <Card key={asset.name} className="bg-primary/5">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {asset.icon}
                            <div>
                                <p className="font-bold">{asset.name}</p>
                                <p className="text-sm text-muted-foreground">Balance: {asset.balance.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="font-bold text-green-500">{asset.apy.toFixed(1)}%</p>
                                <p className="text-xs text-muted-foreground">APY</p>
                            </div>
                            <Button>Deposit</Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
             <Button size="lg" variant="outline" className="w-full text-lg font-bold mt-4">Connect Wallet</Button>
        </div>
    )
}

const PoolInterface = () => {
     const liquidityPools = [
        { id: 1, token1: tokens.JAL, token2: tokens.USDC, apy: 12.5, totalLiquidity: 1_500_000 },
        { id: 2, token1: tokens.JAL, token2: tokens.wETH, apy: 15.8, totalLiquidity: 800_000 },
    ];
    return (
         <div className="space-y-4">
            <div className="flex justify-between items-center">
                 <h3 className="font-semibold text-foreground">Liquidity Pools</h3>
                 <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Position
                 </Button>
            </div>
            {liquidityPools.map(pool => (
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
                                        Total Liquidity: ${pool.totalLiquidity.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                             <div className="text-right">
                                <p className="font-bold text-green-500">{pool.apy.toFixed(1)}% APY</p>
                                <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info className="h-4 w-4 text-muted-foreground cursor-pointer inline-block ml-auto mt-1" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Based on last 24h fees.</p>
                                    </TooltipContent>
                                </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                         <Button className="w-full mt-4">Add Liquidity</Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

const MarketplacePage = () => {
  const marketplaceImage = placeHolderImages.find(p => p.id === 'river-background');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
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
        
        <div className="py-16 sm:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <Card className="max-w-md mx-auto bg-card/80 backdrop-blur-sm border-primary/20 shadow-xl">
                    <CardContent className="p-4">
                        <Tabs defaultValue="swap">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="swap">Swap</TabsTrigger>
                                <TabsTrigger value="deposit">Deposit</TabsTrigger>
                                <TabsTrigger value="pool">Pool</TabsTrigger>
                            </TabsList>
                            <TabsContent value="swap" className="mt-6">
                                <SwapInterface />
                            </TabsContent>
                            <TabsContent value="deposit" className="mt-6">
                                <DepositInterface />
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

    
    