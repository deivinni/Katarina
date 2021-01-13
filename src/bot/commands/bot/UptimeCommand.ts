import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

import DayJS from 'dayjs';
import 'dayjs/locale/pt-br';
import DayJSRelativeTime from 'dayjs/plugin/relativeTime';

DayJS.locale('pt-br');
DayJS.extend(DayJSRelativeTime);

export default class UptimeCommand extends Command {
  public constructor() {
    super('uptime', {
      aliases: ['uptime', 'up'],
      category: 'bot',
      description: {
        content: 'commands:bot.uptime.description',
        usage: 'uptime',
        examples: ['uptime'],
      },
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES'],
    });
  }

  public async exec(message: Message): Promise<void> {
    return message.quote(
      this.client.i18n.t('commands:bot.uptime.message', {
        time: DayJS().to((Date.now() - this.client.uptime)),
      }),
    );
  }
}
