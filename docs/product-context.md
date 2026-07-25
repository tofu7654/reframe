# Reframe product context

## One-sentence description

Reframe is a user-controlled adaptive UI capability that observes how people use
an application, identifies their current intent and recurring tendencies, and
recommends reversible interface changes that make their common workflows faster.

## Product thesis

Most software ships one interface to everyone even though different users
repeatedly emphasize different workflows. Someone exploring jobs, researching
candidates, or publishing content may use the same professional network in very
different ways.

Reframe turns repeated behavior into an interface recommendation. It does not
silently redesign the product and does not permanently label the user. It shows
what it noticed, proposes a constrained change, lets the user preview and
selectively accept it, and always provides an undo path.

The hackathon application is a LinkedIn-like demonstration. The longer-term
pitch is a capability that a host application such as LinkedIn integrates into
its own product. It is not a browser extension that modifies the real LinkedIn
DOM.

## Core product contract

Every adaptation follows this loop:

1. **Observe:** The host UI emits meaningful interaction events.
2. **Aggregate:** Reframe stores recent events and computes useful counters,
   sequences, and recency signals.
3. **Infer:** Transparent rules identify a likely current intent or recurring
   tendency with a confidence score.
4. **Recommend:** The user sees a proposed UI change and the evidence for it.
5. **Preview:** The proposed layout can be inspected without committing it.
6. **Decide:** The user accepts or rejects the recommendation.
7. **Apply:** A constrained renderer applies an approved, versioned manifest.
8. **Undo:** The user can restore the previous layout.

No inferred tendency should bypass recommendation and consent.

## Terminology

### Semantic event

A semantic event describes a meaningful product action, not a raw DOM click.
Examples include `job_searched`, `job_saved`, `profile_viewed`,
`candidate_messaged`, and `post_published`. The host application should emit
these events in the same handlers that perform the corresponding product action.

### Intent

An intent is a short-lived goal inferred from recent behavior, such as comparing
jobs during the current session.

### Tendency

A tendency is a repeated pattern observed over a longer window, such as
frequently saving jobs or repeatedly reviewing profiles before messaging
someone. Tendencies can decay and disappear as behavior changes.

### Recommendation

A recommendation connects behavioral evidence to a specific allowed adaptation.
It includes an explanation, confidence, preview state, and accept/reject
actions.

### Manifest

A manifest is declarative data describing an allowed UI configuration. It
selects approved components, their order, prominence, and limited settings. It
does not contain executable code.

Example:

```json
{
  "id": "jobs-focused-home-v1",
  "version": 1,
  "slots": {
    "home.primary": ["job-search", "recommended-jobs", "feed"],
    "home.sidebar": ["saved-jobs", "applications"]
  },
  "settings": {
    "jobsNavEmphasis": "high"
  }
}
```

### Constrained renderer

The constrained renderer validates a manifest and maps its identifiers to a
fixed registry of application-owned React components. Unknown components,
properties, or placements are rejected. This makes adaptation testable,
reversible, and safer than regenerating or executing UI code live.

## Event model

For the hackathon, events can live in browser `localStorage`. Use a capped list
or rolling time window so storage does not grow without bound.

A useful event shape is:

```ts
type SemanticEvent = {
  id: string;
  name: string;
  timestamp: string;
  sessionId: string;
  surface: "feed" | "jobs" | "profile" | "messages" | "creator";
  targetType?: "job" | "profile" | "post" | "message";
  targetId?: string;
  metadata?: Record<string, string | number | boolean>;
};
```

Guidelines:

- Emit events from product action handlers, not a global click listener.
- Record the action and minimal context needed for inference.
- Avoid raw message bodies, post drafts, keystrokes, private profile text, or
  other sensitive content.
- Give events stable names and document them.
- Deduplicate rapid repeated events where appropriate.
- Keep timestamps so rules can distinguish recent intent from old behavior.

## Initial behavior patterns

These are starting patterns for the demonstration, not predefined user
personas. A user can match several patterns, stop matching them, or reject the
associated recommendations.

### Job exploration

Useful events:

- `jobs_tab_opened`
- `job_searched`
- `job_viewed`
- `job_saved`
- `job_applied`
- `application_status_viewed`
- `company_followed`
- `recruiter_messaged`

Example signal:

- At least three job-related actions across two or more sessions, with at least
  one high-intent action such as save or apply.

Possible recommendation:

- Put job search and recommended jobs near the top of Home.
- Emphasize Jobs in navigation.
- Add compact saved-jobs and application-status modules.

Evidence copy:

> You visited Jobs in three recent sessions and saved two roles. Would you like
> quicker access to job search and your saved roles?

### Recruiter-style profile research

Useful events:

- `people_searched`
- `search_filter_applied`
- `profile_viewed`
- `profile_saved`
- `profile_compared`
- `candidate_note_added`
- `profile_shared`
- `candidate_messaged`
- `message_follow_up_scheduled`

Example signal:

- Several profile views following people searches or filters, especially when
  followed by saves, notes, comparisons, or messages.

Possible recommendation:

- Promote people search and filters.
- Add a recent/saved profiles workspace.
- Add a compact candidate pipeline or follow-up queue.
- Expose message and note actions near profile summaries.

Evidence copy:

> You frequently search for people, review several profiles, and then send a
> message. Would you like a profile research workspace on Home?

### Content creation

Useful events:

- `composer_opened`
- `draft_saved`
- `post_published`
- `post_scheduled`
- `post_analytics_viewed`
- `comment_replied`
- `audience_growth_viewed`
- `creator_tool_opened`

Example signal:

- Repeated composer or publishing activity, or a publish followed by analytics
  and comment-management activity.

Possible recommendation:

- Promote the post composer.
- Add drafts and recent-post performance.
- Add a comment-reply queue.
- Expose creator tools and publishing cadence.

Evidence copy:

> You created posts and checked their performance several times this week. Would
> you like creator tools and drafts at the top of Home?

## Recommendation model

For the MVP, use deterministic, inspectable rules. A recommendation should be
created only when:

- its minimum evidence threshold is met;
- the same recommendation is not already active;
- it has not recently been rejected or dismissed;
- there is an approved manifest for the proposed change; and
- the evidence can be summarized in plain language.

A recommendation record can contain:

```ts
type Recommendation = {
  id: string;
  ruleId: string;
  title: string;
  explanation: string;
  evidence: Array<{ label: string; value: number | string }>;
  confidence: number;
  manifestId: string;
  status: "pending" | "accepted" | "rejected" | "undone";
  createdAt: string;
};
```

Confidence should reflect the strength and recency of observed evidence. It
should not pretend to be a psychological certainty.

An AI model can later summarize evidence or help rank eligible
recommendations, but it is not required for the hackathon. Raw event history
should not be sent to a model by default. If AI is introduced, send a compact
aggregate, require structured output, validate it, and keep final UI choices
within the approved manifest catalog.

## User-control requirements

The recommendation UI should provide:

- a short description of the proposed benefit;
- a "Why am I seeing this?" explanation with concrete evidence;
- a visual preview or clear before/after representation;
- explicit Accept and Not now actions;
- a durable Undo or Restore default action after applying;
- a place to review active adaptations; and
- a way to disable future adaptation suggestions.

Rejecting a suggestion should suppress it for a reasonable period. Undo should
restore the exact prior manifest, not approximate the old layout.

## Hackathon MVP

Build one complete vertical slice before broadening the system:

1. A LinkedIn-like default experience with basic feed, jobs, profiles/search,
   messaging, and content creation behavior.
2. Semantic event instrumentation for the actions used by one rule.
3. Local event storage and a small developer/demo event inspector.
4. One deterministic inference rule.
5. One recommendation card with evidence.
6. A preview of one approved adaptive layout.
7. Accept, apply, persist, and undo behavior.
8. A demo reset/seed control so judges can see the loop quickly.

If time remains, add the other two tendency rules using the same pipeline. Do
not build three disconnected hard-coded demos.

### Recommended first vertical slice

Use job exploration because it is visually obvious and easy to demonstrate:

1. Start with the default home feed.
2. Perform or seed several job actions.
3. Show the detected tendency and its evidence.
4. Preview a jobs-focused home layout.
5. Accept it and show the rearranged home surface.
6. Undo and return to the exact default layout.

## Suggested internal architecture

Keep modules separable even if they all run in the browser:

- **Event instrumentation:** Product handlers emit semantic events.
- **Event store:** Persists, caps, reads, and clears local events.
- **Signal aggregation:** Computes counts, sequences, sessions, and recency.
- **Rule engine:** Turns aggregates into recommendation candidates.
- **Recommendation store:** Tracks pending, accepted, rejected, and undone
  decisions.
- **Manifest catalog:** Contains versioned, approved adaptations.
- **Manifest validator:** Rejects unsupported component IDs, placements, and
  properties.
- **Component registry:** Maps approved IDs to existing React components.
- **Adaptive renderer:** Renders the accepted manifest with safe defaults.
- **Control UI:** Explains, previews, accepts, rejects, and undoes changes.

The host application owns event emission and all renderable components. Reframe
provides inference, recommendation, manifest selection, and lifecycle
orchestration.

## Production direction

For a real LinkedIn integration:

- LinkedIn would deliberately add the event instrumentation and approved
  adaptation points to its application.
- Reframe would consume versioned semantic events, not scrape the page or
  inject arbitrary DOM changes.
- LinkedIn would own the component registry, design-system constraints,
  accessibility standards, experimentation controls, and deployment gates.
- Reframe could recommend and manage manifests, but the host would validate and
  render them.
- Rollouts would need telemetry, privacy review, accessibility verification,
  holdbacks, error monitoring, and instant rollback.

The product should be pitched as a safe adaptive-UI platform or capability, not
as autonomous live code regeneration.

## Privacy, safety, and quality constraints

- Collect only events needed for a defined adaptation.
- Prefer on-device aggregation for the demonstration.
- Never infer or display sensitive traits.
- Do not represent a behavior pattern as the user's identity or profession.
- Avoid manipulative adaptations designed only to increase engagement.
- Preserve accessibility, keyboard navigation, responsive behavior, and design
  system consistency in every manifest.
- Version manifests and preserve a known-good default.
- Log recommendation decisions separately from raw content.
- Make resets and deletion straightforward.

## Non-goals for the hackathon

- Modifying the actual LinkedIn website.
- Building a Chrome extension.
- Training a custom model.
- Sending every click or raw content to an AI service.
- Generating arbitrary React code at runtime.
- Building production multi-tenant infrastructure.
- Perfectly identifying a user's profession or permanent persona.
- Automatically applying changes without consent.

## Demo success criteria

The demonstration is successful when a judge can clearly answer:

1. What behavior did Reframe observe?
2. What tendency or current intent did it infer?
3. What evidence supported that inference?
4. What interface change did it recommend?
5. Did the user control whether it was applied?
6. Was the resulting layout constrained and safe?
7. Could the user undo it?

The strongest demo is a short, reliable before-and-after story, not the largest
number of rules.
