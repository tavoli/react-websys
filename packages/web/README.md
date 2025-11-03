# React Web Package

The frontend React application for the WASM Layer System.

## Structure

```
web/
├── src/
│   ├── components/     # React components
│   │   ├── canvas/     # Canvas rendering components
│   │   ├── layers/     # Layer management UI
│   │   └── ui-controls/ # Input controls
│   ├── contexts/       # React contexts
│   │   └── WasmContext.tsx  # WASM instance provider
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities and helpers
│   │   └── wasm-loader.ts   # WASM module loader
│   ├── styles/         # CSS files
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── public/             # Static assets
├── index.html          # HTML template
├── tsconfig.json       # TypeScript configuration
└── package.json        # Package metadata
```

## Key Components

### WasmContext

Provides the WASM instance to all child components via React Context. Handles:
- WASM module initialization
- Loading states
- Error handling

Usage:
```typescript
import { useWasm } from '@/contexts/WasmContext';

function MyComponent() {
  const { wasm, status } = useWasm();

  if (status === 'loading') return <div>Loading WASM...</div>;
  if (status === 'error') return <div>Error loading WASM</div>;

  // Use wasm instance
}
```

### WASM Loader

Located at `src/lib/wasm-loader.ts`, this module:
- Dynamically imports the WASM module
- Initializes it with the correct binary path
- Provides type-safe bindings
- Handles initialization errors

## Development

The web package is built using Bun and includes:
- TypeScript with strict type checking
- React 19 with the new JSX runtime
- Hot module replacement in dev mode
- Code splitting for optimal loading

## Build Output

When built, the web package is bundled to the root `dist/` directory with:
- Minified JavaScript bundles
- Optimized CSS
- Code-split chunks for better caching
- Source maps (in dev mode)
