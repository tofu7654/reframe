<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Reframe project guidance

Before making product, interaction, or architecture changes, read
[`docs/product-context.md`](docs/product-context.md).

### Product principles

- Reframe observes semantic UI events and infers temporary user intents and
  tendencies. Do not permanently classify a user into a fixed persona.
- Every adaptive UI recommendation must explain the behavioral evidence behind
  it.
- The user must be able to preview, accept, reject, and undo a recommendation.
- Apply adaptations through versioned manifests and an approved component
  registry. Do not generate or execute arbitrary UI code at runtime.
- Collect the minimum data needed. Prefer semantic event names and non-sensitive
  metadata over raw content, keystrokes, message bodies, or profile text.
- Preserve existing functionality unless the task explicitly changes it.

### Hackathon priorities

- Prefer transparent deterministic rules over complex AI inference.
- Store demo events and accepted UI state locally unless a task explicitly
  introduces a backend.
- Build one complete observable loop before adding more recommendation types:
  observe, infer, recommend, explain, preview, accept, apply, and undo.
- The initial tendency patterns are job exploration, recruiter-style profile
  research, and content creation. They are behavior patterns, not identity
  labels.

### Development

- Install dependencies with `npm install`.
- Run the app with `npm run dev`.
- Before completing implementation work, run `npm run build` and
  `npm run lint`.
- Preserve the Lovable-managed block above and follow its Git-history rules.
