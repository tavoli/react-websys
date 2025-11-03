# React WASM Layer System

A high-performance layer management system combining React UI with Rust WebAssembly for state management.

## Project Structure

This is a monorepo-style project with the following structure:

```
react-websys/
├── packages/
│   ├── web/          # React frontend application
│   │   ├── src/      # React components, contexts, and hooks
│   │   ├── public/   # Static assets
│   │   └── index.html
│   └── wasm/         # Rust WASM layer system
│       ├── src/      # Rust source code
│       ├── pkg/      # Generated WASM package (git-ignored)
│       └── Cargo.toml
├── scripts/          # TypeScript build scripts
│   ├── build.ts      # Main build orchestrator
│   ├── build-wasm.ts # WASM build script
│   └── build-web.ts  # Web build script
└── dist/             # Production build output (git-ignored)
```

## Prerequisites

- [Bun](https://bun.sh/) - Fast JavaScript runtime and bundler
- [Rust](https://www.rust-lang.org/) - For WASM compilation
- [wasm-pack](https://rustwasm.github.io/wasm-pack/) - WASM build tool

```bash
# Install wasm-pack
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
```

## Getting Started

### Install Dependencies

```bash
bun install
```

### Development

Start the development server with hot reload:

```bash
bun run dev
```

This will:
1. Build the WASM package if not already built
2. Copy the WASM binary to `packages/web/public/` for serving
3. Start the Bun dev server at http://localhost:3000/ with hot module replacement

The dev script automatically handles the WASM file setup, ensuring the binary is accessible to the browser.

### Building

Build the entire project (WASM + Web):

```bash
# Production build
bun run build

# Development build (faster, no minification)
bun run build:dev
```

Build individual packages:

```bash
# Build only WASM package
bun run build:wasm

# Build only web package (requires WASM to be built first)
bun run build:web
```

### Preview Production Build

```bash
bun run preview
```

Serves the production build at http://localhost:3000/

### Other Commands

```bash
# TypeScript type checking
bun run typecheck

# Lint code
bun run lint

# Clean build artifacts
bun run clean
```

## Build System

This project uses custom TypeScript build scripts powered by Bun:

1. **dev.ts** - Development server setup (builds WASM, copies to public, starts server)
2. **build-wasm.ts** - Compiles Rust to WASM using wasm-pack
3. **build-web.ts** - Type checks and bundles the React app with Bun
4. **build.ts** - Orchestrates the full build pipeline

The build system:
- Compiles Rust to WebAssembly targeting web
- Type-checks TypeScript with strict settings
- Bundles the React app with code splitting
- Copies WASM binaries to the dist folder
- Supports both development and production modes

### Development Server Details

The dev server (`scripts/dev.ts`) ensures WASM files are accessible by:
1. Checking if WASM package is built (builds if missing)
2. Copying `wasm_layer_system_bg.wasm` to `packages/web/public/`
3. Starting Bun's built-in dev server with hot reload

This approach works because Bun's dev server automatically serves files from the `public/` directory alongside the HTML entry point.

## Architecture

### WASM Layer System

The Rust WASM module handles:
- Layer state management
- Drag-and-drop calculations
- Z-index ordering
- Layer transformations

### React Frontend

The React app provides:
- Interactive UI components
- Layer visualization via Canvas API
- Real-time updates from WASM state
- User input handling

### Communication Bridge

`packages/web/src/lib/wasm-loader.ts` manages:
- WASM module initialization
- Import path resolution
- Type-safe WASM bindings

## Configuration

### TypeScript

- Root `tsconfig.json` - Base configuration with path aliases
- `packages/web/tsconfig.json` - Web package specific settings

Path aliases are configured for easier imports:
```typescript
import { Component } from '@web/components/Component';
import { wasmModule } from '@wasm/wasm_layer_system';
```

### Package Management

This project uses Bun workspaces. Dependencies are hoisted to the root, but packages can have their own dependencies if needed.

## License

MIT
