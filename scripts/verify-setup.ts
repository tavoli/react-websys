/**
 * Verification script to check if the dev environment is set up correctly
 */

import { existsSync } from 'fs';
import { join } from 'path';

const projectRoot = process.cwd();

console.log('Verifying React WASM project setup...\n');

let hasErrors = false;

// Check WASM package
const wasmPkgDir = join(projectRoot, 'packages/wasm/pkg');
const wasmBinary = join(wasmPkgDir, 'wasm_layer_system_bg.wasm');
const wasmJs = join(wasmPkgDir, 'wasm_layer_system.js');

if (existsSync(wasmBinary) && existsSync(wasmJs)) {
  console.log('✓ WASM package is built');
} else {
  console.log('✗ WASM package not found - run "bun run build:wasm"');
  hasErrors = true;
}

// Check public directory
const webPublicDir = join(projectRoot, 'packages/web/public');
if (existsSync(webPublicDir)) {
  console.log('✓ Public directory exists');

  const wasmPublicPath = join(webPublicDir, 'wasm_layer_system_bg.wasm');
  if (existsSync(wasmPublicPath)) {
    console.log('✓ WASM file is in public directory');
  } else {
    console.log('✗ WASM file not in public directory - run "bun run dev" to set up');
    hasErrors = true;
  }
} else {
  console.log('✗ Public directory not found');
  hasErrors = true;
}

// Check key source files
const wasmLoader = join(projectRoot, 'packages/web/src/lib/wasm-loader.ts');
const wasmContext = join(projectRoot, 'packages/web/src/contexts/WasmContext.tsx');

if (existsSync(wasmLoader)) {
  console.log('✓ WASM loader exists');
} else {
  console.log('✗ WASM loader not found');
  hasErrors = true;
}

if (existsSync(wasmContext)) {
  console.log('✓ WASM context exists');
} else {
  console.log('✗ WASM context not found');
  hasErrors = true;
}

console.log('\n---\n');

if (hasErrors) {
  console.log('Some checks failed. Please run:');
  console.log('  bun run dev');
  console.log('\nThis will build WASM and set up the dev environment.\n');
  process.exit(1);
} else {
  console.log('All checks passed! You can now run:');
  console.log('  bun run dev');
  console.log('\nThe dev server will be available at http://localhost:3000\n');
}
