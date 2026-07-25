import { Bookmark } from "lucide-react";

export function ShortcutsNav() {
  return (
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
  );
}
