
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
    partnership: 'As part of the Jal ecosystem, we provide our own smart water meters designed for reliable and secure data retrieval. This hardware is one of the key products that powers our network.',
    howItWorks: [
        { title: "Installation", description: "Meters are installed at key points in the water system." },
        { title: "Data Collection", description: "Real-time data is securely transmitted to the Jal platform." },
        { title: "Verification", description: "Data is verified on-chain, ensuring its integrity." }
    ],
    value: [
        "Reliable and Secure Data Retrieval",
        "Powers the entire Jal verifiable data network",
        "Enables creation of on-chain water assets"
    ],
    imageId: 'hero-background',
  },
  {
    id: 'residents',
    category: 'For Residents',
    title: 'For Residents',
    headline: 'Empowering Homeowners and Apartment Buildings',
    partnership: 'A simple, plug-and-play smart water meter from Jal allows homeowners to contribute data and earn rewards.',
    howItWorks: [
        { title: "Install Meter", description: "A Jal smart meter is installed in your home or building." },
        { title: "Contribute Data", description: "Your anonymized water usage data is shared with the network." },
        { title: "Earn Rewards", description: "Receive $JAL tokens for your data contribution." }
    ],
    value: [
        "Earn a passive income in $JAL tokens just by contributing your water consumption data.",
        "Let your data help subsidize your water bill.",
        "Become an active participant in a sustainable water economy."
    ],
    imageId: 'residents',
  },
  {
    id: 'industries',
    category: 'For Industries',
    title: 'For Industries',
    headline: 'Servicing Factories, Manufacturing, and Agriculture',
    partnership: 'We provide heavy-duty, industrial-grade smart meters to track water usage and recycling efforts in large-scale operations.',
     howItWorks: [
        { title: "Meter Integration", description: "Industrial-grade meters are fitted into your existing water infrastructure." },
        { title: "Track Usage & Recycling", description: "Monitor water inflow, outflow, and recycled amounts in real-time." },
        { title: "Generate Assets", description: "Verifiable data is used to mint ESG-compliant tokens." }
    ],
    value: [
      'Get two massive benefits: Earn $JAL rewards for your data.',
      'Get verifiable, on-chain ESG proof of your water usage, ready for corporate reports and saving you in audit fees.',
    ],
    imageId: 'industries',
  },
  {
    id: 'municipalities',
    category: 'For Municipalities',
    title: 'For Municipalities',
    headline: 'Partnering with Wastewater Renewal Plants',
    partnership: 'We install specialized meters to track both water inflow and the volume of treated, renewed water being returned to the system.',
    howItWorks: [
        { title: "Measure Inflow/Outflow", description: "Track water entering the plant and purified water leaving it." },
        { title: "Verify Renewal", description: "The volume of renewed water is verified on-chain." },
        { title: "Mint Credits", description: 'Mint "Verifiable Water Renewal Credits" based on the proven output.' }
    ],
    value: [
      'Create a brand-new asset from a byproduct.',
      'By verifiably proving the water you renew, you can sell credits for a significant profit.',
      'Incentivizes investment in better water treatment infrastructure.'
    ],
    imageId: 'municipalities',
  },
  {
    id: 'conservationists',
    category: 'For Water Conservationists',
    title: 'For Water Conservationists',
    headline: 'Prove Your Impact, Fund Your Mission',
    partnership: 'A platform for the NGOs, activists, and communities on the ground who are actively saving water.',
    howItWorks: [
      {
        title: 'Measure the Baseline',
        description: 'Before you start a project—like restoring a lake or running a community awareness campaign—we help you deploy Jal sensors to establish a verifiable, on-chain baseline.',
      },
      {
        title: 'Drive the Impact',
        description: 'You do what you do best and run your conservation initiative.',
      },
      {
        title: 'Prove the Result',
        description: "Our network measures the positive change in real-time. The water you saved is no longer just a number in a report; it's a verifiable fact on the blockchain.",
      },
    ],
    value: [
      'Get undeniable, on-chain proof of your impact to show donors, partners, and the world.',
      'Mint your proven results as "Verifiable Conservation Credits" on the Jal Marketplace.',
      'Sell these credits to corporates who need to meet their ESG goals. Your conservation work can now fund itself, creating a powerful, self-sustaining loop.',
    ],
    imageId: 'conservationists',
  },
    {
    id: 'corporates',
    category: 'For Corporates',
    title: 'For Corporates',
    headline: 'Achieve Your ESG & "Water Positive" Goals with Unquestionable Proof',
    partnership: 'A transparent and auditable platform for corporations to fund real-world water impact and verifiably meet their sustainability commitments.',
    howItWorks: [
      {
        title: 'Access the Marketplace',
        description: 'Browse the Jal Marketplace, a global exchange of on-chain, verifiable water assets.',
      },
      {
        title: 'Purchase Verifiable Credits',
        description: 'Buy "Verifiable Water Renewal Credits" directly from municipalities and "Verifiable Conservation Credits" directly from the NGOs and projects on the ground.',
      },
      {
        title: 'Receive On-Chain Proof',
        description: 'Your purchase is settled on-chain. You receive a unique token that acts as an immutable, auditable receipt of the specific water you helped renew or conserve.',
      },
    ],
    value: [
      "This is not a donation. You are purchasing a verified asset that proves a specific, measured amount of water was saved or renewed. It's an auditable fact, not a marketing claim.",
      'Show your auditors, investors, and customers the exact on-chain transaction that proves your ESG contribution. This is the highest standard of transparency.',
      'Your capital flows directly to the municipalities and conservationists who are doing the work, creating a powerful and transparent incentive for them to do more.',
    ],
    imageId: 'corporates',
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
              A collaborative network powered by verifiable data and shared incentives, creating value for every stakeholder in the water cycle.
            </p>
          </div>
        </div>
        {ecosystemData.map((item, index) => (
          <EcosystemSection key={item.id} item={item} index={index} />
        ))}
      </main>
      <Footer />
    </div>
  );
};

export default EcosystemPage;
