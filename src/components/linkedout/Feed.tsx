import { Image as ImageIcon, Video, FileText, ThumbsUp, MessageCircle, Repeat2, Send, Globe, MoreHorizontal, X } from "lucide-react";

function ActionButton({ icon: Icon, label, color }: { icon: typeof ImageIcon; label: string; color: string }) {
  return (
    <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded hover:bg-accent text-sm font-semibold text-muted-foreground">
      <Icon className={`h-5 w-5 ${color}`} />
      {label}
    </button>
  );
}

function PostAction({ icon: Icon, label }: { icon: typeof ThumbsUp; label: string }) {
  return (
    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded hover:bg-accent text-sm font-semibold text-muted-foreground">
      <Icon className="h-5 w-5" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function Post({
  name,
  headline,
  time,
  content,
  reactions,
  comments,
}: {
  name: string;
  headline: string;
  time: string;
  content: string;
  reactions: number;
  comments: number;
}) {
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
      <div className="px-4 pb-3 text-sm whitespace-pre-line">{content}</div>
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

export function Feed() {
  return (
    <div className="space-y-2">
      {/* Premium promo */}
      <div className="bg-card rounded-lg border border-border p-4 flex items-center gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-base">The average career is 42 years.</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Invest in long-term growth with Premium.
          </p>
          <button className="mt-3 px-4 py-1.5 rounded-full bg-premium text-foreground font-semibold text-sm hover:brightness-95">
            Get Premium now
          </button>
        </div>
        <div className="h-20 w-20 rounded-full bg-muted shrink-0" />
      </div>

      {/* Composer */}
      <div className="bg-card rounded-lg border border-border p-3">
        <div className="flex items-center gap-2">
          <div className="h-12 w-12 rounded-full bg-muted shrink-0" />
          <button className="flex-1 text-left px-4 py-3 rounded-full border border-border hover:bg-accent text-sm font-semibold text-muted-foreground">
            Start a post
          </button>
        </div>
        <div className="flex mt-2">
          <ActionButton icon={Video} label="Video" color="text-green-600" />
          <ActionButton icon={ImageIcon} label="Photo" color="text-blue-600" />
          <ActionButton icon={FileText} label="Write article" color="text-orange-600" />
        </div>
      </div>

      <div className="flex items-center gap-2 px-2 text-xs text-muted-foreground">
        <div className="flex-1 border-t border-border" />
        Sort by: <span className="font-semibold text-foreground">Top ▾</span>
      </div>

      <Post
        name="Priya Ramesh"
        headline="DevOps & Cloud Engineer | AI-Driven Operations"
        time="1d"
        content={`The biggest misconception about MLOps...\n\nPeople think the career path looks like this:\nData → Model → Deploy → Done.\n\nIn reality: it's a loop. Monitor, retrain, ship, repeat. The teams that treat models like living products win.`}
        reactions={1284}
        comments={92}
      />
      <Post
        name="Marcus Lee"
        headline="Product Designer @ Studio Nomad"
        time="4h"
        content={`Design systems don't fail because of tokens.\n\nThey fail because no one owns the handoff between design and engineering. Fix the seam, not the file.`}
        reactions={412}
        comments={38}
      />
      <Post
        name="Sofia Alvarez"
        headline="Founder & CEO at Northwind Labs"
        time="2d"
        content={`Hiring update: we just closed our Series A and we're bringing on 12 engineers this quarter.\n\nIf you care about developer experience and want to build tools that thousands of teams use daily — send me a note.`}
        reactions={3204}
        comments={187}
      />
    </div>
  );
}
