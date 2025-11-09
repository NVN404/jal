'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { placeHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

type HowItWorksStep = {
  title: string;
  description: string;
};

type EcosystemItem = {
  id: string;
  category: string;
  title: string;
  headline: string;
  partnership: string;
  howItWorks: HowItWorksStep[];
  value: string[];
  imageId: string;
};

const ecosystemData: EcosystemItem[] = [
  {
    id: 'technology',
    category: 'Technology',
    title: 'Our Technology',
    headline: 'The Jal Smart Meter',
    partnership: 'We build and deploy IoT smart meters that measure real water flow — the foundation of truth in the Jal ecosystem.',
    howItWorks: [
      { title: "Installation", description: "Meters installed at homes, factories, and treatment plants." },
      { title: "Real-Time Tracking", description: "Every liter in, out, saved, or renewed is recorded." },
      { title: "On-Chain Verification", description: "Data verified by oracle → Mint $JAL." }
    ],
    value: [
      "Unbreakable source of truth for water usage",
      "Powers $JAL minting with zero fraud",
      "1 $JAL = 1 m³ verified impact"
    ],
    imageId: 'hero-background',
  },
  {
    id: 'residents',
    category: 'For Residents',
    title: 'For Residents',
    headline: 'Save Water. Earn $JAL. Profit.',
    partnership: 'Lease a Jal meter, use less than your neighbors, and earn $JAL every month.',
    howItWorks: [
      { title: "Lease Meter", description: "₹500/month — installed in 10 minutes." },
      { title: "Use Less Than Avg", description: "Your building avg: 135L/day. You use 110L." },
      { title: "Mint $JAL", description: "Save 25L → mint 25 $JAL → worth ₹50+." }
    ],
    value: [
      "Net profit: ₹500+ per month just by saving water",
      "Your savings fund your meter — no upfront cost",
      "Be the top saver in your building. Win bragging rights."
    ],
    imageId: 'residents',
  },
  {
    id: 'enterprises',
    category: 'For Enterprises',
    title: 'For Enterprises',
    headline: 'Factories, Offices, Hotels — Reduce, Earn, or Buy Impact.',
    partnership: 'Whether you’re a factory reducing water use or a corporate HQ proving ESG — Jal gives you two paths: earn $JAL by saving water, or buy $JAL from others to claim verified water-positive impact.',
    howItWorks: [
      {
        title: "Mode 1: Reduce & Earn",
        description: "Install industrial meters. Set a monthly water baseline (e.g., 10M liters). Use less or recycle more → mint $JAL for every liter saved below target."
      },
      {
        title: "Mode 2: Buy & Prove",
        description: "Can’t reduce enough? Buy $JAL from residents, municipalities, or NGOs on the Jal Marketplace. Receive an NFT: “You funded 1M m³ of verified water renewal.”"
      },
      {
        title: "On-Chain Compliance",
        description: "All data verified by oracle. No audits needed. ESG reports auto-generated from blockchain."
      }
    ],
    value: [
      "Earn $JAL by reducing real water usage",
      "Buy $JAL → get NFT proof of water-positive impact",
      "Avoid penalties. Meet ESG goals. Save on audit costs."
    ],
    imageId: 'industries',
  },
  {
    id: 'municipalities',
    category: 'For Municipalities',
    title: 'For Municipalities',
    headline: 'Treat Water. Mint $JAL. Fund Upgrades.',
    partnership: 'Install inflow/outflow meters. Every m³ of treated water = 1 $JAL minted.',
    howItWorks: [
      { title: "Install Meters", description: "Track raw sewage in, clean water out." },
      { title: "Verify Treatment", description: "Oracle confirms quality and volume." },
      { title: "Mint $JAL", description: "1 m³ treated = 1 $JAL → sell or stake." }
    ],
    value: [
      'Turn wastewater into revenue',
      'Sell $JAL to enterprises → fund new plants',
      'Higher efficiency = more $JAL per m³'
    ],
    imageId: 'municipalities',
  },
  {
    id: 'conservationists',
    category: 'For Water Conservationists',
    title: 'For Water Conservationists',
    headline: 'Prove Impact. Mint $JAL. Fund Forever.',
    partnership: 'NGOs deploy sensors before/after projects. Proven savings = $JAL minted.',
    howItWorks: [
      {
        title: 'Baseline Sensors',
        description: 'Satellite + IoT measure lake level, flow, or groundwater before project.',
      },
      {
        title: 'Run Initiative',
        description: 'Restore wetlands, plant trees, run awareness — your way.',
      },
      {
        title: 'Mint $JAL',
        description: 'Oracle confirms delta. 1 m³ saved = 1 $JAL → your wallet.',
      },
    ],
    value: [
      'On-chain proof of impact — no more donor reports',
      'Sell $JAL to enterprises → self-funded missions',
      'Your work becomes a tradable asset'
    ],
    imageId: 'conservationists',
  },
];

const EcosystemSection = ({ item, index }: { item: EcosystemItem; index: number }) => {
  const image = placeHolderImages.find(p => p.id === item.imageId);
  const isReversed = index % 2 !== 0;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section
      className="py-16 sm:py-24"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className={cn('grid md:grid-cols-2 gap-12 md:gap-16 items-start', isReversed && 'md:grid-flow-col-dense')}>
          <div className={cn('relative w-full h-80 md:h-[500px] rounded-3xl bg-primary flex items-end p-8', isReversed && 'md:col-start-2')}>
            {image && <Image src={image.imageUrl} alt={image.description} fill className="object-cover rounded-3xl" data-ai-hint={image.imageHint} />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-3xl"></div>
            <h3 className="relative text-3xl font-bold text-white drop-shadow-md">{item.headline}</h3>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-primary font-semibold mb-2">{item.category}</span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{item.title}</h2>
            <Card className="bg-transparent border-none shadow-none mt-4">
              <CardContent className="p-0 space-y-6 text-muted-foreground">
                <div>
                  <h4 className="font-semibold text-foreground/90">The Partnership</h4>
                  <p>{item.partnership}</p>
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="mt-6 space-y-6">
                        <div>
                          <h4 className="font-semibold text-foreground/90">How it Works</h4>
                          <ul className="mt-2 space-y-4">
                            {item.howItWorks.map((step, i) => (
                              <li key={i} className="flex items-start">
                                <ChevronRight className="w-4 h-4 text-accent mr-2 mt-1 flex-shrink-0" />
                                <div>
                                  <span className="font-medium text-foreground/80">{step.title}:</span> {step.description}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground/90">The Value</h4>
                          <ul className="mt-2 space-y-2">
                            {item.value.map((point, i) => (
                              <li key={i} className="flex items-start">
                                <svg className="w-5 h-5 text-accent mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <Link href="#contact" className="inline-block mt-4">
                  <Button>Partner with us</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

const EcosystemPage = () => {
  const techImage = placeHolderImages.find(p => p.id === 'hero-background');

  return (
    <div className="flex flex-col min-h-screen bg-primary/10">
      <Header />
      <main className="flex-grow">
        {/* HERO SECTION */}
        <div className="relative flex items-center justify-center text-center h-[75vh] overflow-hidden">
          {techImage && (
            <Image
              src={techImage.imageUrl}
              alt={techImage.description}
              fill
              className="object-cover z-0"
              data-ai-hint={techImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-primary/80 z-10"></div>
          <div className="container mx-auto px-4 md:px-6 relative z-20">
            <h1 className="text-4xl md:text-6xl font-bold text-white">The Jal Ecosystem</h1>
            <p className="mt-4 text-lg text-white/90 max-w-3xl mx-auto">
              One token. One truth. <strong>1 $JAL = 1 m³ of verified water impact.</strong> Save it. Earn it. Buy it. Prove it.
            </p>
          </div>
        </div>

        {/* TOKEN PEG BADGE */}
        <div className="container mx-auto px-4 md:px-6 py-12 text-center">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">$J</div>
            <span className="text-white font-semibold">1 $JAL = 1 m³ verified water impact</span>
          </div>
        </div>

        {/* ECOSYSTEM SECTIONS */}
        {ecosystemData.map((item, index) => (
          <EcosystemSection key={item.id} item={item} index={index} />
        ))}
      </main>
      <Footer />
    </div>
  );
};

export default EcosystemPage;