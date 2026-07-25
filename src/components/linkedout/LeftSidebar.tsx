import { Bookmark } from "lucide-react";

export function LeftSidebar() {
  return (
    <aside className="space-y-2">
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="h-14 bg-gradient-to-r from-brand to-primary" />
        <div className="px-4 pb-4 -mt-8 text-center">
          <div className="h-16 w-16 rounded-full bg-muted border-4 border-card mx-auto" />
          <h2 className="mt-2 font-semibold text-base hover:underline cursor-pointer">
            Alex Morgan
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Senior Software Engineer @ Northwind
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            San Francisco, California
          </p>
        </div>
        <div className="border-t border-border px-4 py-2 hover:bg-accent cursor-pointer">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-muted" />
            <span className="text-xs font-semibold">Northwind Labs</span>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-4 text-xs">
        <div className="space-y-2">
          <div className="flex items-center justify-between hover:bg-accent -mx-2 px-2 py-1 rounded cursor-pointer">
            <span className="text-muted-foreground">Profile viewers</span>
            <span className="font-semibold text-primary">142</span>
          </div>
          <div className="flex items-center justify-between hover:bg-accent -mx-2 px-2 py-1 rounded cursor-pointer">
            <span className="text-muted-foreground">Post impressions</span>
            <span className="font-semibold text-primary">1,204</span>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-4 text-xs">
        <div className="text-muted-foreground text-center leading-relaxed">
          Access exclusive tools & insights
        </div>
        <div className="flex items-center gap-2 mt-2 cursor-pointer hover:underline">
          <div className="h-4 w-4 bg-premium rounded-sm" />
          <span className="font-semibold">Try Premium for free</span>
        </div>
      </div>

      <nav className="bg-card rounded-lg border border-border p-2 text-sm font-semibold">
        <a className="flex items-center gap-2 px-2 py-2 rounded hover:bg-accent cursor-pointer">
          <Bookmark className="h-4 w-4" />
          Saved items
        </a>
        <a className="flex items-center gap-2 px-2 py-2 rounded hover:bg-accent cursor-pointer">
          <span className="h-4 w-4 grid place-items-center">👥</span>
          Groups
        </a>
        <a className="flex items-center gap-2 px-2 py-2 rounded hover:bg-accent cursor-pointer">
          <span className="h-4 w-4 grid place-items-center">📰</span>
          Newsletters
        </a>
        <a className="flex items-center gap-2 px-2 py-2 rounded hover:bg-accent cursor-pointer">
          <span className="h-4 w-4 grid place-items-center">📅</span>
          Events
        </a>
      </nav>
    </aside>
  );
}
