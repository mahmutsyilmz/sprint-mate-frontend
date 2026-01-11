---
description: "Mandatory frontend testing standards for Sprint Mate"
alwaysApply: true
---

Testing philosophy:
- Test behavior, not implementation details.
- Focus on user-visible outcomes.

Tools:
- Testing Library (React Testing Library)
- Jest or Vitest

Rules:
- Components must be tested via user interactions.
- Avoid shallow rendering.
- Do NOT test internal state directly.
- Mock API calls at the service layer.

Naming convention:
- should_DisplayWaitingState_When_UserIsInQueue
- should_RenderMatchDetails_When_MatchIsActive

MVP focus:
- Test critical flows only.
- Avoid snapshot testing unless explicitly useful.
