import { slackbot } from 'botkit';

import {
  rebuild,
  show,
  recent,
  help,
  greeting,
  inspect,
} from 'controllers/';

import { startHttpd } from 'lib/httpd.js';

export function run() {
  // To avoid heroku timeout
  startHttpd();

  // Initialize
  const controller = slackbot({
    debug: process.env.NODE_ENV === 'debug',
  });

  // Set controllers
  controller.hears('rebuild', ['direct_mention', 'mention'], rebuild);
  controller.hears('show', ['direct_mention', 'mention'], show);
  controller.hears('recent', ['direct_mention', 'mention'], recent);
  controller.hears('inspect', ['direct_mention', 'mention'], inspect);

  controller.hears('help', ['direct_mention', 'mention'], help);
  controller.hears('sing', ['direct_mention', 'mention'], greeting);

  // Spawn application
  controller.spawn({
    token: process.env.CIBOT_SLACK_TOKEN,
  }).startRTM();
}
