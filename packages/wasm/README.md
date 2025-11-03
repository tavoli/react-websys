# WASM Layer System

Rust-based WebAssembly module for high-performance layer state management.

## Structure

```
wasm/
├── src/
│   └── lib.rs          # Main WASM module implementation
├── pkg/                # Generated WASM package (git-ignored)
│   ├── wasm_layer_system.js       # JavaScript bindings
│   ├── wasm_layer_system_bg.wasm  # Compiled WASM binary
│   └── wasm_layer_system.d.ts     # TypeScript definitions
├── target/             # Rust build artifacts (git-ignored)
├── Cargo.toml          # Rust package manifest
└── Cargo.lock          # Dependency lock file
```

## Features

The WASM layer system provides:
- **Layer Management**: Create, delete, and organize layers
- **Z-Index Control**: Manage layer stacking order
- **Position Tracking**: Handle x/y coordinates for layers
- **Drag-and-Drop**: Calculate positions during drag operations
- **Performance**: Native-speed state updates

## Building

### Prerequisites

- Rust (stable)
- wasm-pack

### Build Commands

```bash
# Development build (faster, larger)
cd packages/wasm
wasm-pack build --target web --dev

# Production build (optimized, smaller)
cd packages/wasm
wasm-pack build --target web --release
```

Or use the project-level build scripts:

```bash
# From project root
bun run build:wasm
```

## Generated Package

The build process generates a `pkg/` directory containing:

1. **wasm_layer_system_bg.wasm** - The compiled WebAssembly binary
2. **wasm_layer_system.js** - JavaScript bindings and glue code
3. **wasm_layer_system.d.ts** - TypeScript type definitions

These files are automatically consumed by the React web package.

## Integration with Web Package

The web package imports and initializes this WASM module:

```typescript
// In packages/web/src/lib/wasm-loader.ts
import wasmInit from '../../../wasm/pkg/wasm_layer_system.js';

await wasmInit('./wasm_layer_system_bg.wasm');
```

## Development

When developing the WASM module:

1. Make changes to `src/lib.rs`
2. Rebuild the WASM package: `bun run build:wasm`
3. The web package will automatically use the updated WASM

## Performance Considerations

- WASM provides near-native performance for state calculations
- Use WASM for CPU-intensive operations
- Keep the WASM API surface small to minimize JS ↔ WASM overhead
- Pass data in bulk rather than making many small calls

## Target Configuration

This WASM module is built with:
- **Target**: `wasm32-unknown-unknown`
- **Output**: Web-compatible ES module
- **Features**: None (default wasm-bindgen features)
