<!-- eslint-disable no-plusplus -->
<!-- eslint-disable no-loop-func -->
<script setup lang="ts">
import type { BasicTable } from '#/api/datasource/table/model';
import type { ResourceVO } from '#/api/resource/model';

import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { usePreferences } from '@vben/preferences';

import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import { format as sqlFormat } from 'sql-formatter';

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    language?: string;
    treeData?:BasicTable[];
    value?: null | string;
  }>(),
  {
    language: 'sql',
    treeData: () => [],
    disabled: false,
    value: null as null | string
  }
);

const emit = defineEmits<{
  (e: 'update:value', value: string): void;
}>();


const { isDark } = usePreferences();

window.MonacoEnvironment = {
  getWorker(_workerId: any, _label: string) {

    return new editorWorker();
  }
};
const editorRef = ref<HTMLElement | null>(null);
let editor: monaco.editor.IStandaloneCodeEditor | null = null;
let completionProvider: monaco.IDisposable | null = null;
let formattingProvider: monaco.IDisposable | null = null;

// Define base SQL keywords for completion
const baseSqlKeywords = [
  'SELECT',
  'FROM',
  'WHERE',
  'INSERT',
  'INTO',
  'VALUES',
  'UPDATE',
  'SET',
  'DELETE',
  'CREATE',
  'TABLE',
  'DATABASE',
  'ALTER',
  'DROP',
  'INDEX',
  'JOIN',
  'INNER',
  'LEFT',
  'RIGHT',
  'OUTER',
  'ON',
  'GROUP',
  'BY',
  'ORDER',
  'HAVING',
  'AS',
  'DISTINCT',
  'COUNT',
  'SUM',
  'AVG',
  'MAX',
  'MIN',
  'AND',
  'OR',
  'NOT',
  'NULL',
  'IS',
  'LIKE',
  'IN',
  'BETWEEN',
  'CASE',
  'WHEN',
  'THEN',
  'ELSE',
  'END'
];

// 特殊字符保护和恢复的辅助函数
interface PlaceholderMap {
  placeholder: string;
  original: string;
}

/**
 * 在格式化前保护特殊字符,将它们替换为占位符
 */
function protectSpecialChars(sql: string): {
  placeholders: PlaceholderMap[];
  sql: string;
} {
  const placeholders: PlaceholderMap[] = [];
  let counter = 0;

  // 定义需要保护的特殊字符模式
  const patterns = [
    // ${...} 模板变量
    /\$\{[^}]*\}/g,
    // #{...} MyBatis 参数
    /#\{[^}]*\}/g,
    // {...} 单独的花括号内容
    /\{[^}]*\}/g,
    // [...] 方括号内容
    /\[[^\]]*\]/g,
    // $variable 美元符号变量
    /\$[a-z_]\w*/gi
  ];

  let protectedSql = sql;

  // 对每个模式进行替换
  for (const pattern of patterns) {
    protectedSql = protectedSql.replace(pattern, match => {
      const placeholder = `__PLACEHOLDER_${counter}__`;
      placeholders.push({ placeholder, original: match });
      counter++;
      return placeholder;
    });
  }

  return { sql: protectedSql, placeholders };
}

/**
 * 格式化后恢复特殊字符
 */
function restoreSpecialChars(sql: string, placeholders: PlaceholderMap[]): string {
  let restoredSql = sql;

  // 按照相反的顺序恢复,避免占位符冲突
  for (let i = placeholders.length - 1; i >= 0; i--) {
    const { placeholder, original } = placeholders[i];
    restoredSql = restoredSql.replaceAll(new RegExp(placeholder, 'g'), original);
  }

  return restoredSql;
}

function createCompletionProvider(treeData: BasicTable[]) {
  const suggestions: monaco.languages.CompletionItem[] = baseSqlKeywords.map(keyword => ({
    label: keyword,
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: keyword,
    range: undefined as any
  }));

  // Add suggestions from treeData
  function traverse(nodes: BasicTable[]) {
    nodes.forEach(node => {
      suggestions.push(
        {
          label: node.tableName,
          kind: monaco.languages.CompletionItemKind.Struct,
          insertText: `\`${node.schemaName}\`.\`${node.tableName}\``,
          range: undefined as any,
          detail:node.tableAlias,
        },
        {
          label: node.tableAlias,
          kind: monaco.languages.CompletionItemKind.Struct,
          insertText: `\`${node.schemaName}\`.\`${node.tableName}\``,
          range: undefined as any,
          detail:node.tableName,
        }
      );
    });
  }

  traverse(treeData);
  return monaco.languages.registerCompletionItemProvider('sql', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };
      // Set the range for all suggestions
      const dynamicSuggestions = suggestions.map(s => ({ ...s, range }));
      return {
        suggestions: dynamicSuggestions
      };
    }
  });
}

function registerFormattingProvider(language = 'sql') {
  return monaco.languages.registerDocumentFormattingEditProvider(language, {
    provideDocumentFormattingEdits(model) {
      const original = model.getValue();
      let formatted = original;
      try {
        // 保护特殊字符
        const { sql: protectedSql, placeholders } = protectSpecialChars(original);

        // 格式化保护后的 SQL
        const formattedSql = sqlFormat(protectedSql, {
          language: 'sql',
          keywordCase: 'preserve',
          indentStyle: 'standard',
          tabWidth: 2
        });

        // 恢复特殊字符
        formatted = restoreSpecialChars(formattedSql, placeholders);
      } catch {
        // swallow formatting errors to avoid breaking the editor
        formatted = original;
      }
      return [
        {
          range: model.getFullModelRange(),
          text: formatted
        }
      ];
    }
  });
}

function handleDragOver(event: DragEvent) {
  event.preventDefault();
}

function resolveDropText(event: DragEvent): string {
  if (!event.dataTransfer) return '';
  const jsonValue = event.dataTransfer.getData('application/json');
  if (jsonValue) {
    try {
      const payload = JSON.parse(jsonValue) as ResourceVO;
      return `\`${payload.resName}\``;
    } catch {
      return jsonValue;
    }
  }
  return event.dataTransfer.getData('text/plain') || '';
}

function handleDrop(event: DragEvent) {
  event.preventDefault();
  if (!editor) return;
  const dropText = resolveDropText(event);
  if (!dropText) return;
  const position = editor.getPosition();
  if (!position) return;
  editor.executeEdits('drag-drop', [
    {
      range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
      text: dropText
    }
  ]);
  editor.pushUndoStop();
}

onMounted(() => {
  if (editorRef.value) {
    // vs' (default), 'vs-dark', 'hc-black', 'hc-light
    editor = monaco.editor.create(editorRef.value, {
      value: props.value || '',
      language: props.language,
      theme: isDark.value ? 'vs-dark' : 'hc-light',
      automaticLayout: true,
      minimap: {
        enabled: false
      },
      readOnly: props.disabled
    });
    editor.onDidChangeModelContent(() => {
      const currentValue = editor?.getValue();
      if (currentValue !== props.value) {
        emit('update:value', currentValue || '');
      }
    });

    // Initial completion provider setup
    completionProvider = createCompletionProvider(props.treeData);

    // Register formatting provider so that Shift+Alt+F and context menu "Format Document" work
    formattingProvider = registerFormattingProvider(props.language || 'sql');
  }
});

watch(isDark, newVal => {
  if (editor) {
    editor.updateOptions({
      theme: newVal ? 'vs-dark' : 'vs'
    });
  }
});

watch(
  () => props.value,
  newValue => {
    if (editor && editor.getValue() !== newValue) {
      // Preserve view state when externally updating value
      const state = editor.saveViewState();
      editor.setValue(newValue || '');
      if (state) editor.restoreViewState(state);
    }
  }
);

// Watch for changes in treeData and update the completion provider
watch(
  () => props.treeData,
  newTreeData => {
    if (completionProvider) {
      completionProvider.dispose();
    }
    completionProvider = createCompletionProvider(newTreeData);
  },
  { deep: true }
);

// If language changes, re-register formatting provider
watch(
  () => props.language,
  lang => {
    if (formattingProvider) {
      formattingProvider.dispose();
    }
    formattingProvider = registerFormattingProvider(lang || 'sql');
  }
);

onBeforeUnmount(() => {
  if (completionProvider) {
    completionProvider.dispose();
    completionProvider = null;
  }
  if (formattingProvider) {
    formattingProvider.dispose();
    formattingProvider = null;
  }
  if (editor) {
    editor.dispose();
    editor = null;
  }
});
</script>

<template>
  <div ref="editorRef" class="h-full w-full" @dragover="handleDragOver" @drop="handleDrop"></div>
</template>
