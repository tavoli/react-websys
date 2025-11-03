# Installed Claude Code Agents

This directory contains specialized AI agents from the [awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) repository, customized for this React + WebAssembly project.

## Installed Agents

### Meta & Orchestration
- **workflow-orchestrator.md** - Manages complex multi-phase workflows, state machines, and process automation

### Language Specialists
- **react-specialist.md** - React 18+ expert for hooks, context, server components, and performance optimization
- **rust-engineer.md** - Rust systems programming specialist with WebAssembly optimization expertise
- **typescript-pro.md** - TypeScript expert for type safety, build tooling, and full-stack type systems

## Custom Guides
- **PROJECT_AGENT_GUIDE.md** - Project-specific guide for using these agents with the React + WASM architecture

## Usage

### Invoke an Agent
```
> [agent-name]: [your question or request]
```

Example:
```
> workflow-orchestrator: Help me coordinate Phase 1 implementation
```

### Agent Selection Guide

**Use `workflow-orchestrator` when:**
- Starting a new implementation phase
- Coordinating between React and WASM work
- Managing complex multi-step processes
- Integrating cross-boundary features

**Use `react-specialist` when:**
- Building React components
- Implementing hooks and context
- Optimizing React performance
- Setting up component architecture

**Use `rust-engineer` when:**
- Writing Rust/WASM code
- Implementing memory-safe patterns
- Optimizing WebAssembly performance
- Working with web-sys DOM manipulation

**Use `typescript-pro` when:**
- Setting up TypeScript configuration
- Creating type definitions
- Optimizing build tooling
- Ensuring type safety at React-WASM boundaries

## Quick Start

1. Review `PROJECT_AGENT_GUIDE.md` for detailed usage patterns
2. Check `../CLAUDE.md` for project architecture principles
3. Refer to `../tasks.md` for the implementation roadmap
4. Start with workflow-orchestrator to coordinate your first phase

## Agent Sources

All agents sourced from: https://github.com/VoltAgent/awesome-claude-code-subagents

- workflow-orchestrator: `categories/09-meta-orchestration/`
- react-specialist: `categories/02-language-specialists/`
- rust-engineer: `categories/02-language-specialists/`
- typescript-pro: `categories/02-language-specialists/`

## Notes

- Agents operate in isolated context windows
- Provide project context when needed (reference CLAUDE.md)
- Enforce minimalist development principles with all agents
- Use workflow-orchestrator for coordination, specialists for deep work
