# Reframe

Reframe is a user-controlled adaptive UI capability. It observes how someone
uses an application, infers their current intent from repeated behavior, and
recommends reversible interface changes that speed up their common workflows.

This repository is a LinkedIn-like demo host app with Reframe built in. It is
not a browser extension and does not modify the real LinkedIn site.

## How it works

Every adaptation follows the same loop, and nothing is applied without consent:

1. **Observe:** product handlers emit semantic events such as `job_saved`,
   `job_application_submitted`, or `post_published`, stored locally in the
   browser.
2. **Infer:** transparent rules turn event counts into a recommendation
   candidate. Patterns are temporary behavior signals, not user identities.
3. **Recommend and explain:** the user sees the proposed change and the
   behavioral evidence behind it.
4. **Preview, accept, or reject:** the layout can be previewed before it is
   committed. A rejected suggestion is suppressed.
5. **Apply:** an approved, versioned manifest is rendered by a constrained
   renderer.
6. **Undo:** the user can revert to the exact previous manifest or restore the
   defaults.

Adaptations are declarative manifests that select components from a fixed,
application-owned registry. The app never generates or executes UI code at
runtime, and unknown components, slots, or placements are rejected.

### Recommendations

Rules are evaluated in priority order and the first eligible one wins. Rules
live in `src/intelligence/deterministicPlanner.ts`.

| Rule | Adaptation |
| --- | --- |
| `creator-relationship-hub` | Creator workspace for people engaging with your posts |
| `application-momentum` | Keeps in-progress and submitted applications on Home |
| `job-search-command-center` | Job search workspace on Home |
| `post-engagers` | Adds people engaging with your post to Home |
| `applied-company-connections` | Adds people at companies you applied to on Jobs |
| `application-tracker` | Adds an application tracker to Jobs |
| `saved-jobs` | Adds Saved Jobs to Home |
| `promote-jobs` | Moves Jobs next to Home in navigation |

## Getting started

Requires Node.js and npm.

```sh
npm install
npm run dev
```

### Environment variables

An AI key is optional. Without one, the app uses the deterministic rules only.
Copy `.env.example` to `.env.local` to configure it.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run build:node` | Build with the Node server preset |
| `npm run preview` | Build for Node and serve the output |
| `npm test` | Run the Vitest suite |
| `npm run lint` | Lint with ESLint |
| `npm run format` | Format with Prettier |

Run `npm run build` and `npm run lint` before finishing a change.

## Demo and development tools

- In dev mode, a **Personalization development** panel (bottom left) lets you
  seed scenarios, apply and preview manifest presets, revert, and reset.
- In production builds the panel is replaced by a **Reset to default** button.
- Events and accepted UI state live in browser storage only. There is no
  backend.

## Project structure

| Path | Contents |
| --- | --- |
| `src/routes/` | File-based TanStack routes (home, jobs, network, messaging, profile, search, notifications) |
| `src/contracts/` | Types for events, manifests, recommendations, and planner I/O |
| `src/tracking/` | Event store, event summaries, and the recommendation coordinator |
| `src/intelligence/` | Recommendation planning and verification |
| `src/registry/` | Manifest catalog and the allowed components per slot |
| `src/personalization/` | Provider, manifest validation, presets, and persistence |
| `src/components/personalization/` | Constrained renderers and the component registry |
| `src/components/recommendations/` | Recommendation overlay and preview dialog |
| `src/components/modules/` | Adaptive modules a manifest can place |
| `docs/product-context.md` | Product thesis, principles, and scope |

## Product principles

- Every recommendation explains its behavioral evidence.
- The user can preview, accept, reject, and undo.
- Collect the minimum data needed, with semantic event names and no raw content.
- Prefer transparent deterministic rules over opaque AI inference.

See [docs/product-context.md](docs/product-context.md) for the full context.

## Built with

- [TanStack Start](https://tanstack.com/start), React, and TypeScript
- Tailwind CSS and Radix UI
- Vitest

## Lovable

This project is connected to [Lovable](https://lovable.dev). Commits pushed to
the connected branch sync to the Lovable editor, so avoid rewriting published
history (force pushes, or rebasing, amending, or squashing pushed commits).
