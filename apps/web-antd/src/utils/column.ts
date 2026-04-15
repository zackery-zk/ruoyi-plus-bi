export function getColumnWidth(size: number,el:HTMLElement) {
  const fixedWidth = 150;
  const width = el?.getBoundingClientRect?.().width ?? 0;
  // 按每列固定 150px 判断：容器能放下 size 列则用 auto，否则固定 150（触发横向滚动/截断逻辑由表格处理）
  const canFit = width >= size * fixedWidth;
  return canFit ? undefined : fixedWidth;
}
