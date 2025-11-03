# Project Architecture

## Overview

This project combines React for UI and Rust WebAssembly for high-performance state management in a layer system.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│                                                             │
│  ┌──────────────────┐         ┌──────────────────┐        │
│  │  React Frontend  │────────▶│  WASM Instance   │        │
│  │                  │         │                  │        │
│  │  - UI Components │  calls  │  - Layer State   │        │
│  │  - User Input    │────────▶│  - Drag/Drop     │        │
│  │  - Rendering     │◀────────│  - Z-ordering    │        │
│  │                  │ updates │                  │        │
│  └──────────────────┘         └──────────────────┘        │
│         ▲                              ▲                   │
│         │                              │                   │
│         └──────────────┬───────────────┘                   │
│                        │                                   │
│                   WasmContext                              │
│              (React Context API)                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Development Build Flow

```
Developer runs: bun run dev
        ↓
┌───────────────────────────────────────────────────────┐
│             scripts/dev.ts                            │
│                                                       │
│  1. Check if WASM built                              │
│     ├─ If not: wasm-pack build --target web --dev   │
│     └─ Output: packages/wasm/pkg/*.wasm, *.js       │
│                                                       │
│  2. Ensure public/ exists                            │
│     └─ mkdir -p packages/web/public/                 │
│                                                       │
│  3. Copy WASM binary                                 │
│     └─ cp pkg/*.wasm → web/public/*.wasm            │
│                                                       │
│  4. Start dev server                                 │
│     └─ bun --hot packages/web/index.html            │
└───────────────────────────────────────────────────────┘
        ↓
┌───────────────────────────────────────────────────────┐
│           Bun Dev Server (localhost:3000)             │
│                                                       │
│  Serves:                                              │
│  ├─ /                → index.html                    │
│  ├─ /src/main.tsx    → TypeScript modules           │
│  ├─ /public/*        → Static assets                 │
│  └─ /public/*.wasm   → WASM binary ✅                │
└───────────────────────────────────────────────────────┘
```

---

## Production Build Flow

```
Developer runs: bun run build
        ↓
┌───────────────────────────────────────────────────────┐
│              scripts/build.ts                         │
│                                                       │
│  1. Build WASM (Release)                             │
│     └─ wasm-pack build --target web --release       │
│                                                       │
│  2. Type Check                                        │
│     └─ tsc --noEmit                                  │
│                                                       │
│  3. Bundle Web App                                    │
│     └─ Bun.build()                                   │
│        ├─ Entry: src/main.tsx                        │
│        ├─ Format: esm                                │
│        ├─ Splitting: true                            │
│        ├─ Minify: true                               │
│        └─ Target: browser                            │
│                                                       │
│  4. Copy Assets                                       │
│     └─ WASM files → dist/                            │
└───────────────────────────────────────────────────────┘
        ↓
┌───────────────────────────────────────────────────────┐
│                    dist/                              │
│  ├─ index.html                                        │
│  ├─ main.js          (bundled React app)             │
│  ├─ chunk-*.js       (code split chunks)             │
│  ├─ wasm_layer_system_bg.wasm                        │
│  └─ wasm_layer_system.js                             │
└───────────────────────────────────────────────────────┘
```

---

## Module Loading Sequence

```
1. Browser loads index.html
        ↓
2. HTML loads <script type="module" src="./src/main.tsx">
        ↓
3. main.tsx initializes React
        ↓
4. Wraps app in <WasmProvider>
        ↓
5. WasmProvider calls initWasm()
        ↓
6. wasm-loader.ts:
   ├─ import('../../../wasm/pkg/wasm_layer_system.js')
   │  └─ Bun resolves this at build time
   │
   └─ wasm.default('./public/wasm_layer_system_bg.wasm')
      └─ Browser fetches via HTTP
             ↓
7. Browser requests: GET /public/wasm_layer_system_bg.wasm
        ↓
8. Dev server serves from packages/web/public/
        ↓
9. WASM module instantiated
        ↓
10. WasmContext provides instance to React components
        ↓
11. App renders with WASM functionality
```

---

## File Organization

```
react-websys/
│
├── packages/
│   │
│   ├── web/                      React Frontend
│   │   ├── src/
│   │   │   ├── components/       UI Components
│   │   │   ├── contexts/         React Context
│   │   │   │   └── WasmContext.tsx
│   │   │   ├── hooks/            Custom Hooks
│   │   │   ├── lib/              Utilities
│   │   │   │   └── wasm-loader.ts  ← WASM Init
│   │   │   ├── App.tsx           Root Component
│   │   │   ├── main.tsx          Entry Point
│   │   │   └── index.css         Styles
│   │   │
│   │   ├── public/               Static Assets
│   │   │   ├── vite.svg
│   │   │   └── wasm_layer_system_bg.wasm  ← Copied here
│   │   │
│   │   ├── index.html            Entry HTML
│   │   ├── tsconfig.json         TS Config
│   │   └── package.json          Package Info
│   │
│   └── wasm/                     Rust WASM
│       ├── src/
│       │   ├── lib.rs            Entry Point
│       │   ├── workspace.rs      Workspace Logic
│       │   ├── layer.rs          Layer Logic
│       │   ├── dom_builder.rs    DOM Utils
│       │   └── event_handlers.rs Event Logic
│       │
│       ├── pkg/                  Build Output
│       │   ├── wasm_layer_system.js       ← JS Glue
│       │   ├── wasm_layer_system_bg.wasm  ← WASM Binary
│       │   ├── wasm_layer_system.d.ts     ← Types
│       │   └── package.json
│       │
│       ├── target/               Rust Build
│       └── Cargo.toml            Rust Config
│
├── scripts/                      Build Scripts
│   ├── dev.ts                    Dev Server ⭐
│   ├── build.ts                  Main Build
│   ├── build-wasm.ts             WASM Build
│   ├── build-web.ts              Web Build
│   └── verify-setup.ts           Verification
│
├── docs/                         Documentation
│   ├── architecture.md           This file
│   ├── dev-server-flow.md        Server flow
│   ├── changes-made.md           Change log
│   └── quick-reference.md        Quick guide
│
├── dist/                         Production Build
│
├── package.json                  Root Package
├── tsconfig.json                 Root TS Config
├── README.md                     Main README
└── WASM_FIX_SUMMARY.md          Fix Summary
```

---

## Data Flow

### User Interaction Flow

```
User clicks on layer
        ↓
React onClick handler
        ↓
Call WASM function via context
        ↓
wasm.select_layer(index)
        ↓
Rust updates internal state
        ↓
Returns to React
        ↓
React re-renders with new state
        ↓
Canvas updates to show selection
```

### Layer Drag Flow

```
User drags layer
        ↓
React onMouseMove handler
        ↓
Calculate delta x, y
        ↓
wasm.update_selected_position(axis, value)
        ↓
Rust updates layer position
        ↓
Rust rebuilds DOM elements
        ↓
Returns to React
        ↓
React re-renders
        ↓
Layer moves on screen
```

---

## Technology Stack

### Frontend

```
React 19.1.1
├─ UI Framework
├─ Component model
├─ Virtual DOM
└─ Context API for state

TypeScript 5.9.3
├─ Type safety
├─ IDE support
└─ Better refactoring

Bun
├─ Runtime
├─ Bundler
├─ Dev server
└─ Package manager
```

### Backend (WASM)

```
Rust
├─ Memory safety
├─ High performance
├─ Zero-cost abstractions
└─ WebAssembly target

wasm-bindgen
├─ JS ↔ WASM bridge
├─ Type conversions
├─ DOM access
└─ Console logging

wasm-pack
├─ Build tool
├─ NPM integration
└─ Type generation
```

---

## Communication Bridge

### wasm-loader.ts

```typescript
// Purpose: Initialize and manage WASM instance

interface WasmModule {
  // WASM exports
  test_wasm(): string;
  mount_workspace(container: HTMLElement): void;
  unmount_workspace(): void;
  update_selected_position(axis: string, value: number): void;
  bring_to_front(): void;
  send_to_back(): void;
  select_layer(index: number): void;

  // WASM initialization
  default(path?: string | URL | Request): Promise<any>;
}

// Singleton instance
let wasmInstance: WasmModule | null = null;

// Initialize once
export async function initWasm(): Promise<WasmModule> {
  if (wasmInstance) return wasmInstance;

  // Import JS glue code (module resolution)
  const wasm = await import('../../../wasm/pkg/wasm_layer_system.js');

  // Load WASM binary (HTTP fetch)
  await wasm.default('./public/wasm_layer_system_bg.wasm');

  wasmInstance = wasm;
  return wasm;
}
```

### WasmContext.tsx

```typescript
// Purpose: Provide WASM instance via React Context

type WasmStatus = 'loading' | 'ready' | 'error';

interface WasmContextValue {
  wasm: WasmInstance;
  status: WasmStatus;
  error: Error | null;
}

// Context provider
export function WasmProvider({ children }: WasmProviderProps) {
  const [wasm, setWasm] = useState<WasmInstance>(null);
  const [status, setStatus] = useState<WasmStatus>('loading');

  useEffect(() => {
    initWasm()
      .then(instance => {
        setWasm(instance);
        setStatus('ready');
      })
      .catch(err => {
        setError(err);
        setStatus('error');
      });
  }, []);

  return (
    <WasmContext.Provider value={{ wasm, status, error }}>
      {children}
    </WasmContext.Provider>
  );
}

// Hook for components
export function useWasm(): WasmContextValue {
  const context = useContext(WasmContext);
  if (!context) {
    throw new Error('useWasm must be used within WasmProvider');
  }
  return context;
}
```

---

## Key Design Decisions

### Why Copy WASM to Public?

**Problem:** Dev server can't serve files outside its directory

**Options Considered:**
1. Symlink - Cross-platform issues
2. Proxy - Too complex
3. Copy - ✅ Simple and reliable

**Decision:** Copy file during dev setup

### Why Explicit WASM Path?

**Problem:** Default path resolution looks for file relative to JS module

**Options Considered:**
1. Auto-resolution - Doesn't work with dev server
2. Relative path - Inconsistent across builds
3. Explicit path - ✅ Clear and consistent

**Decision:** Pass explicit path to `wasm.default()`

### Why Separate Build Script?

**Problem:** Manual steps error-prone

**Options Considered:**
1. Manual copy - Error-prone
2. Bundler plugin - Complex
3. Build script - ✅ Flexible and clear

**Decision:** Create `dev.ts` script

---

## Performance Considerations

### WASM Benefits

- Near-native speed for computations
- Efficient memory management
- No garbage collection overhead
- Direct binary format

### React Benefits

- Virtual DOM diffing
- Efficient re-rendering
- Component memoization
- Lazy loading support

### Optimization Opportunities

1. **Code Splitting**
   - Separate chunks for routes
   - Lazy load components
   - Reduce initial bundle

2. **WASM Size**
   - Release builds with optimizations
   - Strip debug symbols
   - Use smaller allocators

3. **Caching**
   - Browser caches WASM binary
   - Service worker for offline
   - HTTP/2 multiplexing

---

## Security Considerations

### WASM Sandbox

- Runs in browser sandbox
- No direct system access
- Memory isolated from JS
- No network access

### Content Security Policy

- Restrict script sources
- Allow WASM execution
- Validate WASM signatures
- Use HTTPS in production

### Build Integrity

- Verify wasm-pack checksum
- Use locked dependencies
- Review Cargo.lock changes
- Audit npm packages

---

## Debugging Tips

### Chrome DevTools

1. **Sources Panel**
   - See WASM in file tree
   - Set breakpoints (limited)
   - Inspect memory

2. **Network Panel**
   - Verify WASM loaded
   - Check MIME type
   - Monitor transfer size

3. **Console Panel**
   - WASM errors appear here
   - Use console.log in Rust
   - Check initialization status

### Rust Debugging

```rust
// Add debug output
#[wasm_bindgen]
pub fn debug_layer(index: usize) {
    web_sys::console::log_1(&format!("Layer {}: {:?}", index, layer).into());
}
```

### React DevTools

- Inspect WasmContext value
- Check component props
- Monitor re-renders
- Profile performance

---

## Deployment

### Static Hosting (Recommended)

```bash
# Build for production
bun run build

# Deploy dist/ to:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront
```

### Docker Container

```dockerfile
FROM oven/bun:1 as builder
WORKDIR /app
COPY . .
RUN bun install
RUN bun run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Server Configuration

Ensure WASM MIME type:

**nginx:**
```nginx
types {
    application/wasm wasm;
}
```

**Apache:**
```apache
AddType application/wasm .wasm
```

---

## Monitoring

### Metrics to Track

1. **WASM Load Time**
   - Time to download binary
   - Time to instantiate
   - Total initialization time

2. **Function Performance**
   - WASM function call duration
   - React re-render frequency
   - Frame rate during interactions

3. **Error Rates**
   - WASM initialization failures
   - Function call errors
   - Memory allocation failures

### Logging

```typescript
// Add timing metrics
const start = performance.now();
await initWasm();
const duration = performance.now() - start;
console.log(`WASM initialized in ${duration}ms`);
```

---

## Future Enhancements

1. **Web Workers**
   - Run WASM in worker thread
   - Keep main thread responsive
   - Parallel computations

2. **SharedArrayBuffer**
   - Share memory with workers
   - Faster data transfer
   - Real-time collaboration

3. **WASM SIMD**
   - Vectorized operations
   - Faster image processing
   - Better performance

4. **Progressive Loading**
   - Stream WASM compilation
   - Instant startup
   - Better UX

---

## Conclusion

This architecture provides:

- **Performance:** WASM for heavy computation
- **Usability:** React for interactive UI
- **Maintainability:** Clear separation of concerns
- **Scalability:** Easy to add features
- **Developer Experience:** Automated workflows

The dev server fix ensures seamless development with automatic WASM setup and hot reload support.
