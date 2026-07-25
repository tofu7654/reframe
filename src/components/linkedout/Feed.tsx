import { useRef, useState } from "react";
import { Image as ImageIcon, Video, FileText, ThumbsUp, MessageCircle, Repeat2, Send, Globe, MoreHorizontal, X } from "lucide-react";

function ActionButton({ icon: Icon, label, color, onClick }: { icon: typeof ImageIcon; label: string; color: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex items-center justify-center gap-2 py-2 rounded hover:bg-accent text-sm font-semibold text-muted-foreground"
    >
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

type PostData = {
  id: string;
  name: string;
  headline: string;
  time: string;
  content: string;
  reactions: number;
  comments: number;
  imageUrl?: string;
};

function Post({ name, headline, time, content, reactions, comments, imageUrl }: PostData) {
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

function ComposerModal({
  open,
  onClose,
  onPost,
  initialImage,
}: {
  open: boolean;
  onClose: () => void;
  onPost: (content: string, imageUrl?: string) => void;
  initialImage?: string;
}) {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialImage);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const submit = () => {
    if (!content.trim() && !imageUrl) return;
    onPost(content.trim(), imageUrl);
    setContent("");
    setImageUrl(undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-card rounded-lg w-full max-w-xl max-h-[90vh] flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-muted" />
            <div>
              <div className="font-semibold text-sm">You</div>
              <div className="text-xs text-muted-foreground">Post to Anyone</div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-accent">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          <textarea
            autoFocus
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What do you want to talk about?"
            className="w-full min-h-[140px] resize-none outline-none bg-transparent text-base placeholder:text-muted-foreground"
          />
          {imageUrl && (
            <div className="relative mt-2">
              <img src={imageUrl} alt="Preview" className="w-full rounded-lg max-h-[400px] object-cover" />
              <button
                onClick={() => setImageUrl(undefined)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        <div className="p-3 border-t border-border flex items-center justify-between">
          <button
            onClick={() => fileRef.current?.click()}
            className="p-2 rounded-full hover:bg-accent text-blue-600"
            title="Add photo"
          >
            <ImageIcon className="h-6 w-6" />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
          <button
            onClick={submit}
            disabled={!content.trim() && !imageUrl}
            className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-95"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

const INITIAL_POSTS: PostData[] = [
  {
    id: "1",
    name: "Priya Ramesh",
    headline: "DevOps & Cloud Engineer | AI-Driven Operations",
    time: "1d",
    content: `The biggest misconception about MLOps...\n\nPeople think the career path looks like this:\nData → Model → Deploy → Done.\n\nIn reality: it's a loop. Monitor, retrain, ship, repeat. The teams that treat models like living products win.`,
    reactions: 1284,
    comments: 92,
  },
  {
    id: "2",
    name: "Marcus Lee",
    headline: "Product Designer @ Studio Nomad",
    time: "4h",
    content: `Design systems don't fail because of tokens.\n\nThey fail because no one owns the handoff between design and engineering. Fix the seam, not the file.`,
    reactions: 412,
    comments: 38,
  },
  {
    id: "3",
    name: "Sofia Alvarez",
    headline: "Founder & CEO at Northwind Labs",
    time: "2d",
    content: `Hiring update: we just closed our Series A and we're bringing on 12 engineers this quarter.\n\nIf you care about developer experience and want to build tools that thousands of teams use daily — send me a note.`,
    reactions: 3204,
    comments: 187,
  },
];

export function Feed() {
  const [posts, setPosts] = useState<PostData[]>(INITIAL_POSTS);
  const [composerOpen, setComposerOpen] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | undefined>(undefined);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const addPost = (content: string, imageUrl?: string) => {
    const newPost: PostData = {
      id: crypto.randomUUID(),
      name: "You",
      headline: "Sharing on LinkedOut",
      time: "now",
      content,
      imageUrl,
      reactions: 0,
      comments: 0,
    };
    setPosts((p) => [newPost, ...p]);
    setPendingImage(undefined);
  };

  const openWithPhoto = () => photoInputRef.current?.click();

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
          <button
            onClick={() => setComposerOpen(true)}
            className="flex-1 text-left px-4 py-3 rounded-full border border-border hover:bg-accent text-sm font-semibold text-muted-foreground"
          >
            Start a post
          </button>
        </div>
        <div className="flex mt-2">
          <ActionButton icon={Video} label="Video" color="text-green-600" onClick={() => setComposerOpen(true)} />
          <ActionButton icon={ImageIcon} label="Photo" color="text-blue-600" onClick={openWithPhoto} />
          <ActionButton icon={FileText} label="Write article" color="text-orange-600" onClick={() => setComposerOpen(true)} />
        </div>
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              const reader = new FileReader();
              reader.onload = () => {
                setPendingImage(reader.result as string);
                setComposerOpen(true);
              };
              reader.readAsDataURL(f);
            }
            e.target.value = "";
          }}
        />
      </div>

      <div className="flex items-center gap-2 px-2 text-xs text-muted-foreground">
        <div className="flex-1 border-t border-border" />
        Sort by: <span className="font-semibold text-foreground">Top ▾</span>
      </div>

      {posts.map((p) => (
        <Post key={p.id} {...p} />
      ))}

      <ComposerModal
        key={pendingImage ?? "empty"}
        open={composerOpen}
        initialImage={pendingImage}
        onClose={() => {
          setComposerOpen(false);
          setPendingImage(undefined);
        }}
        onPost={addPost}
      />
    </div>
  );
}
