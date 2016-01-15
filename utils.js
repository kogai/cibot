export function createSelectString(selects) {
  return selects.map((select, index)=> `[${index + 1}] ${select.name}`).join('\n');
}
