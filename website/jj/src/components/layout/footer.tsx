
import React from 'react';
import Image from 'next/image';
import { Logo } from '../icons/logo';
import { placeHolderImages } from '@/lib/placeholder-images';
import { Button } from '../ui/button';
import Link from 'next/link';

const Footer = () => {
  const seaImage = placeHolderImages.find(p => p.id === 'hero-background');

  return (
    <footer id="contact" className="relative bg-primary/10 text-primary py-20 md:py-32">
      {seaImage && (
        <Image
          src={seaImage.imageUrl}
          alt={seaImage.description}
          fill
          className="object-cover z-0"
          data-ai-hint={seaImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-primary/80 z-10"></div>
      <div className="container mx-auto py-8 px-4 md:px-6 relative z-20">
        <div className="flex flex-col items-center text-center text-white">
          <Logo className="h-16 w-16" />
          <span className="text-4xl font-semibold mt-4">Jal</span>
           <p className="mt-4 max-w-xl text-lg text-white/90">
            Completing the cycle, contributing to a sustainable future.
          </p>
           <Link href="/whitepaper.pdf" target="_blank">
            <Button
                variant="outline"
                className="mt-8 bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary font-bold transition-all duration-300"
              >
                Download Whitepaper
              </Button>
            </Link>

          <div className="mt-8 space-y-2 text-white/90">
            <p>Email: manbingtwo@gmail.com</p>
            <p>Telegram: @YUN0HU</p>
          </div>

          <p className="text-sm text-white/80 mt-12">
            © {new Date().getFullYear()} Jal. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
