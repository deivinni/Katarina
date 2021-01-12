import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import moment from 'moment';
import 'moment-duration-format';
import { capitalize, KatarinaEmbed } from '../../../util/functions';

/* eslint-disable consistent-return */

moment.locale('pt-BR');

export default class HelpCommand extends Command {
  public constructor() {
    super('help', {
      aliases: ['help', 'ajuda'],
      category: 'bot',
      description: {
        content: 'commands:bot.help.description',
        usage: 'help [command]',
        examples: ['help ping', 'help pixel'],
      },
      args: [
        {
          id: 'command',
          type: 'commandAlias',
        },
      ],
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES'],
    });
  }

  public async exec(message: Message, { command }: { command: Command }): Promise<void> {
    const { t } = this.client.i18n;
    const embed = new KatarinaEmbed(message.author);

    if (!command) {
      const prefix = this.handler.prefix as string[]; // eslint-disable-line prefer-destructuring
      let maxSize: number = 0;

      embed.setAuthor(
        t('commands:bot.help.noArguments.title'),
        message.author.displayAvatarURL({ dynamic: true }),
      );

      for (const category of this.handler.categories.values()) {
        maxSize += category.size;

        embed.addField(
          `❯ ${capitalize(category.id)} [${category.size}]`,
          category
            .filter((cmd) => cmd.aliases.length > 0)
            .map((cmd) => `\`${cmd.aliases[0]}\``)
            .join(', '),
        );
      }
      embed.setDescription(t('commands:bot.help.noArguments.description', { maxSize, totalPrefixes: `\`${prefix.join('` e `')}\``, prefix: prefix[0] }));

      return message.quote(embed);
    }

    const emoji = '<:Think:634436345153978379>';

    embed.setAuthor(capitalize(command.id), message.author.displayAvatarURL({ dynamic: true }));
    embed.setDescription(t(`${command.description.content}`) || '\u200b');
    embed.addField(t('commands:bot.help.find.information.name'), [
      t('commands:bot.help.find.information.command', { id: command.id || emoji }),
      t('commands:bot.help.find.information.aliases', { alias: command.aliases.length > 1 ? `\`${command.aliases.slice(1).join('`, `')}\`` : emoji }),
      t('commands:bot.help.find.information.cooldown', { cooldown: moment.duration(command.cooldown).format('`d`[d ]`h`[h ]`m`[m ]`s`[s]') || emoji }),
    ], true);
    embed.addField('\u200b', [
      t('commands:bot.help.find.information.category', { category: command.category || emoji }),
      t('commands:bot.help.find.information.rateLimit', { rateLimit: `\`${command.ratelimit}\`` || emoji }),
    ], true);
    embed.addField(t('commands:bot.help.find.utility.name'), [
      t('commands:bot.help.find.utility.form', { usage: `**${command.description.usage}**` || emoji }),
      t('commands:bot.help.find.utility.example', { example: `\`${command.description.examples.join('`, `')}\`` || emoji }),
    ], false);
    embed.addField(t('commands:bot.help.find.permissions.name'), [
      t('commands:bot.help.find.permissions.permissionMember', { perm: command.userPermissions ? this.permissions(command.userPermissions as string[]) : emoji }),
      t('commands:bot.help.find.permissions.permissionBot', { perm: command.clientPermissions ? this.permissions(command.clientPermissions as string[]) : emoji }),
    ], false);

    return message.quote(embed);
  }

  private permissions(permissions: string[]) {
    const array: string[] = [];
    for (const perms of permissions) {
      array.push(capitalize(perms.replace(/_/g, ' ')));
    }

    return array.length > 1
      ? `\`${array.slice(0, -1).join('`, `')}\` e \`${array.slice(-1)[0]}\``
      : `\`${array[0]}\``;
  }
}
