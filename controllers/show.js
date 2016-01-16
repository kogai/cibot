import { CIHelper } from 'lib/CIHelper';
import { normalizeBuilds } from 'lib/utils';

export function show(bot, msg) {
  const ci = new CIHelper({ bot, msg, context: this });
  ci.getUserSelect()
    .then((selected)=> {
      const conditions = {
        username: selected.username,
        project: selected.reponame,
        limit: 5,
      };
      ci.ci.getBuilds(conditions)
        .then((builds)=> {
          bot.reply(msg, `${normalizeBuilds(builds).join('\n\n')}`);
        });
    })
    .catch((err)=> {
      bot.reply(msg, ci.errorMessage);
      console.log(err);
    });
}
