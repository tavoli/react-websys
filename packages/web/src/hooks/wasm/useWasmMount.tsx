/**
 * useWasmMount Hook
 * Handles mounting and unmounting of WASM content into React containers
 * Uses mountedRef to prevent double-mounting in React StrictMode
 */

import { useEffect, useRef } from 'react';
import { useWasm } from '../../contexts/WasmContext';

export function useWasmMount(mountType: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);
  const { wasm, status } = useWasm();

  useEffect(() => {
    if (status !== 'ready' || !containerRef.current || !wasm || mountedRef.current) {
      return;
    }

    const mountFunction = wasm[`mount_${mountType}`];
    const unmountFunction = wasm[`unmount_${mountType}`];

    if (mountFunction) {
      mountedRef.current = true;
      mountFunction(containerRef.current);
    }

    return () => {
      if (unmountFunction && mountedRef.current) {
        mountedRef.current = false;
        unmountFunction();
      }
    };
  }, [wasm, status, mountType]);

  return containerRef;
}
