import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { WavySeparator } from '../ui/wavy-separator';
import { Globe, Siren, Frown } from 'lucide-react';

const aboutData = [
  {
    icon: <Globe className="h-10 w-10 text-primary" />,
    title: 'The Global Water Crisis',
    description:
      "Only 1% of the planet's water is available freshwater. A quarter of the world's population faces severe water stress, a crisis accelerating with climate change and urbanization.",
  },
  {
    icon: <Frown className="h-10 w-10 text-primary" />,
    title: 'The Limits of an Old Model',
    description:
      'Centralized infrastructures are failing, with cities losing 30-50% of treated water to leaks. Inefficient billing forces conservationists to subsidize waste, demanding a decentralized, community-powered future.',
  },
  {
    icon: <Siren className="h-10 w-10 text-primary" />,
    title: 'A New Global Regulatory Push',
    description:
      'New regulations mandating individual water meters and transparent ESG reporting are creating an immediate global market for verifiable water impact solutions, paving the way for innovation.',
  },
];

const About = () => {
  return (
    <section id="about" className="relative py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            A World Thirsting for a Solution
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our most critical resource is under unprecedented strain. The old ways have failed, but a new wave of technology and regulation brings hope.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {aboutData.map((item, index) => (
            <Card
              key={index}
              className="border-2 border-primary/20 rounded-3xl shadow-lg hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-300 bg-card/80 backdrop-blur-sm"
            >
              <CardHeader className="items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  {item.icon}
                </div>
                <CardTitle className="text-2xl text-foreground">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                <p>{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <WavySeparator className="text-primary/10 mt-20 relative z-10" />
    </section>
  );
};

export default About;
