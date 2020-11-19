import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';
import { KatarinaEmbed } from '../../../util/functions';

export default class invertCommand extends Command {
  public constructor() {
    super('invert', {
      aliases: ['invert'],
      category: 'image',
      description: {
        content: 'commands:invert.description',
        usage: 'invert [@user]',
        examples: ['invert @Katarina'],
      },
      args: [
        {
          id: 'user',
          type: 'user',
          match: 'rest',
          default: (message: Message) => message.author,
        },
      ],
      userPermissions: ['SEND_MESSAGES'],
      clientPermissions: ['SEND_MESSAGES'],
    });
  }

  public async exec(message: Message, { user }: { user: User }): Promise<Message> {
    const avatar = user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 });
    const { image, format } = await this.client.dagpi.image_process('invert', { url: avatar });

    return message.util?.send({
      embed: new KatarinaEmbed(message.author).setImage(`attachment://invert.${format}`),
      files: [{ name: `invert.${format}`, attachment: image }],
    });
  }
}
