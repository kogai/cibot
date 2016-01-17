import Botkit from 'botkit';

import {
  rebuild,
  show,
  recent,
  help,
} from 'controllers/';

import { startHttpd } from 'lib/httpd.js';

export function run() {
  // To avoid heroku timeout
  startHttpd();

  // Initialize
  const controller = Botkit.slackbot({
    debug: process.env.NODE_ENV === 'debug',
  });

  controller.spawn({
    token: process.env.CIBOT_SLACK_TOKEN,
  }).startRTM();

  // Set controllers
  controller.hears('rebuild', ['direct_mention', 'mention'], rebuild);
  controller.hears('show', ['direct_mention', 'mention'], show);
  controller.hears('recent', ['direct_mention', 'mention'], recent);
  controller.hears('help', ['direct_mention', 'mention'], help);
}
