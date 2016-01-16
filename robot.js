import Botkit from 'botkit';

import { rebuild } from 'controllers/rebuild.js';
import { startHttpd } from 'lib/utils.js';

export function run() {
  // to avoid heroku timeout
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
}
