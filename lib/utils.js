export function createSelectString(projects) {
  return projects.map((select, index)=> {
    return `[${index + 1}] \`${select.username}/${select.reponame}\``;
  }).join('\n');
}

export function normalizeBuilds(builds) {
  return builds.map((b)=> {
    return `\`${b.status}\` \`${b.lifecycle}\`\n#${b.build_num} ${b.username}/${b.reponame} (${b.branch})\n${b.subject}`;
  });
}
