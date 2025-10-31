'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { placeHolderImages } from '@/lib/placeholder-images';

const Hero = () => {
  const heroImage = placeHolderImages.find(p => p.id === 'hero-background');

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-primary/50 z-10"></div>

      <div className="relative z-20 flex h-full flex-col items-center justify-center text-center text-white p-4">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className="mt-4 max-w-4xl text-4xl md:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-md">
            A Universal Protocol for Verifiable Water Impact.
          </p>
          <p className='mt-4 text-lg md:text-xl text-white/90 drop-shadow-md'>
            Turning scarcity into a sustainable opportunity.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link href="#about">
            <Button
              variant="outline"
              size="lg"
              className="mt-8 bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary font-bold transition-all duration-300"
            >
              Discover the Solution
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
