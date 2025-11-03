/**
 * WasmContainer Component
 * Provides a mount point for WASM-created content
 * WARNING: Do NOT add React state or event handlers to this container
 * WASM owns all content within this container
 */

import { forwardRef } from 'react';

interface WasmContainerProps {
  mountType: string;
  className?: string;
}

export const WasmContainer = forwardRef<HTMLDivElement, WasmContainerProps>(
  ({ mountType, className = '' }, ref) => {
    return (
      <div
        ref={ref}
        data-wasm-container={mountType}
        className={className}
      />
    );
  }
);

WasmContainer.displayName = 'WasmContainer';
