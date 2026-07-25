import { ThumbsUp, MessageCircle, Repeat2, Send, Globe, MoreHorizontal, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { PostData } from "@/lib/posts-data";

function PostAction({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded hover:bg-accent text-sm font-semibold text-muted-foreground">
      <Icon className="h-5 w-5" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export function PostCard({ name, headline, time, content, reactions, comments, imageUrl }: PostData) {
  return (
    <article className="bg-card rounded-lg border border-border">
      <div className="flex items-start gap-2 p-4">
        <div className="h-12 w-12 rounded-full bg-muted shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm hover:text-primary hover:underline cursor-pointer">
            {name}
          </div>
          <div className="text-xs text-muted-foreground truncate">{headline}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            {time} · <Globe className="h-3 w-3" />
          </div>
        </div>
        <button className="text-muted-foreground hover:bg-accent p-1 rounded-full">
          <MoreHorizontal className="h-5 w-5" />
        </button>
        <button className="text-muted-foreground hover:bg-accent p-1 rounded-full">
          <X className="h-5 w-5" />
        </button>
      </div>
      {content && <div className="px-4 pb-3 text-sm whitespace-pre-line">{content}</div>}
      {imageUrl && (
        <div className="bg-muted">
          <img src={imageUrl} alt="Post" className="w-full max-h-[520px] object-cover" />
        </div>
      )}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-muted-foreground border-b border-border">
        <div className="flex items-center gap-1">
          <span className="inline-flex -space-x-1">
            <span className="h-4 w-4 rounded-full bg-primary grid place-items-center text-[10px] text-primary-foreground">👍</span>
            <span className="h-4 w-4 rounded-full bg-destructive grid place-items-center text-[10px]">❤️</span>
          </span>
          <span className="hover:text-primary hover:underline cursor-pointer">{reactions}</span>
        </div>
        <div className="hover:text-primary hover:underline cursor-pointer">
          {comments} comments
        </div>
      </div>
      <div className="p-1 flex">
        <PostAction icon={ThumbsUp} label="Like" />
        <PostAction icon={MessageCircle} label="Comment" />
        <PostAction icon={Repeat2} label="Repost" />
        <PostAction icon={Send} label="Send" />
      </div>
    </article>
  );
}
