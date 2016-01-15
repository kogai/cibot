const Botkit = require('botkit');

const controller = Botkit.slackbot({
  debug: process.env.NODE_ENV === 'debug',
});

controller.spawn({
  token: process.env.CIBOT_SLACK_TOKEN,
}).startRTM()

controller.hears('hello', ['direct_message','direct_mention','mention'], (bot, message)=> {
  bot.reply(message,'Hello yourself.');
});

controller.hears('rebuild', ['direct_mention', 'mention'], (bot, msg)=> {
  bot.reply(msg, 'rebuild start...')
  bot.startConversation(msg, (err, conv)=> {
    if (err) {
      return console.log(err);
    }

    conv.ask(`choose....\n${createSelectString(_select)}`, (res, conv)=> {
      const selected = _select[Number(res.text) - 1];
      conv.say(`your choice: ${selected.name}`);
      conv.say('start rebuilding...');
      conv.next();
    });
  });
});

const _select = [
  { name: 'dekujs/deku', uri: 'https://github.com/dekujs/deku' },
  { name: 'facebook/react', uri: 'https://github.com/facebook/react' },
  { name: 'angular/angular', uri: 'https://github.com/angular/angular' },
];

function createSelectString(selects) {
  return selects.map((select, index)=> `[${index + 1}] ${select.name}`).join('\n');
}

// console.log(Promise);
