/**
 * WasmContext
 * Provides WASM instance to all components
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { initWasm, getWasmInstance } from '../lib/wasm-loader';

type WasmStatus = 'loading' | 'ready' | 'error';

type WasmInstance = ReturnType<typeof getWasmInstance>;

interface WasmContextValue {
  wasm: WasmInstance;
  status: WasmStatus;
  error: Error | null;
}

const WasmContext = createContext<WasmContextValue | null>(null);

interface WasmProviderProps {
  children: ReactNode;
}

export function WasmProvider({ children }: WasmProviderProps) {
  const [wasm, setWasm] = useState<WasmInstance>(null);
  const [status, setStatus] = useState<WasmStatus>('loading');
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    initWasm()
      .then(instance => {
        setWasm(instance);
        setStatus('ready');
      })
      .catch(err => {
        setError(err);
        setStatus('error');
        console.error('WASM initialization failed:', err);
      });
  }, []);

  return (
    <WasmContext.Provider value={{ wasm, status, error }}>
      {children}
    </WasmContext.Provider>
  );
}

export function useWasm(): WasmContextValue {
  const context = useContext(WasmContext);
  if (!context) {
    throw new Error('useWasm must be used within WasmProvider');
  }
  return context;
}
