---
paths: ui/**/*.{ts,tsx}
---

# TypeScript/React Development Rules

## Component Patterns

- Use functional components with hooks
- Co-locate component, types, and styles
- Extract reusable logic into custom hooks
- Keep components focused on single responsibility

## Type Definitions

- Use `interface` for object shapes (not `type`)
- Export types from component files when needed
- Use discriminated unions for state machines
- Prefer explicit types over inference for public APIs

## Naming Conventions

- Components: `PascalCase` (e.g., `AgentCard.tsx`)
- Hooks: `useCamelCase` (e.g., `useAgentState.ts`)
- Utilities: `camelCase` (e.g., `formatDate.ts`)
- Constants: `UPPER_SNAKE_CASE`

## Styling

- Use Tailwind CSS for all styling
- Follow mobile-first responsive design
- Use CSS variables for theme colors
- Avoid inline styles except for dynamic values

## CopilotKit Integration

- Use `useHumanInTheLoop` for user interaction points
- Use `useCoAgentStateRender` for state visualization
- Use `useRenderToolCall` for generative UI
- Keep HITL components in `components/hitl/`

## React Flow (Canvas)

- Custom nodes extend base node component
- Use `useNodesState` and `useEdgesState` hooks
- Validate connections in `isValidConnection`
- Store workflow state in context/store

## State Management

- Use React Context for global app state
- Use `useState` for local component state
- Use `useReducer` for complex state logic
- Consider Zustand for cross-component state

## Package Management

- Always use `bun` (NOT npm or yarn)
- Install: `bun install` or `bun add <package>`
- Dev: `bun add -d <package>`
- Run scripts: `bun run <script>`
