import Botkit from 'botkit';
import CircleCI from 'circleci';

import { createSelectString } from 'utils';

const ci = new CircleCI({ auth: process.env.CIBOT_CIRCLECI_TOKEN });

function rebuild(bot, msg) {
  bot.reply(msg, ':hammer_and_wrench: OK, your projects fetching...');

  ci.getProjects()
  .then((projects)=> {
    return new Promise((resolve, reject)=> {
      bot.startConversation(msg, (err, conv)=> {
        if (err) {
          return reject({ conv, err });
        }
        resolve({ conv, projects });
      });
    });
  })
  .then(({ conv, projects })=> {
    return new Promise((resolve)=> {
      conv.ask(`Choose....\n${createSelectString(projects)}`, (res, nextConv)=> {
        const selected = projects[Number(res.text) - 1];
        const selectedName = `${selected.username}/${selected.reponame}`;

        nextConv.say(`:robot_face: Your choice: \`${selectedName}\``);
        nextConv.next();
        resolve({ selected });
      });
    });
  })
  .then(({ selected })=> {
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

export function run() {
  // Initialize
  const controller = Botkit.slackbot({
    debug: process.env.NODE_ENV === 'debug',
  });

  controller.spawn({
    token: process.env.CIBOT_SLACK_TOKEN,
  }).startRTM();

  // Set controllers
  controller.hears('rebuild', ['direct_mention', 'mention'], rebuild);
}
