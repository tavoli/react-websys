/**
 * Development server script
 * Ensures WASM is built, links it to the web package, and starts the dev server
 */

import { $ } from 'bun';
import { existsSync, mkdirSync, copyFileSync, unlinkSync, lstatSync } from 'fs';
import { join } from 'path';

const projectRoot = process.cwd();
const wasmPkgDir = join(projectRoot, 'packages/wasm/pkg');
const wasmBinary = join(wasmPkgDir, 'wasm_layer_system_bg.wasm');
const webPublicDir = join(projectRoot, 'packages/web/public');
const wasmPublicPath = join(webPublicDir, 'wasm_layer_system_bg.wasm');

console.log('Development server setup\n');

// Check if WASM is built
if (!existsSync(wasmBinary)) {
  console.log('Building WASM package...');
  try {
    await $`cd packages/wasm && wasm-pack build --target web --dev`;
    console.log('WASM build complete\n');
  } catch (error) {
    console.error('WASM build failed:', error);
    process.exit(1);
  }
}

// Ensure public directory exists
if (!existsSync(webPublicDir)) {
  console.log('Creating public directory...');
  mkdirSync(webPublicDir, { recursive: true });
}

// Copy WASM binary to public directory
// We use copy instead of symlink for better compatibility across platforms
try {
  // Remove existing file if present
  if (existsSync(wasmPublicPath)) {
    const stats = lstatSync(wasmPublicPath);
    if (stats.isSymbolicLink() || stats.isFile()) {
      unlinkSync(wasmPublicPath);
    }
  }

  // Copy the WASM file
  copyFileSync(wasmBinary, wasmPublicPath);
  console.log('Copied WASM file to public directory\n');
} catch (error) {
  console.error('Failed to copy WASM file:', error);
  process.exit(1);
}

// Start dev server
console.log('Starting dev server...\n');
console.log('Open http://localhost:3000 in your browser\n');

await $`bun --hot packages/web/index.html`;
