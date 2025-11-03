# Orchestration Commands for React + WASM Project

## Single Command to Orchestrate All Phases

### Method 1: Direct Agent Invocation (Full Automation)

Invoke the workflow-orchestrator agent with a comprehensive prompt:

```
> workflow-orchestrator: You are coordinating the full implementation of a React + WebAssembly layer manipulation application.

PROJECT CONTEXT:
- Review /tasks.md for the complete 5-phase implementation plan
- Review /CLAUDE.md for architecture principles and patterns
- Review /prd.txt for detailed requirements

YOUR MISSION:
Execute all 5 phases sequentially, parallelizing tasks where possible:

PHASE 1: Architecture Setup
- Initialize React (Vite) + Rust/WASM projects
- Configure build tools and dependencies
- Set up WasmContext provider

PHASE 2: UI Framework (React only - can run parallel with Phase 3)
- Create layout components
- Build control panel components
- Implement useWasmMount hook

PHASE 3: Dynamic Content (WASM only - can run parallel with Phase 2)
- Build Rust module structure
- Implement Layer management
- Create drag-and-drop with web-sys

PHASE 4: Integration (requires Phases 2 & 3 complete)
- Wire React controls to WASM
- Implement bidirectional sync
- Memory cleanup

PHASE 5: Testing & Optimization
- Run all tests
- Performance validation
- Documentation

PARALLELIZATION RULES:
- Phase 2 (React) and Phase 3 (WASM) can run in parallel
- Use react-specialist for React work
- Use rust-engineer for WASM work
- Use typescript-pro for build config
- Coordinate integration in Phase 4

CONSTRAINTS:
- Follow minimalist UI (no styling, <50 lines CSS)
- Maintain React-WASM boundaries strictly
- Zero JavaScript bridge code
- 60fps drag performance requirement

Please create a detailed execution plan with parallel task groups, then execute it.
```

### Method 2: Phased Approach with Checkpoints

For more control, invoke per phase with explicit parallelization:

```
> workflow-orchestrator: Execute Phase 1 - Architecture Setup from tasks.md.
After completion, wait for my approval before proceeding to Phase 2.
```

Then after Phase 1:
```
> workflow-orchestrator: Execute Phases 2 and 3 IN PARALLEL:
- Launch react-specialist for Phase 2 (UI Framework)
- Launch rust-engineer for Phase 3 (Dynamic Content)
Coordinate both agents and report when both complete.
```

## 2. Parallel Task Execution

### How Parallelization Works in Claude Code

According to Claude Code's architecture, to run tasks in parallel you must:
1. Send a **single message** with **multiple Task tool calls**
2. The system will execute them concurrently

### Example: Parallel Phase 2 & 3 Execution

**Single message with multiple agent launches:**

```
Please execute Phases 2 and 3 in parallel:

PHASE 2 (react-specialist):
- Create Workspace component (800x600px container)
- Create ControlPanel component (250px, right side)
- Build PositionInputs (X/Y with data-wasm-sync)
- Build LayerOrderButtons (Bring to Front/Send to Back)
- Build LayerList component
- Implement useWasmMount custom hook
- Create WasmContainer component

PHASE 3 (rust-engineer):
- Set up lib.rs module structure
- Create Layer struct (id, x, y, z_index, selected)
- Implement Workspace state manager
- Create DomBuilder utility
- Implement mousedown/mousemove/mouseup handlers
- Create EventHandle with Drop trait
- Expose WASM public API functions

Launch both agents simultaneously and coordinate completion.
```

### Tasks That Can Be Parallelized

Based on your tasks.md:

**✅ CAN RUN IN PARALLEL:**

**Group A - Phase 2 (React) + Phase 3 (WASM)**
```
Parallel Group 1:
├─ react-specialist → All of Phase 2 (UI Framework)
└─ rust-engineer → All of Phase 3 (Dynamic Content)
```

**Group B - Within Phase 5 (Testing)**
```
Parallel Group 2:
├─ react-specialist → React component tests
├─ rust-engineer → WASM unit tests
└─ Performance benchmarking
```

**❌ MUST RUN SEQUENTIALLY:**

```
Phase 1 → (Phases 2 & 3 parallel) → Phase 4 → Phase 5
```

**Reasoning:**
- Phase 1 creates foundation (must complete first)
- Phases 2 & 3 are independent (React vs WASM)
- Phase 4 requires both 2 & 3 (integration)
- Phase 5 requires everything built (testing)

## 3. Advanced Orchestration Patterns

### Pattern A: Full Automation with Explicit Parallelization

```
> workflow-orchestrator: Orchestrate the complete React + WASM implementation using this strategy:

EXECUTION PLAN:

STAGE 1: Foundation (Sequential)
├─ Initialize React project with Vite + TypeScript
├─ Initialize Rust library with wasm-pack
├─ Configure dependencies and build tools
└─ Create WasmContext provider
→ Wait for user approval

STAGE 2: Parallel Development (2 agents simultaneously)
├─ [react-specialist] Build all UI components (Phase 2)
│   ├─ Layout (Workspace + ControlPanel)
│   ├─ Controls (Inputs, Buttons, List)
│   └─ Hooks (useWasmMount + WasmContainer)
│
└─ [rust-engineer] Build WASM layer system (Phase 3)
    ├─ Module structure (workspace, layer, events)
    ├─ Layer state management
    ├─ Drag-and-drop implementation
    └─ Public API exposure
→ Coordinate both completions, then wait for approval

STAGE 3: Integration (Sequential)
├─ Wire React controls to WASM methods
├─ Implement WASM → React synchronization
├─ Memory cleanup verification
└─ Error handling
→ Wait for approval

STAGE 4: Validation (Parallel tests)
├─ [react-specialist] React component tests
├─ [rust-engineer] WASM unit tests + performance
└─ Integration testing
→ Report final results

Execute this plan with maximum parallelization. Use TodoWrite to track progress.
```

### Pattern B: Checkpoint-Based with Manual Approvals

```
> workflow-orchestrator: Execute Phase 1 only. After completion:
1. Show me what was created
2. Report any issues
3. Wait for my "proceed" command before Phase 2/3
```

## 4. Monitoring Parallel Execution

When agents run in parallel, the orchestrator should:

1. **Use TodoWrite** to track each agent's progress
2. **Report status** of both parallel tracks
3. **Handle errors** in either track without blocking the other
4. **Synchronize completion** before moving to integration

### Expected Output During Parallel Execution:

```
workflow-orchestrator: Launching parallel execution of Phases 2 & 3...

[TodoWrite updates]
✓ Phase 2.1: Workspace component (react-specialist)
✓ Phase 3.1: Rust module structure (rust-engineer)
⏳ Phase 2.2: ControlPanel component (react-specialist)
⏳ Phase 3.2: Layer struct implementation (rust-engineer)
...

Both phases complete. Ready for Phase 4 integration.
```

## 5. Practical Commands

### Start Full Orchestration
```bash
# In Claude Code, simply type:
> workflow-orchestrator: Review tasks.md and execute the complete 5-phase implementation plan. Parallelize Phases 2 & 3. Use react-specialist for React work and rust-engineer for WASM work. Follow minimalist UI principles strictly.
```

### Check Progress Mid-Execution
```bash
> workflow-orchestrator: Status report on current phase execution
```

### Handle Errors
```bash
> workflow-orchestrator: Phase 3 had an error with event handlers. Debug and fix, then continue.
```

## 6. Important Considerations

### Agent Context Limits
- Each agent has isolated context
- Orchestrator coordinates but agents work independently
- Share project context explicitly when invoking

### File Access
- All agents can read tasks.md, CLAUDE.md, prd.txt
- Orchestrator should reference these files in prompts

### Handoffs
- Orchestrator manages handoffs between phases
- Integration points require careful coordination

### Progress Tracking
- Orchestrator should use TodoWrite extensively
- Provides visibility into parallel execution

## 7. Example Complete Command

Copy and use this command to start full orchestrated implementation:

```
> workflow-orchestrator:

MISSION: Orchestrate complete implementation of React + WebAssembly layer manipulation app

CONTEXT FILES:
- /tasks.md (5 phases, detailed tasks)
- /CLAUDE.md (architecture, patterns)
- /prd.txt (requirements, constraints)

EXECUTION STRATEGY:

PHASE 1 - Foundation (Sequential):
Execute all tasks in Phase 1 (Architecture Setup). Report completion.

PHASES 2 & 3 - Parallel Development:
Launch TWO agents simultaneously:
1. react-specialist → Execute all Phase 2 tasks (UI Framework)
2. rust-engineer → Execute all Phase 3 tasks (Dynamic Content)

Coordinate both agents. Report when BOTH complete.

PHASE 4 - Integration (Sequential):
Execute all Phase 4 tasks (React-WASM Integration). Ensure memory cleanup.

PHASE 5 - Validation (Parallel Tests):
Run React tests, WASM tests, and performance validation in parallel.

CONSTRAINTS:
✓ Minimalist UI only (<50 lines CSS, no styling)
✓ Maintain React-WASM boundaries strictly
✓ Zero JavaScript bridge code
✓ 60fps drag performance
✓ Use TodoWrite for progress tracking

BEGIN EXECUTION. Ask for approval between major phases.
```

## 8. Tips for Best Results

1. **Be Specific**: Reference exact files (tasks.md, CLAUDE.md)
2. **Set Checkpoints**: Request approval between phases
3. **Monitor Progress**: Ask orchestrator to use TodoWrite
4. **Handle Errors**: Tell orchestrator to stop and report on errors
5. **Validate Architecture**: Remind about React-WASM boundaries
6. **Enforce Minimalism**: Explicitly mention "no styling" constraint

## Ready to Start?

To begin the orchestrated implementation, simply invoke:

```
> workflow-orchestrator: Execute the complete implementation plan from tasks.md with maximum parallelization. Follow the architecture in CLAUDE.md strictly. Start with Phase 1.
```

The orchestrator will coordinate all specialists and manage the entire workflow!
