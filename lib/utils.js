import http from 'http';

export function startHttpd() {
  http.createServer((req, res)=> {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.send('it is running\n');
  })
  .listen((process.env.PORT || 5000), ()=> {
    console.log('httpd server listening...');
  });
}

export function createSelectString(projects) {
  return projects.map((select, index)=> {
    return `[${index + 1}] \`${select.username}/${select.reponame}\``;
  }).join('\n');
}
