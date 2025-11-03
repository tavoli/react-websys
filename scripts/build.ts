/**
 * Main build orchestrator
 * Coordinates building WASM and web packages
 */

import { performance } from 'perf_hooks';
import { buildWasm, type WasmBuildOptions } from './build-wasm';
import { buildWeb, type WebBuildOptions } from './build-web';

interface BuildOptions {
  mode: 'development' | 'production';
  skipWasm?: boolean;
  skipWeb?: boolean;
  verbose?: boolean;
}

async function build(options: BuildOptions = { mode: 'production' }) {
  const startTime = performance.now();

  console.log(`🚀 Starting ${options.mode} build...\n`);

  try {
    // Step 1: Build WASM package
    if (!options.skipWasm) {
      console.log('📦 Building WASM package...');
      await buildWasm({
        release: options.mode === 'production',
        verbose: options.verbose,
      });
    }

    // Step 2: Build web package
    if (!options.skipWeb) {
      console.log('\n🌐 Building web package...');
      await buildWeb({
        mode: options.mode,
        verbose: options.verbose,
      });
    }

    const duration = ((performance.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✨ Build completed in ${duration}s`);

  } catch (error) {
    console.error('\n❌ Build failed:', error);
    process.exit(1);
  }
}

// CLI argument parsing
const args = process.argv.slice(2);
const options: BuildOptions = {
  mode: args.includes('--dev') ? 'development' : 'production',
  skipWasm: args.includes('--skip-wasm'),
  skipWeb: args.includes('--skip-web'),
  verbose: args.includes('--verbose') || args.includes('-v'),
};

build(options);
