import parseMS from 'parse-ms';

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

function normalizeTime(ms) {
  const t = parseMS(ms);

  const hours = t.hours;
  const minutes = t.minutes;
  const seconds = t.seconds;

  return hours > 0 ?
    `${hours}:${minutes}:${seconds}` :
    `${minutes}:${seconds}`;
}

export function normalizeStep(i, build) {
  return `step-${i + 1}: ${build.name}  \`${normalizeTime(build.actions[0].run_time_millis || 0)}\``;
}
