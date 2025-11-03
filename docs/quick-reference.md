# Quick Reference - WASM Development

## Common Commands

```bash
# Start development server (automatic WASM setup)
bun run dev

# Verify setup is correct
bun run verify

# Rebuild WASM only
bun run build:wasm

# Full production build
bun run build

# Clean all build artifacts
bun run clean

# Type checking
bun run typecheck

# Lint code
bun run lint
```

---

## Development Workflow

### Starting Fresh

```bash
git clone <repo>
cd react-websys
bun install
bun run dev
# Open http://localhost:3000
```

### After Modifying WASM

```bash
# 1. Make changes to Rust code in packages/wasm/src/

# 2. Rebuild WASM
bun run build:wasm

# 3. Restart dev server
# Press Ctrl+C to stop
bun run dev
```

### After Modifying React

```bash
# No action needed - hot reload is automatic
# Just save your file and browser will update
```

---

## Troubleshooting

### WASM file not found (404)

```bash
# Check if WASM is built
ls packages/wasm/pkg/wasm_layer_system_bg.wasm

# If not, build it
bun run build:wasm

# Check if in public
ls packages/web/public/wasm_layer_system_bg.wasm

# If not, restart dev server
bun run dev
```

### WASM returns HTML

```bash
# Remove stale file and restart
rm packages/web/public/wasm_layer_system_bg.wasm
bun run dev
```

### Module not found errors

```bash
# Clean and rebuild everything
bun run clean
bun run dev
```

### wasm-pack not found

```bash
# Install wasm-pack
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# Add WASM target
rustup target add wasm32-unknown-unknown
```

---

## File Locations

```
Key Files:
├── packages/web/src/lib/wasm-loader.ts     ← WASM initialization
├── packages/web/src/contexts/WasmContext.tsx ← WASM provider
├── packages/wasm/src/lib.rs                ← WASM entry point
├── scripts/dev.ts                          ← Dev server script
└── package.json                            ← Scripts

Generated Files:
├── packages/wasm/pkg/                      ← WASM build output
└── packages/web/public/wasm_layer_system_bg.wasm ← Served file
```

---

## Network Request Check

### Expected in DevTools Network Tab

```
Request URL:     http://localhost:3000/public/wasm_layer_system_bg.wasm
Request Method:  GET
Status Code:     200 OK
Content-Type:    application/wasm
Content-Length:  ~150000 bytes
```

### If Seeing This Instead (BAD)

```
Request URL:     http://localhost:3000/wasm_layer_system_bg.wasm
Request Method:  GET
Status Code:     200 OK
Content-Type:    text/html        ← WRONG!
Content-Length:  ~2000 bytes      ← HTML page
```

**Fix:** Run `bun run dev` to copy WASM to public/

---

## Console Messages

### Good (Working)

```
Development server setup

Copied WASM file to public directory

Starting dev server...

Open http://localhost:3000 in your browser
```

Browser console: No WASM errors

### Bad (Not Working)

```
Failed to initialize WASM: TypeError: Response has unsupported MIME type
```

**Fix:** Run `bun run verify` to diagnose

---

## Quick Fixes

### Problem: Changes not showing up

```bash
# Hard refresh browser
Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows/Linux)
```

### Problem: Dev server won't start

```bash
# Check if port 3000 is in use
lsof -ti:3000 | xargs kill -9  # Kill process on port 3000
bun run dev                     # Restart
```

### Problem: Old WASM being used

```bash
# Clean and rebuild
bun run clean
bun run dev
```

### Problem: Build fails

```bash
# Check prerequisites
rustc --version      # Should show Rust version
wasm-pack --version  # Should show wasm-pack version
bun --version        # Should show Bun version

# If any missing, install them first
```

---

## Environment Setup

### First Time Setup

```bash
# Install Bun (if not installed)
curl -fsSL https://bun.sh/install | bash

# Install Rust (if not installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install wasm-pack
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# Add WASM target
rustup target add wasm32-unknown-unknown

# Clone and setup project
git clone <repo>
cd react-websys
bun install

# Verify everything works
bun run verify
bun run dev
```

---

## VS Code Tasks

Add to `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Dev Server",
      "type": "shell",
      "command": "bun run dev",
      "problemMatcher": [],
      "group": {
        "kind": "build",
        "isDefault": true
      }
    },
    {
      "label": "Rebuild WASM",
      "type": "shell",
      "command": "bun run build:wasm",
      "problemMatcher": []
    },
    {
      "label": "Verify Setup",
      "type": "shell",
      "command": "bun run verify",
      "problemMatcher": []
    }
  ]
}
```

Use: Cmd+Shift+B (Mac) or Ctrl+Shift+B (Windows/Linux)

---

## Performance Tips

### Fast Development Cycle

1. Keep dev server running
2. Only modify React code (hot reload)
3. Batch WASM changes before rebuilding
4. Use `--dev` flag for faster WASM builds

### Faster WASM Builds

```bash
# Development build (faster)
cd packages/wasm
wasm-pack build --target web --dev

# Release build (slower, optimized)
cd packages/wasm
wasm-pack build --target web --release
```

### Skip Type Checking (faster iteration)

```bash
# Skip typecheck during dev
# Type errors will show in IDE anyway
```

---

## Help

### Documentation

- [README.md](../README.md) - Project overview
- [WASM_FIX_SUMMARY.md](../WASM_FIX_SUMMARY.md) - Fix details
- [dev-server-flow.md](./dev-server-flow.md) - Server flow diagrams
- [changes-made.md](./changes-made.md) - Change log

### Commands for Help

```bash
bun run verify          # Check setup
wasm-pack --help        # WASM build options
bun --help              # Bun options
```

### External Resources

- [Bun Documentation](https://bun.sh/docs)
- [wasm-pack Guide](https://rustwasm.github.io/wasm-pack/)
- [Rust WASM Book](https://rustwasm.github.io/docs/book/)
