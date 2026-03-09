// src/components/QuestionCardCreateQuiz.tsx
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Trash2,
  ChevronUp,
  ChevronDown,
  Type,
  Minus,
  Plus,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Question {
  id: string;
  questionText: string;
  choices: string[];
  correctAnswer: number;
  points: number;
}

interface QuestionCardProps {
  question: Question;
  index: number;
  totalQuestions: number;
  onQuestionUpdate: (id: string, field: keyof Question, value: any) => void;
  onChoiceUpdate: (
    questionId: string,
    choiceIndex: number,
    value: string,
  ) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

// ─── Tiny KaTeX loader (CDN) ────────────────────────────────────────────────
function useKatex() {
  const [ready, setReady] = useState(!!(window as any).katex);
  useEffect(() => {
    if ((window as any).katex) {
      setReady(true);
      return;
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js";
    script.onload = () => setReady(true);
    document.head.appendChild(script);
  }, []);
  return ready;
}

function renderLatex(tex: string, display = false) {
  if (!(window as any).katex) return tex;
  try {
    return (window as any).katex.renderToString(tex, {
      displayMode: display,
      throwOnError: false,
    });
  } catch {
    return tex;
  }
}

// ─── Equation Modal ──────────────────────────────────────────────────────────
function EquationModal({
  onInsert,
  onClose,
}: {
  onInsert: (latex: string, display: boolean) => void;
  onClose: () => void;
}) {
  const [latex, setLatex] = useState("E = mc^2");
  const [display, setDisplay] = useState(false);
  const katexReady = useKatex();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800 to-slate-900 p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-lg">
            ∑
          </div>
          <div>
            <div className="font-bold text-slate-100">
              LaTeX Equation Editor
            </div>
            <div className="text-xs text-slate-400">
              Enter a LaTeX expression to insert
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-auto text-slate-400 hover:text-slate-300"
          >
            ✕
          </button>
        </div>

        {/* Quick symbols */}
        <div className="mb-3">
          <div className="mb-1 text-xs uppercase tracking-wider text-slate-500">
            Quick Insert
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              ["α", "\\alpha"],
              ["β", "\\beta"],
              ["γ", "\\gamma"],
              ["δ", "\\delta"],
              ["∑", "\\sum"],
              ["∫", "\\int"],
              ["√", "\\sqrt{x}"],
              ["∞", "\\infty"],
              ["π", "\\pi"],
              ["±", "\\pm"],
              ["÷", "\\div"],
              ["×", "\\times"],
              ["≤", "\\leq"],
              ["≥", "\\geq"],
              ["≠", "\\neq"],
              ["→", "\\rightarrow"],
            ].map(([label, sym]) => (
              <button
                key={sym}
                onClick={() => setLatex((l) => l + sym)}
                className="rounded-md border border-slate-700 bg-slate-800/50 px-3 py-1.5 font-serif text-sm text-slate-300 transition-all hover:border-indigo-500 hover:bg-slate-800"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <textarea
          value={latex}
          onChange={(e) => setLatex(e.target.value)}
          rows={3}
          placeholder="Enter LaTeX e.g. \frac{a}{b}"
          className="w-full resize-y rounded-lg border border-slate-700 bg-slate-900/50 p-3 font-mono text-sm text-slate-200 outline-none transition-colors focus:border-indigo-500"
        />

        {/* Preview */}
        <div className="mt-3 flex min-h-[60px] items-center justify-center rounded-lg border border-slate-800 bg-slate-900/30 p-4">
          {katexReady && latex ? (
            <span
              dangerouslySetInnerHTML={{ __html: renderLatex(latex, display) }}
            />
          ) : (
            <span className="text-xs text-slate-600">
              Preview will appear here…
            </span>
          )}
        </div>

        {/* Display mode toggle */}
        <label className="mt-3 flex cursor-pointer items-center gap-3">
          <div
            onClick={() => setDisplay((d) => !d)}
            className={`relative h-5 w-9 rounded-full transition-colors ${
              display ? "bg-indigo-500" : "bg-slate-700"
            }`}
          >
            <div
              className={`absolute top-1 h-3 w-3 rounded-full bg-white transition-all ${
                display ? "left-5" : "left-1"
              }`}
            />
          </div>
          <span className="text-xs text-slate-400">
            Display mode (centered block)
          </span>
        </label>

        {/* Actions */}
        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-700 px-5 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onInsert(latex, display);
              onClose();
            }}
            className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Insert Equation
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Rich Text Toolbar ───────────────────────────────────────────────────────
function Toolbar({
  onCommand,
  onEquation,
  activeFormats,
}: {
  onCommand: (cmd: string) => void;
  onEquation: () => void;
  activeFormats: Set<string>;
}) {
  const [clickedButton, setClickedButton] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleButtonClick = (cmd: string) => {
    setClickedButton(cmd);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setClickedButton(null);
    }, 200);
    onCommand(cmd);
  };

  const handleFontSize = (increase: boolean) => {
    onCommand(increase ? "increaseFontSize" : "decreaseFontSize");
    handleButtonClick(increase ? "fontPlus" : "fontMinus");
  };

  const btn = (label: string, cmd: string, title?: string) => {
    const isActive = activeFormats.has(cmd);
    const isClicked = clickedButton === cmd;

    return (
      <button
        title={title || cmd}
        onMouseDown={(e) => {
          e.preventDefault();
          handleButtonClick(cmd);
        }}
        className={`rounded-md px-2 py-1 text-sm transition-all ${
          isActive
            ? "bg-indigo-500/30 text-indigo-200 shadow-lg shadow-indigo-500/30"
            : isClicked
              ? "bg-indigo-500/20 text-indigo-300 scale-110"
              : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 rounded-t-lg border-b border-slate-800 bg-slate-900/50 p-2">
      {btn("B", "bold", "Bold (Ctrl+B)")}
      {btn("I", "italic", "Italic (Ctrl+I)")}
      {btn("U", "underline", "Underline (Ctrl+U)")}
      <div className="mx-1 h-5 w-px bg-slate-700" />

      {/* Font Size Controls */}
      <div className="relative flex items-center gap-0.5">
        <button
          title="Decrease font size (Ctrl+Shift+<)"
          onMouseDown={(e) => {
            e.preventDefault();
            handleFontSize(false);
          }}
          className={`rounded-md px-2 py-1 text-sm transition-all ${
            clickedButton === "fontMinus"
              ? "bg-indigo-500/20 text-indigo-300 scale-110"
              : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          }`}
        >
          <Minus className="h-3 w-3" />
        </button>
        <Type className="h-3 w-3 text-slate-500 mx-0.5" />
        <button
          title="Increase font size (Ctrl+Shift+>)"
          onMouseDown={(e) => {
            e.preventDefault();
            handleFontSize(true);
          }}
          className={`rounded-md px-2 py-1 text-sm transition-all ${
            clickedButton === "fontPlus"
              ? "bg-indigo-500/20 text-indigo-300 scale-110"
              : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          }`}
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>

      <div className="mx-1 h-5 w-px bg-slate-700" />
      {btn("x²", "superscript", "Superscript")}
      {btn("x₂", "subscript", "Subscript")}
      <div className="mx-1 h-5 w-px bg-slate-700" />
      {btn("•", "insertUnorderedList", "Bullet List")}
      {btn("1.", "insertOrderedList", "Numbered List")}
      <div className="mx-1 h-5 w-px bg-slate-700" />
      {btn("</>", "formatBlock", "Code Block")}
      <div className="mx-1 h-5 w-px bg-slate-700" />
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          onEquation();
        }}
        title="Insert Equation (LaTeX)"
        className="flex items-center gap-1 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-1 text-xs font-semibold text-white transition-all hover:opacity-90"
      >
        <span className="text-sm">∑</span> Equation
      </button>
    </div>
  );
}

// ─── Rich Text Editor ────────────────────────────────────────────────────────
function RichEditor({
  value,
  onChange,
  placeholder,
  compact = false,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder: string;
  compact?: boolean;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showEquation, setShowEquation] = useState(false);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const savedRange = useRef<Range | null>(null);
  const isFocused = useRef(false);

  // Set initial content ONCE on mount only
  useEffect(() => {
    if (editorRef.current && !isFocused.current) {
      editorRef.current.innerHTML = value || "";
    }
  }, []);

  // Check active formats when selection changes
  const checkActiveFormats = () => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount || !editorRef.current) return;

    const formats = new Set<string>();

    // Check if we're inside the editor
    let node = selection.getRangeAt(0).commonAncestorContainer;
    if (node.nodeType === 3) node = node.parentNode as Node;

    if (!editorRef.current.contains(node)) return;

    // Check for formatting states
    try {
      if (document.queryCommandState("bold")) formats.add("bold");
      if (document.queryCommandState("italic")) formats.add("italic");
      if (document.queryCommandState("underline")) formats.add("underline");
      if (document.queryCommandState("superscript")) formats.add("superscript");
      if (document.queryCommandState("subscript")) formats.add("subscript");
      if (document.queryCommandState("insertUnorderedList"))
        formats.add("insertUnorderedList");
      if (document.queryCommandState("insertOrderedList"))
        formats.add("insertOrderedList");
    } catch (e) {
      // Ignore errors for commands that might not be supported
    }

    setActiveFormats(formats);
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
      checkActiveFormats();
    }
  };

  const restoreSelection = () => {
    if (!savedRange.current) return;
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(savedRange.current);
    checkActiveFormats();
  };

  // Helper function to get current font size
  const getCurrentFontSize = (): number => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return 3;

    let node = selection.getRangeAt(0).commonAncestorContainer;
    if (node.nodeType === 3) node = node.parentNode as Node;

    // Check if node or parent has font tag with size
    while (node && node !== editorRef.current) {
      if ((node as HTMLElement).tagName === "FONT") {
        const size = (node as HTMLElement).getAttribute("size");
        if (size) return parseInt(size);
      }
      node = node.parentNode as Node;
    }
    return 3; // Default size
  };

  const handleCommand = (cmd: string) => {
    // Focus the editor first
    editorRef.current?.focus();
    restoreSelection();

    if (cmd === "increaseFontSize" || cmd === "decreaseFontSize") {
      // Get current font size
      let currentSize = getCurrentFontSize();

      // Calculate new size
      if (cmd === "increaseFontSize") {
        currentSize = Math.min(7, currentSize + 1);
      } else {
        currentSize = Math.max(1, currentSize - 1);
      }

      // Apply font size using execCommand with font size command
      document.execCommand("fontSize", false, currentSize.toString());
    } else if (cmd === "superscript" || cmd === "subscript") {
      document.execCommand(cmd, false);
    } else if (cmd === "formatBlock") {
      document.execCommand("formatBlock", false, "pre");
    } else {
      document.execCommand(cmd, false, null);
    }

    // Check active formats after command
    setTimeout(() => {
      checkActiveFormats();
      onChange(editorRef.current?.innerHTML || "");
    }, 10);
  };

  const handleEquationInsert = (latex: string, display: boolean) => {
    restoreSelection();
    const html = renderLatex(latex, display);
    const wrapper = display
      ? `<div class="equation-block" contenteditable="false" data-latex="${encodeURIComponent(latex)}" style="display:block;text-align:center;margin:8px 0;padding:8px;background:#1e293b;border-radius:6px;">${html}</div>`
      : `<span class="equation-inline" contenteditable="false" data-latex="${encodeURIComponent(latex)}" style="display:inline-block;padding:0 2px;vertical-align:middle;">${html}</span>`;
    document.execCommand("insertHTML", false, wrapper + "&nbsp;");
    onChange(editorRef.current?.innerHTML || "");
  };

  const handleInput = () => {
    onChange(editorRef.current?.innerHTML || "");
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "b") {
      e.preventDefault();
      handleCommand("bold");
    } else if ((e.ctrlKey || e.metaKey) && e.key === "i") {
      e.preventDefault();
      handleCommand("italic");
    } else if ((e.ctrlKey || e.metaKey) && e.key === "u") {
      e.preventDefault();
      handleCommand("underline");
    } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === ">") {
      e.preventDefault();
      handleCommand("increaseFontSize");
    } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "<") {
      e.preventDefault();
      handleCommand("decreaseFontSize");
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-900/50 transition-colors focus-within:border-indigo-500">
      <Toolbar
        onCommand={handleCommand}
        onEquation={() => {
          saveSelection();
          setShowEquation(true);
        }}
        activeFormats={activeFormats}
      />
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onFocus={() => {
          isFocused.current = true;
        }}
        onBlur={() => {
          isFocused.current = false;
          checkActiveFormats();
        }}
        onInput={handleInput}
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
        onKeyDown={handleKeyDown}
        onClick={checkActiveFormats}
        data-placeholder={placeholder}
        className={`overflow-y-auto p-3 text-slate-200 outline-none ${
          compact ? "min-h-[40px]" : "min-h-[80px]"
        }`}
        style={{ fontFamily: "'Georgia', serif" }}
      />
      {showEquation && (
        <EquationModal
          onInsert={handleEquationInsert}
          onClose={() => setShowEquation(false)}
        />
      )}
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #475569;
          pointer-events: none;
        }
        [contenteditable] pre {
          background: #1e293b;
          border-radius: 6px;
          padding: 8px 12px;
          font-family: monospace;
          font-size: 13px;
          color: #7dd3fc;
          margin: 4px 0;
        }
        [contenteditable] ul, [contenteditable] ol {
          display: block;
          list-style-type: disc;
          margin-block-start: 1em;
          margin-block-end: 1em;
          margin-inline-start: 0px;
          margin-inline-end: 0px;
          padding-inline-start: 40px;
        }
        [contenteditable] ul {
          list-style-type: disc;
        }
        [contenteditable] ul ul {
          list-style-type: circle;
        }
        [contenteditable] ul ul ul {
          list-style-type: square;
        }
        [contenteditable] ol {
          list-style-type: decimal;
        }
        [contenteditable] ol ol {
          list-style-type: lower-alpha;
        }
        [contenteditable] ol ol ol {
          list-style-type: lower-roman;
        }
        [contenteditable] li {
          display: list-item;
          text-align: match-parent;
          margin: 0;
          padding: 0;
        }
        [contenteditable] ul li,
        [contenteditable] ol li {
          margin-left: 20px;
        }
        [contenteditable] b, [contenteditable] strong {
          color: #f1f5f9;
        }
        [contenteditable] sup {
          font-size: 0.75em;
          vertical-align: super;
          line-height: 0;
        }
        [contenteditable] sub {
          font-size: 0.75em;
          vertical-align: sub;
          line-height: 0;
        }
        [contenteditable] font[size="1"] { font-size: 0.75rem; }
        [contenteditable] font[size="2"] { font-size: 0.875rem; }
        [contenteditable] font[size="3"] { font-size: 1rem; }
        [contenteditable] font[size="4"] { font-size: 1.125rem; }
        [contenteditable] font[size="5"] { font-size: 1.25rem; }
        [contenteditable] font[size="6"] { font-size: 1.5rem; }
        [contenteditable] font[size="7"] { font-size: 1.75rem; }
        [contenteditable] blockquote {
          border-left: 3px solid #4b5563;
          padding-left: 1rem;
          margin: 1rem 0;
          color: #9ca3af;
        }
        [contenteditable] h1, [contenteditable] h2, [contenteditable] h3 {
          font-weight: bold;
          margin: 0.5rem 0;
        }
        [contenteditable] h1 { font-size: 2em; }
        [contenteditable] h2 { font-size: 1.5em; }
        [contenteditable] h3 { font-size: 1.17em; }
      `}</style>
    </div>
  );
}

// ─── Choice Row ──────────────────────────────────────────────────────────────
function ChoiceRow({
  choice,
  choiceIndex,
  isCorrect,
  onUpdate,
  onMarkCorrect,
}: {
  choice: string;
  choiceIndex: number;
  isCorrect: boolean;
  onUpdate: (html: string) => void;
  onMarkCorrect: () => void;
}) {
  return (
    <div
      className={`flex items-start gap-3 rounded-lg border p-3 transition-all ${
        isCorrect
          ? "border-green-500/30 bg-green-500/5"
          : "border-slate-700/50 bg-slate-800/30 hover:border-slate-600"
      }`}
    >
      {/* Radio-style marker */}
      <button
        onClick={onMarkCorrect}
        title="Mark as correct answer"
        className={`mt-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
          isCorrect
            ? "border-green-500 bg-green-500"
            : "border-slate-600 bg-transparent hover:border-slate-500"
        }`}
      >
        {isCorrect && <span className="text-xs text-white">✓</span>}
      </button>

      {/* Rich editor for choice */}
      <div className="flex-1">
        <RichEditor
          value={choice}
          onChange={onUpdate}
          placeholder={`Choice ${choiceIndex + 1}`}
          compact
        />
      </div>

      {/* Correct badge */}
      <div
        className={`mt-2 whitespace-nowrap text-xs font-medium ${
          isCorrect ? "text-green-400" : "text-slate-600"
        }`}
      >
        {isCorrect ? "✓ Correct" : "Mark correct"}
      </div>
    </div>
  );
}

export function QuestionCardCreateQuiz({
  question,
  index,
  totalQuestions,
  onQuestionUpdate,
  onChoiceUpdate,
  onRemove,
  canRemove,
}: QuestionCardProps) {
  const [collapsed, setCollapsed] = useState(false);

  // Strip HTML for preview text
  const plainTextPreview = question.questionText
    .replace(/<[^>]+>/g, "")
    .slice(0, 48);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 * index }}
      className="group"
    >
      <Card className="overflow-hidden border border-slate-700/50 bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm transition-all hover:border-slate-600/50">
        <CardHeader className="border-b border-slate-700/50 bg-slate-900/40 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-sm font-bold text-white">
                {index + 1}
              </div>
              <CardTitle className="text-lg text-slate-200">
                Question {index + 1}
                {question.questionText && (
                  <span className="ml-2 text-sm font-normal text-slate-500">
                    — {plainTextPreview}
                    {question.questionText.length > 48 ? "…" : ""}
                  </span>
                )}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCollapsed(!collapsed)}
                className="h-8 w-8 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
              >
                {collapsed ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </Button>
              {canRemove && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(question.id)}
                    className="h-8 w-8 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </CardHeader>

        {!collapsed && (
          <CardContent className="space-y-6 p-6">
            {/* Question Text */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Question Text
              </Label>
              <RichEditor
                value={question.questionText}
                onChange={(html) =>
                  onQuestionUpdate(question.id, "questionText", html)
                }
                placeholder="Enter your question here… use ∑ to add equations"
              />
            </div>

            {/* Answer Choices */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Answer Choices
                </Label>
                <span className="text-xs text-slate-600">
                  Click ○ to mark correct answer
                </span>
              </div>
              <div className="space-y-3">
                {question.choices.map((choice, cIndex) => (
                  <ChoiceRow
                    key={cIndex}
                    choice={choice}
                    choiceIndex={cIndex}
                    isCorrect={question.correctAnswer === cIndex}
                    onUpdate={(html) =>
                      onChoiceUpdate(question.id, cIndex, html)
                    }
                    onMarkCorrect={() =>
                      onQuestionUpdate(question.id, "correctAnswer", cIndex)
                    }
                  />
                ))}
              </div>
            </div>

            {/* Points */}
            <div className="flex items-center gap-3">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Points
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                  ⭐
                </span>
                <Input
                  type="number"
                  value={question.points}
                  onChange={(e) =>
                    onQuestionUpdate(
                      question.id,
                      "points",
                      parseInt(e.target.value) || 1,
                    )
                  }
                  className="w-24 border-slate-700 bg-slate-800/50 pl-8 text-slate-200 focus:border-indigo-500"
                  min="1"
                />
              </div>
              <span className="text-xs text-slate-600">pts</span>
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}
