# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Gemini rule-match demo

The app uses the official `@google/genai` SDK in the browser and waits up to
five seconds for Gemini before comparing its structured recommendation with the
deterministic planner. Rules remain the fallback for every mismatch or SDK
failure.

Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY` for this
browser-only demo. It is bundled into the client, so restrict it to this app's
allowed web origins and do not reuse a private server key. `VITE_GEMINI_MODEL`
is optional and defaults to `gemini-3.5-flash-lite`.

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS
