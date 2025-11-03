/**
 * WASM build script
 * Handles Rust compilation with wasm-pack
 */

import { $ } from 'bun';
import { existsSync } from 'fs';
import { join } from 'path';

export interface WasmBuildOptions {
  release?: boolean;
  verbose?: boolean;
}

export async function buildWasm(options: WasmBuildOptions = {}) {
  const wasmDir = join(process.cwd(), 'packages/wasm');
  const outputDir = join(wasmDir, 'pkg');

  if (!existsSync(wasmDir)) {
    throw new Error(`WASM directory not found: ${wasmDir}`);
  }

  const buildMode = options.release ? '--release' : '--dev';
  const verboseFlag = options.verbose ? '--verbose' : '';

  console.log(`  Building in ${options.release ? 'release' : 'development'} mode...`);

  try {
    await $`cd ${wasmDir} && wasm-pack build --target web ${buildMode} ${verboseFlag}`.quiet(!options.verbose);

    if (!existsSync(join(outputDir, 'wasm_layer_system_bg.wasm'))) {
      throw new Error('WASM binary not generated');
    }

    console.log(`  ✅ Output: ${outputDir}`);

  } catch (error) {
    throw new Error(`WASM build failed: ${error}`);
  }
}

// Allow running directly
if (import.meta.main) {
  const args = process.argv.slice(2);
  await buildWasm({
    release: !args.includes('--dev'),
    verbose: args.includes('--verbose') || args.includes('-v'),
  });
}
