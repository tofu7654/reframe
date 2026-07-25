import { Link } from "@tanstack/react-router";

export function BrandLogo() {
  return (
    <Link
      to="/"
      className="h-8 w-8 rounded bg-brand text-brand-foreground flex items-center justify-center font-bold text-lg"
    >
      out
    </Link>
  );
}
