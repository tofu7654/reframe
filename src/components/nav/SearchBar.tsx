import { Search } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export function SearchBar() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const query = q.trim();
        if (query) navigate({ to: "/search", search: { q: query } });
      }}
      className="relative flex-1 max-w-[280px]"
    >
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search"
        className="w-full h-9 pl-10 pr-3 rounded bg-accent text-sm focus:outline-none focus:ring-1 focus:ring-ring"
      />
    </form>
  );
}
