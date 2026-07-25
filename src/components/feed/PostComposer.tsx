import { useRef } from "react";
import { Image as ImageIcon, Video, FileText } from "lucide-react";
import type { LucideIcon } from "lucide-react";

function ActionButton({
  icon: Icon,
  label,
  color,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  color: string;
  onClick?: () => void;
}) {
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

export function PostComposer({
  onOpen,
  onPhotoSelected,
}: {
  onOpen: () => void;
  onPhotoSelected: (dataUrl: string) => void;
}) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const openWithPhoto = () => photoInputRef.current?.click();
  return (
    <div className="bg-card rounded-lg border border-border p-3">
      <div className="flex items-center gap-2">
        <div className="h-12 w-12 rounded-full bg-muted shrink-0" />
        <button
          onClick={onOpen}
          className="flex-1 text-left px-4 py-3 rounded-full border border-border hover:bg-accent text-sm font-semibold text-muted-foreground"
        >
          Start a post
        </button>
      </div>
      <div className="flex mt-2">
        <ActionButton icon={Video} label="Video" color="text-green-600" onClick={onOpen} />
        <ActionButton icon={ImageIcon} label="Photo" color="text-blue-600" onClick={openWithPhoto} />
        <ActionButton icon={FileText} label="Write article" color="text-orange-600" onClick={onOpen} />
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
            reader.onload = () => onPhotoSelected(reader.result as string);
            reader.readAsDataURL(f);
          }
          e.target.value = "";
        }}
      />
    </div>
  );
}
