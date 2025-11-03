/**
 * WASM Module Loader
 * Handles loading and initialization of the WASM layer system
 */

// WASM module interface based on generated types
interface WasmModule {
  test_wasm(): string;
  mount_workspace(container: HTMLElement): void;
  unmount_workspace(): void;
  update_selected_position(axis: string, value: number): void;
  bring_to_front(): void;
  send_to_back(): void;
  select_layer(index: number): void;
  default(path?: string | URL | Request): Promise<any>;
}

let wasmInstance: WasmModule | null = null;

/**
 * Initialize the WASM module
 * @returns Promise resolving to the WASM module instance
 */
export async function initWasm(): Promise<WasmModule> {
  if (wasmInstance) {
    return wasmInstance;
  }

  try {
    // Load the WASM module from the packages/wasm/pkg directory
    const wasm = await import('../../../wasm/pkg/wasm_layer_system.js') as WasmModule;

    // Initialize the WASM module
    // Let wasm-bindgen resolve the WASM binary using import.meta.url
    // This automatically finds the .wasm file next to the .js file
    await wasm.default();

    wasmInstance = wasm;
    return wasm;
  } catch (error) {
    console.error('Failed to initialize WASM:', error);
    throw error;
  }
}

/**
 * Get the current WASM instance (if initialized)
 * @returns The WASM module instance or null
 */
export function getWasmInstance(): WasmModule | null {
  return wasmInstance;
}
