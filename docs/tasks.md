# Project Tasks

## Phase 1: Architecture Setup

### 1.1 Project Initialization
- [ ] Initialize React project with Vite (TypeScript template)
- [ ] Initialize Rust library project for WASM
- [ ] Configure Cargo.toml with wasm-bindgen dependencies
- [ ] Configure web-sys features (Document, Element, HtmlElement, MouseEvent, EventTarget)
- [ ] Set up wasm-pack build configuration
- [ ] Create initial project structure (src/components, src/hooks, src/contexts, src/wasm)

### 1.2 WASM Module Setup
- [ ] Create basic Rust WASM module entry point
- [ ] Implement WASM module initialization function
- [ ] Add error handling types (AppError enum with thiserror)
- [ ] Create wasm_module.js wrapper for loading WASM
- [ ] Test WASM module loads successfully in browser

### 1.3 React Context Provider
- [ ] Create WasmContext.jsx with context and provider
- [ ] Implement WASM loading state management (loading, ready, error)
- [ ] Create useWasm hook for consuming context
- [ ] Add WasmProvider to App root
- [ ] Test context provides WASM instance to children

## Phase 2: UI Framework (React)

### 2.1 Basic Layout Components
- [ ] Create App.jsx with main layout structure
- [ ] Create Workspace container component (800x600px, bordered)
- [ ] Create ControlPanel component (250px width, right side)
- [ ] Add minimal CSS (under 50 lines total)
- [ ] Verify layout displays correctly

### 2.2 Control Panel Components
- [ ] Create PositionInputs component (X and Y inputs)
  - Label above input, vertical stacking
  - data-wasm-sync attributes for WASM updates
- [ ] Create LayerOrderButtons component
  - "Bring to Front" button
  - "Send to Back" button
  - Plain white buttons with 1px border
- [ ] Create LayerList component (unordered list)
  - Display 5 layer items
  - Click handler for selection
- [ ] Wire up all controls in ControlPanel

### 2.3 WASM Mount Point
- [ ] Create useWasmMount custom hook
  - Accept mountType parameter
  - Handle mounting/unmounting with useEffect
  - Return containerRef
  - Prevent double-mounting with mountedRef
- [ ] Create WasmContainer component with forwardRef
  - Accept mountType prop
  - Add data-wasm-container attribute
- [ ] Add workspace mount point to main layout

## Phase 3: Dynamic Content (WASM)

### 3.1 Rust Module Structure
- [ ] Create lib.rs with module organization
- [ ] Create workspace module for layer container
- [ ] Create layer module for individual layers
- [ ] Create event_handlers module for mouse events
- [ ] Define public API exports with wasm-bindgen

### 3.2 Layer Data Structure
- [ ] Define Layer struct (id, x, y, z_index, selected)
- [ ] Implement Layer creation method
- [ ] Implement Layer position update methods
- [ ] Implement Layer selection state management
- [ ] Add z-index manipulation methods

### 3.3 Workspace State Management
- [ ] Create Workspace struct with RefCell<Vec<Layer>>
- [ ] Implement singleton pattern for Workspace instance
- [ ] Add layer collection management (add, remove, get)
- [ ] Add selected layer tracking
- [ ] Implement bring_to_front and send_to_back logic

### 3.4 DOM Manipulation
- [ ] Create DomBuilder utility for fluent element creation
- [ ] Implement layer element creation (100x100px divs)
- [ ] Add inline styles for positioning (left, top, position: absolute)
- [ ] Implement data-selected attribute management
- [ ] Add visual state updates (border color changes)

### 3.5 Drag-and-Drop Implementation
- [ ] Create EventHandle struct with Drop trait for cleanup
- [ ] Implement mousedown handler (start drag, mark selected)
- [ ] Implement mousemove handler (update position during drag)
- [ ] Implement mouseup handler (end drag)
- [ ] Add opacity change during drag (0.8)
- [ ] Ensure 60fps performance during drag

### 3.6 WASM Public API
- [ ] Expose mount_workspace function
- [ ] Expose unmount_workspace function
- [ ] Expose update_selected_position function (axis, value)
- [ ] Expose bring_to_front function
- [ ] Expose send_to_back function
- [ ] Expose get_layer_info function (for syncing)

## Phase 4: Integration

### 4.1 React to WASM Communication
- [ ] Wire position inputs to call wasm.update_selected_position
- [ ] Wire "Bring to Front" button to wasm.bring_to_front
- [ ] Wire "Send to Back" button to wasm.send_to_back
- [ ] Wire layer list clicks to WASM selection
- [ ] Add input validation and error handling

### 4.2 WASM to React Synchronization
- [ ] Implement position input sync when layer selected
- [ ] Update layer list to highlight selected layer
- [ ] Sync inputs during drag operations
- [ ] Handle edge cases (no selection, invalid values)

### 4.3 Memory Management
- [ ] Verify all event listeners cleaned up on unmount
- [ ] Test for memory leaks (heap profiling)
- [ ] Ensure Drop implementations called correctly
- [ ] Add cleanup in unmount_workspace

### 4.4 Error Handling
- [ ] Add try-catch in React for WASM calls
- [ ] Display user-friendly error messages
- [ ] Log WASM errors to console
- [ ] Handle WASM load failures gracefully

## Phase 5: Testing & Optimization

### 5.1 React Testing
- [ ] Test WasmContext provider initialization
- [ ] Test useWasm hook throws outside provider
- [ ] Test control components render correctly
- [ ] Mock WASM for isolated component tests

### 5.2 WASM Testing
- [ ] Set up wasm-bindgen-test
- [ ] Test layer state management
- [ ] Test z-index calculations
- [ ] Test position boundary checks
- [ ] Test event handler cleanup

### 5.3 Integration Testing
- [ ] Test layer creation on mount
- [ ] Test drag-and-drop functionality
- [ ] Test input synchronization
- [ ] Test layer selection via list
- [ ] Test bring to front/send to back

### 5.4 Performance Validation
- [ ] Measure drag operation frame rate (target: 60fps)
- [ ] Measure WASM initialization time (target: <100ms)
- [ ] Profile memory usage over time
- [ ] Verify WASM bundle size (<500KB)
- [ ] Test on Chrome, Firefox, Safari, Edge

### 5.5 Documentation
- [ ] Add JSDoc comments to React components
- [ ] Add Rust doc comments to public APIs
- [ ] Document React/WASM boundaries clearly
- [ ] Add usage examples in component files
- [ ] Create troubleshooting guide

## Optional Enhancements (Post-MVP)

- [ ] Add layer resize functionality
- [ ] Implement undo/redo system
- [ ] Add keyboard shortcuts
- [ ] Implement layer grouping
- [ ] Add export/import layer configurations
- [ ] Performance benchmarking dashboard
- [ ] Add design system overlay (post-wireframe)

## Notes

- Follow minimalist UI principles throughout (no styling until functional)
- Keep total CSS under 50 lines during development
- Maintain clear React/WASM boundaries
- Test memory cleanup thoroughly
- Document any deviations from architecture
