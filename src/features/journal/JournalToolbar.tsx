import { useEditorState, type Editor } from "@tiptap/react";
import type { ReactNode } from "react";
import {
  BulletListIcon,
  ChecklistIcon,
  ClockIcon,
  HighlightIcon,
  IdeaIcon,
  NumberListIcon,
  QuoteIcon,
  RedoIcon,
  UndoIcon,
} from "../../components/icons/EditorIcons";

type ToolButtonProps = {
  label: string;
  active?: boolean; // only for on/off buttons like Bold
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
};

function ToolButton({ label, active, disabled, onClick, children }: ToolButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      // Keep the cursor in the text: don't let the button steal focus on click
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={`flex h-8 min-w-8 items-center justify-center rounded-xl px-1.5 text-sm disabled:opacity-40 ${
        active ? "bg-pink text-on-pink" : "text-ink-soft hover:bg-card-soft hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span aria-hidden="true" className="mx-0.5 h-5 w-px bg-line" />;
}

type JournalToolbarProps = {
  editor: Editor;
  onIdea: () => void;
};

export function JournalToolbar({ editor, onIdea }: JournalToolbarProps) {
  // Re-render the toolbar only when one of these answers changes
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      underline: editor.isActive("underline"),
      strike: editor.isActive("strike"),
      heading: editor.isActive("heading", { level: 2 }),
      bulletList: editor.isActive("bulletList"),
      orderedList: editor.isActive("orderedList"),
      taskList: editor.isActive("taskList"),
      quote: editor.isActive("blockquote"),
      highlight: editor.isActive("highlight"),
      canUndo: editor.can().undo(),
      canRedo: editor.can().redo(),
    }),
  });

  // Every button runs a "chain": focus the text, do one thing, run it
  const run = () => editor.chain().focus();

  function addTime() {
    const time = new Date().toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true });
    run().insertContent([{ type: "text", text: time, marks: [{ type: "bold" }] }, { type: "text", text: " " }]).run();
  }

  return (
    <div role="toolbar" aria-label="Formatting" className="flex flex-wrap items-center gap-0.5 rounded-2xl bg-card-soft/60 p-1">
      <ToolButton label="Bold (Ctrl+B)" active={state.bold} onClick={() => run().toggleBold().run()}>
        <span className="font-bold">B</span>
      </ToolButton>
      <ToolButton label="Italic (Ctrl+I)" active={state.italic} onClick={() => run().toggleItalic().run()}>
        <span className="font-semibold italic">I</span>
      </ToolButton>
      <ToolButton label="Underline (Ctrl+U)" active={state.underline} onClick={() => run().toggleUnderline().run()}>
        <span className="font-semibold underline">U</span>
      </ToolButton>
      <ToolButton label="Strikethrough" active={state.strike} onClick={() => run().toggleStrike().run()}>
        <span className="font-semibold line-through">S</span>
      </ToolButton>
      <ToolButton label="Pink highlighter" active={state.highlight} onClick={() => run().toggleHighlight().run()}>
        <HighlightIcon />
      </ToolButton>
      <Divider />
      <ToolButton label="Heading" active={state.heading} onClick={() => run().toggleHeading({ level: 2 }).run()}>
        <span className="font-bold">H</span>
      </ToolButton>
      <ToolButton label="Bullet list" active={state.bulletList} onClick={() => run().toggleBulletList().run()}>
        <BulletListIcon />
      </ToolButton>
      <ToolButton label="Numbered list" active={state.orderedList} onClick={() => run().toggleOrderedList().run()}>
        <NumberListIcon />
      </ToolButton>
      <ToolButton label="Checklist" active={state.taskList} onClick={() => run().toggleTaskList().run()}>
        <ChecklistIcon />
      </ToolButton>
      <ToolButton label="Quote" active={state.quote} onClick={() => run().toggleBlockquote().run()}>
        <QuoteIcon />
      </ToolButton>
      <Divider />
      <ToolButton label="Add the time" onClick={addTime}>
        <ClockIcon />
      </ToolButton>
      <ToolButton label="Need an idea?" onClick={onIdea}>
        <IdeaIcon />
      </ToolButton>
      <Divider />
      <ToolButton label="Undo (Ctrl+Z)" disabled={!state.canUndo} onClick={() => run().undo().run()}>
        <UndoIcon />
      </ToolButton>
      <ToolButton label="Redo (Ctrl+Y)" disabled={!state.canRedo} onClick={() => run().redo().run()}>
        <RedoIcon />
      </ToolButton>
    </div>
  );
}
