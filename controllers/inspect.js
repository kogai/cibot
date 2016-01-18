import Promise from 'bluebird';
import { CIHelper } from 'lib/CIHelper';
import { normalizeStep } from 'lib/utils';

export function inspect(bot, msg) {
  const ci = new CIHelper({ bot, msg, context: this });
  ci.getInspectBuild()
    .then((selected)=> {
      return new Promise((resolve, reject)=> {
        ci.ci.getBuild({
          username: selected.username,
          project: selected.reponame,
          build_num: selected.build_num,
        })
        .then(resolve)
        .catch(reject);
      });
    })
    .then((build)=> {
      const messages = build.steps.map((b, i)=> normalizeStep(i, b)).join('\n');
      bot.reply(msg, messages);
    })
    .then(ci.cleanConv.bind(ci));
}
