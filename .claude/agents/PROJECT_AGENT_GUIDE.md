# React + WebAssembly Project - Agent Usage Guide

This guide explains how to use the installed agents for your React + WebAssembly layer manipulation project.

## Installed Agents

### Meta & Orchestration
- **workflow-orchestrator** - Manages the 5-phase implementation workflow

### Language Specialists
- **react-specialist** - React 18+ patterns, hooks, context management
- **rust-engineer** - Rust/WASM implementation with web-sys
- **typescript-pro** - Type safety and build tooling

## Agent-to-Phase Mapping

### Phase 1: Architecture Setup
**Primary Agent:** `workflow-orchestrator`
```
> workflow-orchestrator: Help me set up Phase 1 - Architecture Setup
```
**Tasks:**
- Coordinate React + Rust project initialization
- Set up WASM build pipeline
- Create WasmContext provider structure

**Supporting Agents:**
- `typescript-pro` for tsconfig and build setup
- `rust-engineer` for Cargo.toml and wasm-pack configuration

### Phase 2: UI Framework (React)
**Primary Agent:** `react-specialist`
```
> react-specialist: Implement Phase 2 - UI Framework components
```
**Tasks:**
- Create layout components (Workspace, ControlPanel)
- Build control components (PositionInputs, LayerOrderButtons, LayerList)
- Implement useWasmMount custom hook
- Set up WasmContainer component

**Key Focus:**
- Minimalist UI (no styling)
- Proper React patterns (hooks, context, refs)
- data-wasm-sync attributes for WASM updates

### Phase 3: Dynamic Content (WASM)
**Primary Agent:** `rust-engineer`
```
> rust-engineer: Implement Phase 3 - Dynamic Content in Rust/WASM
```
**Tasks:**
- Create Rust module structure (workspace, layer, event_handlers)
- Implement Layer struct with state management
- Build drag-and-drop with web-sys
- Create DomBuilder utility
- Implement WASM public API

**Key Focus:**
- Memory safety (RAII pattern for event handlers)
- Zero unsafe code in public APIs
- 60fps drag performance
- WebAssembly optimization

### Phase 4: Integration
**Primary Agent:** `workflow-orchestrator`
```
> workflow-orchestrator: Coordinate Phase 4 - React-WASM Integration
```
**Tasks:**
- Wire React controls to WASM methods
- Implement WASM → React synchronization
- Memory cleanup verification
- Error handling

**Supporting Agents:**
- `react-specialist` for React event handlers
- `rust-engineer` for WASM public API refinement
- `typescript-pro` for type safety at boundaries

### Phase 5: Testing & Optimization
**Primary Agent:** `workflow-orchestrator`
```
> workflow-orchestrator: Execute Phase 5 - Testing and Performance Validation
```
**Supporting Agents:**
- `rust-engineer` for WASM performance profiling
- `react-specialist` for React component testing

## Common Use Cases

### Starting a New Phase
```
> workflow-orchestrator: I'm ready to start Phase [X]. Please coordinate the implementation.
```

### React-Specific Questions
```
> react-specialist: How should I structure the useWasmMount hook to prevent double-mounting in StrictMode?
```

### Rust/WASM-Specific Questions
```
> rust-engineer: Help me implement memory-safe event handler cleanup using the Drop trait
```

### Type Safety Issues
```
> typescript-pro: How do I type the WASM module interface for TypeScript?
```

### Cross-Boundary Integration
```
> workflow-orchestrator: Coordinate React-WASM communication for position input synchronization
```

## Architecture-Specific Guidelines

### React-WASM Boundaries

**React Agents Should:**
- Focus on UI components and controls
- Create mount points with proper refs
- Handle user input and form controls
- Use context for WASM instance access

**Rust Agents Should:**
- Focus on dynamic layer creation
- Implement drag-and-drop logic
- Manage layer state
- Direct DOM manipulation via web-sys

**Never:**
- Ask React agents to write WASM code
- Ask Rust agents to write React components
- Create JavaScript bridge code (architectural violation)

### Minimalist Development Enforcement

When working with ANY agent, remind them:
```
IMPORTANT: Follow minimalist development principles:
- No CSS styling beyond functional borders
- Total CSS under 50 lines
- Black text on white background only
- Focus on functionality first
```

## Agent Collaboration Patterns

### Pattern 1: Sequential Specialists
For independent React and WASM work:
1. `react-specialist` builds UI components
2. `rust-engineer` builds WASM modules
3. `workflow-orchestrator` integrates them

### Pattern 2: Parallel Development
For concurrent work:
```
> workflow-orchestrator: Coordinate parallel development:
  - react-specialist: Build control panel components
  - rust-engineer: Implement layer data structures
```

### Pattern 3: Integration Coordination
For cross-boundary features:
```
> workflow-orchestrator: Coordinate drag-and-drop integration:
  - rust-engineer: Implement WASM drag handlers
  - react-specialist: Add visual feedback in React
  - typescript-pro: Type the integration interfaces
```

## Quick Reference Commands

### Check Agent Availability
```bash
ls .claude/agents/
```

### View Agent Capabilities
```
> [agent-name]: What are your capabilities?
```

### Phase Status Check
```
> workflow-orchestrator: Review progress on current phase and identify blockers
```

### Architecture Validation
```
> workflow-orchestrator: Validate that we're maintaining React-WASM boundaries correctly
```

## Troubleshooting

### Agent Not Understanding Context
Provide specific context:
```
> react-specialist: This is a React + WASM hybrid app. React owns UI, WASM owns dynamic layers. [Your question]
```

### Wrong Agent for Task
Redirect explicitly:
```
> workflow-orchestrator: Please delegate this React component work to react-specialist
```

### Architecture Violations
Stop and clarify:
```
> workflow-orchestrator: STOP. This violates the React-WASM boundary. React should not manipulate layers directly.
```

## Performance Targets to Remind Agents

When working with agents, reference these targets:
- **Drag operations:** 60fps minimum
- **WASM initialization:** <100ms
- **WASM bundle size:** <500KB
- **Memory:** Stable over time (no leaks)
- **Browser support:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## Best Practices

1. **Start with workflow-orchestrator** for multi-step or cross-boundary work
2. **Use specialists** for deep technical implementation in their domain
3. **Reference CLAUDE.md and tasks.md** when invoking agents
4. **Enforce minimalist principles** with every agent interaction
5. **Validate architecture boundaries** at integration points

## Example Session Flow

```
User: Let's start implementing this project

> workflow-orchestrator: Review the tasks.md and help me execute Phase 1

[Orchestrator coordinates setup]

User: Phase 1 complete, moving to UI

> react-specialist: Implement the Workspace and ControlPanel components from Phase 2.1

[React specialist builds components]

User: Now I need the WASM layer system

> rust-engineer: Implement the Layer struct and drag-and-drop from Phase 3

[Rust engineer builds WASM modules]

User: Time to connect them

> workflow-orchestrator: Coordinate Phase 4 integration between React controls and WASM layers

[Orchestrator manages cross-boundary integration]
```

## Notes

- Agents have been pre-configured with the repository's proven patterns
- Each agent has isolated context - provide project context as needed
- workflow-orchestrator is best for coordination, specialists for implementation
- Always reference CLAUDE.md for architecture principles
- Keep agents focused on their specialization for best results
