import CircleCI from 'circleci';
import { createSelectString } from 'lib/utils';

const ci = new CircleCI({ auth: process.env.CIBOT_CIRCLECI_TOKEN });
const errorMessage = `
  I'm afraid I can't do that.
  This conversation can serve no purpose. Good-bye.
`;

export class CIHelper {
  constructor({ bot, msg }) {
    this.bot = bot;
    this.msg = msg;
    this.ci = ci;
    this.conv = null;
    this.me = bot.identity.id;
    this.you = bot.user;
    this.channel = msg.channel;
    this.projects = [];
    this.errorMessage = errorMessage;
  }

  _getProjects() {
    return new Promise((resolve)=> {
      ci.getProjects().then((projects)=> {
        this.projects = projects;
        resolve();
      });
    });
  }

  _startConv() {
    return new Promise((resolve, reject)=> {
      this.bot.startConversation(this.msg, (err, conv)=> {
        if (err) {
          return reject(err);
        }
        this.conv = conv;
        resolve();
      });
    });
  }

  _selectProject() {
    return new Promise((resolve)=> {
      const question = `Choose....\n${createSelectString(this.projects)}`;

      this.conv.ask(question, (res, nextConv)=> {
        this.bot.api.reactions.add({
          timestamp: res.ts,
          channel: res.channel,
          name: 'eyes',
        });

        const selected = this.projects[Number(res.text) - 1];
        const selectedName = `${selected.username}/${selected.reponame}`;

        nextConv.say(`You select \`${selectedName}\``);
        nextConv.next();
        resolve(selected);
      });
    });
  }

  _cleanConv() {
    return new Promise((resolve, reject)=> {
      const THREE_MINUETS = 1000 * 60 * 3; // ms * s * m
      setTimeout(()=> {
        const conditinos = {
          channel: this.channel,
          count: 5,
        };

        this.bot.api.channels.history(conditinos, (err, res)=> {
          if (err || !res.ok) {
            return reject(err);
          }

          const botMessages = res.messages.filter((msg)=> msg.user === this.me);
          botMessages.forEach((m)=> {
            this.bot.api.chat.delete({
              channel: this.channel,
              ts: m.ts,
            });
          });
          resolve();
        });
      }, THREE_MINUETS);
    });
  }

  getUserSelect() {
    this.bot.reply(this.msg, 'OK, Just a moment...');
    return new Promise((resolve, reject)=> {
      this._getProjects()
        .then(this._startConv.bind(this))
        .then(this._selectProject.bind(this))
        .then(resolve)
        .then(this._cleanConv.bind(this))
        .catch(reject);
    });
  }

  getRecentBuilds(limit) {
    return new Promise((resolve)=> {
      this.ci.getRecentBuilds({ limit }).then(resolve);
    });
  }
}
