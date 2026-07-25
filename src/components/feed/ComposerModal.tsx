import { useRef, useState } from "react";
import { Image as ImageIcon, X } from "lucide-react";

export function ComposerModal({
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
