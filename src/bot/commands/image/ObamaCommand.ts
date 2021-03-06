import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';

import { KatarinaEmbed } from '../../../util/functions';

export default class ObamaCommand extends Command {
  public constructor() {
    super('obama', {
      aliases: ['obama'],
      category: 'image',
      description: {
        content: 'commands:image.obama',
        usage: 'obama [@user]',
        examples: ['obama @Katarina'],
      },
      args: [
        {
          id: 'user',
          type: 'user',
          match: 'phrase',
          default: (message: Message) => message.author,
        },
      ],
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    });
  }

  public async exec(message: Message, { user }: { user: User }): Promise<void> {
    const url = user.displayAvatarURL({ format: 'png', size: 1024 });
    const { image, format } = await this.client.dagpi.image_process('obama', { url });

    return message.quote({
      embed: new KatarinaEmbed(message.author).setImage(`attachment://obama.${format}`),
      files: [{ name: `obama.${format}`, attachment: image }],
    });
  }
}
