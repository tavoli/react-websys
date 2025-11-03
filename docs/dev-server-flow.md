# Development Server Flow

## Before Fix

```
Browser Request: GET /wasm_layer_system_bg.wasm
                     ↓
         Bun Dev Server (packages/web/)
                     ↓
         File not found in web directory
                     ↓
         Returns index.html (404 fallback)
                     ↓
         Browser receives HTML instead of WASM
                     ↓
         ❌ WASM initialization fails
```

**Error in Console:**
```
Failed to initialize WASM: TypeError: Response has unsupported MIME type
```

**Network Tab:**
```
Request:  /wasm_layer_system_bg.wasm
Status:   200 OK
Type:     document (text/html)
Size:     ~2KB (HTML page)
```

---

## After Fix

```
bun run dev
    ↓
scripts/dev.ts
    ↓
[1] Check if WASM built → Build if missing
    ↓
[2] Create public/ directory
    ↓
[3] Copy wasm_layer_system_bg.wasm to public/
    ↓
[4] Start: bun --hot packages/web/index.html
    ↓
Browser Request: GET /public/wasm_layer_system_bg.wasm
                     ↓
         Bun Dev Server
                     ↓
         Serves file from packages/web/public/
                     ↓
         Returns WASM binary
                     ↓
         ✅ WASM loads successfully
```

**Console Output:**
```
Development server setup

Copied WASM file to public directory

Starting dev server...

Open http://localhost:3000 in your browser
```

**Network Tab:**
```
Request:  /public/wasm_layer_system_bg.wasm
Status:   200 OK
Type:     wasm (application/wasm)
Size:     ~150KB (WASM binary)
```

---

## Directory Structure

### Before Fix

```
packages/
├── web/
│   ├── src/
│   │   └── lib/
│   │       └── wasm-loader.ts  ← imports from ../../../wasm/pkg/
│   ├── public/                  ← empty or doesn't exist
│   └── index.html
└── wasm/
    └── pkg/
        ├── wasm_layer_system.js
        └── wasm_layer_system_bg.wasm  ← not accessible via HTTP
```

### After Fix

```
packages/
├── web/
│   ├── src/
│   │   └── lib/
│   │       └── wasm-loader.ts  ← imports JS from ../../../wasm/pkg/
│   │                              loads WASM from ./public/
│   ├── public/
│   │   └── wasm_layer_system_bg.wasm  ← copied here (accessible)
│   └── index.html
└── wasm/
    └── pkg/
        ├── wasm_layer_system.js
        └── wasm_layer_system_bg.wasm  ← source file
```

---

## Key Concepts

### Why JavaScript imports work but WASM doesn't

**JavaScript Module Import:**
- Uses Node-style resolution
- Bun resolves `../../../wasm/pkg/wasm_layer_system.js`
- Works at build/bundle time
- ✅ Can access files outside web directory

**WASM Binary Loading:**
- Uses HTTP fetch
- Browser requests `/wasm_layer_system_bg.wasm` from server
- Happens at runtime
- ❌ Server only serves files in its directory tree

### Solution: Copy to Public Directory

The `public/` directory is special:
- Bun dev server automatically serves files from it
- Files are accessible at `/public/filename`
- Standard convention for static assets
- Works in both dev and production builds

---

## Development Workflow

### First Time Setup

```bash
# Install dependencies
bun install

# Start dev server (handles WASM setup automatically)
bun run dev
```

### After Modifying WASM Code

```bash
# Rebuild WASM
bun run build:wasm

# Restart dev server (will copy updated WASM)
bun run dev
```

### Clean Build

```bash
# Remove all generated files
bun run clean

# Start fresh
bun run dev
```

---

## Troubleshooting

### WASM file returns HTML

**Symptom:** Browser receives HTML when requesting WASM file

**Cause:** WASM file not in public directory

**Fix:**
```bash
bun run dev  # This will copy the file
```

### WASM build not found

**Symptom:** `scripts/dev.ts` tries to build WASM but fails

**Cause:** wasm-pack not installed or Rust not configured

**Fix:**
```bash
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
rustup target add wasm32-unknown-unknown
```

### Module not found errors

**Symptom:** Cannot import WASM module

**Cause:** WASM package not built

**Fix:**
```bash
bun run build:wasm
```

### Old WASM file being served

**Symptom:** Changes to Rust code not reflected in browser

**Cause:** Stale WASM file in public directory

**Fix:**
```bash
# Rebuild WASM
bun run build:wasm

# Remove old public WASM file
rm packages/web/public/wasm_layer_system_bg.wasm

# Restart dev server
bun run dev
```

---

## Verification

Run the verification script to check setup:

```bash
bun run verify
```

Expected output:
```
Verifying React WASM project setup...

✓ WASM package is built
✓ Public directory exists
✓ WASM file is in public directory
✓ WASM loader exists
✓ WASM context exists

---

All checks passed! You can now run:
  bun run dev

The dev server will be available at http://localhost:3000
```
