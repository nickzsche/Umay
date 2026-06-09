import { useMemo } from 'react'
import { Code2, Copy, Check } from 'lucide-react'
import { useState, useCallback } from 'react'

interface SyntaxHighlightProps {
  code: string
  language: string
}

// Token types for syntax highlighting
type TokenType = 'keyword' | 'string' | 'comment' | 'number' | 'function' | 'operator' | 'type' | 'plain'

interface Token {
  type: TokenType
  text: string
}

// Language-specific keyword sets
const languageKeywords: Record<string, string[]> = {
  javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'new', 'this', 'class', 'extends', 'import', 'export', 'default', 'from', 'async', 'await', 'try', 'catch', 'finally', 'throw', 'typeof', 'instanceof', 'in', 'of', 'yield', 'delete', 'void', 'null', 'undefined', 'true', 'false', 'super', 'static', 'get', 'set'],
  js: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'new', 'this', 'class', 'extends', 'import', 'export', 'default', 'from', 'async', 'await', 'try', 'catch', 'finally', 'throw', 'typeof', 'instanceof', 'in', 'of', 'yield', 'delete', 'void', 'null', 'undefined', 'true', 'false', 'super', 'static', 'get', 'set'],
  typescript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'new', 'this', 'class', 'extends', 'import', 'export', 'default', 'from', 'async', 'await', 'try', 'catch', 'finally', 'throw', 'typeof', 'instanceof', 'in', 'of', 'yield', 'delete', 'void', 'null', 'undefined', 'true', 'false', 'super', 'static', 'get', 'set', 'interface', 'type', 'enum', 'implements', 'declare', 'namespace', 'abstract', 'as', 'is', 'keyof', 'readonly', 'private', 'protected', 'public'],
  ts: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'new', 'this', 'class', 'extends', 'import', 'export', 'default', 'from', 'async', 'await', 'try', 'catch', 'finally', 'throw', 'typeof', 'instanceof', 'in', 'of', 'yield', 'delete', 'void', 'null', 'undefined', 'true', 'false', 'super', 'static', 'get', 'set', 'interface', 'type', 'enum', 'implements', 'declare', 'namespace', 'abstract', 'as', 'is', 'keyof', 'readonly', 'private', 'protected', 'public'],
  python: ['def', 'class', 'return', 'if', 'elif', 'else', 'for', 'while', 'try', 'except', 'finally', 'with', 'as', 'import', 'from', 'raise', 'pass', 'break', 'continue', 'lambda', 'yield', 'global', 'nonlocal', 'assert', 'del', 'in', 'not', 'and', 'or', 'is', 'None', 'True', 'False', 'self', 'async', 'await', 'print'],
  py: ['def', 'class', 'return', 'if', 'elif', 'else', 'for', 'while', 'try', 'except', 'finally', 'with', 'as', 'import', 'from', 'raise', 'pass', 'break', 'continue', 'lambda', 'yield', 'global', 'nonlocal', 'assert', 'del', 'in', 'not', 'and', 'or', 'is', 'None', 'True', 'False', 'self', 'async', 'await', 'print'],
  rust: ['fn', 'let', 'mut', 'if', 'else', 'for', 'while', 'loop', 'match', 'return', 'break', 'continue', 'struct', 'enum', 'impl', 'trait', 'pub', 'use', 'mod', 'crate', 'self', 'super', 'where', 'type', 'const', 'static', 'ref', 'move', 'async', 'await', 'unsafe', 'extern', 'dyn', 'as', 'in', 'true', 'false', 'Some', 'None', 'Ok', 'Err'],
  go: ['func', 'var', 'const', 'type', 'struct', 'interface', 'map', 'chan', 'go', 'select', 'case', 'default', 'if', 'else', 'for', 'range', 'switch', 'return', 'break', 'continue', 'defer', 'fallthrough', 'import', 'package', 'nil', 'true', 'false', 'make', 'new', 'append', 'len', 'cap', 'err'],
  css: ['@media', '@keyframes', '@import', '@font-face', '@supports', '@layer', 'important', 'from', 'to', 'and', 'or', 'not', 'only'],
  html: ['DOCTYPE', 'html', 'head', 'body', 'div', 'span', 'script', 'style', 'link', 'meta', 'title', 'class', 'id', 'src', 'href'],
  json: ['true', 'false', 'null'],
  bash: ['if', 'then', 'else', 'elif', 'fi', 'for', 'while', 'do', 'done', 'case', 'esac', 'function', 'return', 'exit', 'echo', 'export', 'source', 'alias', 'set', 'unset', 'local', 'readonly', 'declare', 'true', 'false'],
  sh: ['if', 'then', 'else', 'elif', 'fi', 'for', 'while', 'do', 'done', 'case', 'esac', 'function', 'return', 'exit', 'echo', 'export', 'source', 'alias', 'set', 'unset', 'local', 'readonly', 'declare', 'true', 'false'],
  sql: ['SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'AND', 'OR', 'NOT', 'NULL', 'IS', 'IN', 'BETWEEN', 'LIKE', 'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'AS', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'UNION', 'ALL', 'EXISTS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'TRUE', 'FALSE'],
}

// Color mapping for token types (dark mode friendly)
const tokenColors: Record<TokenType, string> = {
  keyword: 'text-purple-400',
  string: 'text-emerald-400',
  comment: 'text-gray-500 dark:text-gray-600 italic',
  number: 'text-amber-400',
  function: 'text-blue-400',
  operator: 'text-gray-400',
  type: 'text-cyan-400',
  plain: 'text-gray-200',
}

function tokenize(code: string, language: string): Token[] {
  const normalizedLang = language.toLowerCase()
  const keywords = languageKeywords[normalizedLang] || languageKeywords['javascript'] || []
  const tokens: Token[] = []
  let i = 0

  while (i < code.length) {
    // Single-line comments
    if (code[i] === '/' && code[i + 1] === '/') {
      let end = code.indexOf('\n', i)
      if (end === -1) end = code.length
      tokens.push({ type: 'comment', text: code.slice(i, end) })
      i = end
      continue
    }

    // Hash comments (Python, Bash)
    if ((normalizedLang === 'python' || normalizedLang === 'py' || normalizedLang === 'bash' || normalizedLang === 'sh') && code[i] === '#') {
      let end = code.indexOf('\n', i)
      if (end === -1) end = code.length
      tokens.push({ type: 'comment', text: code.slice(i, end) })
      i = end
      continue
    }

    // Multi-line comments /* */
    if (code[i] === '/' && code[i + 1] === '*') {
      let end = code.indexOf('*/', i + 2)
      if (end === -1) end = code.length
      else end += 2
      tokens.push({ type: 'comment', text: code.slice(i, end) })
      i = end
      continue
    }

    // Strings (double quotes)
    if (code[i] === '"') {
      let end = i + 1
      while (end < code.length && code[end] !== '"') {
        if (code[end] === '\\') end++ // skip escaped chars
        end++
      }
      end++ // include closing quote
      tokens.push({ type: 'string', text: code.slice(i, Math.min(end, code.length)) })
      i = Math.min(end, code.length)
      continue
    }

    // Strings (single quotes)
    if (code[i] === "'") {
      let end = i + 1
      while (end < code.length && code[end] !== "'") {
        if (code[end] === '\\') end++
        end++
      }
      end++
      tokens.push({ type: 'string', text: code.slice(i, Math.min(end, code.length)) })
      i = Math.min(end, code.length)
      continue
    }

    // Template literals (backticks)
    if (code[i] === '`') {
      let end = i + 1
      while (end < code.length && code[end] !== '`') {
        if (code[end] === '\\') end++
        end++
      }
      end++
      tokens.push({ type: 'string', text: code.slice(i, Math.min(end, code.length)) })
      i = Math.min(end, code.length)
      continue
    }

    // Numbers
    if (/[0-9]/.test(code[i]) && (i === 0 || !/[a-zA-Z_$]/.test(code[i - 1]))) {
      let end = i
      while (end < code.length && /[0-9.xXa-fA-F_]/.test(code[end])) end++
      tokens.push({ type: 'number', text: code.slice(i, end) })
      i = end
      continue
    }

    // Words (identifiers/keywords)
    if (/[a-zA-Z_$]/.test(code[i])) {
      let end = i
      while (end < code.length && /[a-zA-Z0-9_$]/.test(code[end])) end++
      const word = code.slice(i, end)

      // Check if followed by ( → function call
      const afterWord = code.slice(end).trimStart()
      if (keywords.includes(word)) {
        tokens.push({ type: 'keyword', text: word })
      } else if (afterWord[0] === '(') {
        tokens.push({ type: 'function', text: word })
      } else if (word[0] === word[0].toUpperCase() && word[0] !== word[0].toLowerCase()) {
        tokens.push({ type: 'type', text: word })
      } else {
        tokens.push({ type: 'plain', text: word })
      }
      i = end
      continue
    }

    // Operators and punctuation
    if (/[+\-*/%=<>!&|^~?:]/.test(code[i])) {
      let end = i + 1
      // Multi-char operators
      if (i + 1 < code.length && /[=>&|]/.test(code[i + 1])) end = i + 2
      if (i + 2 < code.length && code.slice(i, i + 3) === '===') end = i + 3
      if (i + 2 < code.length && code.slice(i, i + 3) === '!==') end = i + 3
      tokens.push({ type: 'operator', text: code.slice(i, end) })
      i = end
      continue
    }

    // Whitespace and other characters
    tokens.push({ type: 'plain', text: code[i] })
    i++
  }

  return tokens
}

const languageLabels: Record<string, string> = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  python: 'Python',
  py: 'Python',
  rust: 'Rust',
  go: 'Go',
  css: 'CSS',
  html: 'HTML',
  json: 'JSON',
  bash: 'Bash',
  sh: 'Shell',
  sql: 'SQL',
  jsx: 'JSX',
  tsx: 'TSX',
  yaml: 'YAML',
  xml: 'XML',
  markdown: 'Markdown',
  md: 'Markdown',
}

export default function SyntaxHighlight({ code, language }: SyntaxHighlightProps) {
  const [copied, setCopied] = useState(false)
  const tokens = useMemo(() => tokenize(code, language), [code, language])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  const displayLang = languageLabels[language.toLowerCase()] || language.toUpperCase()

  return (
    <div className="group relative rounded-xl overflow-hidden bg-gray-900 border border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800/80 border-b border-gray-700/50">
        <div className="flex items-center gap-2">
          <Code2 size={14} className="text-gray-500" />
          <span className="text-xs font-medium text-gray-400">{displayLang}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-700/50 transition-all opacity-0 group-hover:opacity-100"
        >
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Code block */}
      <div className="overflow-x-auto p-4">
        <pre className="text-sm leading-relaxed font-mono">
          <code>
            {tokens.map((token, i) => (
              <span key={i} className={tokenColors[token.type]}>
                {token.text}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  )
}