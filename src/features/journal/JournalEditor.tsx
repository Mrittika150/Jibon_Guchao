import Highlight from "@tiptap/extension-highlight";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { CharacterCount, Placeholder } from "@tiptap/extensions";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Card } from "../../components/Card";
import { queryClient } from "../../lib/queryClient";
import { saveJournalEntry, useSaveJournal, type JournalChanges, type JournalEntry } from "./api";
import { JournalToolbar } from "./JournalToolbar";
import { MOODS, type MoodId } from "./moods";
import { htmlToText, toEditorHtml } from "./preview";
import { nextPrompt } from "./prompts";

const AUTOSAVE_AFTER_MS = 1000;
const MAX_CHARACTERS = 20000;

// What the editor can do. Made once, shared by every day's editor.
const EXTENSIONS = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    link: false,
    code: false,
    codeBlock: false,
    horizontalRule: false,
  }),
  Highlight,
  TaskList,
  TaskItem.configure({ nested: true }),
  Placeholder.configure({ placeholder: "How was your day?" }),
  CharacterCount.configure({ limit: MAX_CHARACTERS }),
];

function isBlank(changes: JournalChanges): boolean {
  return htmlToText(changes.body).trim() === "" && changes.mood === null;
}

type JournalEditorProps = {
  date: string;
  entry: JournalEntry | null;
};

// One day's page. The parent gives it key={date}, so switching days starts a fresh editor.
export function JournalEditor({ date, entry }: JournalEditorProps) {
  const save = useSaveJournal(date);
  const [body, setBody] = useState(entry?.body ?? "");
  const [mood, setMood] = useState<MoodId | null>(entry?.mood ?? null);
  const [prompt, setPrompt] = useState<string | null>(null);

  const editor = useEditor({
    extensions: EXTENSIONS,
    content: toEditorHtml(entry?.body ?? ""),
    // Every change in the editor updates `body`, which starts the autosave timer
    onUpdate: ({ editor }) => setBody(editor.getHTML()),
    editorProps: {
      attributes: { class: "journal-content", "aria-label": "Journal entry", "aria-multiline": "true" },
    },
  });

  const counts = useEditorState({
    editor,
    selector: ({ editor }) => ({
      characters: editor?.storage.characterCount.characters() ?? 0,
      words: editor?.storage.characterCount.words() ?? 0,
    }),
  });

  // What the database has right now (a ref, so changing it doesn't re-render)
  const saved = useRef<JournalChanges & { exists: boolean }>({
    body: entry?.body ?? "",
    mood: entry?.mood ?? null,
    exists: entry !== null,
  });
  const isDirty = body !== saved.current.body || mood !== saved.current.mood;

  function saveNow(changes: JournalChanges = { body, mood }) {
    if (isBlank(changes) && !saved.current.exists) return; // nothing to save for a blank new day
    save.mutate(changes, {
      onSuccess: () => {
        saved.current = { ...changes, exists: true };
      },
    });
  }

  // Autosave: wait until you stop typing for a second, then save
  useEffect(() => {
    if (!isDirty || save.isPending) return;
    const timer = setTimeout(() => saveNow(), AUTOSAVE_AFTER_MS);
    return () => clearTimeout(timer);
  });

  // Switching days (or screens) closes this editor: save anything not saved yet
  const latest = useRef<JournalChanges>({ body, mood });
  useEffect(() => {
    latest.current = { body, mood };
  });
  useEffect(() => {
    return () => {
      const now = latest.current;
      const changed = now.body !== saved.current.body || now.mood !== saved.current.mood;
      if (changed && !(isBlank(now) && !saved.current.exists)) {
        void saveJournalEntry(date, now).then(() => queryClient.invalidateQueries());
      }
    };
  }, [date]);

  // Ctrl + S saves straight away
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();
      saveNow();
    }
  }

  // Put the prompt into the page as a small heading, with an empty line under it to answer
  function insertPrompt() {
    if (!editor || !prompt) return;
    editor
      .chain()
      .focus("end")
      .insertContent([
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: prompt }] },
        { type: "paragraph" },
      ])
      .run();
    setPrompt(null);
  }

  let status = "";
  if (save.isError) status = `Not saved: ${save.error.message}`;
  else if (save.isPending) status = "Saving...";
  else if (isDirty) status = "Writing...";
  else if (saved.current.exists) status = "Saved";

  return (
    <Card title="Dear diary" sticker="bow">
      <div role="group" aria-label="Mood" className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-sm font-semibold text-ink-soft">Mood</span>
        {MOODS.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={mood === option.id}
            onClick={() => setMood(mood === option.id ? null : option.id)}
            className={`rounded-full px-3 py-1 text-sm font-semibold ${
              mood === option.id ? "bg-pink text-on-pink" : "bg-card-soft text-ink-soft hover:text-ink"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {editor && <JournalToolbar editor={editor} onIdea={() => setPrompt(nextPrompt(prompt))} />}

      {prompt && (
        <div className="pop-in flex flex-wrap items-center gap-2 rounded-2xl border border-dashed border-pink px-3 py-2 text-sm">
          <span className="flex-1 font-semibold">{prompt}</span>
          <button type="button" onClick={insertPrompt} className="rounded-xl bg-pink px-2.5 py-1 font-bold text-on-pink">
            Use it
          </button>
          <button type="button" onClick={() => setPrompt(nextPrompt(prompt))} className="rounded-xl bg-card-soft px-2.5 py-1 font-semibold">
            Another
          </button>
          <button type="button" onClick={() => setPrompt(null)} className="rounded-xl px-2 py-1 text-ink-soft hover:text-ink">
            Close
          </button>
        </div>
      )}

      {/* Clicking anywhere in the paper puts the cursor in the text */}
      <div
        onKeyDown={handleKeyDown}
        onClick={(event) => {
          if (event.target === event.currentTarget) editor?.chain().focus("end").run();
        }}
        className="h-72 cursor-text overflow-y-auto rounded-2xl border border-line bg-page px-4 py-3"
      >
        <EditorContent editor={editor} />
      </div>

      <div className="flex items-center justify-between gap-2 text-sm text-ink-soft">
        <span>
          {counts.words.toLocaleString()} words · {counts.characters.toLocaleString()} / {MAX_CHARACTERS.toLocaleString()}
        </span>
        <span role="status" className="flex items-center gap-2">
          {status}
          {save.isError && (
            <button type="button" onClick={() => saveNow()} className="rounded-xl bg-card-soft px-2 py-0.5 font-semibold text-ink">
              Try again
            </button>
          )}
        </span>
      </div>
    </Card>
  );
}
