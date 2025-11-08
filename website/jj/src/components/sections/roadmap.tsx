import React from 'react';

const roadmapData = [
  {
    phase: 'Phase 1',
    year: '2026',
    title: 'Pilot & Foundation',
    description: 'Launch pilots in Bengaluru, Mumbai, & Delhi. Onboard first partners and verify 1 million liters of water impact.',
    position: { top: '10%', left: '15%' },
  },
  {
    phase: 'Phase 2',
    year: '2027-2028',
    title: 'Scale & Marketplace',
    description: 'Expand to 100 partners globally. Launch the $JAL token marketplace and deploy intelligent leak detection.',
     position: { top: '50%', left: '45%' },
  },
  {
    phase: 'Phase 3',
    year: '2029+',
    title: 'Global Adoption',
    description: 'Reach 1,000+ global partners, covering 30% of water-stressed urban populations and achieving a global market.',
     position: { top: '20%', left: '75%' },
  },
];

const Roadmap = () => {
  return (
    <section id="roadmap" className="py-20 md:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">A Milestone-Driven Global Rollout</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our journey is just beginning. We have a clear, phased plan to scale our impact from local communities to a global water economy.
          </p>
        </div>

        <div className="relative h-96 w-full hidden md:block">
          {/* Winding Path SVG */}
          <svg
            className="absolute top-0 left-0 w-full h-full"
            preserveAspectRatio="none"
            viewBox="0 0 1200 400"
          >
            <path
              d="M 50,200 C 250,50 350,350 600,200 C 850,50 950,350 1150,200"
              fill="none"
              stroke="hsl(var(--primary) / 0.2)"
              strokeWidth="6"
              strokeDasharray="12 12"
              strokeLinecap="round"
            />
          </svg>

          {/* Milestones */}
          {roadmapData.map((item) => (
            <div
              key={item.phase}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 w-64"
              style={{ top: item.position.top, left: item.position.left }}
            >
              <div className="relative">
                <div className="absolute -inset-2 bg-primary/20 rounded-full blur-lg opacity-60"></div>
                <div className="relative bg-card p-4 rounded-2xl shadow-lg border border-primary/20">
                    <span className="absolute -top-3 -left-3 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">{item.year}</span>
                    <h3 className="text-lg font-bold text-primary mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Mobile View */}
        <div className="md:hidden space-y-12">
            {roadmapData.map((item) => (
                 <div key={item.phase} className="relative bg-card p-6 rounded-2xl shadow-lg border border-primary/20">
                    <span className="absolute -top-3 left-4 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">{item.year}</span>
                    <h3 className="text-xl font-bold text-primary mt-4 mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
