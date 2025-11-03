/**
 * WASM Module Wrapper
 * Handles loading and initialization of the WASM layer system
 */

let wasmInstance = null;

export async function initWasm() {
  if (wasmInstance) {
    return wasmInstance;
  }

  try {
    // Load the WASM module
    const wasm = await import('../../wasm-layer-system/pkg/wasm_layer_system.js');

    // Pass the correct path to the WASM binary
    // In production (bundled), use relative path from the root
    await wasm.default('./wasm_layer_system_bg.wasm');

    wasmInstance = wasm;
    return wasm;
  } catch (error) {
    console.error('Failed to initialize WASM:', error);
    throw error;
  }
}

export function getWasmInstance() {
  return wasmInstance;
}
