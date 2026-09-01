"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Image as ImageIcon, Link as LinkIcon, X } from "lucide-react";

import { createPostAction, type CreatePostState } from "@/app/(app)/actions";
import { Avatar } from "@/components/Avatar";

const initialState: CreatePostState = { error: null };

type CreatePostModalProps = {
  authorId: string;
  fullName: string;
  avatarUrl?: string | null;
  open: boolean;
  onClose: () => void;
};

type PickedFile = { file: File; previewUrl: string };

export const CreatePostModal = ({ authorId, fullName, avatarUrl, open, onClose }: CreatePostModalProps) => {
  const [state, formAction, isPending] = useActionState(createPostAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wasPending = useRef(false);
  const [files, setFiles] = useState<PickedFile[]>([]);
  const [content, setContent] = useState("");
  const [showLinkField, setShowLinkField] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  useEffect(() => {
    if (wasPending.current && !isPending && !state.error) {
      formRef.current?.reset();
      files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
      setFiles([]);
      setContent("");
      setShowLinkField(false);
      setLinkUrl("");
      onClose();
    }
    wasPending.current = isPending;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending, state.error, onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && resetAndClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onClose]);

  const resetAndClose = () => {
    files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    setFiles([]);
    setContent("");
    setShowLinkField(false);
    setLinkUrl("");
    formRef.current?.reset();
    onClose();
  };

  if (!open) return null;

  // A native file input's `.files` only ever reflects the most recent picker
  // selection, not an accumulated set — so every add/remove rebuilds it via
  // DataTransfer to keep what actually submits in sync with the previews.
  const syncInput = (fileList: File[]) => {
    const dt = new DataTransfer();
    fileList.forEach((file) => dt.items.add(file));
    if (fileInputRef.current) fileInputRef.current.files = dt.files;
  };

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const picked = Array.from(list)
      .slice(0, 10 - files.length)
      .map((file) => ({ file, previewUrl: URL.createObjectURL(file) }));
    const next = [...files, ...picked];
    syncInput(next.map((f) => f.file));
    setFiles(next);
  };

  const removeFile = (index: number) => {
    const next = files.filter((_, i) => i !== index);
    URL.revokeObjectURL(files[index].previewUrl);
    syncInput(next.map((f) => f.file));
    setFiles(next);
  };

  // Rendered via a portal to escape the sidebar's `position: sticky`
  // ancestor — sticky elements establish their own stacking context, which
  // trapped this modal's z-50 backdrop below the header's z-40 (a sibling
  // of that stacking context, not a descendant), letting feed content paint
  // over the "dimmed" backdrop despite the lower z-index looking correct on
  // paper. Portaling to <body> puts the modal in the root stacking context.
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 px-4 pt-20 pb-10 backdrop-blur-sm">
      <div className="glass-strong w-full max-w-lg rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-text">Share an update</h2>
          <button
            type="button"
            onClick={resetAndClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-muted-bg/70 hover:text-text"
          >
            <X className="h-4.5 w-4.5" strokeWidth={2} />
          </button>
        </div>

        <form ref={formRef} action={formAction} className="mt-4 flex gap-3">
          <Avatar id={authorId} name={fullName} avatarUrl={avatarUrl} size="h-10 w-10" />
          <div className="min-w-0 flex-1">
            <textarea
              name="content"
              rows={5}
              autoFocus
              maxLength={5000}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share an update, milestone or launch..."
              className="w-full resize-none rounded-xl border border-border/70 bg-muted-bg/60 px-3.5 py-3 text-sm text-text outline-none placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
            />
            <div className="mt-1 text-right text-[11px] text-muted">{content.length}/5000</div>

            <input type="file" name="media" ref={fileInputRef} multiple accept="image/*,video/*" hidden onChange={(e) => addFiles(e.target.files)} />

            {showLinkField ? (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="url"
                  name="linkUrl"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://..."
                  autoCapitalize="none"
                  className="h-9 flex-1 rounded-xl border border-border/70 bg-muted-bg/60 px-3.5 text-xs text-text outline-none placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowLinkField(false);
                    setLinkUrl("");
                  }}
                  aria-label="Remove link"
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-muted hover:bg-muted-bg/70 hover:text-text"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              </div>
            ) : null}

            {files.length > 0 ? (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {files.map((f, index) => (
                  <div key={f.previewUrl} className="group relative aspect-square overflow-hidden rounded-lg bg-muted-bg">
                    {f.file.type.startsWith("video/") ? (
                      <video src={f.previewUrl} className="h-full w-full object-cover" muted />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={f.previewUrl} alt="" className="h-full w-full object-cover" />
                    )}
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      aria-label="Remove"
                      className="absolute right-1 top-1 flex h-5.5 w-5.5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" strokeWidth={2.5} />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            {state.error ? <p className="mt-2 text-xs font-medium text-danger">{state.error}</p> : null}

            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={files.length >= 10}
                  className="flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-1.5 text-xs font-bold text-muted transition hover:bg-muted-bg/70 hover:text-text disabled:opacity-40"
                >
                  <ImageIcon className="h-3.5 w-3.5" strokeWidth={2} />
                  Photo / video
                </button>
                <button
                  type="button"
                  onClick={() => setShowLinkField((v) => !v)}
                  className="flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-1.5 text-xs font-bold text-muted transition hover:bg-muted-bg/70 hover:text-text"
                >
                  <LinkIcon className="h-3.5 w-3.5" strokeWidth={2} />
                  {showLinkField ? "Hide URL" : "Add URL"}
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="rounded-full border border-border/70 px-4 py-1.5 text-xs font-bold text-text hover:bg-muted-bg/70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || !content.trim()}
                  className="rounded-full bg-gradient-to-r from-primary to-indigo-500 px-4 py-1.5 text-xs font-bold text-on-primary shadow-md shadow-primary/25 disabled:opacity-60"
                >
                  {isPending ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
