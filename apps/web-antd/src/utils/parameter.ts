/**
 * 解析 SQL 内容中的参数
 * @param sqlContent SQL 内容
 * @returns 解析后的参数列表
 */
export function parseSqlParams(
  sqlContent: string,
): { paramName: string; required: boolean }[] {
  if (!sqlContent) return [];

  const paramRegex = /\$\{([^}]*)\}/g;
  const optionalParamRegex = /\{\[(.*?)\]\}/g;

  const params: { paramName: string; required: boolean }[] = [];

  // 解析必填参数 ${param}
  let match;
  // eslint-disable-next-line no-cond-assign
  while ((match = paramRegex.exec(sqlContent)) !== null) {
    const paramName = match[1].trim();
    // 检查是否已经添加过该参数
    if (!params.some((param) => param.paramName === paramName)) {
      params.push({ paramName, required: true });
    }
  }

  // 解析非必填参数 {[${param}]}
  // eslint-disable-next-line no-cond-assign
  while ((match = optionalParamRegex.exec(sqlContent)) !== null) {
    const optionalContent = match[1];
    if (optionalContent) {
      const paramMatches = optionalContent.match(/\$\{([^}]*)\}/g);

      if (paramMatches) {
        paramMatches.forEach((paramMatch) => {
          const paramName = paramMatch.slice(2, -1).trim();
          // 将已添加的必填参数改为非必填
          const existingParam = params.find(
            (param) => param.paramName === paramName,
          );
          if (existingParam) {
            existingParam.required = false;
          } else {
            params.push({ paramName, required: false });
          }
        });
      }
    }
  }

  return params;
}
