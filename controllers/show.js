import { CIHelper } from 'lib/CIHelper';
import { normalizeBuilds } from 'lib/utils';

export function show(bot, msg) {
  const hasLimit = /^show ([0-9]+)/.exec(msg.text);
  const limit = hasLimit ? hasLimit[1] : 5;

  const ci = new CIHelper({ bot, msg, context: this });
  ci.getUserSelect()
    .then((selected)=> {
      const conditions = {
        username: selected.username,
        project: selected.reponame,
        limit,
      };
      ci.ci.getBuilds(conditions)
        .then((builds)=> {
          bot.reply(msg, `${normalizeBuilds(builds).join('\n\n')}`);
        });
    })
    .then(ci.cleanConv.bind(ci))
    .catch((err)=> {
      bot.reply(msg, ci.errorMessage);
      console.log(err);
    });
}
