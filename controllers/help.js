export function help(bot, msg) {
  bot.reply(msg, '使い方: \`@cibot <command> [<args> ...]\`');

  bot.reply(msg, '\`rebuild\` 対話で指定したレポジトリを再度ビルドします');
  bot.reply(msg, '\`show\` 対話で指定したレポジトリの直近のビルドを表示します');
  bot.reply(msg, '\`recent [limit]\` 直近のlimit分のビルドを表示します');
}
