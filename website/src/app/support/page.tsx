'use client';

import React from 'react';
import Image from 'next/image';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { placeHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BadgeCheck, Trophy, MapPin, TreePine, Recycle, Droplets } from 'lucide-react';

type Pack = {
  id: string;
  name: string;
  jal: number;
  m3: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  imageId: string;
  description: string;
  benefits: string[];
};

const packs: Pack[] = [
  {
    id: '1',
    name: 'Seed',
    jal: 100,
    m3: 100,
    tier: 'Bronze',
    imageId: 'conservationists',
    description: 'Start your water legacy. Fund local lake cleanup.',
    benefits: ['NFT Proof', 'Name on donor wall', 'Monthly impact report'],
  },
  {
    id: '2',
    name: 'River',
    jal: 1_000,
    m3: 1_000,
    tier: 'Silver',
    imageId: 'river-background',
    description: 'Restore a river. Fund NGO water meters in villages.',
    benefits: ['Exclusive NFT', 'Video from field', 'Annual impact audit'],
  },
  {
    id: '3',
    name: 'Ocean',
    jal: 10_000,
    m3: 10_000,
    tier: 'Gold',
    imageId: 'hero-background',
    description: 'Save a watershed. Fund industrial recycling plants.',
    benefits: ['Premium NFT', 'Live satellite tracking', 'CEO impact call'],
  },
  {
    id: '4',
    name: 'Legacy',
    jal: 100_000,
    m3: 100_000,
    tier: 'Diamond',
    imageId: 'corporates',
    description: 'Change a nation. Fund municipal water systems.',
    benefits: ['1/1 NFT', 'Name a project', 'Board seat on Jal Council'],
  },
];

type Project = {
  id: string;
  title: string;
  org: string;
  type: 'NGO' | 'Municipality' | 'Industry';
  location: string;
  m3: number;
  imageId: string;
  verified: boolean;
};

const projects: Project[] = [
  { id: '1', title: 'Bengaluru Lake Rejuvenation', org: 'Bangalore Water Initiative', type: 'NGO', location: 'Bengaluru, India', m3: 500_000, imageId: 'conservationists', verified: true },
  { id: '2', title: 'Mumbai Industrial Water Recycling', org: 'AquaPure Industries', type: 'Industry', location: 'Mumbai, India', m3: 1_200_000, imageId: 'industries', verified: true },
  { id: '3', title: 'Delhi Yamuna Cleanup', org: 'Delhi Municipal Corporation', type: 'Municipality', location: 'Delhi, India', m3: 2_500_000, imageId: 'municipalities', verified: true },
  { id: '4', title: 'Amazon Rainforest Water Basin', org: 'Rainforest Trust', type: 'NGO', location: 'Amazon, Brazil', m3: 10_000_000, imageId: 'river-background', verified: true },
];

const getIcon = (type: Project['type']) => {
  switch (type) {
    case 'Municipality': return <MapPin className="w-4 h-4" />;
    case 'NGO': return <TreePine className="w-4 h-4" />;
    case 'Industry': return <Recycle className="w-4 h-4" />;
  }
};

const PackCard = ({ pack }: { pack: Pack }) => {
  const image = placeHolderImages.find(p => p.id === pack.imageId);

  return (
    <Card className="w-full h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group bg-card border-2 border-transparent hover:border-primary/50">
      <div className="relative h-64 w-full bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 flex-shrink-0">
        {image && (
          <Image
            src={image.imageUrl}
            alt={pack.name}
            fill
            className="object-cover opacity-30 group-hover:opacity-40 transition-opacity"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <Trophy className={`w-24 h-24 ${
            pack.tier === 'Bronze' ? 'text-amber-600' :
            pack.tier === 'Silver' ? 'text-gray-400' :
            pack.tier === 'Gold' ? 'text-yellow-500' :
            'text-cyan-400'
          }`} />
        </div>
      </div>

      <div className="p-6 space-y-4 flex-grow flex flex-col">
        <div className="text-center flex-grow">
          <h3 className="text-2xl font-bold text-foreground">{pack.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{pack.tier} Tier</p>
        </div>

        <p className="text-sm text-center text-muted-foreground flex-grow">{pack.description}</p>

        <div className="flex justify-center items-center gap-2 text-lg font-bold">
          <span className="text-primary">{pack.jal.toLocaleString()}</span>
          <span className="text-muted-foreground">$JAL</span>
          <span className="text-2xl">→</span>
          <span className="text-green-600">{pack.m3.toLocaleString()} m³</span>
        </div>

        <div className="space-y-1 text-xs text-muted-foreground">
          {pack.benefits.map((b, i) => (
            <p key={i} className="flex items-center justify-center gap-1">
              <BadgeCheck className="w-3 h-3 text-green-600" />
              {b}
            </p>
          ))}
        </div>

        <Button className="w-full text-lg font-bold bg-blue-600 hover:bg-blue-600 text-white mt-auto">
          Mint NFT
        </Button>
      </div>
    </Card>
  );
};

const ProjectCard = ({ project }: { project: Project }) => {
  const image = placeHolderImages.find(p => p.id === project.imageId);

  return (
    <Card className="w-full h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group bg-card">
      <div className="relative h-48 w-full flex-shrink-0">
        {image && (
          <Image
            src={image.imageUrl}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
        )}
        {project.verified && (
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-green-700 flex items-center gap-1">
            <BadgeCheck className="w-3 h-3" />
            Verified
          </div>
        )}
      </div>

      <div className="p-4 space-y-3 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-foreground line-clamp-2">{project.title}</h3>

        <div className="flex items-center text-sm text-muted-foreground">
          {getIcon(project.type)}
          <span className="ml-2 truncate">{project.org}</span>
        </div>

        <div className="flex items-center gap-4 text-sm flex-grow">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="truncate">{project.location}</span>
          </div>
          <div class72 className="flex items-center gap-1">
            <Droplets className="w-4 h-4 text-green-600" />
            <span>{(project.m3 / 1000).toFixed(0)}K m³</span>
          </div>
        </div>

        <Button variant="outline" className="w-full mt-auto">
          View Project
        </Button>
      </div>
    </Card>
  );
};

const SupportPage = () => {
  // OLD HERO IMAGE — UNTOUCHED
  const heroImage = placeHolderImages.find(p => p.id === 'river-background');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* HERO — OLD IMAGE, NO CHANGE */}
        <div className="relative flex items-center justify-center text-center h-[50vh] overflow-hidden bg-primary/10">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover z-0"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-primary/80 z-10"></div>
          <div className="container mx-auto px-4 md:px-6 relative z-20">
            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-2xl">
              Mint Impact. Save Water.
            </h1>
            <p className="mt-4 text-xl text-white/90 max-w-4xl mx-auto">
              1 $JAL = 1 m³ verified impact. <br />
              <span className="font-bold text-white">Mint an NFT. Fund real projects. Get proof.</span>
            </p>
          </div>
        </div>

        {/* TABS: MINT vs EXPLORE */}
        <div className="py-16 sm:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <Tabs defaultValue="mint" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-12 h-14">
                <TabsTrigger value="mint" className="text-lg h-full flex items-center justify-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Mint Impact
                </TabsTrigger>
                <TabsTrigger value="projects" className="text-lg h-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Explore Projects
                </TabsTrigger>
              </TabsList>

              <TabsContent value="mint">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold">Choose Your Legacy</h2>
                  <p className="text-muted-foreground mt-2">Every $JAL funds real water projects</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {packs.map(pack => (
                    <PackCard key={pack.id} pack={pack} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="projects">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold">Live Water Projects</h2>
                  <p className="text-muted-foreground mt-2">See where your impact flows</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {projects.map(project => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* LIVE STATS */}
            <div className="mt-16 bg-primary/5 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Live Impact</h3>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-4xl font-bold text-cyan-600">1,284,000</p>
                  <p className="text-muted-foreground">$JAL Minted</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-green-600">1,284,000 m³</p>
                  <p className="text-muted-foreground">Water Saved</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-blue-600">842</p>
                  <p className="text-muted-foreground">NFTs Minted</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SupportPage;