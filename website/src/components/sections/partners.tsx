import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Building2, Factory } from 'lucide-react';
import { WavySeparator } from '../ui/wavy-separator';

const partnersData = [
  {
    value: 'residents',
    icon: <Home className="h-8 w-8" />,
    title: 'Residents’ Associations',
    shortTitle: 'Residents',
    description: 'Transform water conservation into real revenue. Admin-verified smart meter data triggers $JAL minting for every litre saved per household. Your association sells tokens to NGOs and corporations and funds solar-powered purifiers, rainwater harvesting systems, and leak repair programs , get an discount in monthly maintanence fee — creating a self-sustaining green community.',
    points: [
      'Earn $JAL for every Litre saved below margin per home',
      'Admin enters data if you are an association already → fraud-proof minting ',
      'Sell tokens → fund solar purifiers & RWH ',
      'Reduce municipal dependency and reduce monthly maintanence costs',
      'Gamified app tracks household savings,  leaderboards and vouchers'
    ]
  },
  {
    value: 'ngo-muni',
    icon: <Building2 className="h-8 w-8" />,
    title: 'NGOs & Municipalities',
    shortTitle: 'NGOs & Muni',
    description: 'Municipalities recycle wastewater at scale → earn up to 50% - 80% $JAL per m³ (multiplier set monthly by admin).  All data notarized on Solana — transparent, auditable, and aligned with UN SDG 6.',
    points: [
      'Municipalities: Earn 80% $JAL on recycled water based on multiplier(quality of water recycled)',
      'NGOs: funded by $JAL → for conservation activities ',
      'Admin-only data entry → zero fraud',
      'On-chain proof for donor reports',
      'Supports NGOs in water-stressed areas'
    ]
  },
  {
    value: 'corp-ind',
    icon: <Factory className="h-8 w-8" />,
    title: 'Corporations & Industries',
    shortTitle: 'Corps & Industry',
    description: 'Industries install water quality meters → admin logs recycling volume and quality. Corporations buy $JAL on open market to offset water footprint, retire tokens on-chain for ESG compliance. Every retired $JAL = 1 m³ of real, verified impact — no greenwashing, full audit trail on Solana.',
    points: [
      'Industry: Recycle → data logged and if used more water , regulate the usage → buy $JAL tokens',
      'Corps: Buy $JAL → for ESG/Scope 3',
      'On-chain retirement = audit-proof',
      'Support real communities — not offsets',
      'Integrates with GRI, CDP, SBTi reporting and various compliances '
    ]
  }
];

const Partners = () => {
  return (
    <section id="partners" className="py-20 md:py-32 bg-primary/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Join the Water Revolution</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Admin-controlled. On-chain verified. Real impact.
          </p>
        </div>

        <Tabs defaultValue="residents" className="w-full">
          {/* TABS LIST — SAME SIZE, NO OVERLAP */}
          <TabsList className="grid w-full grid-cols-3 bg-primary/10 rounded-xl p-2 h-auto gap-2">
            {partnersData.map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex flex-col items-center gap-2 p-3 rounded-lg data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-md text-xs sm:text-sm md:text-base"
              >
                <div className="text-primary">{tab.icon}</div>
                <span className="hidden sm:block">{tab.title}</span>
                <span className="sm:hidden font-medium">{tab.shortTitle}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* TABS CONTENT — SAME SIZE CARD */}
          {partnersData.map(tab => (
            <TabsContent key={tab.value} value={tab.value} className="mt-8">
              <Card className="border-none shadow-none bg-transparent">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                      <h3 className="text-2xl sm:text-3xl font-bold text-foreground">{tab.title}</h3>
                      <p className="text-sm sm:text-base text-muted-foreground">{tab.description}</p>
                      <ul className="space-y-2 pt-4">
                        {tab.points.map((point, i) => (
                          <li key={i} className="flex items-start text-sm sm:text-base">
                            <svg className="w-5 h-5 text-accent mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-foreground">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-card p-8 rounded-3xl flex items-center justify-center aspect-square">
                      {React.cloneElement(tab.icon, { className: 'h-32 w-32 text-primary/80' })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <WavySeparator className="text-background rotate-180 mt-20" />
    </section>
  );
};

export default Partners;