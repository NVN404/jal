
'use client';
import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const timelineData = [
  {
    step: '01',
    title: 'Partnership',
    description: 'Collaborate with Residents’ Associations and facility managers for scalable integration.',
  },
  {
    step: '02',
    title: 'Tracking',
    description: 'Smart meters send real-time, verified water usage data to our secure platform.',
  },
  {
    step: '03',
    title: 'Token Creation',
    description: 'A smart contract issues $JAL tokens for every cubic meter of verified water impact.',
  },
  {
    step: '04',
    title: 'Dual Market',
    description: 'Residents redeem tokens for discounts, while corporations buy them for ESG compliance.',
  },
  {
    step: '05',
    title: 'Regeneration',
    description: 'Revenue from corporate buyers funds new community projects like rainwater harvesting.',
  },
];

const Solution = () => {
  return (
    <section id="solution" className="py-20 md:py-32 bg-primary/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">The Jal Solution: A New Water Economy</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our blockchain-powered platform turns crisis into opportunity, creating a transparent global market that rewards positive water impact.
          </p>
        </div>

        <div className="relative">
          {/* The river path */}
          <div className="absolute left-1/2 top-0 -ml-1 h-full w-2 hidden md:block" aria-hidden="true">
            <motion.div 
              className="h-full w-full bg-primary/70 origin-top"
              style={{
                boxShadow: '0 0 10px hsl(var(--primary)), 0 0 20px hsl(var(--primary))'
              }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 2, ease: 'easeOut' }}
            />
          </div>

          <div className="space-y-8 md:space-y-0">
            {timelineData.map((item, index) => (
              <div key={item.step} className="relative">

                {/* Desktop Layout */}
                <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-8 md:mb-16">
                  {/* Content Left (Odd numbers) */}
                  <div className={cn(
                    'p-4 rounded-lg text-right',
                    index % 2 === 0 ? 'block' : 'hidden'
                  )}>
                    <Card className="bg-transparent border-none shadow-none">
                      <CardHeader className="p-0">
                        <CardTitle className="text-3xl text-primary">{item.title}</CardTitle>
                        <CardDescription className="text-muted-foreground text-base pt-2">
                          {item.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                  
                  {/* Dot in the middle */}
                  <div className={cn(
                      "flex w-28 h-28 bg-background rounded-full items-center justify-center p-2 shadow-lg",
                      index % 2 !== 0 && "col-start-2"
                  )}>
                      <div className="w-full h-full bg-card rounded-full flex items-center justify-center shadow-inner">
                          <span className="text-3xl text-primary/50">{item.step}</span>
                      </div>
                  </div>

                  {/* Content Right (Even numbers) */}
                  <div className={cn(
                    'p-4 rounded-lg',
                     index % 2 !== 0 ? 'block' : 'hidden'
                  )}>
                    <Card className="bg-transparent border-none shadow-none">
                      <CardHeader className="p-0">
                        <CardTitle className="text-3xl text-primary">{item.title}</CardTitle>
                        <CardDescription className="text-muted-foreground text-base pt-2">
                          {item.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden flex items-start gap-4 mb-8">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center shadow-inner">
                      <span className="text-2xl text-primary/50">{item.step}</span>
                    </div>
                    {index < timelineData.length - 1 && (
                      <div className="w-px grow min-h-24 bg-primary/20 mt-4" />
                    )}
                  </div>
                  <div className="pt-3">
                    <h3 className="text-2xl text-primary mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Solution;
