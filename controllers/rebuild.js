import CircleCI from 'circleci';
import { CI } from 'lib/CI';

const ci = new CircleCI({ auth: process.env.CIBOT_CIRCLECI_TOKEN });

export function rebuild(bot, msg) {
  const cibot = new CI({ bot, msg, context: this });

  bot.reply(msg, ':hammer_and_wrench: OK, your projects fetching...');
  cibot.getUserSelect()
    .then((selected)=> {
      return new Promise((resolve)=> {
        ci.getBuilds({
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
      ci.retryBuild({
        username: build.username,
        project: build.reponame,
        build_num: build.build_num,
      })
      .then((rebuilded)=> {
        const buildDetail = `${rebuilded.branch} #${rebuilded.build_num} ${rebuilded.subject}`;
        bot.reply(msg, `:hammer_and_wrench: Start rebuilding \`${buildDetail}\` ...`);
      });
    })
    .catch((err)=> {
      bot.reply(msg, `:robot_face: Rebuild is failed... check heroku logs`);
      console.log(err);
    });
}
