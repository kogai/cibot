import { CIHelper } from 'lib/CIHelper';

export function rebuild(bot, msg) {
  const ci = new CIHelper({ bot, msg, context: this });
  ci.getUserSelect()
    .then((selected)=> {
      return new Promise((resolve)=> {
        ci.ci.getBuilds({
          username: selected.username,
          project: selected.reponame,
          limit: 1,
        })
        .then((builds)=> {
          resolve({ build: builds[0] });
        });
      });
    })
    .then(({ build })=> {
      ci.ci.retryBuild({
        username: build.username,
        project: build.reponame,
        build_num: build.build_num,
      })
      .then((rebuilded)=> {
        const buildDetail = `${rebuilded.branch} #${rebuilded.build_num} ${rebuilded.subject}`;
        bot.reply(msg, `:hammer_and_wrench: Start rebuilding \`${buildDetail}\` ...`);
      });
    })
    .then(ci.cleanConv.bind(ci))
    .catch((err)=> {
      bot.reply(msg, ci.errorMessage);
      console.log(err);
    });
}
