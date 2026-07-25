import { useState } from "react";
import { PostCard } from "./PostCard";
import { ComposerModal } from "./ComposerModal";
import { PostComposer } from "./PostComposer";
import { PremiumPromo } from "./PremiumPromo";
import { FeedSortBar } from "./FeedSortBar";
import { INITIAL_POSTS, type PostData } from "@/lib/posts-data";

export function Feed() {
  const [posts, setPosts] = useState<PostData[]>(INITIAL_POSTS);
  const [composerOpen, setComposerOpen] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | undefined>(undefined);

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

  return (
    <div className="space-y-2">
      <PremiumPromo />
      <PostComposer
        onOpen={() => setComposerOpen(true)}
        onPhotoSelected={(dataUrl) => {
          setPendingImage(dataUrl);
          setComposerOpen(true);
        }}
      />
      <FeedSortBar />
      {posts.map((p) => (
        <PostCard key={p.id} {...p} />
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
