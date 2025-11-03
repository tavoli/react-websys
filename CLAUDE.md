# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Experimental React + WebAssembly application demonstrating hybrid architecture:
- React manages all static UI components (controls, panels, inputs)
- WebAssembly (Rust + web-sys) manages dynamic interactive elements (draggable layers)
- Zero JavaScript bridge code for layer manipulation

## Core Architectural Principles

### Division of Responsibilities

**React owns:**
- UI chrome (buttons, inputs, panels, containers)
- Application layout and structure
- Form controls and user inputs
- Mounting containers for WASM content (using `data-wasm-container` attributes)
- All styleable UI elements

**WASM owns:**
- Dynamic layer creation and management
- All drag-and-drop logic
- Layer state and positioning
- Direct DOM manipulation for performance-critical updates
- Event handling for interactive elements

**Critical Rule:** React creates maximum HTML for styling; WASM only creates dynamic content requiring high-performance manipulation.

## Minimalist Development Philosophy

**NO visual styling during development:**
- Black text on white background only
- No CSS frameworks, gradients, shadows, or animations
- Plain HTML inputs with default browser styling
- Forms: vertical label + input stacking
- Entire application CSS under 50 lines
- Focus on functionality; styling comes later

**Speed benefit:** 3x faster development (empirically tested: 24min → 8min for complex features)

## Project Structure

```
src/
├── components/
│   ├── wasm-containers/     # WASM mount point components
│   └── ui-controls/          # Pure React UI components
├── hooks/
│   └── wasm/                # WASM-related hooks (useWasmMount)
├── contexts/
│   └── WasmContext.jsx      # WASM instance provider
├── styles/
│   ├── components/          # React component styles
│   └── wasm-elements.scss   # Styles for WASM-created elements
└── wasm/
    └── wasm_module.js       # WASM module wrapper
```

## Development Commands

### React Setup
```bash
npm create vite@latest . -- --template react-ts
npm install
# Development with Bun (default)
bun run dev
# Development with Vite (legacy)
bun run dev:vite
```

### Rust/WASM Setup
```bash
cargo new --lib wasm-layer-system
# Add to Cargo.toml:
# [lib]
# crate-type = ["cdylib"]
#
# [dependencies]
# wasm-bindgen = "0.2"
# web-sys = { version = "0.3", features = ["Document", "Element", "HtmlElement", "MouseEvent", "EventTarget"] }
# thiserror = "1.0"

wasm-pack build --target web
```

### Build and Preview
```bash
# Build with Bun (default)
bun run build

# Preview production build
bun run preview

# Legacy Vite commands still available:
# bun run build:vite
# bun run preview:vite
```

### Testing
```bash
# React tests
npm test

# Rust/WASM tests
wasm-pack test --headless --chrome
```

## Migration Notes (Vite → Bun)

### Key Changes
1. **Bundler:** Migrated from Vite to Bun for faster build times
2. **WASM Loading:** Updated to use explicit path (`./wasm_layer_system_bg.wasm`) instead of `import.meta.url`
3. **Build Process:** Added automatic WASM file copying to dist folder
4. **Preview Server:** Using Python's http.server instead of Bun's --hot mode (limitation: Bun doesn't serve WASM files correctly)

### Known Limitations
- Bun's `--hot` mode doesn't properly serve static WASM files with correct MIME types
- Preview server requires Python 3 (uses `python3 -m http.server`)
- Hot reload in dev mode works but may require manual page refresh for WASM changes

### WASM Path Configuration
The WASM module loader in `src/wasm/wasm_module.js` explicitly passes the WASM path:
```javascript
await wasm.default('./wasm_layer_system_bg.wasm');
```
This ensures correct path resolution in both development and production builds.

## React Patterns

### WASM Context Usage
```jsx
// Every component needing WASM must use context
const { wasm, status } = useWasm();

// Wait for ready state before mounting
if (status !== 'ready') return <div>Loading WASM...</div>;
```

### WASM Mount Points
```jsx
// Use custom hook for mounting
const containerRef = useWasmMount('workspace');

return <div ref={containerRef} data-wasm-container="workspace" />;
```

### Communication: React → WASM
```jsx
// Direct method calls
wasm.update_selected_position('x', value);
wasm.bring_to_front();
```

## Rust/WASM Patterns

### Memory Management
- Use RAII pattern with Drop trait for event listeners
- Explicit cleanup in Drop implementations
- No leaked closures or event handlers

### DOM Manipulation
```rust
// Use DomBuilder fluent API
let element = DomBuilder::create(&doc, "div")?
    .id("layer-1")
    .class("wasm-layer")
    .style("left", "0px")?
    .build();
```

### Error Handling
```rust
use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("DOM element not found: {0}")]
    ElementNotFound(String),
    #[error("Invalid state transition: {0}")]
    InvalidState(String),
}

pub type WasmResult<T> = Result<T, AppError>;
```

### Communication: WASM → React
```rust
// Update React inputs via data attributes
fn sync_inputs(&self) -> Result<(), JsValue> {
    let input = self.document
        .query_selector("[data-wasm-sync='position-x']")?;
    input.set_attribute("value", &x.to_string())?;
}
```

## CSS Strategy

**React components:** Use CSS classes and stylesheets
**WASM elements:** Minimal inline styles for positioning only
**Shared state:** Use data attributes (e.g., `data-selected="true"`)

Example:
```scss
.wasm-layer {
  position: absolute;
  border: 1px solid #ccc;

  &[data-selected="true"] {
    border-color: #000;
  }
}
```

## Key Implementation Notes

1. **Component Documentation:** Every component interfacing with WASM must document:
   - Its role (structure vs behavior)
   - Warnings about not adding React state/handlers to WASM containers
   - Examples of correct vs incorrect usage

2. **No State Duplication:** WASM maintains single source of truth for layer state; React reads via data attributes

3. **Mount Point Guards:** Use `mountedRef` to prevent double-mounting in React StrictMode

4. **Module Organization:** Separate Rust modules for workspace, controls, event handling with clear public API boundaries

## Performance Requirements

- Layer drag operations: 60fps minimum
- WASM initialization: < 100ms
- Memory usage: Stable over time (no leaks)
- WASM bundle size: < 500KB

## Browser Support

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## Security Considerations

- Avoid command injection when processing user inputs
- Sanitize any user-provided content before DOM insertion
- Be cautious with `set_inner_html` in Rust (prefer createElement)
