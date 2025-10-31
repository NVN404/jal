
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/icons/logo';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/ecosystem', label: 'Ecosystem' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/support', label: 'Support' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/#contact', label: 'Contact Us' },
];

const Header = () => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const isTransparent = isHomePage && !hasScrolled && !isMenuOpen;

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      alert('Please install MetaMask or another Ethereum wallet!');
    }
  };


  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20);
    };
    if (isHomePage) {
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    } else {
        setHasScrolled(true);
    }
  }, [isHomePage]);
  
  useEffect(() => {
    // Check if a wallet is already connected
    const checkIfWalletIsConnected = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      }
    };
    checkIfWalletIsConnected();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });
    }
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isTransparent ? 'bg-transparent' : 'bg-background/80 backdrop-blur-sm shadow-md'
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className={cn('h-8 w-8 transition-colors', isTransparent ? 'text-white' : 'text-primary')} />
            <span className={cn('font-bold text-2xl transition-colors', isTransparent ? 'text-white' : 'text-foreground')}>
              Jal
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  isTransparent ? 'text-white/90 hover:text-white' : 'text-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
            <Button
              variant={!isTransparent ? "default" : "outline"}
              className={cn(
                'font-bold transition-all duration-300',
                isTransparent && 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary'
              )}
              onClick={connectWallet}
            >
              {account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : 'Connect Wallet'}
            </Button>
          </nav>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(isTransparent ? 'text-white' : 'text-foreground')}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-sm">
          <nav className="flex flex-col items-center space-y-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg text-foreground transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button onClick={connectWallet}>
               {account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : 'Connect Wallet'}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
