import Botkit from 'botkit';

import { rebuild, show } from 'controllers/';
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
  controller.hears('show', ['direct_mention', 'mention'], show);
}
