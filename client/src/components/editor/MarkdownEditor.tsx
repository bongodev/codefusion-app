import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Toolbar,
  IconButton,
  Typography,
  Tooltip,
  Divider,
  ButtonGroup,
  Chip,
  Stack,
} from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  Code,
  Link,
  Image,
  FormatQuote,
  Fullscreen,
  FullscreenExit,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

type EditorTheme = "vs-dark" | "light" | "vs";

// Declare global monaco
declare global {
  const monaco: unknown;
}

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onSave?: () => void;
  placeholder?: string;
  height?: string;
  readOnly?: boolean;
  autoSave?: boolean;
  autoSaveInterval?: number;
};

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  onSave,
  placeholder = "Start writing your note...",
  height = "400px",
  readOnly = false,
  autoSave = true,
  autoSaveInterval = 30000, // 30 seconds
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [editorTheme] = useState<EditorTheme>("vs");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Calculate word and character count
  useEffect(() => {
    const words = value.trim() ? value.trim().split(/\s+/).length : 0;
    const chars = value.length;
    setWordCount(words);
    setCharCount(chars);
  }, [value]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !onSave) return;

    const autoSaveTimer = setInterval(() => {
      if (value.trim()) {
        onSave();
      }
    }, autoSaveInterval);

    return () => clearInterval(autoSaveTimer);
  }, [autoSave, autoSaveInterval, onSave, value]);

  // Handle editor mount
  const handleEditorDidMount = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (editor: any, monacoInstance: any) => {
      editorRef.current = editor;

      // Add keyboard shortcuts
      editor.addCommand(
        monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyS,
        () => {
          onSave?.();
        }
      );

      editor.addCommand(
        monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyB,
        () => {
          insertMarkdownSyntax("**", "**", "Bold text");
        }
      );

      editor.addCommand(
        monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyI,
        () => {
          insertMarkdownSyntax("*", "*", "Italic text");
        }
      );

      editor.addCommand(
        monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyF,
        () => {
          editor.getAction("actions.find").run();
        }
      );
    },
    [onSave]
  );

  // Insert markdown syntax
  const insertMarkdownSyntax = useCallback(
    (before: string, after: string, placeholder: string) => {
      if (!editorRef.current) return;

      const editor = editorRef.current;
      const selection = editor.getSelection();
      const selectedText = editor.getModel().getValueInRange(selection);

      if (selectedText) {
        const newText = `${before}${selectedText}${after}`;
        editor.executeEdits("markdown-toolbar", [
          {
            range: selection,
            text: newText,
          },
        ]);
      } else {
        const position = editor.getPosition();
        const newText = `${before}${placeholder}${after}`;
        editor.executeEdits("markdown-toolbar", [
          {
            range: {
              startLineNumber: position.lineNumber,
              startColumn: position.column,
              endLineNumber: position.lineNumber,
              endColumn: position.column,
            },
            text: newText,
          },
        ]);

        // Select the placeholder text
        editor.setSelection({
          startLineNumber: position.lineNumber,
          startColumn: position.column + before.length,
          endLineNumber: position.lineNumber,
          endColumn: position.column + before.length + placeholder.length,
        });
      }

      editor.focus();
    },
    []
  );

  // Toolbar actions
  const toolbarActions = [
    {
      icon: <FormatBold />,
      label: "Bold (Ctrl+B)",
      action: () => insertMarkdownSyntax("**", "**", "Bold text"),
    },
    {
      icon: <FormatItalic />,
      label: "Italic (Ctrl+I)",
      action: () => insertMarkdownSyntax("*", "*", "Italic text"),
    },
    {
      icon: <Code />,
      label: "Code",
      action: () => insertMarkdownSyntax("`", "`", "Code"),
    },
    {
      icon: <FormatListBulleted />,
      label: "Bullet List",
      action: () => insertMarkdownSyntax("- ", "", "List item"),
    },
    {
      icon: <FormatListNumbered />,
      label: "Numbered List",
      action: () => insertMarkdownSyntax("1. ", "", "List item"),
    },
    {
      icon: <FormatQuote />,
      label: "Quote",
      action: () => insertMarkdownSyntax("> ", "", "Quote"),
    },
    {
      icon: <Link />,
      label: "Link",
      action: () => insertMarkdownSyntax("[", "](url)", "Link text"),
    },
    {
      icon: <Image />,
      label: "Image",
      action: () => insertMarkdownSyntax("![", "](image-url)", "Alt text"),
    },
  ];

  // Custom renderer for code blocks
  const components = {
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={tomorrow}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  const containerHeight = isFullscreen ? "100vh" : height;

  return (
    <Box
      sx={{
        position: isFullscreen ? "fixed" : "relative",
        top: isFullscreen ? 0 : "auto",
        left: isFullscreen ? 0 : "auto",
        right: isFullscreen ? 0 : "auto",
        bottom: isFullscreen ? 0 : "auto",
        zIndex: isFullscreen ? 9999 : "auto",
        bgcolor: "background.paper",
        border: isFullscreen ? "none" : "1px solid",
        borderColor: "divider",
        borderRadius: isFullscreen ? 0 : 1,
        overflow: "hidden",
      }}
    >
      {/* Toolbar */}
      <Toolbar
        variant="dense"
        sx={{
          bgcolor: "background.default",
          borderBottom: "1px solid",
          borderBottomColor: "divider",
          minHeight: 56,
          px: 1,
        }}
      >
        {/* Formatting Tools */}
        <Stack direction="row" spacing={0.5}>
          {toolbarActions.map((action, index) => (
            <Tooltip key={index} title={action.label}>
              <IconButton
                size="small"
                onClick={action.action}
                disabled={readOnly}
              >
                {action.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Stack>

        <Divider orientation="vertical" sx={{ mx: 1, height: 24 }} />

        {/* View Controls */}
        <ButtonGroup size="small" variant="outlined">
          <Tooltip title="Toggle Preview">
            <IconButton
              size="small"
              onClick={() => setShowPreview(!showPreview)}
              color={showPreview ? "primary" : "default"}
            >
              {showPreview ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </Tooltip>
          <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
            <IconButton
              size="small"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
          </Tooltip>
        </ButtonGroup>

        <Box sx={{ flexGrow: 1 }} />

        {/* Stats */}
        <Stack direction="row" spacing={1}>
          <Chip label={`${wordCount} words`} size="small" variant="outlined" />
          <Chip label={`${charCount} chars`} size="small" variant="outlined" />
        </Stack>
      </Toolbar>

      {/* Editor and Preview */}
      <Box
        sx={{
          display: "flex",
          height: `calc(${containerHeight} - 56px)`,
        }}
      >
        {/* Editor */}
        <Box
          sx={{
            flex: showPreview ? 1 : 2,
            borderRight: showPreview ? "1px solid" : "none",
            borderRightColor: "divider",
          }}
        >
          <Editor
            height="100%"
            defaultLanguage="markdown"
            value={value}
            onChange={(newValue) => onChange(newValue || "")}
            onMount={handleEditorDidMount}
            theme={editorTheme}
            options={{
              minimap: { enabled: true },
              wordWrap: "on",
              lineNumbers: "on",
              automaticLayout: true,
              scrollBeyondLastLine: false,
              fontSize: 14,
              lineHeight: 1.6,
              fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
              readOnly,
              placeholder,
              formatOnPaste: true,
              formatOnType: true,
              suggest: {
                showKeywords: true,
                showSnippets: true,
              },
            }}
          />
        </Box>

        {/* Preview */}
        {showPreview && (
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              p: 3,
              bgcolor: "background.paper",
            }}
          >
            {value.trim() ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={components}
              >
                {value}
              </ReactMarkdown>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontStyle: "italic" }}
              >
                Preview will appear here as you type...
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MarkdownEditor;
