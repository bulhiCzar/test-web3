import React from 'react';
import logo from './logo.svg';
import './App.css';

import '@rainbow-me/rainbowkit/styles.css';
import {http, WagmiProvider} from "wagmi";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ConnectButton, getDefaultConfig, RainbowKitProvider} from "@rainbow-me/rainbowkit";
import {bscTestnet} from "viem/chains";
import {Details} from "./components/Details";
import {Reward} from "./components/Reward";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchInterval: 2000
        }
    }
});

declare module 'wagmi' {
    interface Register {
        config: typeof config
    }
}

const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
    chains: [bscTestnet],
    transports: {
        [bscTestnet.id]: http(),
    },
    ssr: false, // If your dApp uses server side rendering (SSR)
});


function App() {
  return (
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider modalSize="compact" >

              <ConnectButton showBalance={false} />

              <br/><br/>

              <Details />

              <br/><br/>

              <Reward />

          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
  );
}

export default App;
