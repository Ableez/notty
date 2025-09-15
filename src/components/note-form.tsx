import { api } from "#/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useState } from "react";

const NoteForm = ({
  className,
  setOpen,
  onNoteCreated,
}: {
  setOpen: (open: boolean) => void;
  onNoteCreated?: () => void;
  className?: string;
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useUser();
  const createNote = useMutation(api.funcs.notes.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !title.trim() || !content.trim()) return;

    try {
      setIsSubmitting(true);
      await createNote({
        title: title.trim(),
        content: content.trim(),
        userId: user.id,
      });

      // Reset form and close drawer/dialog
      setTitle("");
      setContent("");
      setOpen(false);
      onNoteCreated?.();
    } catch (error) {
      console.error("Failed to create note:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full rounded-xl bg-neutral-800 p-3 text-white focus:outline-none"
        required
      />
      <div className="rounded-2xl bg-neutral-900 p-2 px-4">
        <textarea
          className="max-h-[500px] min-h-[100px] w-full resize-none overflow-hidden bg-transparent text-white focus:outline-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here..."
          rows={4}
          style={{ height: "auto", overflow: "hidden" }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${target.scrollHeight}px`;
          }}
          required
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting || !title.trim() || !content.trim()}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-neutral-700"
      >
        {isSubmitting ? "Creating..." : "Create Note"}
      </button>
    </form>
  );
};

export default NoteForm;
