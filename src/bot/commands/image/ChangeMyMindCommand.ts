import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import axios from 'axios';

import { KatarinaEmbed } from '../../../util/functions';

export default class CowboyCommand extends Command {
  public constructor() {
    super('changemymind', {
      aliases: ['changemymind', 'cmm'],
      category: 'fun',
      description: {
        content: 'commands:image.changemymind.description',
        usage: 'changemymind <text>',
        examples: ['changemymind AAAAAAAAAAAAAAAAB'],
      },
      args: [
        {
          id: 'text',
          type: 'string',
          match: 'rest',
          prompt: {
            start: 'commands:image.changemymind.arguments.start',
            retry: 'commands:image.changemymind.arguments.retry',
          },
        },
      ],
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES'],
    });
  }

  public async exec(message: Message, { text }: { text: string }): Promise<Message> {
    const { data } = await axios.get('https://nekobot.xyz/api/imagegen', { params: { type: 'changemymind', text } });

    if (!data.success) return message.util?.reply(this.client.i18n.t('commands:image.changemymind.unsuccessfully'));

    return message.util?.send(new KatarinaEmbed(message.author).setImage(data.message));
  }
}
