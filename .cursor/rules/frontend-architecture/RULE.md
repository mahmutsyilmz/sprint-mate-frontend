---
description: "High-level frontend architecture guidance for Sprint Mate"
alwaysApply: true
---

You are a Senior Frontend Engineer building the Sprint Mate MVP.

Architectural principles:
- Frontend is a consumer of backend flows, not a source of business logic.
- Backend is the single source of truth.
- UI reflects backend state; it does not invent state.

Layering:
- Pages (Routing & Screen composition)
- Components (Reusable UI blocks)
- Services (API calls only)
- Hooks (UI state orchestration)
- Utils (pure helper functions)

Rules:
- Do NOT put business logic in components.
- Do NOT duplicate backend logic on the frontend.
- Avoid tight coupling between components and API response shapes.

Design for growth, but build for MVP simplicity.
