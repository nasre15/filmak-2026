'use client';

import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function ConnectWalletButton() {
  const { toast } = useToast();

  const handleConnect = async () => {
    if (window.ethereum) {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        toast({
          title: 'Wallet Connected',
          description: `Connected to account: ${accounts[0]}`,
        });
      } catch (error) {
        console.error('User denied account access', error);
        toast({
          variant: 'destructive',
          title: 'Connection Failed',
          description: 'You rejected the connection request.',
        });
      }
    } else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      toast({
        variant: 'destructive',
        title: 'MetaMask Not Found',
        description: 'Please install MetaMask to use this feature.',
      });
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleConnect}>
      <Wallet className="h-5 w-5" />
      <span className="sr-only">Connect Wallet</span>
    </Button>
  );
}
