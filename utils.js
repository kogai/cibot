export function createSelectString(projects) {
  return projects.map((select, index)=> {
    return `[${index + 1}] \`${select.username}/${select.reponame}\``;
  }).join('\n');
}
