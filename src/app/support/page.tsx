
'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { placeHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Droplets, Recycle, Leaf, Factory, Landmark } from 'lucide-react';

type CreditType = 'Renewal' | 'Conservation';
type SellerType = 'Municipality' | 'NGO' | 'Industry';

type WaterCredit = {
  id: string;
  title: string;
  seller: string;
  sellerType: SellerType;
  type: CreditType;
  volume: number;
  pricePerLiter: number;
  imageId: string;
  location: string;
};

const marketplaceData: WaterCredit[] = [
  {
    id: '1',
    title: 'Bengaluru Lake Rejuvenation',
    seller: 'Bangalore Water Initiative',
    sellerType: 'NGO',
    type: 'Conservation',
    volume: 500000,
    pricePerLiter: 0.12,
    imageId: 'conservationists',
    location: 'Bengaluru, India',
  },
  {
    id: '2',
    title: 'Mumbai Industrial Water Recycling',
    seller: 'AquaPure Industries',
    sellerType: 'Industry',
    type: 'Renewal',
    volume: 1200000,
    pricePerLiter: 0.08,
    imageId: 'industries',
    location: 'Mumbai, India',
  },
  {
    id: '3',
    title: 'Delhi Yamuna Cleanup',
    seller: 'Delhi Municipal Corporation',
    sellerType: 'Municipality',
    type: 'Renewal',
    volume: 2500000,
    pricePerLiter: 0.09,
    imageId: 'municipalities',
    location: 'Delhi, India',
  },
  {
    id: '4',
    title: 'Amazon Rainforest Water Basin',
    seller: 'Rainforest Trust',
    sellerType: 'NGO',
    type: 'Conservation',
    volume: 10000000,
    pricePerLiter: 0.15,
    imageId: 'river-background',
    location: 'Amazon, Brazil',
  },
    {
    id: '5',
    title: 'City of London Thames Project',
    seller: 'London Waterworks',
    sellerType: 'Municipality',
    type: 'Renewal',
    volume: 3000000,
    pricePerLiter: 0.11,
    imageId: 'hero-background',
    location: 'London, UK',
  },
  {
    id: '6',
    title: 'Nile River Delta Initiative',
    seller: 'Sahara Eco-Fund',
    sellerType: 'NGO',
    type: 'Conservation',
    volume: 750000,
    pricePerLiter: 0.13,
    imageId: 'corporates',
    location: 'Cairo, Egypt',
  },
  {
    id: '7',
    title: 'Rhine River Quality Improvement',
    seller: 'German Manufacturing Alliance',
    sellerType: 'Industry',
    type: 'Renewal',
    volume: 1800000,
    pricePerLiter: 0.07,
    imageId: 'industries',
    location: 'Cologne, Germany',
  },
  {
    id: '8',
    title: 'Great Barrier Reef Runoff Prevention',
    seller: 'Reef Guardian Collective',
    sellerType: 'NGO',
    type: 'Conservation',
    volume: 1250000,
    pricePerLiter: 0.14,
    imageId: 'conservationists',
    location: 'Queensland, Australia',
  },
  {
    id: '9',
    title: 'Singapore NEWater Plant Expansion',
    seller: 'Singapore Public Utilities Board',
    sellerType: 'Municipality',
    type: 'Renewal',
    volume: 5000000,
    pricePerLiter: 0.10,
    imageId: 'municipalities',
    location: 'Singapore',
  },
  {
    id: '10',
    title: 'California Aqueduct Efficiency',
    seller: 'Golden State Water Savers',
    sellerType: 'NGO',
    type: 'Conservation',
    volume: 450000,
    pricePerLiter: 0.11,
    imageId: 'river-background',
    location: 'California, USA',
  },
];


const getIcon = (type: SellerType) => {
    switch (type) {
        case 'Municipality': return <Landmark className="w-4 h-4" />;
        case 'NGO': return <Leaf className="w-4 h-4" />;
        case 'Industry': return <Factory className="w-4 h-4" />;
    }
}


const CreditCard = ({ credit }: { credit: WaterCredit }) => {
    const image = placeHolderImages.find(p => p.id === credit.imageId);
    const totalPrice = credit.volume * credit.pricePerLiter;

    return (
        <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-2 group bg-card">
            <CardContent className="p-0">
                <div className="relative h-48 w-full">
                    {image && <Image src={image.imageUrl} alt={image.description} fill className="object-cover" data-ai-hint={image.imageHint} />}
                    <div className="absolute top-2 right-2 flex items-center gap-2">
                        <div className={`flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-semibold bg-black/50 text-white`}>
                           {credit.type === 'Renewal' ? 
                                <Recycle className="w-3.5 h-3.5" /> : 
                                <Leaf className="w-3.5 h-3.5" />
                            }
                            <span>{credit.type}</span>
                        </div>
                    </div>
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-bold text-foreground truncate">{credit.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1.5">
                       {getIcon(credit.sellerType)}
                       <span className="ml-2">{credit.seller}</span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Volume</p>
                            <p className="font-semibold text-foreground flex items-center">
                                <Droplets className="w-4 h-4 mr-1 text-primary" />
                                {credit.volume.toLocaleString()} L
                            </p>
                        </div>
                         <div>
                            <p className="text-muted-foreground">Location</p>
                            <p className="font-semibold text-foreground truncate">{credit.location}</p>
                        </div>
                    </div>

                    <div className="mt-6 border-t pt-4">
                        <p className="text-muted-foreground text-sm">Total Price</p>
                         <p className="text-2xl font-bold text-primary">
                            {totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            <span className="text-sm font-normal text-muted-foreground"> $JAL</span>
                        </p>
                        <Button className="w-full mt-4 font-bold">Buy Now</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

const SupportPage = () => {
  const marketplaceImage = placeHolderImages.find(p => p.id === 'river-background');
  const [activeFilter, setActiveFilter] = useState<CreditType | 'All'>('All');
  const [sortBy, setSortBy] = useState('volume_desc');

  const filteredAndSortedData = useMemo(() => {
    let data = marketplaceData;

    if (activeFilter !== 'All') {
      data = data.filter(c => c.type === activeFilter);
    }

    return [...data].sort((a, b) => {
        const [key, order] = sortBy.split('_');
        let valA, valB;

        switch (key) {
            case 'price':
                valA = a.pricePerLiter * a.volume;
                valB = b.pricePerLiter * b.volume;
                break;
            case 'volume':
                valA = a.volume;
                valB = b.volume;
                break;
            case 'title':
                valA = a.title;
                valB = b.title;
                break;
            default:
                return 0;
        }

        if (typeof valA === 'number' && typeof valB === 'number') {
            return order === 'asc' ? valA - valB : valB - valA;
        }
        if (typeof valA === 'string' && typeof valB === 'string') {
             return order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return 0;
    });

  }, [activeFilter, sortBy]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <div className="relative flex items-center justify-center text-center h-[50vh] overflow-hidden bg-primary/10">
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
            <h1 className="text-4xl md:text-6xl font-bold text-white">Support Impact Projects</h1>
            <p className="mt-4 text-lg text-white/90 max-w-3xl mx-auto">
              Fund direct water impact and achieve your sustainability goals with complete transparency by purchasing Verifiable Water Credits.
            </p>
          </div>
        </div>
        
        <div className="py-16 sm:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    <Tabs defaultValue="All" className="w-full md:w-auto" onValueChange={(val) => setActiveFilter(val as any)}>
                        <TabsList>
                            <TabsTrigger value="All">All Projects</TabsTrigger>
                            <TabsTrigger value="Conservation">
                                <Leaf className="w-4 h-4 mr-2" />
                                Conservation
                            </TabsTrigger>
                            <TabsTrigger value="Renewal">
                                <Recycle className="w-4 h-4 mr-2" />
                                Renewal
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                     <div className="w-full md:w-auto md:min-w-48">
                        <Select onValueChange={setSortBy} defaultValue={sortBy}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="volume_desc">Volume (High to Low)</SelectItem>
                                <SelectItem value="volume_asc">Volume (Low to High)</SelectItem>
                                <SelectItem value="price_desc">Price (High to Low)</SelectItem>
                                <SelectItem value="price_asc">Price (Low to High)</SelectItem>
                                <SelectItem value="title_asc">Alphabetical</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {filteredAndSortedData.map(credit => (
                        <CreditCard key={credit.id} credit={credit} />
                    ))}
                </div>
                {filteredAndSortedData.length === 0 && (
                     <div className="text-center col-span-full py-16">
                        <h3 className="text-2xl font-semibold text-foreground">No Projects Found</h3>
                        <p className="text-muted-foreground mt-2">Try adjusting your filters.</p>
                    </div>
                )}
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SupportPage;
