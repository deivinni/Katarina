import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

import DayJS from 'dayjs';
import DayJSDuration from 'dayjs/plugin/duration';
import 'dayjs/locale/pt-br';

import { capitalize, KatarinaEmbed } from '../../../util/functions';

/* eslint-disable consistent-return */

DayJS.locale('pt-BR');
DayJS.extend(DayJSDuration);

export default class HelpCommand extends Command {
  public constructor() {
    super('help', {
      aliases: ['help', 'ajuda'],
      category: 'bot',
      description: {
        content: 'commands:bot.help.description',
        usage: 'help [cmd]',
        examples: ['help ping', 'help pixel'],
      },
      args: [
        {
          id: 'cmd',
          type: 'commandAlias',
        },
      ],
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES'],
    });
  }

  public async exec(message: Message, { cmd }: { cmd: Command }): Promise<void> {
    const embed = new KatarinaEmbed(message.author);

    if (!cmd) {
      const prefix = this.handler.prefix as string[]; // eslint-disable-line prefer-destructuring
      let maxSize: number = 0;

      embed.setTitle(this.client.i18n.t('commands:bot.help.noArguments.title'));

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
      embed.setDescription(this.client.i18n.t('commands:bot.help.noArguments.description', { maxSize, totalPrefixes: `\`${prefix.join('` e `')}\``, prefix: prefix[0] }));

      return message.quote(embed);
    }

    const emoji = '<:Think:634436345153978379>';

    embed
      .setTitle(capitalize(cmd.id))
      .setDescription(this.client.i18n.t(`${cmd.description.content}`) || '\u200b')
      .addField(this.client.i18n.t('commands:bot.help.find.information.name'), [
        this.client.i18n.t('commands:bot.help.find.information.command', { id: cmd.id || emoji }),
        this.client.i18n.t('commands:bot.help.find.information.aliases', { alias: cmd.aliases.length > 1 ? `\`${cmd.aliases.slice(1).join('`, `')}\`` : emoji }),
        this.client.i18n.t('commands:bot.help.find.information.cooldown', { cooldown: cmd.cooldown ? DayJS.duration(cmd.cooldown).format('`d`[d ]`h`[h ]`m`[m ]`s`[s]') : emoji }),
      ], true)
      .addField('\u200b', [
        this.client.i18n.t('commands:bot.help.find.information.category', { category: cmd.category || emoji }),
        this.client.i18n.t('commands:bot.help.find.information.rateLimit', { rateLimit: cmd.ratelimit || emoji }),
      ], true)
      .addField(this.client.i18n.t('commands:bot.help.find.utility.name'), [
        this.client.i18n.t('commands:bot.help.find.utility.form', { usage: cmd.description.usage || emoji }),
        this.client.i18n.t('commands:bot.help.find.utility.example', { example: cmd.description.examples.join('`, `') || emoji }),
      ], false)
      .addField(this.client.i18n.t('commands:bot.help.find.permissions.name'), [
        this.client.i18n.t('commands:bot.help.find.permissions.permissionMember', { perm: cmd.userPermissions ? this.permissions(cmd.userPermissions as string[]) : emoji }),
        this.client.i18n.t('commands:bot.help.find.permissions.permissionBot', { perm: cmd.clientPermissions ? this.permissions(cmd.clientPermissions as string[]) : emoji }),
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
