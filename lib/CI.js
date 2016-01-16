import CircleCI from 'circleci';
import { createSelectString } from 'lib/utils';

const ci = new CircleCI({ auth: process.env.CIBOT_CIRCLECI_TOKEN });

export class CI {
  constructor({ bot, msg }) {
    this.bot = bot;
    this.msg = msg;
    this.conv = null;
    this.projects = [];
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
        const selected = this.projects[Number(res.text) - 1];
        const selectedName = `${selected.username}/${selected.reponame}`;

        nextConv.say(`:robot_face: Your choice: \`${selectedName}\``);
        nextConv.next();
        resolve(selected);
      });
    });
  }

  getUserSelect() {
    return new Promise((resolve, reject)=> {
      this._getProjects()
        .then(this._startConv.bind(this))
        .then(this._selectProject.bind(this))
        .then(resolve)
        .catch(reject);
    });
  }
}
