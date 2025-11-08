import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CommunityIcon } from '../icons/community-icon';
import { FactoryIcon } from '../icons/factory-icon';
import { LeafIcon } from '../icons/leaf-icon';
import { WavySeparator } from '../ui/wavy-separator';

const partnersData = [
  {
    value: 'residents',
    icon: <CommunityIcon className="h-8 w-8 text-primary" />,
    title: 'For Residents\' Associations',
    description: 'Empower your community by reducing water bills and generating revenue. Our platform provides the tools to track savings, reward conservation, and fund sustainable projects like rainwater harvesting, creating a virtuous cycle of impact and investment.',
    points: ['Lower utility costs for residents', 'New revenue stream from token sales', 'Fund community infrastructure projects']
  },
  {
    value: 'facilities',
    icon: <FactoryIcon className="h-8 w-8 text-primary" />,
    title: 'For Industrial Facilities',
    description: 'Turn your wastewater into a valuable asset. By recycling water, you not only reduce your environmental footprint but also generate $JAL tokens. These can be sold to corporations, creating a new revenue stream and showcasing your commitment to sustainability.',
    points: ['Monetize water recycling efforts', 'Strengthen your corporate sustainability profile', 'Gain a competitive edge with green credentials']
  },
  {
    value: 'corporations',
    icon: <LeafIcon className="h-8 w-8 text-primary" />,
    title: 'For Corporations',
    description: 'Meet your ESG goals with verifiable and transparent water credits. Purchase $JAL tokens on our open market to offset your water consumption and support community-led conservation projects. Our on-chain ledger ensures every claim is auditable and impactful.',
    points: ['Achieve ESG and compliance targets', 'Invest in transparent, verifiable impact', 'No greenwashing—all data is on-chain']
  }
];

const Partners = () => {
  return (
    <section id="partners" className="py-20 md:py-32 bg-primary/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Join the Water Revolution</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Whether you are a community, an industrial facility, or a corporation, you have a role to play in creating a water-secure future.
          </p>
        </div>

        <Tabs defaultValue="residents" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-primary/10 rounded-xl p-2 h-auto">
            {partnersData.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value} className="flex flex-col sm:flex-row gap-2 items-center text-foreground/70 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-md rounded-lg p-3">
                {tab.icon} {tab.title.split('For ')[1]}
              </TabsTrigger>
            ))}
          </TabsList>
          {partnersData.map(tab => (
            <TabsContent key={tab.value} value={tab.value} className="mt-8">
              <Card className="border-none shadow-none bg-transparent">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                      <h3 className="text-3xl font-bold text-foreground">{tab.title}</h3>
                      <p className="text-muted-foreground">{tab.description}</p>
                      <ul className="space-y-2 pt-4">
                        {tab.points.map((point, i) => (
                           <li key={i} className="flex items-start">
                             <svg className="w-5 h-5 text-accent mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                             </svg>
                             <span className="text-foreground">{point}</span>
                           </li>
                        ))}
                      </ul>
                    </div>
                     <div className="bg-card p-8 rounded-3xl flex items-center justify-center aspect-square">
                        {React.cloneElement(tab.icon, {className: 'h-32 w-32 text-primary/80' })}
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
