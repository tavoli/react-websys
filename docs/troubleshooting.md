# Troubleshooting Guide

## Common Issues and Solutions

---

## WASM Loading Issues

### Issue: WASM file returns HTML instead of binary

**Symptoms:**
- Console error: `Failed to initialize WASM: TypeError: Response has unsupported MIME type`
- Network tab shows HTML content for `.wasm` request
- Content-Type is `text/html` instead of `application/wasm`

**Root Cause:**
WASM file not accessible to dev server

**Solution:**
```bash
# Stop dev server (Ctrl+C)

# Restart dev server (this copies WASM to public/)
bun run dev
```

**Verification:**
```bash
# Check if WASM is in public directory
ls -la packages/web/public/wasm_layer_system_bg.wasm

# Should show file with ~150KB size
```

---

### Issue: WASM file not found (404)

**Symptoms:**
- Console error: `Failed to load WASM: 404 Not Found`
- Network tab shows 404 for `.wasm` request

**Root Cause:**
WASM package not built

**Solution:**
```bash
# Build WASM package
bun run build:wasm

# Restart dev server
bun run dev
```

**Verification:**
```bash
# Run verification script
bun run verify

# Should show all checkmarks
```

---

### Issue: WASM loads but functions fail

**Symptoms:**
- WASM initializes successfully
- Calling WASM functions throws errors
- Console shows: `TypeError: wasm.function_name is not a function`

**Root Cause:**
- Mismatch between Rust exports and TypeScript interface
- WASM not rebuilt after Rust changes

**Solution:**
```bash
# Rebuild WASM
cd packages/wasm
wasm-pack build --target web --dev

# Return to root and restart
cd ../..
bun run dev
```

**Verification:**
```typescript
// Check available exports
console.log(Object.keys(wasm));
// Should show: test_wasm, mount_workspace, etc.
```

---

## Build Issues

### Issue: wasm-pack not found

**Symptoms:**
```
sh: wasm-pack: command not found
```

**Solution:**
```bash
# Install wasm-pack
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# Verify installation
wasm-pack --version
```

---

### Issue: Rust not installed

**Symptoms:**
```
error: no override and no default toolchain set
```

**Solution:**
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add WASM target
rustup target add wasm32-unknown-unknown

# Verify installation
rustc --version
cargo --version
```

---

### Issue: WASM build fails with errors

**Symptoms:**
```
error[E0433]: failed to resolve: use of undeclared crate or module
```

**Root Cause:**
Missing Rust dependencies or syntax errors

**Solution:**
```bash
# Update Cargo.lock
cd packages/wasm
cargo update

# Check Cargo.toml for correct dependencies

# Try building with verbose output
wasm-pack build --target web --dev --verbose
```

**Common Fixes:**
```toml
# Ensure these in Cargo.toml
[dependencies]
wasm-bindgen = "0.2"
web-sys = { version = "0.3", features = ["console", "Document", "Element", "HtmlElement", "Node", "Window"] }
```

---

### Issue: TypeScript errors in WASM imports

**Symptoms:**
```
Cannot find module '../../../wasm/pkg/wasm_layer_system.js'
```

**Root Cause:**
WASM package not built yet, TypeScript can't find generated files

**Solution:**
```bash
# Build WASM first
bun run build:wasm

# TypeScript should now find the types
```

**Alternative:**
```typescript
// Add @ts-ignore as temporary workaround
// @ts-ignore
const wasm = await import('../../../wasm/pkg/wasm_layer_system.js');
```

---

## Dev Server Issues

### Issue: Port 3000 already in use

**Symptoms:**
```
error: Failed to start server
Address already in use (os error 48)
```

**Solution:**
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 bun run dev
```

---

### Issue: Hot reload not working

**Symptoms:**
- Changes to files don't trigger browser reload
- Must manually refresh to see changes

**Root Cause:**
Dev server not watching files correctly

**Solution:**
```bash
# Restart dev server
# Press Ctrl+C to stop
bun run dev

# If still not working, clear cache
rm -rf node_modules/.cache
bun run dev
```

---

### Issue: Dev server starts but page is blank

**Symptoms:**
- Dev server running without errors
- Browser shows blank white page
- Console may show errors

**Diagnostic Steps:**
```bash
# 1. Check console for errors
# Open DevTools → Console

# 2. Check network tab
# Look for failed requests

# 3. Check if WASM initialized
# Should see "WASM initialized" in console
```

**Solution:**
```bash
# Clean and rebuild
bun run clean
bun install
bun run dev
```

---

## Performance Issues

### Issue: WASM loading is slow

**Symptoms:**
- Page takes several seconds to become interactive
- "Loading..." message persists

**Solutions:**

1. **Use development build for faster compilation:**
```bash
# Dev build is faster but larger
wasm-pack build --target web --dev
```

2. **Use release build for smaller size:**
```bash
# Release build is slower to compile but smaller and faster
wasm-pack build --target web --release
```

3. **Enable caching:**
```typescript
// Service worker for offline caching
// Add to public/sw.js
```

---

### Issue: High memory usage

**Symptoms:**
- Browser tab uses excessive memory
- System becomes sluggish

**Root Cause:**
- Memory leaks in WASM
- Not properly disposing of resources

**Solution:**
```rust
// In Rust, implement Drop for cleanup
impl Drop for Workspace {
    fn drop(&mut self) {
        // Clean up resources
        self.layers.clear();
    }
}
```

```typescript
// In React, cleanup on unmount
useEffect(() => {
  const wasm = getWasmInstance();

  return () => {
    wasm?.unmount_workspace();
  };
}, []);
```

---

## File System Issues

### Issue: Permission denied when copying WASM

**Symptoms:**
```
Error: EACCES: permission denied, copyfile
```

**Solution:**
```bash
# Fix permissions
chmod +w packages/web/public/
rm -f packages/web/public/wasm_layer_system_bg.wasm

# Retry
bun run dev
```

---

### Issue: Symlink fails on Windows

**Symptoms:**
```
Error: EPERM: operation not permitted, symlink
```

**Root Cause:**
Windows requires admin privileges for symlinks

**Solution:**
The fix already handles this by using `copyFileSync` instead of symlinks.

If still failing:
```bash
# Run terminal as Administrator
# Or use WSL2 instead
```

---

## Browser Compatibility Issues

### Issue: WASM not supported in browser

**Symptoms:**
```
WebAssembly is not defined
```

**Root Cause:**
Very old browser without WASM support

**Solution:**
Upgrade to a modern browser:
- Chrome 57+
- Firefox 52+
- Safari 11+
- Edge 16+

**Detection:**
```javascript
if (typeof WebAssembly === 'undefined') {
  alert('Please upgrade your browser to use this application');
}
```

---

### Issue: CORS errors in production

**Symptoms:**
```
Access to fetch at 'https://example.com/wasm_layer_system_bg.wasm'
from origin 'https://app.example.com' has been blocked by CORS policy
```

**Root Cause:**
WASM file served from different domain

**Solution:**
```nginx
# nginx configuration
location ~* \.wasm$ {
    add_header Access-Control-Allow-Origin *;
    add_header Cache-Control "public, max-age=31536000, immutable";
}
```

---

## React Issues

### Issue: "useWasm must be used within WasmProvider"

**Symptoms:**
```
Error: useWasm must be used within WasmProvider
```

**Root Cause:**
Component using `useWasm()` hook is not wrapped in `WasmProvider`

**Solution:**
```typescript
// In main.tsx, ensure WasmProvider wraps the app
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WasmProvider>  {/* ← Must wrap entire app */}
      <App />
    </WasmProvider>
  </StrictMode>,
)
```

---

### Issue: WASM context is null

**Symptoms:**
- `wasm` from context is `null`
- Functions can't be called

**Root Cause:**
Component rendering before WASM initializes

**Solution:**
```typescript
function MyComponent() {
  const { wasm, status } = useWasm();

  // Wait for WASM to load
  if (status === 'loading') {
    return <div>Loading WASM...</div>;
  }

  if (status === 'error') {
    return <div>Failed to load WASM</div>;
  }

  // Now safe to use wasm
  return <div onClick={() => wasm.test_wasm()}>Click me</div>;
}
```

---

## Git Issues

### Issue: WASM files committed to git

**Symptoms:**
Large files in git history

**Root Cause:**
`pkg/` directory not ignored

**Solution:**
```bash
# Ensure .gitignore includes
echo "packages/wasm/pkg/" >> .gitignore
echo "packages/wasm/target/" >> .gitignore
echo "packages/web/public/wasm_layer_system_bg.wasm" >> .gitignore

# Remove from git if already committed
git rm -r --cached packages/wasm/pkg/
git rm --cached packages/web/public/wasm_layer_system_bg.wasm
git commit -m "Remove WASM build artifacts from git"
```

---

## Environment Issues

### Issue: Bun not found

**Symptoms:**
```
command not found: bun
```

**Solution:**
```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Reload shell
source ~/.bashrc  # or source ~/.zshrc

# Verify
bun --version
```

---

### Issue: Node version conflicts

**Symptoms:**
Strange errors with dependencies

**Solution:**
Use Bun exclusively, not Node:
```bash
# Remove node_modules
rm -rf node_modules

# Reinstall with Bun
bun install
```

---

## Verification Commands

Use these commands to diagnose issues:

```bash
# Check environment
bun --version
rustc --version
wasm-pack --version

# Verify project setup
bun run verify

# Check WASM build
ls -lh packages/wasm/pkg/wasm_layer_system_bg.wasm

# Check public directory
ls -lh packages/web/public/

# Check for TypeScript errors
bun run typecheck

# Check for lint errors
bun run lint

# Test dev server (will error if issues)
timeout 3 bun run dev || echo "Dev server check complete"
```

---

## Debug Mode

Enable verbose logging:

```typescript
// In wasm-loader.ts
export async function initWasm(): Promise<WasmModule> {
  console.log('[DEBUG] Starting WASM initialization');

  try {
    console.log('[DEBUG] Importing WASM module');
    const wasm = await import('../../../wasm/pkg/wasm_layer_system.js');

    console.log('[DEBUG] Loading WASM binary from:', './public/wasm_layer_system_bg.wasm');
    await wasm.default('./public/wasm_layer_system_bg.wasm');

    console.log('[DEBUG] WASM initialized successfully');
    console.log('[DEBUG] Available functions:', Object.keys(wasm));

    wasmInstance = wasm;
    return wasm;
  } catch (error) {
    console.error('[DEBUG] WASM initialization failed:', error);
    console.error('[DEBUG] Error stack:', error.stack);
    throw error;
  }
}
```

---

## Getting Help

### Information to Provide

When asking for help, include:

1. **Error message** (full stack trace)
2. **Environment info:**
   ```bash
   bun --version
   rustc --version
   wasm-pack --version
   uname -a  # or `ver` on Windows
   ```
3. **Steps to reproduce**
4. **What you've tried**
5. **Output of:** `bun run verify`

### Useful Resources

- [Project README](../README.md)
- [Quick Reference](./quick-reference.md)
- [Architecture Guide](./architecture.md)
- [Bun Discord](https://bun.sh/discord)
- [Rust WASM Book](https://rustwasm.github.io/docs/book/)

---

## Last Resort

If nothing works:

```bash
# Nuclear option: Start completely fresh
cd ..
rm -rf react-websys
git clone <repo>
cd react-websys

# Install prerequisites
curl -fsSL https://bun.sh/install | bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
rustup target add wasm32-unknown-unknown

# Start from scratch
bun install
bun run dev
```

This should fix all issues caused by corrupted state or partial installations.
