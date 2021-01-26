import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

import { KatarinaEmbed } from '../../../util/functions';

export default class QRCodeCommand extends Command {
  public constructor() {
    super('qrcode', {
      aliases: ['qrcode', 'qr'],
      category: 'util',
      description: {
        content: 'commands:util.qr.description',
        usage: 'qrcode <text>',
        examples: ['qrcode hello', 'qr olá'],
      },
      args: [
        {
          id: 'text',
          type: 'string',
          match: 'rest',
          prompt: {
            start: 'commands:util.qr.arguments.start',
            retry: 'commands.util.qr.arguments.retry',
          },
        },
      ],
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    });
  }

  public async exec(message: Message, { text }: { text: string }): Promise<(void|Message)> {
    try {
      return message.quote(new KatarinaEmbed(message.author)
        .setImage(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURI(text)}`),
      );
    } catch (error) {
      this.client.logger.error(error);

      return message.quote(this.client.i18n.t('commands:util.qr.unsuccessfully'));
    }
  }
}
