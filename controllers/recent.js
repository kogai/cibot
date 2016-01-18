import { CIHelper } from 'lib/CIHelper';
import { normalizeBuilds } from 'lib/utils';

export function recent(bot, msg) {
  const hasLimit = /^recent ([0-9]+)/.exec(msg.text);
  const limit = hasLimit ? hasLimit[1] : 5;

  const ci = new CIHelper({ bot, msg, context: this });
  ci.getRecentBuilds(limit)
    .then((builds)=> {
      bot.reply(msg, `${normalizeBuilds(builds).join('\n\n')}`);
    })
    .then(ci.cleanConv.bind(ci));
}
