import { Link } from "@tanstack/react-router";
import { MapPin, MessageSquare, UserPlus, MoreHorizontal } from "lucide-react";
import bannerAsset from "@/assets/mbappe_banner.avif.asset.json";
import type { Person } from "@/lib/people-data";

export function ProfileHeader({ person }: { person: Person }) {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {person.id === "kylian-mbappe" ? (
        <div
          className="h-40 bg-cover bg-center"
          style={{ backgroundImage: `url(${bannerAsset.url})` }}
        />
      ) : (
        <div className="h-40 bg-accent" />
      )}
      <div className="px-6 pb-6 -mt-16">
        <div className="h-32 w-32 rounded-full bg-brand text-brand-foreground border-4 border-card flex items-center justify-center font-bold text-4xl">
          {person.initials}
        </div>
        <div className="mt-3 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{person.name}</h1>
            <p className="text-foreground mt-1">{person.headline}</p>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {person.location} ·{" "}
              <span className="text-brand font-medium">Contact info</span>
            </p>
            <p className="text-sm text-brand font-medium mt-1">
              {person.connections} connections · {person.mutual} mutual
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-2 flex-wrap">
          <Link
            to="/messaging/$personId"
            params={{ personId: person.id }}
            className="px-4 py-1.5 rounded-full bg-brand text-brand-foreground text-sm font-semibold hover:bg-brand/90 flex items-center gap-1.5"
          >
            <MessageSquare className="h-4 w-4" /> Message
          </Link>
          <button className="px-4 py-1.5 rounded-full border border-brand text-brand text-sm font-semibold hover:bg-brand/10 flex items-center gap-1.5">
            <UserPlus className="h-4 w-4" /> Connect
          </button>
          <button className="px-4 py-1.5 rounded-full border border-border text-foreground text-sm font-semibold hover:bg-accent flex items-center gap-1.5">
            <MoreHorizontal className="h-4 w-4" /> More
          </button>
        </div>
      </div>
    </div>
  );
}
