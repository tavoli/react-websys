/**
 * Web build script
 * Handles TypeScript checking and Bun bundling
 */

import { $ } from 'bun';
import { existsSync } from 'fs';
import { join } from 'path';

export interface WebBuildOptions {
  mode: 'development' | 'production';
  verbose?: boolean;
  skipTypecheck?: boolean;
}

export async function buildWeb(options: WebBuildOptions) {
  const webDir = join(process.cwd(), 'packages/web');
  const distDir = join(process.cwd(), 'dist');
  const wasmPkgDir = join(process.cwd(), 'packages/wasm/pkg');

  // Step 1: TypeScript checking
  if (!options.skipTypecheck) {
    console.log('  Running TypeScript checks...');
    try {
      await $`tsc --project ${join(webDir, 'tsconfig.json')} --noEmit`.quiet(!options.verbose);
    } catch (error) {
      throw new Error('TypeScript check failed');
    }
  }

  // Step 2: Bundle with Bun
  console.log('  Bundling application...');
  const minify = options.mode === 'production' ? '--minify' : '';

  try {
    const result = await $`bun build ${join(webDir, 'index.html')} --outdir=${distDir} ${minify} --target=browser --splitting`.quiet(!options.verbose);
    if (options.verbose) {
      console.log(result.stdout.toString());
    }
  } catch (error) {
    throw new Error(`Bundling failed: ${error}`);
  }

  // Step 3: Copy WASM files
  console.log('  Copying WASM files...');
  if (!existsSync(wasmPkgDir)) {
    throw new Error('WASM package not found. Run WASM build first.');
  }

  await $`cp ${join(wasmPkgDir, 'wasm_layer_system_bg.wasm')} ${distDir}/`;

  console.log(`  ✅ Output: ${distDir}`);
}

// Allow running directly
if (import.meta.main) {
  const args = process.argv.slice(2);
  await buildWeb({
    mode: args.includes('--dev') ? 'development' : 'production',
    verbose: args.includes('--verbose') || args.includes('-v'),
    skipTypecheck: args.includes('--skip-typecheck'),
  });
}
