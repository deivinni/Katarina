import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';
import { KatarinaEmbed } from '../../../util/functions';

export default class PixelCommand extends Command {
  public constructor() {
    super('pixel', {
      aliases: ['pixel'],
      category: 'image',
      description: {
        content: 'commands:image.pixel',
        usage: 'pixel [@user]',
        examples: ['pixel', 'pixel @Katarina'],
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

  public async exec(message: Message, { user }: { user: User }): Promise<any> {
    const avatar = user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 });
    const { image, format } = await this.client.dagpi.image_process('pixel', { url: avatar });

    return message.util?.send({
      embed: new KatarinaEmbed(message.author).setImage(`attachment://pixel.${format}`),
      files: [{ name: `pixel.${format}`, attachment: image }],
    });
  }
}
